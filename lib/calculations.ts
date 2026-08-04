/**
 * Hiring Manager Time Leak — calculation engine.
 *
 * Every constant below is a documented mock assumption, not a validated
 * benchmark. The goal is a calculator whose relationships are logical and
 * whose totals are internally consistent (every category sums exactly to
 * the reported total), not a source of real labour-market or productivity
 * data. Replace the constants — not the shapes — when real data exists.
 */

import { LEADERSHIP_ROLES } from "@/data/leadership-roles";
import type {
  CalculatorInput,
  FunnelHoursStage,
  LossItem,
  SpecialistComparison,
  TimeCategory,
  TimeLeakReport,
  WhatIfAssumptions,
  WhatIfOutput,
} from "./types";

const HOURS_PER_WORKING_DAY = 8;
const HOURS_PER_WORKING_WEEK = 40;

/** Minutes a hiring manager spends on a single resume pass. */
const RESUME_REVIEW_MINUTES = 6;
/** Minutes a recruiter and hiring manager spend syncing per screened candidate. */
const RECRUITER_SYNC_MINUTES = 10;
/** Minutes spent closing out a candidate who didn't progress (rejection call/notes). */
const REJECTION_OVERHEAD_MINUTES = 15;
/** Hours of pipeline rework triggered by a single declined offer. */
const OFFER_FALLOUT_HOURS = 3;

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

function leadershipMultiplier(input: CalculatorInput): number {
  const leadershipRolesSelected = input.involvedRoles.filter((key) => {
    const def = LEADERSHIP_ROLES.find((r) => r.key === key);
    return def?.tier === "leadership";
  });
  return Math.max(1, leadershipRolesSelected.length);
}

function roundToOneDecimal(value: number): number {
  return Math.round(value * 10) / 10;
}

/**
 * Builds the 9 time categories that make up the vertical timeline. Every
 * category is a genuinely distinct activity, so they sum exactly to the
 * reported total leadership time — unlike the interview-count funnel, there
 * is no double counting between categories.
 */
export function computeCategories(input: CalculatorInput): TimeCategory[] {
  const interviewMinutes = input.avgInterviewDurationMins + input.avgPrepTimeMins;
  const totalInterviewRounds =
    input.technicalInterviews + input.hiringManagerInterviews + input.leadershipInterviews + input.finalInterviews;
  const multiplier = leadershipMultiplier(input);

  const resumeReviews = (input.resumesReviewedByManager * RESUME_REVIEW_MINUTES) / 60;
  const interviewScheduling = (totalInterviewRounds * input.avgSchedulingOverheadMins) / 60;
  const recruiterSync = (input.recruiterScreens * RECRUITER_SYNC_MINUTES) / 60;
  const technicalInterviews = (input.technicalInterviews * interviewMinutes) / 60;
  const hiringManagerInterviews = (input.hiringManagerInterviews * interviewMinutes) / 60;
  const leadershipInterviews = (input.leadershipInterviews * multiplier * interviewMinutes) / 60;
  const feedbackDiscussions = (totalInterviewRounds * input.avgFeedbackTimeMins) / 60;
  const rejectedCount = Math.max(0, input.technicalInterviews - input.offers);
  const rejectedCandidates = (rejectedCount * REJECTION_OVERHEAD_MINUTES) / 60;
  const declinedOffers = Math.max(0, input.offers - input.joins);
  const offerFallout = declinedOffers * OFFER_FALLOUT_HOURS;

  return [
    { id: "resume-reviews", label: "Resume Reviews", hours: roundToOneDecimal(resumeReviews) },
    { id: "interview-scheduling", label: "Interview Scheduling", hours: roundToOneDecimal(interviewScheduling) },
    { id: "recruiter-sync", label: "Recruiter Sync", hours: roundToOneDecimal(recruiterSync) },
    { id: "technical-interviews", label: "Technical Interviews", hours: roundToOneDecimal(technicalInterviews) },
    { id: "hiring-manager-interviews", label: "Hiring Manager Interviews", hours: roundToOneDecimal(hiringManagerInterviews) },
    { id: "leadership-interviews", label: "Leadership Interviews", hours: roundToOneDecimal(leadershipInterviews) },
    { id: "feedback-discussions", label: "Feedback Discussions", hours: roundToOneDecimal(feedbackDiscussions) },
    { id: "rejected-candidates", label: "Rejected Candidates", hours: roundToOneDecimal(rejectedCandidates) },
    { id: "offer-fallout", label: "Offer Fallout", hours: roundToOneDecimal(offerFallout) },
  ];
}

