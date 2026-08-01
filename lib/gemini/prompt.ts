import type { SearchBrief } from "@/lib/types";

/**
 * Builds the instruction prompt for Gemini. The model receives the full
 * submitted brief and must return JSON matching GENERATED_CONTENT_GEMINI_SCHEMA
 * — see lib/gemini/generated-content-schema.ts for the exact shape and
 * lib/report-assembler.ts for how this content is combined with
 * code-derived and shared fields into the final report.
 */
export function buildPrompt(brief: SearchBrief): string {
  const { role, hiringContext, offerProcess, attraction } = brief;

  return `You are the analytical engine behind Talent Genome, a premium talent-intelligence product built by a specialist recruitment firm. A client has submitted a confidential role brief. Produce the analytical content for their Talent Genome report as JSON matching the provided schema exactly.

## The brief

Role: ${role.title} (${role.function})
Primary skill: ${role.primarySkill}
Secondary skills: ${role.secondarySkills.join(", ") || "none specified"}
Seniority: ${role.seniority}
Experience band: ${role.experienceMin}–${role.experienceMax} years
Industry preference: ${role.industryPreference}
Domain experience required: ${role.domainExperienceRequired}
Team management required: ${role.teamManagementRequired ? "Yes" : "No"} (${role.managementTrack})
Location: ${role.location}
Remote policy: ${role.remotePolicy}
Relocation allowed: ${role.relocationAllowed ? "Yes" : "No"}

Hiring context: ${hiringContext.isNewRole ? "New role" : "Replacement"}, criticality ${hiringContext.criticality}, desired joining timeline ${hiringContext.desiredJoiningTimelineWeeks} weeks, open for ${hiringContext.roleOpenWeeks} weeks already, previously failed to close: ${hiringContext.previouslyFailedToClose ? "Yes" : "No"}, profiles reviewed so far: ${hiringContext.profilesReviewed}, candidates interviewed: ${hiringContext.candidatesInterviewed}, offers extended: ${hiringContext.offersExtended}, candidate declined an offer: ${hiringContext.candidateDeclined ? "Yes" : "No"}.

Offer and process: compensation ₹${offerProcess.compMinLakh}–${offerProcess.compMaxLakh} lakh (fixed:variable ${offerProcess.fixedVariableSplit}), equity available: ${offerProcess.equityAvailable ? "Yes" : "No"}, ${offerProcess.interviewRounds} interview rounds averaging ${offerProcess.avgDaysBetweenRounds} days apart, final decision maker: ${offerProcess.finalDecisionMaker}, notice period ${offerProcess.noticePeriodDays} days, buyout available: ${offerProcess.buyoutAvailable ? "Yes" : "No"}, joining bonus available: ${offerProcess.joiningBonusAvailable ? "Yes" : "No"}.

Attraction narrative supplied by the client:
- Why a strong candidate would join: ${attraction.whyJoin || "not specified"}
- What they will own: ${attraction.whatTheyWillOwn || "not specified"}
- Success after 12 months: ${attraction.successAfter12Months || "not specified"}
- What's genuinely distinctive: ${attraction.distinctiveFactor || "not specified"}
- What might cause hesitation: ${attraction.hesitationFactors || "not specified"}
- Non-negotiables: ${attraction.nonNegotiables || "not specified"}
- Flexible requirements: ${attraction.flexibleRequirements || "not specified"}

## What to produce

Generate every field in the schema, tailored specifically to this brief — real company names typical for this role's market and geography, real-sounding career paths, and specific, evidence-flavoured reasoning. Every number must be internally consistent with every other number (see rules below). Do not use placeholder or generic text anywhere.

### Numeric consistency rules
- \`talentPool.technicallyRelevant\` is the total market size for this exact skill/seniority/geography combination. Calibrate it to how genuinely niche the role is: a broad, common skill combination might have several thousand technically relevant people; a highly specialised or senior role might have only a few hundred.
- \`talentPool.realisticallyRecruitable\` must be dramatically smaller than \`technicallyRelevant\` — typically 5%–15% of it, reflecting compensation, location, seniority and switching-probability filters. Never more than 20%.
- \`talentPool.highProbabilityMovers\` sits between the two, typically 15%–25% of \`technicallyRelevant\` (candidates in a switching-probability window, regardless of whether they clear every brief constraint).
- \`talentPool.briefCoveragePercent\` = realisticallyRecruitable / technicallyRelevant × 100, rounded to one decimal.
- \`funnel\` has EXACTLY 7 stages, in this fixed order, with monotonically decreasing counts: (1) "Technically relevant profiles" — count equals talentPool.technicallyRelevant; (2) "Correct experience and seniority"; (3) "Relevant domain exposure"; (4) "Suitable location or relocation profile"; (5) "Compensation alignment"; (6) "Likely open to moving" — count equals talentPool.realisticallyRecruitable; (7) "High-intent candidates available now" — a further, smaller narrowing (roughly a third of stage 6). Each stage's \`whyRemoved\` must reference the specific number of candidates removed at that stage, and \`expansionLever\` must name a concrete brief change that would recover some of them.
- \`experienceBands\` percentages should sum to approximately 100.
- \`motivations\` has EXACTLY 10 entries ranked 1–10 with descending \`weightPercent\` (top one in the 45–70% range, bottom one under 20%). Only ranks 1–5 should include \`candidateWants\`, \`weakPositioning\`, and \`strongPositioning\`; omit those three fields for ranks 6–10.
- \`archetypes\` has EXACTLY 4 entries whose \`shareOfPool\` values sum to approximately 100.
- \`employers\` should include 14–20 real, specific, geography-appropriate companies spread across all four categories (Core target, Emerging source, Overfished, Underexplored), each with an \`estimatedPopulation\` that is plausible relative to talentPool.technicallyRelevant.
- \`adjacentProfiles\` has EXACTLY 5 entries. Their \`additionalRecruitable\` values should be modest relative to \`talentPool.realisticallyRecruitable\` (roughly 10%–50% of it each), since the neighbourhood insight will describe combining the top two.
- \`risks\` has EXACTLY 5 entries covering distinct failure modes for this specific brief (e.g. over-narrow requirement stacking, process length, geographic/industry bias, compensation ceiling, narrative/positioning risk) — do not generate generic risks that ignore the actual brief.
- \`taGuidance.recommendedModel\`: choose "Specialist search" if realisticallyRecruitable is under roughly 100 or the role previously failed to close; "Internal TA" only if the pool is broad and the role is low-criticality; otherwise "Hybrid search".
- \`chroBrief.leadershipDecisions\` has EXACTLY 3 entries — concrete yes/no trade-off decisions specific to this brief's actual constraints (not generic).

### Tone and style
Direct, intelligent, specific, evidence-oriented, consultative. Never promotional. Avoid phrases like "unlock top talent", "revolutionize", "cutting-edge", "hire smarter", "best-in-class", "game-changing". Prefer concrete, falsifiable-sounding claims with specific numbers, in the voice of a specialist search analyst briefing a CHRO — similar to: "The current brief addresses approximately 7.8% of the visible market" or "The highest-value adjustment is process speed, not compensation."

Every insight string (\`executiveInsight\`, \`employerInsight\`, \`competitiveInsight\`, \`neighbourhoodInsight\`, \`bestEngagementWindow\`, \`careerPathInsights\`) must reference specific numbers or names from this brief or from the content you just generated — never a generic statement that could apply to any role.

Return only the JSON object matching the schema. Do not include markdown formatting, code fences, or commentary outside the JSON.`;
}
