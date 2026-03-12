export const VALID_REPORT_TYPES = [
  "working",
  "atm_empty",
  "branch_closed",
  "long_queue",
] as const;

export const MAX_REPORT_NOTE_LENGTH = 500;
export const MAX_REPORT_IMAGE_BYTES = 8 * 1024 * 1024;
export const COMMUNITY_REPORTS_TABLE = "community_reports";
export const DEFAULT_REPORTS_BUCKET = "report-photos";

export type ReportType = (typeof VALID_REPORT_TYPES)[number];
export type AgentRecommendation = "approve" | "review" | "reject";
export type ModerationStatus = "pending" | "approved" | "rejected";

export interface ReportPayload {
  branchId: number;
  suburbId: number;
  reportType: ReportType;
  note?: string;
  ipHash?: string;
}

export interface AgentAssessment {
  confidence: number;
  recommendation: AgentRecommendation;
  summary: string;
}

export interface UploadedPhoto {
  bucket: string;
  contentType: string | null;
  path: string;
}

export interface CommunityReportRecord {
  id: string;
  branch_id: number;
  suburb_id: number;
  report_type: ReportType;
  note: string | null;
  photo_path: string | null;
  photo_bucket: string | null;
  photo_content_type: string | null;
  reporter_hash: string | null;
  source: string;
  agent_summary: string | null;
  agent_confidence: number | null;
  agent_recommendation: AgentRecommendation | null;
  moderation_status: ModerationStatus;
  moderation_note: string | null;
  moderated_at: string | null;
  moderated_by: string | null;
  submitted_at: string;
  synced_at: string | null;
}