function categoryHours(categories: TimeCategory[], id: string): number {
  return categories.find((c) => c.id === id)?.hours ?? 0;
}

function buildFunnelStages(input: CalculatorInput): FunnelHoursStage[] {
  const stageCounts = [
    { id: "resumes", count: Math.max(1, input.resumesReviewedByManager) },
    { id: "screens", count: input.recruiterScreens },
    { id: "technical", count: input.technicalInterviews },
    { id: "manager", count: input.hiringManagerInterviews },
    { id: "leadership", count: input.leadershipInterviews || input.finalInterviews },
    { id: "offers", count: input.offers },
    { id: "joins", count: input.joins },
  ];

  const base = stageCounts[0].count;
  let previousPercent = 100;

  const stages: FunnelHoursStage[] = [
    { id: "total", label: "100 Hours", percentOfTotal: 100, tone: "neutral" },
  ];

  const labels: Record<string, string> = {
    resumes: "Resume Review",
    screens: "Recruiter Screens",
    technical: "Technical Interviews",
    manager: "Manager Interviews",
    leadership: "Leadership Interviews",
    offers: "Offers",
    joins: "Joined",
  };

  for (const stage of stageCounts) {
    const raw = base > 0 ? (stage.count / base) * 100 : 0;
    const percent = clamp(Math.min(raw, previousPercent), 0, 100);
    previousPercent = percent;
    stages.push({
      id: stage.id,
      label: labels[stage.id],
      percentOfTotal: roundToOneDecimal(percent),
      tone: stage.id === "joins" ? "accent" : "neutral",
    });
  }

  const rejectedPercent = clamp(stages[3].percentOfTotal - stages[6].percentOfTotal, 0, 100);
  stages.push({
    id: "rejected",
    label: "Rejected",
    percentOfTotal: roundToOneDecimal(rejectedPercent),
    tone: "red",
  });

  const offerRejectedPercent = clamp(stages[6].percentOfTotal - stages[7].percentOfTotal, 0, 100);
  stages.push({
    id: "offer-rejected",
    label: "Offer Rejected",
    percentOfTotal: roundToOneDecimal(offerRejectedPercent),
    tone: "orange",
  });

  return stages;
}

function buildComparison(categories: TimeCategory[], totalHours: number): SpecialistComparison {
  const technical = categoryHours(categories, "technical-interviews");
  const hm = categoryHours(categories, "hiring-manager-interviews");
  const leadership = categoryHours(categories, "leadership-interviews");
  const rejected = categoryHours(categories, "rejected-candidates");

  // Documented heuristic: a specialist search qualifies candidates earlier,
  // typically removing ~35% of technical/HM/leadership interview time spent
  // on unsuitable candidates, and roughly halving rejection-closure overhead.
  const reduction = clamp(0.35 * (technical + hm + leadership) + 0.5 * rejected, 0, totalHours * 0.7);
  const specialistSupportedHours = Math.max(0, totalHours - reduction);
  const hoursReturned = totalHours - specialistSupportedHours;

  return {
    currentHours: roundToOneDecimal(totalHours),
    specialistSupportedHours: roundToOneDecimal(specialistSupportedHours),
    hoursReturned: roundToOneDecimal(hoursReturned),
    daysReturned: roundToOneDecimal(hoursReturned / HOURS_PER_WORKING_DAY),
  };
}

