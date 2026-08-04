import type { CalculatorInput } from "@/lib/types";

/**
 * Used both to preload the calculator form and as the instant "View Example
 * Report" preset. Deliberately a demanding but realistic senior-hire
 * scenario — the numbers are illustrative, not derived from any real search.
 */
export const EXAMPLE_INPUT: CalculatorInput = {
  role: "Backend Engineer",
  hiresNeeded: 1,

  resumesReviewedByManager: 70,
  recruiterScreens: 35,
  technicalInterviews: 16,
  hiringManagerInterviews: 10,
  leadershipInterviews: 4,
  finalInterviews: 3,
  offers: 3,
  joins: 1,

  avgInterviewDurationMins: 60,
  avgPrepTimeMins: 20,
  avgFeedbackTimeMins: 15,
  avgSchedulingOverheadMins: 10,

  involvedRoles: ["engineering_manager", "senior_engineer", "director", "vp", "cto"],
};
