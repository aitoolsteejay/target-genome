/**
 * Talent Genome — core data model.
 *
 * Everything here is shaped so that a real backend (search-team data,
 * licensed market datasets, ATS exports) can be dropped in later without
 * touching component code. Mock data lives in /data and conforms to these
 * interfaces; UI components only ever import types from this file.
 */

// ---------------------------------------------------------------------------
// Section A/B/C/D — Role Intelligence form (SearchBrief)
// ---------------------------------------------------------------------------

export type Seniority =
  | "Mid-level"
  | "Senior"
  | "Lead"
  | "Principal / Staff"
  | "Director"
  | "VP / Executive";

export type ManagementTrack = "Individual contributor" | "People manager";

export type RemotePolicy =
  | "Onsite"
  | "Hybrid"
  | "Remote — city only"
  | "Remote — anywhere in country";

export type Criticality =
  | "Standard"
  | "Important"
  | "Business-critical"
  | "Mission-critical";

export interface RoleProfile {
  title: string;
  function: string;
  primarySkill: string;
  secondarySkills: string[];
  seniority: Seniority;
  experienceMin: number;
  experienceMax: number;
  industryPreference: string;
  domainExperienceRequired: string;
  teamManagementRequired: boolean;
  managementTrack: ManagementTrack;
  location: string;
  remotePolicy: RemotePolicy;
  relocationAllowed: boolean;
}

export interface HiringContext {
  isNewRole: boolean;
  criticality: Criticality;
  desiredJoiningTimelineWeeks: number;
  roleOpenWeeks: number;
  previouslyFailedToClose: boolean;
  profilesReviewed: number;
  candidatesInterviewed: number;
  offersExtended: number;
  candidateDeclined: boolean;
  withInternalTA: boolean;
  withAgencies: boolean;
}

export interface OfferProcess {
  compMinLakh: number;
  compMaxLakh: number;
  fixedVariableSplit: string;
  equityAvailable: boolean;
  interviewRounds: number;
  avgDaysBetweenRounds: number;
  finalDecisionMaker: string;
  noticePeriodDays: number;
  buyoutAvailable: boolean;
  joiningBonusAvailable: boolean;
}

export interface RoleAttraction {
  whyJoin: string;
  whatTheyWillOwn: string;
  successAfter12Months: string;
  distinctiveFactor: string;
  hesitationFactors: string;
  nonNegotiables: string;
  flexibleRequirements: string;
}

export interface SearchBrief {
  id: string;
  slug: string;
  role: RoleProfile;
  hiringContext: HiringContext;
  offerProcess: OfferProcess;
  attraction: RoleAttraction;
}

// ---------------------------------------------------------------------------
// Report metadata
// ---------------------------------------------------------------------------

export interface ReportMetadata {
  reportId: string;
  generatedOn: string;
  classification: string;
  version: string;
}

// ---------------------------------------------------------------------------
// Executive summary / talent pool
// ---------------------------------------------------------------------------

export type PressureLevel = "Low" | "Moderate" | "High" | "Very high";

export interface TalentPool {
  technicallyRelevant: number;
  realisticallyRecruitable: number;
  highProbabilityMovers: number;
  medianTenureYears: number;
  competitivePressure: PressureLevel;
  searchWindowWeeksMin: number;
  searchWindowWeeksMax: number;
  briefCoveragePercent: number;
}

export interface ExecutiveMetric {
  id: string;
  label: string;
  value: string;
  explanation: string;
}

// ---------------------------------------------------------------------------
// Talent funnel
// ---------------------------------------------------------------------------

export interface TalentFunnelStage {
  id: string;
  label: string;
  count: number;
  definition: string;
  whyRemoved: string;
  expansionLever: string;
  expansionGain?: number;
  expansionActiveGain?: number;
}

// ---------------------------------------------------------------------------
// Career DNA
// ---------------------------------------------------------------------------

export interface CareerDNAStat {
  id: string;
  label: string;
  value: string;
}

export interface ExperienceBand {
  band: string;
  percent: number;
}

export interface CareerArchetype {
  id: string;
  name: string;
  shareOfPool: number;
  summary: string;
  characteristics: string[];
  typicalEmployers: string[];
  motivations: string[];
  objections: string[];
  outreachAngle: string;
  interviewConcerns: string[];
}