function buildLossItems(input: CalculatorInput, categories: TimeCategory[]): LossItem[] {
  const technical = categoryHours(categories, "technical-interviews");
  const leadership = categoryHours(categories, "leadership-interviews");
  const scheduling = categoryHours(categories, "interview-scheduling");
  const feedback = categoryHours(categories, "feedback-discussions");
  const offerFallout = categoryHours(categories, "offer-fallout");
  const rejected = categoryHours(categories, "rejected-candidates");

  const stageCount = [
    input.recruiterScreens,
    input.technicalInterviews,
    input.hiringManagerInterviews,
    input.leadershipInterviews,
    input.finalInterviews,
  ].filter((n) => n > 0).length;

  const stageNumberWord = ["Zero", "One", "Two", "Three", "Four", "Five", "Six"][stageCount] ?? `${stageCount}`;

  const items: Omit<LossItem, "rank">[] = [
    {
      id: "unsuitable-technical",
      title: "Too many unsuitable technical interviews",
      estimatedLossHours: roundToOneDecimal(technical * 0.45),
      recommendation: "Improve qualification before technical rounds.",
    },
    {
      id: "leadership-too-early",
      title: "Leadership involved too early",
      estimatedLossHours: roundToOneDecimal(leadership * 0.6),
      recommendation: "Delay executive interviews until shortlist.",
    },
    {
      id: "stage-count",
      title: `${stageNumberWord} interview stages`,
      estimatedLossHours: roundToOneDecimal(scheduling + feedback * 0.5),
      recommendation: "Reduce to three structured rounds.",
    },
    {
      id: "offer-fallout",
      title: "Offer fallout",
      estimatedLossHours: roundToOneDecimal(offerFallout + rejected * 0.3),
      recommendation: "Improve candidate engagement before offer.",
    },
  ];

  return items
    .filter((item) => item.estimatedLossHours > 0)
    .sort((a, b) => b.estimatedLossHours - a.estimatedLossHours)
    .map((item, i) => ({ ...item, rank: i + 1 }));
}

function buildCalendarUtilization(input: CalculatorInput) {
  const totalInterviewRounds =
    input.technicalInterviews + input.hiringManagerInterviews + input.leadershipInterviews + input.finalInterviews;
  const rejectedBlocks = Math.max(0, input.technicalInterviews - input.offers);
  const offerDeclinedBlocks = Math.max(0, input.offers - input.joins);
  const interviewBlocks = Math.max(0, totalInterviewRounds - rejectedBlocks - offerDeclinedBlocks);
  const totalBlocks = Math.max(1, totalInterviewRounds);
  const wastedPercent = Math.round(((rejectedBlocks + offerDeclinedBlocks) / totalBlocks) * 100);

  return {
    totalBlocks,
    interviewBlocks,
    rejectedBlocks,
    offerDeclinedBlocks,
    wastedPercent: clamp(wastedPercent, 0, 100),
  };
}

function buildExecutiveSummary(input: CalculatorInput, report: Pick<TimeLeakReport, "totalLeadershipHours" | "lossItems">): string {
  const topLoss = report.lossItems[0];
  const roleLabel = input.role || "this role";

  return `Your current process for hiring ${roleLabel.toLowerCase()} appears optimised for reducing hiring mistakes. However, it achieves this by transferring significant workload onto senior technical leaders. Based on the information provided, leadership spends approximately ${Math.round(
    report.totalLeadershipHours
  )} hours interviewing candidates to complete ${input.joins > 1 ? `${input.joins} successful hires` : "one successful hire"}. The largest source of lost time is not interview duration — it is ${
    topLoss ? topLoss.title.toLowerCase() : "unsuitable candidates progressing too far through the process"
  }. A specialist recruitment partner would typically reduce the number of leadership interviews rather than simply increase sourcing volume. This allows internal Talent Acquisition teams to continue owning the hiring process while reducing executive involvement earlier in the funnel.`;
}

