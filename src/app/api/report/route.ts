import { NextRequest, NextResponse } from "next/server";
import { submitStatusReport } from "@/lib/data";
import { isRateLimited, getIpHash } from "@/lib/rate-limit";
import { statusReportsEnabled } from "@/lib/feature-flags";

const VALID_TYPES = ["working", "atm_empty", "branch_closed", "long_queue"];

export async function POST(request: NextRequest) {
  if (!statusReportsEnabled) {
    return NextResponse.json({ error: "Status reporting is not enabled yet." }, { status: 503 });
  }

  try {
    const ipHash = getIpHash(request);

    // Rate limit: max 5 reports per minute per IP
    if (isRateLimited(`report:${ipHash}`, 5, 60_000)) {
      return NextResponse.json({ error: "Too many reports. Try again later." }, { status: 429 });
    }

    const body = await request.json();
    const { branchId, suburbId, reportType } = body;

    if (!branchId || !suburbId || !reportType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!VALID_TYPES.includes(reportType)) {
      return NextResponse.json({ error: "Invalid report type" }, { status: 400 });
    }

    if (typeof branchId !== "number" || typeof suburbId !== "number") {
      return NextResponse.json({ error: "Invalid field types" }, { status: 400 });
    }

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
