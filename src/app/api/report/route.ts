import { NextRequest, NextResponse } from "next/server";
import { submitStatusReport } from "@/lib/data";

const VALID_TYPES = ["working", "atm_empty", "branch_closed", "long_queue"];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { branchId, suburbId, reportType } = body;

    if (!branchId || !suburbId || !reportType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!VALID_TYPES.includes(reportType)) {
      return NextResponse.json({ error: "Invalid report type" }, { status: 400 });
    }

    // Simple IP hash for rate limiting (anonymized)
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded?.split(",")[0]?.trim() || "unknown";
    const ipHash = Buffer.from(ip).toString("base64").slice(0, 12);

    await submitStatusReport({
      branchId: Number(branchId),
      suburbId: Number(suburbId),
      reportType,
      ipHash,
    });

    return NextResponse.json({ success: true, message: "Report submitted. Thank you!" });
    } catch (err) {
      console.error("[report] Failed to submit:", err);
      return NextResponse.json({ error: "Failed to submit report" }, { status: 500 });
    }
}
