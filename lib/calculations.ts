/**
 * Talent Genome — demo calculation heuristics.
 *
 * Every function in this file is a transparent, documented HEURISTIC used to
 * make the prototype behave logically as a user changes assumptions. None of
 * the constants below are derived from verified labour-market data. In
 * production, replace these with models trained on validated internal search
 * data, licensed talent-market datasets, and candidate-conversation records —
 * the function signatures are designed so that swap can happen without
 * touching any component.
 */

import type {
  PressureLevel,
  ScenarioAssumptions,
  ScenarioBaseline,
  ScenarioOutput,
  SearchBrief,
  SearchDifficulty,
  TalentPool,
} from "./types";

export type { ScenarioBaseline };

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

/**
 * Demo heuristic: each lever moves the recruitable pool multiplicatively,
 * relative to the report's own baseline assumptions. The multipliers are
 * calibrated so the direction and rough magnitude of change feels credible
 * for a specialist/niche technical search — they are not fitted to data.
 */
export function computeScenarioOutput(
  baseline: ScenarioBaseline,
  assumptions: ScenarioAssumptions
): ScenarioOutput {
  const a = baseline.assumptions;
  let poolMultiplier = 1;
  let relevantMultiplier = 1;
  let acceptanceDelta = 0;
  let durationMultiplier = 1;

  // Compensation — raising the ceiling recruits comp-sensitive candidates,
  // with diminishing returns; lowering it shrinks the pool faster than it grew.
  const compDelta = (assumptions.compMaxLakh - a.compMaxLakh) / a.compMaxLakh;
  poolMultiplier *= 1 + clamp(compDelta, -0.6, 1) * 0.55;
  acceptanceDelta += clamp(compDelta, -0.6, 1) * 18;

  // Remote across the country — the single largest lever for location-bound
  // niche roles: it compounds beyond the simple funnel location filter
  // because it also reaches comp-flexible candidates outside the metro.
  if (assumptions.allowRemoteAcrossCountry && !a.allowRemoteAcrossCountry) {
    poolMultiplier *= 2.3;
    relevantMultiplier *= 1.12;
    durationMultiplier *= 0.72;
    acceptanceDelta += 6;
  } else if (!assumptions.allowRemoteAcrossCountry && a.allowRemoteAcrossCountry) {
    poolMultiplier *= 1 / 2.3;
    durationMultiplier *= 1.25;
  }

  // Minimum experience — each year shaved off the floor widens both the
  // technically relevant and recruitable pools, since more candidates clear
  // the seniority bar.
  const experienceDeltaYears = a.experienceMin - assumptions.experienceMin;
  poolMultiplier *= 1 + experienceDeltaYears * 0.14;
  relevantMultiplier *= 1 + experienceDeltaYears * 0.08;

  // Mandatory industry/domain match (e.g. "must have fintech experience").
  if (!assumptions.requireIndustryMatch && a.requireIndustryMatch) {
    poolMultiplier *= 1.9;
    relevantMultiplier *= 1.1;
  } else if (assumptions.requireIndustryMatch && !a.requireIndustryMatch) {
    poolMultiplier *= 1 / 1.9;
  }

  // Mandatory secondary skills — every skill dropped from "must-have" to
  // "nice-to-have" reopens candidates who were otherwise a strong fit.
  const skillsDelta = a.mandatorySkillsCount - assumptions.mandatorySkillsCount;
  poolMultiplier *= 1 + skillsDelta * 0.1;

  // Leadership / people-management requirement — dropping it opens the
  // individual-contributor track, which is usually the deeper pool.
  if (!assumptions.leadershipRequired && a.leadershipRequired) {
    poolMultiplier *= 1.3;
  } else if (assumptions.leadershipRequired && !a.leadershipRequired) {
    poolMultiplier *= 1 / 1.3;
  }

  // Notice-period tolerance — doesn't change who exists, but changes who is
  // willing to engage and how fast the process can move.
  const noticeDeltaDays = assumptions.noticePeriodToleranceDays - a.noticePeriodToleranceDays;
  acceptanceDelta += clamp(noticeDeltaDays / 30, -2, 2) * 3;
  durationMultiplier *= 1 - clamp(noticeDeltaDays / 30, -2, 2) * 0.03;

  // Interview rounds — pool of candidates is unaffected, but participation,
  // offer-acceptance and duration all respond to process length.
  const roundsDelta = a.interviewRounds - assumptions.interviewRounds;
  acceptanceDelta += roundsDelta * 4.2;
  durationMultiplier *= 1 - roundsDelta * 0.045;

  const technicallyRelevant = Math.round(baseline.technicallyRelevant * relevantMultiplier);
  const recruitable = Math.round(
    clamp(baseline.recruitable * poolMultiplier, 4, technicallyRelevant * 0.85)
  );
  const highProbabilityMovers = Math.round(
    clamp(
      baseline.highProbabilityMovers * Math.sqrt(poolMultiplier * relevantMultiplier),
      2,
      technicallyRelevant
    )
  );

  const recruitableShare = recruitable / technicallyRelevant;
  const competitivePressure = pressureFromShare(recruitableShare);
  const searchDifficulty = difficultyFromShare(recruitableShare, assumptions.interviewRounds);

  const durationMin = Math.max(4, Math.round(baseline.searchDurationWeeksMin * durationMultiplier));
  const durationMax = Math.max(
    durationMin + 2,
    Math.round(baseline.searchDurationWeeksMax * durationMultiplier)
  );

  const offerAcceptanceProbability = Math.round(
    clamp(baseline.offerAcceptanceProbability + acceptanceDelta, 12, 96)
  );

  return {
    technicallyRelevant,
    recruitable,
    highProbabilityMovers,
    competitivePressure,
    searchDurationWeeksMin: durationMin,
    searchDurationWeeksMax: durationMax,
    searchDifficulty,
    offerAcceptanceProbability,
  };
}