// ---------------------------------------------------------------------------
// Career journey / talent flow
// ---------------------------------------------------------------------------

export interface CareerPath {
  id: string;
  steps: string[];
  frequency: number;
}

// ---------------------------------------------------------------------------
// Employer ecosystem
// ---------------------------------------------------------------------------

export type EmployerCategory =
  | "Core target"
  | "Emerging source"
  | "Overfished"
  | "Underexplored";

export interface EmployerIntelligence {
  id: string;
  name: string;
  category: EmployerCategory;
  estimatedPopulation: number;
  medianTenureYears: number;
  movementLikelihood: PressureLevel;
  compensationPressure: PressureLevel;
  recruiterCompetition: PressureLevel;
  culturalTransferability: "Low" | "Moderate" | "High";
  recommendedPriority: "Low" | "Medium" | "High";
  talentRelevance: number;
  recruitability: number;
}

// ---------------------------------------------------------------------------
// Talent migration radar
// ---------------------------------------------------------------------------

export type MigrationTrend = "Rising" | "Stable" | "Declining";

export interface MigrationFlow {
  id: string;
  from: string;
  to: string;
  trend: MigrationTrend;
  insight: string;
}

// ---------------------------------------------------------------------------
// Switching probability
// ---------------------------------------------------------------------------

export interface SwitchingSignal {
  id: string;
  signal: string;
}

export type SwitchingLevel = "Very low" | "Low" | "Moderate" | "High" | "Very high";

export interface SwitchingCurvePoint {
  tenureBand: string;
  level: SwitchingLevel;
  value: number;
  note?: string;
}

// ---------------------------------------------------------------------------
// Motivation genome
// ---------------------------------------------------------------------------

export interface MotivationFactor {
  id: string;
  rank: number;
  factor: string;
  weightPercent: number;
  candidateWants?: string;
  weakPositioning?: string;
  strongPositioning?: string;
}

// ---------------------------------------------------------------------------
// Candidate resistance map
// ---------------------------------------------------------------------------

export type ResistanceStage = "Ignore" | "Drop" | "Reject";
export type Severity = "Low" | "Medium" | "High" | "Critical";
export type ControlLevel = "Low" | "Medium" | "High";

export interface ResistanceFactor {
  id: string;
  stage: ResistanceStage;
  issue: string;
  impact: string;
  severity: Severity;
  control: ControlLevel;
  recommendedFix: string;
}

// ---------------------------------------------------------------------------
// Competitive hiring pressure
// ---------------------------------------------------------------------------

export interface CompetitiveEmployer {
  id: string;
  name: string;
  hiringIntensity: "Medium" | "High" | "Very high" | "Rising";
  typicalAdvantage: string;
  risk: "Low" | "Medium" | "High";
  workModel: string;
  processSpeed: "Slow" | "Moderate" | "Fast" | "Very fast";
}

// ---------------------------------------------------------------------------
// Talent neighbourhood
// ---------------------------------------------------------------------------

export interface AdjacentProfile {
  id: string;
  title: string;
  skillOverlapPercent: number;
  availability: "Low" | "Medium" | "High";
  adaptationRequired: string;
  searchValue: "Selective" | "Medium" | "High" | "Very high";
  additionalTechnicallyRelevant: number;
  additionalRecruitable: number;
  compensationPressureNote: string;
  adaptationTimeWeeks: number;
  recommendation: string;
}

// ---------------------------------------------------------------------------
// Search assumption simulator
// ---------------------------------------------------------------------------

export interface ScenarioAssumptions {
  compMaxLakh: number;
  allowRemoteAcrossCountry: boolean;
  experienceMin: number;
  requireIndustryMatch: boolean;
  interviewRounds: number;
  mandatorySkillsCount: number;
  noticePeriodToleranceDays: number;
  leadershipRequired: boolean;
}

export type SearchDifficulty =
  | "Moderate"
  | "Moderate to high"
  | "High"
  | "Very high";

export interface ScenarioOutput {
  technicallyRelevant: number;
  recruitable: number;
  highProbabilityMovers: number;
  competitivePressure: PressureLevel;
  searchDurationWeeksMin: number;
  searchDurationWeeksMax: number;
  searchDifficulty: SearchDifficulty;
  offerAcceptanceProbability: number;
}

