import type {
  ExecutiveMetric,
  ScenarioAssumptions,
  ScenarioBaseline,
  ScenarioPreset,
  SearchBrief,
  TalentGenomeReport,
  TalentPool,
} from "./types";
import type { GeneratedReportContent } from "./gemini/generated-content-schema";
import { RESISTANCE_FACTORS } from "@/data/resistance";
import { COMPARABLE_SEARCHES } from "@/data/comparable-searches";
import { SWITCHING_SIGNALS } from "@/data/switching-signals";
import { SEARCH_MODEL_GUIDANCE } from "@/data/ta-guidance";

let reportCounter = 0;

function nextReportId(): string {
  reportCounter += 1;
  const year = new Date().getUTCFullYear();
  const seq = (Date.now() % 100000) + reportCounter;
  return `TG-${year}-${String(seq).padStart(5, "0")}`;
}

function buildExecutiveMetrics(talentPool: TalentPool): ExecutiveMetric[] {
  return [
    {
      id: "relevant",
      label: "Technically relevant talent",
      value: talentPool.technicallyRelevant.toLocaleString("en-IN"),
      explanation:
        "Profiles carrying the core skill combination, seniority band and general market presence this role calls for.",
    },
    {
      id: "recruitable",
      label: "Realistically recruitable",
      value: talentPool.realisticallyRecruitable.toLocaleString("en-IN"),
      explanation:
        "Profiles that fit the role and are likely to consider a move under the current location, compensation, seniority and working-model assumptions.",
    },
    {
      id: "movers",
      label: "High-probability movers",
      value: talentPool.highProbabilityMovers.toLocaleString("en-IN"),
      explanation:
        "Technically relevant candidates currently inside a tenure and career-stage window associated with higher switching probability, regardless of whether they clear every brief constraint.",
    },
    {
      id: "tenure",
      label: "Median tenure",
      value: `${talentPool.medianTenureYears} yrs`,
      explanation:
        "The typical time this segment stays at one employer before moving — the baseline rhythm the search should be timed against.",
    },
    {
      id: "pressure",
      label: "Competitive pressure",
      value: talentPool.competitivePressure,
      explanation:
        "The intensity with which other employers are simultaneously pursuing the same narrow candidate segment.",
    },
    {
      id: "window",
      label: "Estimated search window",
      value: `${talentPool.searchWindowWeeksMin}–${talentPool.searchWindowWeeksMax} weeks`,
      explanation:
        "Expected duration from market mapping to signed offer under the current brief, before notice-period serving.",
    },
  ];
}

function isDomainMandatory(text: string): boolean {
  const t = text.trim().toLowerCase();
  return t.length > 0 && !["none", "any", "open", "not required", "n/a"].some((v) => t.includes(v));
}

function buildScenarioAssumptions(brief: SearchBrief): ScenarioAssumptions {
  return {
    compMaxLakh: brief.offerProcess.compMaxLakh,
    allowRemoteAcrossCountry: brief.role.remotePolicy === "Remote — anywhere in country",
    experienceMin: brief.role.experienceMin,
    requireIndustryMatch: isDomainMandatory(brief.role.domainExperienceRequired),
    interviewRounds: brief.offerProcess.interviewRounds,
    mandatorySkillsCount: brief.role.secondarySkills.length,
    noticePeriodToleranceDays: brief.offerProcess.noticePeriodDays,
    leadershipRequired: brief.role.teamManagementRequired,
  };
}

function buildScenarioBaseline(brief: SearchBrief, talentPool: TalentPool): ScenarioBaseline {
  const rounds = brief.offerProcess.interviewRounds;
  const offerAcceptanceProbability = Math.round(
    Math.min(75, Math.max(20, 55 - (rounds - 3) * 4))
  );

  return {
    assumptions: buildScenarioAssumptions(brief),
    technicallyRelevant: talentPool.technicallyRelevant,
    recruitable: talentPool.realisticallyRecruitable,
    highProbabilityMovers: talentPool.highProbabilityMovers,
    competitivePressure: talentPool.competitivePressure,
    searchDurationWeeksMin: talentPool.searchWindowWeeksMin,
    searchDurationWeeksMax: talentPool.searchWindowWeeksMax,
    offerAcceptanceProbability,
  };
}

