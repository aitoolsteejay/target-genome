import type { ResistanceFactor } from "@/lib/types";

/**
 * Candidate resistance patterns observed across the firm's specialist
 * searches. These are behavioural patterns, not role-specific data, which is
 * why the same set is referenced from every sample report — a real
 * production version would still layer role-specific weighting on top.
 */
export const RESISTANCE_FACTORS: ResistanceFactor[] = [
  {
    id: "ignore-generic-outreach",
    stage: "Ignore",
    issue: "Generic, templated recruiter outreach",
    impact: "Estimated 35–45% of qualified passive candidates never respond to the first message.",
    severity: "High",
    control: "High",
    recommendedFix:
      "Personalise the opening line to something specific about the candidate's current platform or team — not the role's tech stack.",
  },
  {
    id: "ignore-experience-checklist",
    stage: "Ignore",
    issue: "Excessive focus on years of experience over scope",
    impact: "Reduces response rate among senior candidates who read it as a junior-facing message.",
    severity: "Medium",
    control: "High",
    recommendedFix: "Lead the message with ownership and mandate, not a years-of-experience threshold.",
  },
  {
    id: "ignore-employer-story",
    stage: "Ignore",
    issue: "Unconvincing employer engineering story",
    impact: "Candidates from strong engineering cultures disengage if the outreach cannot articulate a credible technical narrative.",
    severity: "Medium",
    control: "Medium",
    recommendedFix: "Anchor outreach in a specific technical problem the hire will own, not employer-brand claims.",
  },
  {
    id: "ignore-unclear-mandate",
    stage: "Ignore",
    issue: "Unclear product or platform mandate in the first message",
    impact: "Candidates cannot self-select in or out, so many default to ignoring rather than asking.",
    severity: "Medium",
    control: "High",
    recommendedFix: "State the mandate in one sentence: what will this person own, and at what scale.",
  },
  {
    id: "drop-five-rounds",
    stage: "Drop",
    issue: "Five or more interview rounds",
    impact: "Estimated 22% reduction in continued candidate participation after round three.",
    severity: "Critical",
    control: "High",
    recommendedFix:
      "Combine technical, architecture and stakeholder rounds into a structured panel conducted within the same week.",
  },
  {
    id: "drop-reporting-structure",
    stage: "Drop",
    issue: "Unclear reporting structure",
    impact: "Senior candidates disengage when they cannot map their own seniority against the org chart.",
    severity: "High",
    control: "High",
    recommendedFix: "Share the reporting line and peer group by the second conversation, not the offer stage.",
  },
  {
    id: "drop-authority-mismatch",
    stage: "Drop",
    issue: "Role described as leadership but lacking actual authority",
    impact: "Creates the most damaging category of drop-off: candidates feel misled rather than simply uninterested.",
    severity: "Critical",
    control: "High",
    recommendedFix: "Only use leadership language in the brief if the role carries budget, roadmap or hiring authority.",
  },
  {
    id: "drop-approval-gaps",
    stage: "Drop",
    issue: "Long gaps between interview stages awaiting internal approval",
    impact: "Every additional week of silence measurably increases the chance of a competing offer landing first.",
    severity: "High",
    control: "Medium",
    recommendedFix: "Pre-commit a weekly decision forum so no candidate waits more than five working days for feedback.",
  },
  {
    id: "drop-title-mismatch",
    stage: "Drop",
    issue: "Title mismatch against the candidate's current seniority",
    impact: "Candidates weigh title change heavily when it is visible to their own network.",
    severity: "Medium",
    control: "Medium",
    recommendedFix: "Confirm internal levelling before outreach begins, not after an offer is verbally discussed.",
  },
  {
    id: "reject-relocation",
    stage: "Reject",
    issue: "Mandatory relocation with no flexibility",
    impact: "One of the highest-frequency final-stage rejection reasons for candidates with families or property commitments.",
    severity: "High",
    control: "Medium",
    recommendedFix: "Offer a defined transition window or hybrid ramp-up period rather than an immediate hard relocation.",
  },
  {
    id: "reject-office-requirement",
    stage: "Reject",
    issue: "Full-time office attendance requirement",
    impact: "Removes a meaningful share of otherwise-committed candidates at final decision, particularly those already on hybrid arrangements.",
    severity: "High",
    control: "High",
    recommendedFix: "Distinguish where flexibility is genuinely non-negotiable from where it is inherited policy.",
  },
  {
    id: "reject-comp-late",
    stage: "Reject",
    issue: "Compensation range shared too late in the process",
    impact: "Candidates who invest three or more rounds before seeing a number reject on principle, even when the number is competitive.",
    severity: "Critical",
    control: "High",
    recommendedFix: "Share the compensation band in the first substantive conversation, before technical rounds begin.",
  },
  {
    id: "reject-no-hm-access",
    stage: "Reject",
    issue: "No access to the hiring manager until the final round",
    impact: "Strong candidates read this as a signal about how much authority the role actually carries.",
    severity: "High",
    control: "High",
    recommendedFix: "Bring the hiring manager into the process within the first two stages, not as a closing formality.",
  },
];
