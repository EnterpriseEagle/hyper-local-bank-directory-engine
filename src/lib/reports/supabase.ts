import "server-only";

import { randomUUID } from "crypto";
import { createClient } from "@supabase/supabase-js";
import { submitStatusReport } from "@/lib/data";
import {
  COMMUNITY_REPORTS_TABLE,
  DEFAULT_REPORTS_BUCKET,
  MAX_REPORT_IMAGE_BYTES,
  MAX_REPORT_NOTE_LENGTH,
  type AgentAssessment,
  type CommunityReportRecord,
  type ModerationStatus,
  type ReportPayload,
  type UploadedPhoto,
} from "./types";

function getSupabaseReportsConfig() {
  const url = process.env.SUPABASE_URL?.trim();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  const bucket = process.env.SUPABASE_REPORTS_BUCKET?.trim() || DEFAULT_REPORTS_BUCKET;

  return {
    bucket,
    serviceRoleKey,
    url,
  };
}

export function supabaseReportsConfigured() {
  const config = getSupabaseReportsConfig();
  return Boolean(config.url && config.serviceRoleKey);
}

function getSupabaseReportsAdminClient() {
  const config = getSupabaseReportsConfig();
  if (!config.url || !config.serviceRoleKey) {
    throw new Error("Supabase report storage is not configured.");
  }

  return {
    bucket: config.bucket,
    client: createClient(config.url, config.serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    }),
  };
}

function normaliseNote(note?: string) {
  const trimmed = note?.trim();
  if (!trimmed) {
    return undefined;
  }

  return trimmed.slice(0, MAX_REPORT_NOTE_LENGTH);
}

function assertImageFile(file: File) {
  if (file.size > MAX_REPORT_IMAGE_BYTES) {
    throw new Error("Photo must be 8MB or smaller.");
  }

  if (file.type && !file.type.startsWith("image/")) {
    throw new Error("Only image uploads are allowed.");
  }
}

export async function uploadReportPhoto(
  branchId: number,
  suburbId: number,
  file: File
): Promise<UploadedPhoto> {
  assertImageFile(file);

  const { bucket, client } = getSupabaseReportsAdminClient();
  const fileExt = file.name.includes(".") ? file.name.split(".").pop() : "jpg";
  const path = `branch-${branchId}/suburb-${suburbId}/${Date.now()}-${randomUUID()}.${fileExt}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error } = await client.storage.from(bucket).upload(path, buffer, {
    contentType: file.type || "application/octet-stream",
    upsert: false,
  });

  if (error) {
    throw new Error(`Failed to upload report photo: ${error.message}`);
  }

  return {
    bucket,
    contentType: file.type || null,
    path,
  };
}

export async function queueCommunityReport(input: {
  payload: ReportPayload;
  assessment: AgentAssessment;
  uploadedPhoto?: UploadedPhoto | null;
}) {
  const { client } = getSupabaseReportsAdminClient();
  const note = normaliseNote(input.payload.note);

  const row = {
    agent_confidence: input.assessment.confidence,
    agent_recommendation: input.assessment.recommendation,
    agent_summary: input.assessment.summary,
    branch_id: input.payload.branchId,
    moderation_status: "pending" satisfies ModerationStatus,
    note: note ?? null,
    photo_bucket: input.uploadedPhoto?.bucket ?? null,
    photo_content_type: input.uploadedPhoto?.contentType ?? null,
    photo_path: input.uploadedPhoto?.path ?? null,
    report_type: input.payload.reportType,
    reporter_hash: input.payload.ipHash ?? null,
    source: "web",
    submitted_at: new Date().toISOString(),
    suburb_id: input.payload.suburbId,
  };

  const { data, error } = await client
    .from(COMMUNITY_REPORTS_TABLE)
    .insert(row)
    .select(
      "id,branch_id,suburb_id,report_type,note,photo_path,photo_bucket,photo_content_type,reporter_hash,source,agent_summary,agent_confidence,agent_recommendation,moderation_status,moderation_note,moderated_at,moderated_by,submitted_at,synced_at"
    )
    .single();

  if (error) {
    throw new Error(`Failed to queue report: ${error.message}`);
  }

  return data as CommunityReportRecord;
}

export async function listCommunityReportsByStatus(
  statuses: ModerationStatus[],
  limit = 25
) {
  const { client } = getSupabaseReportsAdminClient();
  const { data, error } = await client
    .from(COMMUNITY_REPORTS_TABLE)
    .select(
      "id,branch_id,suburb_id,report_type,note,photo_path,photo_bucket,photo_content_type,reporter_hash,source,agent_summary,agent_confidence,agent_recommendation,moderation_status,moderation_note,moderated_at,moderated_by,submitted_at,synced_at"
    )
    .in("moderation_status", statuses)
    .order("submitted_at", { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(`Failed to load community reports: ${error.message}`);
  }

  return (data ?? []) as CommunityReportRecord[];
}

export async function createSignedReportPhotoUrl(
  bucket: string,
  path: string,
  expiresInSeconds = 60 * 60
) {
  const { client } = getSupabaseReportsAdminClient();
  const { data, error } = await client.storage.from(bucket).createSignedUrl(path, expiresInSeconds);

  if (error) {
    throw new Error(`Failed to sign report photo: ${error.message}`);
  }

  return data.signedUrl;
}

export async function moderateCommunityReport(input: {
  action: "approved" | "rejected";
  moderator: string;
  moderationNote?: string;
  reportId: string;
}) {
  const { client } = getSupabaseReportsAdminClient();
  const { data, error } = await client
    .from(COMMUNITY_REPORTS_TABLE)
    .select(
      "id,branch_id,suburb_id,report_type,note,photo_path,photo_bucket,photo_content_type,reporter_hash,source,agent_summary,agent_confidence,agent_recommendation,moderation_status,moderation_note,moderated_at,moderated_by,submitted_at,synced_at"
    )
    .eq("id", input.reportId)
    .single();

  if (error || !data) {
    throw new Error("Report not found.");
  }

  const report = data as CommunityReportRecord;
  const now = new Date().toISOString();
  const moderationNote = normaliseNote(input.moderationNote);
  let syncedAt = report.synced_at;

  if (input.action === "approved" && !report.synced_at) {
    await submitStatusReport({
      branchId: report.branch_id,
      suburbId: report.suburb_id,
      reportType: report.report_type,
      ipHash: report.reporter_hash ?? undefined,
    });
    syncedAt = now;
  }

  const { data: updated, error: updateError } = await client
    .from(COMMUNITY_REPORTS_TABLE)
    .update({
      moderated_at: now,
      moderated_by: input.moderator.slice(0, 80),
      moderation_note: moderationNote ?? null,
      moderation_status: input.action,
      synced_at: syncedAt,
    })
    .eq("id", input.reportId)
    .select(
      "id,branch_id,suburb_id,report_type,note,photo_path,photo_bucket,photo_content_type,reporter_hash,source,agent_summary,agent_confidence,agent_recommendation,moderation_status,moderation_note,moderated_at,moderated_by,submitted_at,synced_at"
    )
    .single();

  if (updateError) {
    throw new Error(`Failed to moderate report: ${updateError.message}`);
  }

  return updated as CommunityReportRecord;
}