function truncate(text: string, max: number): string {
  return text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text;
}

function buildScenarioPresets(brief: SearchBrief): ScenarioPreset[] {
  const { role, offerProcess } = brief;
  const reducedExperience = Math.max(1, role.experienceMin - 2);
  const reducedRounds = Math.max(2, offerProcess.interviewRounds - 2);
  const domainLabel = truncate(
    role.domainExperienceRequired.trim() || role.industryPreference.trim() || "domain",
    40
  );

  const presets: ScenarioPreset[] = [
    {
      id: "current",
      label: "Current Brief",
      description: "The search as currently defined.",
      overrides: {},
    },
  ];

  if (role.remotePolicy !== "Remote — anywhere in country") {
    presets.push({
      id: "remote",
      label: "Allow Remote Across India",
      description: "Remove the location-centric constraint entirely.",
      overrides: { allowRemoteAcrossCountry: true },
    });
  }

  if (role.experienceMin > 2) {
    presets.push({
      id: "experience",
      label: `Reduce Experience Requirement (${role.experienceMin} → ${reducedExperience} years)`,
      description: "Lower the effective minimum experience floor by two years.",
      overrides: { experienceMin: reducedExperience },
    });
  }

  if (isDomainMandatory(role.domainExperienceRequired)) {
    presets.push({
      id: "domain",
      label: `Remove Mandatory ${domainLabel} Experience`,
      description: "Treat domain experience as preferred rather than mandatory.",
      overrides: { requireIndustryMatch: false },
    });
  }

  if (offerProcess.interviewRounds > 3) {
    presets.push({
      id: "rounds",
      label: `Reduce Interview Rounds (${offerProcess.interviewRounds} → ${reducedRounds})`,
      description: "Compress the process without changing the pool definition.",
      overrides: { interviewRounds: reducedRounds },
    });
  }

  return presets;
}

export interface AssembleReportOptions {
  brief: SearchBrief;
  content: GeneratedReportContent;
  generatedOn: string;
  reportId?: string;
}

/**
 * Combines Gemini-generated analytical content with code-derived fields
 * (metadata, executiveMetrics, scenarioBaseline, scenarioPresets) and shared
 * static data (resistanceFactors, comparableSearches, switchingSignals,
 * taGuidance.guidance) into a complete TalentGenomeReport.
 */
export function assembleReport({
  brief,
  content,
  generatedOn,
  reportId,
}: AssembleReportOptions): TalentGenomeReport {
  const talentPool: TalentPool = content.talentPool;

  return {
    brief,
    metadata: {
      reportId: reportId ?? nextReportId(),
      generatedOn,
      classification: "Confidential Talent Intelligence Brief",
      version: "1.0",
    },
    talentPool,
    executiveMetrics: buildExecutiveMetrics(talentPool),
    executiveInsight: content.executiveInsight,
    funnel: content.funnel,
    careerDNAStats: content.careerDNAStats,
    experienceBands: content.experienceBands,
    archetypes: content.archetypes,
    careerPaths: content.careerPaths,
    careerPathInsights: content.careerPathInsights,
    employers: content.employers,
    employerInsight: content.employerInsight,
    migrationFlows: content.migrationFlows,
    switchingSignals: SWITCHING_SIGNALS,
    switchingCurve: content.switchingCurve,
    bestEngagementWindow: content.bestEngagementWindow,
    motivations: content.motivations,
    resistanceFactors: RESISTANCE_FACTORS,
    competitiveEmployers: content.competitiveEmployers,
    competitiveInsight: content.competitiveInsight,
    adjacentProfiles: content.adjacentProfiles,
    neighbourhoodInsight: content.neighbourhoodInsight,
    scenarioPresets: buildScenarioPresets(brief),
    scenarioBaseline: buildScenarioBaseline(brief, talentPool),
    risks: content.risks,
    comparableSearches: COMPARABLE_SEARCHES,
    recommendation: content.recommendation,
    taGuidance: {
      guidance: SEARCH_MODEL_GUIDANCE,
      recommendedModel: content.taGuidance.recommendedModel,
      explanation: content.taGuidance.explanation,
    },
    chroBrief: content.chroBrief,
  };
}
