/**
 * Hiring Manager Time Leak: core data model.
 *
 * The whole app is a client-side calculator: a submitted CalculatorInput is
 * turned into a TimeLeakReport by lib/calculations.ts, entirely in the
 * browser, with no backend involved. Every number is a documented mock
 * heuristic, see the comments in lib/calculations.ts for the assumptions.
 */

// ---------------------------------------------------------------------------
// Leadership roles + mock hourly value
// ---------------------------------------------------------------------------

export type LeadershipRoleKey =
  | "engineering_manager"
  | "senior_engineer"
  | "principal_engineer"
  | "director"
  | "vp"
  | "cto"
  | "founder"
  | "product_head";

export interface LeadershipRoleDefinition {
  key: LeadershipRoleKey;
  label: string;
  /** Mock hourly value in INR, used only to compute a de-emphasised opportunity-cost figure. */
  hourlyRateInr: number;
  /** Roles at this tier multiply leadership-interview hours when several are selected together. */
  tier: "interviewer" | "leadership";
}

// ---------------------------------------------------------------------------
// Calculator input (the 5-step form)
// ---------------------------------------------------------------------------

export interface CalculatorInput {
  // Step 1: basic information
  role: string;

  // Step 2: hiring volume
  hiresNeeded: number;

  // Step 3: current hiring process (funnel counts)
  resumesReviewedByManager: number;
  recruiterScreens: number;
  technicalInterviews: number;
  hiringManagerInterviews: number;
  leadershipInterviews: number;
  finalInterviews: number;
  offers: number;
  joins: number;

  // Step 4: interview details (minutes)
  avgInterviewDurationMins: number;
  avgPrepTimeMins: number;
  avgFeedbackTimeMins: number;
  avgSchedulingOverheadMins: number;

  // Step 5: leadership involvement
  involvedRoles: LeadershipRoleKey[];
}

// ---------------------------------------------------------------------------
// Computed report
// ---------------------------------------------------------------------------

export interface TimeCategory {
  id: string;
  label: string;
  hours: number;
}

export interface CalendarUtilization {
  totalBlocks: number;
  interviewBlocks: number;
  rejectedBlocks: number;
  offerDeclinedBlocks: number;
  wastedPercent: number;
}

export interface FunnelHoursStage {
  id: string;
  label: string;
  /** Percentage of the original 100-hour bar still "in play" at this stage. */
  percentOfTotal: number;
  tone: "neutral" | "accent" | "red" | "orange";
}

export interface SpecialistComparison {
  currentHours: number;
  specialistSupportedHours: number;
  hoursReturned: number;
  daysReturned: number;
}

export interface LossItem {
  id: string;
  rank: number;
  title: string;
  estimatedLossHours: number;
  recommendation: string;
}

export interface TimeLeakReport {
  input: CalculatorInput;
  generatedOn: string;

  totalLeadershipHours: number;
  workingDaysEquivalent: number;
  weeksEquivalent: number;
  hoursPerHire: number;
  opportunityCostInr: number;

  categories: TimeCategory[];
  funnelStages: FunnelHoursStage[];
  calendarUtilization: CalendarUtilization;
  comparison: SpecialistComparison;
  lossItems: LossItem[];
  executiveSummary: string;
}

// ---------------------------------------------------------------------------
// What-if simulator
// ---------------------------------------------------------------------------

export interface WhatIfAssumptions {
  /** 0 = no compression, 100 = maximum stage compression (5 rounds → 3). */
  processCompression: number;
  /** 0 = current qualification depth, 100 = maximum improvement in early screening. */
  recruiterQualification: number;
  /** 0 = no change, 100 = maximum reduction in declined-offer rework. */
  offerFalloutReduction: number;
  /** "Move CTO interview later": delay top-tier leadership involvement until shortlist. */
  delayLeadershipInterviews: boolean;
}

export interface WhatIfOutput {
  totalHours: number;
  weeksLost: number;
  leadershipHoursReturned: number;
}

// ---------------------------------------------------------------------------
// Role presets
// ---------------------------------------------------------------------------

export interface RoleOption {
  value: string;
  label: string;
}
