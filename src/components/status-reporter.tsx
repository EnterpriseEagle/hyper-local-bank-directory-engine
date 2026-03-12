"use client";

import { useState } from "react";

interface StatusReporterProps {
  branches?: { id: number; name: string; type: string; status: string }[];
  branchId?: number;
  suburbId: number;
  suburbName?: string;
}

const REPORT_TYPES = [
  { value: "working", label: "Working", emoji: "✅", color: "emerald" },
  { value: "atm_empty", label: "ATM Empty", emoji: "❌", color: "red" },
  { value: "branch_closed", label: "Branch Closed", emoji: "🚫", color: "red" },
  { value: "long_queue", label: "Long Queue", emoji: "⏳", color: "amber" },
];

export function StatusReporter({ branches, branchId, suburbId, suburbName }: StatusReporterProps) {
  const singleBranchMode = !!branchId;
  const [selectedBranch, setSelectedBranch] = useState<number | null>(branchId ?? null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const activeBranches = branches?.filter((b) => b.status !== "closed") ?? [];

  async function handleReport(reportType: string) {
    if (!selectedBranch) {
      setError("Select a branch or ATM first");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          branchId: selectedBranch,
          suburbId,
          reportType,
        }),
      });
      if (!res.ok) throw new Error("Failed");
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 5000);
    } catch {
      setError("Failed to submit. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="border border-white/10 bg-white/[0.02]">
      {/* Header */}
      <div className="border-b border-white/5 px-6 py-5 flex items-center gap-4">
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
        </span>
        <div>
          <h3 className="font-serif text-[18px] font-light text-white">
            Live Status Reporter
          </h3>
          {suburbName && (
            <p className="text-[12px] text-white/30 mt-0.5">
              No login required. Help {suburbName} stay informed.
            </p>
          )}
        </div>
      </div>

      {submitted ? (
        <div className="px-6 py-10 text-center">
          <span className="text-3xl block mb-3">✅</span>
          <p className="font-serif text-[18px] font-light text-emerald-400 mb-1">
            Report Submitted
          </p>
          <p className="text-[13px] text-white/30">
            Thank you for keeping {suburbName} updated. Page freshness improved.
          </p>
        </div>
      ) : (
        <div className="px-6 py-6">
          {/* Branch Selector — only in multi-branch mode */}
          {!singleBranchMode && (
            <div className="mb-5">
              <label className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-medium mb-2 block">
                Select Location
              </label>
              <select
                value={selectedBranch || ""}
                onChange={(e) => {
                  setSelectedBranch(Number(e.target.value) || null);
                  setError("");
                }}
                className="w-full bg-white/[0.03] border border-white/10 px-4 py-3 text-[13px] font-light text-white focus:outline-none focus:border-white/25 transition-colors duration-300 appearance-none cursor-pointer"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12' fill='none'%3E%3Cpath d='M3 4.5L6 7.5L9 4.5' stroke='rgba(255,255,255,0.3)' stroke-width='1.2'/%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 12px center",
                }}
              >
                <option value="" className="bg-black text-white/50">
                  Choose a branch or ATM...
                </option>
                {activeBranches.map((b) => (
                  <option key={b.id} value={b.id} className="bg-black text-white">
                    {b.name} ({b.type === "atm" ? "ATM" : "Branch"})
                  </option>
                ))}
              </select>
            </div>
          )}

          {error && (
            <p className="mb-4 text-[12px] text-red-400/80 border border-red-500/20 bg-red-500/5 px-3 py-2">
              {error}
            </p>
          )}

          {/* Status Buttons */}
          <label className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-medium mb-3 block">
            Report Status
          </label>
          <div className="grid grid-cols-2 gap-px bg-white/5">
            {REPORT_TYPES.map((rt) => (
              <button
                key={rt.value}
                onClick={() => handleReport(rt.value)}
                disabled={submitting}
                className={`group bg-black px-4 py-4 text-center transition-all duration-300 disabled:opacity-40 ${
                  rt.color === "emerald"
                    ? "hover:bg-emerald-500/[0.05]"
                    : rt.color === "red"
                    ? "hover:bg-red-500/[0.05]"
                    : "hover:bg-amber-500/[0.05]"
                }`}
              >
                <span className="text-xl block mb-2">{rt.emoji}</span>
                <span
                  className={`text-[11px] uppercase tracking-[0.15em] font-medium ${
                    rt.color === "emerald"
                      ? "text-emerald-400/70 group-hover:text-emerald-400"
                      : rt.color === "red"
                      ? "text-red-400/70 group-hover:text-red-400"
                      : "text-amber-400/70 group-hover:text-amber-400"
                  } transition-colors duration-300`}
                >
                  {rt.label}
                </span>
              </button>
            ))}
          </div>

          <p className="mt-4 text-[11px] text-white/20 text-center">
            One tap. Anonymous. Updates the page timestamp for Google freshness.
          </p>
        </div>
      )}
    </div>
  );
}
