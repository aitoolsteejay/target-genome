import { NextResponse } from "next/server";
import type { CalculatorInput, TimeLeakReport } from "@/lib/types";
import { computeTimeLeakReport } from "@/lib/calculations";
import { generateReportNarrativeWithGemini, isGeminiConfigured } from "@/lib/gemini/client";

export const runtime = "nodejs";
export const maxDuration = 60;

const REQUIRED_NUMERIC_FIELDS: (keyof CalculatorInput)[] = [
  "hiresNeeded",
  "resumesReviewedByManager",
  "recruiterScreens",
  "technicalInterviews",
  "hiringManagerInterviews",
  "leadershipInterviews",
  "finalInterviews",
  "offers",
  "joins",
  "avgInterviewDurationMins",
  "avgPrepTimeMins",
  "avgFeedbackTimeMins",
  "avgSchedulingOverheadMins",
];

function isWellFormedInput(value: unknown): value is CalculatorInput {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  if (typeof v.role !== "string" || !Array.isArray(v.involvedRoles)) return false;
  return REQUIRED_NUMERIC_FIELDS.every((key) => typeof v[key] === "number" && Number.isFinite(v[key] as number));
}

/**
 * Overlays Gemini-written narrative onto the deterministic report. Every
 * number (hours, totals, percentages) always comes from
 * lib/calculations.ts — Gemini only replaces the executive summary text and
 * each loss item's title/recommendation, never estimatedLossHours.
 */
function applyNarrative(
  report: TimeLeakReport,
  narrative: { executiveSummary: string; lossItems: { id: string; title: string; recommendation: string }[] }
): TimeLeakReport {
  const narrativeById = new Map(narrative.lossItems.map((item) => [item.id, item]));

  return {
    ...report,
    executiveSummary: narrative.executiveSummary,
    lossItems: report.lossItems.map((item) => {
      const override = narrativeById.get(item.id);
      return override ? { ...item, title: override.title, recommendation: override.recommendation } : item;
    }),
  };
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }

  const input = (body as { input?: unknown } | null)?.input;
  if (!isWellFormedInput(input)) {
    return NextResponse.json(
      { error: "Request body must include a well-formed `input` object." },
      { status: 400 }
    );
  }

  let report: TimeLeakReport;
  try {
    report = computeTimeLeakReport(input);
  } catch (err) {
    console.error("[generate-report] Calculation failed:", err);
    return NextResponse.json({ error: "Could not calculate a report from this input." }, { status: 500 });
  }

  if (isGeminiConfigured()) {
    try {
      const narrative = await generateReportNarrativeWithGemini(
        input,
        report.totalLeadershipHours,
        report.categories,
        report.lossItems
      );
      return NextResponse.json({ report: applyNarrative(report, narrative), source: "gemini" });
    } catch (err) {
      console.error("[generate-report] Gemini generation failed, falling back:", err);
    }
  }

  return NextResponse.json({ report, source: "fallback" });
}