export interface ScenarioPreset {
  id: string;
  label: string;
  description: string;
  overrides: Partial<ScenarioAssumptions>;
}

/** The report's own "current brief" position, used to calibrate the live simulator. */
export interface ScenarioBaseline {
  assumptions: ScenarioAssumptions;
  technicallyRelevant: number;
  recruitable: number;
  highProbabilityMovers: number;
  competitivePressure: PressureLevel;
  searchDurationWeeksMin: number;
  searchDurationWeeksMax: number;
  offerAcceptanceProbability: number;
}

// ---------------------------------------------------------------------------
// Search risks
// ---------------------------------------------------------------------------

export interface SearchRisk {
  id: string;
  title: string;
  description: string;
  severity: "Medium" | "High" | "Critical";
  whyItMatters: string;
  evidence: string;
  recommendedDecision: string;
  impactIfUnresolved: string;
}

// ---------------------------------------------------------------------------
// Comparable search intelligence
// ---------------------------------------------------------------------------

export interface ComparableSearchStat {
  id: string;
  label: string;
  value: string;
}

export interface AnonymisedSearchStory {
  id: string;
  code: string;
  role: string;
  originalIssue: string;
  whatChanged: string;
  result: string;
}

export interface ComparableSearch {
  sampleSize: number;
  stats: ComparableSearchStat[];
  whatChangedTheOutcome: string[];
  stories: AnonymisedSearchStory[];
}

// ---------------------------------------------------------------------------
// Recommended search strategy
// ---------------------------------------------------------------------------

export interface SearchRecommendation {
  prioritySegments: string[];
  employerStrategy: { label: string; percent: number }[];
  positioningLeadWith: string[];
  positioningAvoid: string[];
  processDesign: string[];
  timeline: { phase: string; detail: string }[];
}

// ---------------------------------------------------------------------------
// Internal TA vs specialist search
// ---------------------------------------------------------------------------

export type SearchModel = "Internal TA" | "Hybrid search" | "Specialist search";

export interface SearchModelGuidance {
  model: SearchModel;
  useWhen: string[];
}

export interface TASpecialistRecommendation {
  guidance: SearchModelGuidance[];
  recommendedModel: SearchModel;
  explanation: string;
}

// ---------------------------------------------------------------------------
// CHRO brief
// ---------------------------------------------------------------------------

export interface CHROBrief {
  leadershipDecisions: string[];
  recommendedOwnershipModel: string;
  concludingLine: string;
}

// ---------------------------------------------------------------------------
// Full report bundle
// ---------------------------------------------------------------------------

export interface TalentGenomeReport {
  brief: SearchBrief;
  metadata: ReportMetadata;
  talentPool: TalentPool;
  executiveMetrics: ExecutiveMetric[];
  executiveInsight: string;
  funnel: TalentFunnelStage[];
  careerDNAStats: CareerDNAStat[];
  experienceBands: ExperienceBand[];
  archetypes: CareerArchetype[];
  careerPaths: CareerPath[];
  careerPathInsights: string[];
  employers: EmployerIntelligence[];
  employerInsight: string;
  migrationFlows: MigrationFlow[];
  switchingSignals: SwitchingSignal[];
  switchingCurve: SwitchingCurvePoint[];
  bestEngagementWindow: string;
  motivations: MotivationFactor[];
  resistanceFactors: ResistanceFactor[];
  competitiveEmployers: CompetitiveEmployer[];
  competitiveInsight: string;
  adjacentProfiles: AdjacentProfile[];
  neighbourhoodInsight: string;
  scenarioPresets: ScenarioPreset[];
  scenarioBaseline: ScenarioBaseline;
  risks: SearchRisk[];
  comparableSearches: ComparableSearch;
  recommendation: SearchRecommendation;
  taGuidance: TASpecialistRecommendation;
  chroBrief: CHROBrief;
}

// ---------------------------------------------------------------------------
// Sample search registry
// ---------------------------------------------------------------------------

export interface SampleSearchSummary {
  slug: string;
  title: string;
  location: string;
  experience: string;
  industry: string;
  workModel: string;
}
