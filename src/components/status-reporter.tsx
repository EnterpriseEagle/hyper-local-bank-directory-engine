"use client";

import { useState } from "react";

interface StatusReporterProps {
  branches: { id: number; name: string; type: string; status: string }[];
  suburbId: number;
  suburbName: string;
}

const REPORT_TYPES = [
  { value: "working", label: "Working", icon: "check-circle", color: "emerald" },
  { value: "atm_empty", label: "ATM Empty", icon: "x-circle", color: "red" },
  { value: "branch_closed", label: "Branch Closed", icon: "x-circle", color: "red" },
  { value: "long_queue", label: "Long Queue", icon: "clock", color: "amber" },
];

export function StatusReporter({ branches, suburbId, suburbName }: StatusReporterProps) {
  const [selectedBranch, setSelectedBranch] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const activeBranches = branches.filter((b) => b.status !== "closed");

  async function handleReport(reportType: string) {
    if (!selectedBranch) {
      setError("Please select a branch or ATM first");
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
      setTimeout(() => setSubmitted(false), 4000);
    } catch {
      setError("Failed to submit report. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 md:p-8 text-white">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
          <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-bold">Live Status Reporter</h3>
          <p className="text-sm text-slate-400">Help others in {suburbName} - report real-time status</p>
        </div>
      </div>

      {submitted ? (
        <div className="mt-4 bg-emerald-500/20 border border-emerald-500/30 rounded-xl p-4 text-center">
          <svg className="w-8 h-8 text-emerald-400 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="font-semibold text-emerald-300">Report Submitted!</p>
          <p className="text-sm text-slate-400 mt-1">Thank you for keeping {suburbName} updated.</p>
        </div>
      ) : (
        <>
          <div className="mt-4">
            <label className="text-sm font-medium text-slate-300 mb-2 block">
              Select Branch or ATM
            </label>
            <select
              value={selectedBranch || ""}
              onChange={(e) => {
                setSelectedBranch(Number(e.target.value) || null);
                setError("");
              }}
              className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              <option value="">Choose a location...</option>
              {activeBranches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name} ({b.type === "atm" ? "ATM" : "Branch"})
                </option>
              ))}
            </select>
          </div>

          {error && (
            <p className="mt-2 text-sm text-red-400">{error}</p>
          )}

          <div className="mt-4 grid grid-cols-2 gap-3">
            {REPORT_TYPES.map((rt) => (
              <button
                key={rt.value}
                onClick={() => handleReport(rt.value)}
                disabled={submitting}
                className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 disabled:opacity-50 ${
                  rt.color === "emerald"
                    ? "bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30"
                    : rt.color === "red"
                    ? "bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30"
                    : "bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30"
                }`}
              >
                {rt.value === "working" && (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
                {(rt.value === "atm_empty" || rt.value === "branch_closed") && (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
                {rt.value === "long_queue" && (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
                {rt.label}
              </button>
            ))}
          </div>

          <p className="mt-3 text-xs text-slate-500 text-center">
            No login required. Reports are anonymous and help your community.
          </p>
        </>
      )}
    </div>
  );
}
