import { type AgentAssessment, type ReportPayload } from "./types";

const POSITIVE_KEYWORDS = [
  "working",
  "open",
  "cash available",
  "operational",
  "queue moving",
] as const;

const NEGATIVE_KEYWORDS = [
  "closed",
  "shut",
  "out of service",
  "empty",
  "no cash",
  "broken",
  "offline",
  "queue",
] as const;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function countKeywordMatches(note: string, keywords: readonly string[]) {
  return keywords.reduce((count, keyword) => {
    return count + (note.includes(keyword) ? 1 : 0);
  }, 0);
}

export function assessIncomingReport(
  payload: Pick<ReportPayload, "reportType" | "note"> & { hasPhoto: boolean }
): AgentAssessment {
  const note = payload.note?.trim().toLowerCase() ?? "";
  const positiveHits = countKeywordMatches(note, POSITIVE_KEYWORDS);
  const negativeHits = countKeywordMatches(note, NEGATIVE_KEYWORDS);

  let confidence = 0.25;

  if (payload.hasPhoto) confidence += 0.3;
  if (note.length >= 25) confidence += 0.15;
  if (note.length >= 80) confidence += 0.05;

  if (payload.reportType === "branch_closed") confidence += 0.1;
  if (payload.reportType === "working") confidence += 0.05;

  if (payload.reportType === "working") {
    confidence += positiveHits * 0.08;
    confidence -= negativeHits * 0.06;
  } else {
    confidence += negativeHits * 0.08;
    confidence -= positiveHits * 0.06;
  }

  confidence = clamp(Number(confidence.toFixed(2)), 0.05, 0.95);

  let recommendation: AgentAssessment["recommendation"] = "review";

  if (!payload.hasPhoto && note.length < 20) {
    recommendation = "review";
  } else if (confidence >= 0.78 && payload.reportType !== "branch_closed") {
    recommendation = "approve";
  } else if (confidence <= 0.22) {
    recommendation = "reject";
  }

  const evidenceParts = [
    payload.hasPhoto ? "photo attached" : "no photo",
    note ? "reporter note supplied" : "no note",
    `${payload.reportType.replace("_", " ")} signal`,
  ];

  return {
    confidence,
    recommendation,
    summary: `Heuristic review: ${evidenceParts.join(", ")}. Confidence ${Math.round(
      confidence * 100
    )}%.`,
  };
}