export function computeTimeLeakReport(input: CalculatorInput): TimeLeakReport {
  const categories = computeCategories(input);
  const totalLeadershipHours = roundToOneDecimal(categories.reduce((sum, c) => sum + c.hours, 0));

  const avgRate =
    input.involvedRoles.length > 0
      ? input.involvedRoles.reduce((sum, key) => {
          const def = LEADERSHIP_ROLES.find((r) => r.key === key);
          return sum + (def?.hourlyRateInr ?? 0);
        }, 0) / input.involvedRoles.length
      : 5000;

  const lossItems = buildLossItems(input, categories);

  const report: TimeLeakReport = {
    input,
    generatedOn: new Date().toISOString(),
    totalLeadershipHours,
    workingDaysEquivalent: roundToOneDecimal(totalLeadershipHours / HOURS_PER_WORKING_DAY),
    weeksEquivalent: roundToOneDecimal(totalLeadershipHours / HOURS_PER_WORKING_WEEK),
    hoursPerHire: roundToOneDecimal(totalLeadershipHours / Math.max(1, input.joins)),
    opportunityCostInr: Math.round(totalLeadershipHours * avgRate),
    categories,
    funnelStages: buildFunnelStages(input),
    calendarUtilization: buildCalendarUtilization(input),
    comparison: buildComparison(categories, totalLeadershipHours),
    lossItems,
    executiveSummary: "",
  };

  report.executiveSummary = buildExecutiveSummary(input, report);
  return report;
}

/**
 * Live recompute for the "What If" simulator. Applies percentage reductions
 * to the relevant categories of an already-computed report, rather than
 * re-deriving from raw input — so the sliders stay fast and the baseline
 * always matches the report currently on screen.
 */
export function computeWhatIf(report: TimeLeakReport, assumptions: WhatIfAssumptions): WhatIfOutput {
  const technical = categoryHours(report.categories, "technical-interviews");
  const hm = categoryHours(report.categories, "hiring-manager-interviews");
  const leadership = categoryHours(report.categories, "leadership-interviews");
  const scheduling = categoryHours(report.categories, "interview-scheduling");
  const feedback = categoryHours(report.categories, "feedback-discussions");
  const rejected = categoryHours(report.categories, "rejected-candidates");
  const offerFallout = categoryHours(report.categories, "offer-fallout");
  const resumeReviews = categoryHours(report.categories, "resume-reviews");
  const recruiterSync = categoryHours(report.categories, "recruiter-sync");

  const compression = assumptions.processCompression / 100;
  const qualification = assumptions.recruiterQualification / 100;
  const falloutReduction = assumptions.offerFalloutReduction / 100;

  // Process compression (fewer rounds): cuts scheduling and feedback
  // overhead directly, and a smaller share of interview time itself.
  const compressedScheduling = scheduling * (1 - compression * 0.6);
  const compressedFeedback = feedback * (1 - compression * 0.5);
  const compressedTechnical = technical * (1 - compression * 0.15);
  const compressedHm = hm * (1 - compression * 0.15);

  // Recruiter qualification: fewer unsuitable candidates reach technical/HM
  // rounds and fewer need rejecting after the fact.
  const qualifiedTechnical = compressedTechnical * (1 - qualification * 0.4);
  const qualifiedRejected = rejected * (1 - qualification * 0.5);

  // Offer fallout reduction: better candidate engagement before the offer.
  const reducedFallout = offerFallout * (1 - falloutReduction);

  // Delaying leadership involvement removes the multiplier effect of
  // several leadership-tier interviewers sitting in on the same rounds.
  const adjustedLeadership = assumptions.delayLeadershipInterviews ? leadership * 0.6 : leadership;

  const totalHours =
    resumeReviews +
    compressedScheduling +
    recruiterSync +
    qualifiedTechnical +
    compressedHm +
    adjustedLeadership +
    compressedFeedback +
    qualifiedRejected +
    reducedFallout;

  const leadershipHoursReturned = Math.max(0, report.totalLeadershipHours - totalHours);

  return {
    totalHours: roundToOneDecimal(totalHours),
    weeksLost: roundToOneDecimal(totalHours / HOURS_PER_WORKING_WEEK),
    leadershipHoursReturned: roundToOneDecimal(leadershipHoursReturned),
  };
}

export const DEFAULT_WHAT_IF_ASSUMPTIONS: WhatIfAssumptions = {
  processCompression: 0,
  recruiterQualification: 0,
  offerFalloutReduction: 0,
  delayLeadershipInterviews: false,
};