function pressureFromShare(share: number): PressureLevel {
  if (share < 0.05) return "Very high";
  if (share < 0.1) return "High";
  if (share < 0.2) return "Moderate";
  return "Low";
}

function difficultyFromShare(share: number, rounds: number): SearchDifficulty {
  const roundsPenalty = rounds >= 5 ? 0.02 : rounds <= 3 ? -0.015 : 0;
  const adjusted = share + roundsPenalty;
  if (adjusted < 0.05) return "Very high";
  if (adjusted < 0.09) return "High";
  if (adjusted < 0.14) return "Moderate to high";
  return "Moderate";
}

/** Share of the technically relevant market addressed by the current brief. */
export function briefCoveragePercent(pool: TalentPool): number {
  return Math.round((pool.realisticallyRecruitable / pool.technicallyRelevant) * 1000) / 10;
}

/** Helper used by the Talent Neighbourhood section to preview a widened brief. */
export function addAdjacentProfileImpact(
  currentRecruitable: number,
  additionalRecruitable: number
): number {
  return currentRecruitable + additionalRecruitable;
}

export function formatWeeksRange(min: number, max: number): string {
  return `${min}–${max} weeks`;
}

export type BriefBreadth = "narrow" | "broad" | "balanced";

/**
 * Heuristic read on whether the brief, as written, is unusually narrow or
 * unusually broad — used to surface the empty/alternate-state guidance in
 * the executive summary. Based on how many mutually-reinforcing constraints
 * are stacked, not on any real market signal.
 */
export function classifyBriefBreadth(brief: SearchBrief): BriefBreadth {
  let narrowSignals = 0;
  let broadSignals = 0;

  const expSpan = brief.role.experienceMax - brief.role.experienceMin;
  if (expSpan <= 3) narrowSignals++;
  else if (expSpan >= 10) broadSignals++;

  if (brief.role.remotePolicy === "Onsite" && !brief.role.relocationAllowed) narrowSignals++;
  if (brief.role.remotePolicy === "Remote — anywhere in country") broadSignals++;

  const domain = brief.role.domainExperienceRequired.trim();
  if (domain.length > 0 && !/none|any|not required|open/i.test(domain)) narrowSignals++;
  else broadSignals++;

  const industry = brief.role.industryPreference.trim();
  if (industry.length > 0 && !/any|open/i.test(industry)) narrowSignals++;

  if (brief.role.secondarySkills.length >= 3) narrowSignals++;
  if (brief.role.secondarySkills.length === 0) broadSignals++;

  if (brief.offerProcess.interviewRounds >= 5) narrowSignals++;
  if (brief.role.teamManagementRequired && brief.role.seniority !== "Director" && brief.role.seniority !== "VP / Executive") {
    narrowSignals++;
  }

  if (narrowSignals >= 5) return "narrow";
  if (broadSignals >= 3 && narrowSignals <= 1) return "broad";
  return "balanced";
}
