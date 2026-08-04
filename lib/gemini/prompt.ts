import type { CalculatorInput, LossItem, TimeCategory } from "@/lib/types";

/**
 * Builds the prompt for Gemini. The model receives the submitted inputs and
 * the ALREADY-COMPUTED hours for every category and loss item, and is asked
 * only to write prose around them, not to invent or change any number. See
 * lib/gemini/generated-content-schema.ts for the exact JSON shape expected
 * back.
 */
export function buildPrompt(
  input: CalculatorInput,
  totalHours: number,
  categories: TimeCategory[],
  lossItems: LossItem[]
): string {
  const categoryLines = categories
    .map((c) => `- ${c.label}: ${c.hours} hours`)
    .join("\n");

  const lossItemLines = lossItems
    .map((item) => `- id "${item.id}", currently titled "${item.title}", accounts for ${item.estimatedLossHours} hours`)
    .join("\n");

  return `You are writing the plain-English narrative for a "Hiring Manager Time Leak" report. This tool tells a hiring manager or engineering leader how many leadership hours their hiring process for one role is consuming. The tone is direct, calm, and easy to understand for someone who is not a recruiter. Never use em dashes. Avoid buzzwords like "revolutionary", "game-changing", "AI-powered", or "unlock". Keep sentences short.

## The situation

Role being hired for: ${input.role || "this role"}
Number of hires needed: ${input.hiresNeeded}
Resumes the hiring manager personally reviews: ${input.resumesReviewedByManager}
Recruiter screens: ${input.recruiterScreens}
Technical interviews: ${input.technicalInterviews}
Hiring Manager interviews: ${input.hiringManagerInterviews}
Leadership interviews: ${input.leadershipInterviews}
Final interviews: ${input.finalInterviews}
Offers made: ${input.offers}
Candidates who joined: ${input.joins}
Average interview length: ${input.avgInterviewDurationMins} minutes
Leaders who typically interview: ${input.involvedRoles.join(", ") || "not specified"}

## Numbers already calculated (do not change these, just refer to them)

Total leadership hours consumed: ${totalHours}

Hours by category:
${categoryLines}

The current "where the time is lost" items, ranked by hours already calculated:
${lossItemLines}

## What to write

Return JSON matching the schema with exactly two things:

1. "executiveSummary": a short paragraph (roughly 4 to 6 sentences) written for the hiring manager who submitted this. Reference the actual role, the actual total hours, and the actual biggest loss item by name. Explain what it means in plain language, and end with one concrete, specific suggestion tied to their numbers. Do not use the word "leverage" or "optimize". Do not start with "In conclusion" or "Overall".

2. "lossItems": exactly 4 objects, one for each id below, each with a short punchy "title" (under 8 words) and a specific one-sentence "recommendation" that a hiring manager could actually act on this week. Write these as if you are a specialist recruiter giving direct advice, not a generic tip list. Keep the title recognizably about the same problem as the current title, but feel free to make it sharper and more specific to this exact role and these exact numbers.
   - id "unsuitable-technical": about too many technical interviews with candidates who were not a real fit
   - id "leadership-too-early": about senior leaders (Director, VP, CTO, founder) sitting in interviews before a shortlist exists
   - id "stage-count": about the number of interview stages and scheduling and feedback overhead that come with them
   - id "offer-fallout": about time lost when an offer is declined and the process has to restart

Return only the JSON object. No markdown formatting, no code fences, no extra commentary.`;
}
