import { NextResponse } from "next/server";
import type { SearchBrief } from "@/lib/types";
import { validateBrief } from "@/lib/validate-brief";
import { generateReport as generateFallbackReport } from "@/lib/report-generator";
import { assembleReport } from "@/lib/report-assembler";
import { generateReportContentWithGemini, isGeminiConfigured } from "@/lib/gemini/client";

export const runtime = "nodejs";
export const maxDuration = 60;

function isWellFormedBrief(value: unknown): value is SearchBrief {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.role === "object" &&
    v.role !== null &&
    typeof v.hiringContext === "object" &&
    v.hiringContext !== null &&
    typeof v.offerProcess === "object" &&
    v.offerProcess !== null &&
    typeof v.attraction === "object" &&
    v.attraction !== null
  );
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }

  const brief = (body as { brief?: unknown } | null)?.brief;
  if (!isWellFormedBrief(brief)) {
    return NextResponse.json(
      { error: "Request body must include a well-formed `brief` object." },
      { status: 400 }
    );
  }

  const validationErrors = validateBrief(brief);
  if (Object.keys(validationErrors).length > 0) {
    return NextResponse.json({ error: "Invalid brief.", fieldErrors: validationErrors }, { status: 400 });
  }

  const generatedOn = new Date().toISOString();

  if (isGeminiConfigured()) {
    try {
      const content = await generateReportContentWithGemini(brief);
      const report = assembleReport({ brief, content, generatedOn });
      return NextResponse.json({ report, source: "gemini", isApproximateMatch: false });
    } catch (err) {
      console.error("[generate-report] Gemini generation failed, falling back:", err);
    }
  }

  try {
    const { report, isApproximateMatch } = generateFallbackReport(brief, generatedOn);
    return NextResponse.json({ report, source: "fallback", isApproximateMatch });
  } catch (err) {
    console.error("[generate-report] Fallback generation failed:", err);
    return NextResponse.json(
      { error: "Report generation failed. Please try again." },
      { status: 500 }
    );
  }
}
