import { z } from "zod";

/**
 * The subset of TalentGenomeReport that Gemini generates per submitted
 * brief. Everything else (metadata, executiveMetrics, scenarioBaseline,
 * scenarioPresets) is derived in code from this content plus the brief, and
 * a few fields (resistanceFactors, comparableSearches, switchingSignals,
 * taGuidance.guidance) are shared static data — see lib/report-assembler.ts.
 *
 * IMPORTANT: this Zod schema and the `GENERATED_CONTENT_GEMINI_SCHEMA` object
 * below must describe the same shape. Zod validates what comes back from
 * Gemini; the Gemini schema is what we ask the model to produce in the first
 * place. There is no automatic sync between the two — update both together.
 */

const pressureLevel = z.enum(["Low", "Moderate", "High", "Very high"]);
const lowModHigh = z.enum(["Low", "Moderate", "High"]);
const lowMedHigh = z.enum(["Low", "Medium", "High"]);

export const GeneratedTalentPoolSchema = z.object({
  technicallyRelevant: z.number().int().min(50).max(50000),
  realisticallyRecruitable: z.number().int().min(5).max(20000),
  highProbabilityMovers: z.number().int().min(5).max(20000),
  medianTenureYears: z.number().min(0.5).max(15),
  competitivePressure: pressureLevel,
  searchWindowWeeksMin: z.number().int().min(2).max(30),
  searchWindowWeeksMax: z.number().int().min(2).max(40),
  briefCoveragePercent: z.number().min(0).max(100),
});

export const GeneratedFunnelStageSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  count: z.number().int().min(0),
  definition: z.string().min(1),
  whyRemoved: z.string().min(1),
  expansionLever: z.string().min(1),
});

export const GeneratedCareerDNAStatSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  value: z.string().min(1),
});

export const GeneratedExperienceBandSchema = z.object({
  band: z.string().min(1),
  percent: z.number().min(0).max(100),
});

export const GeneratedArchetypeSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  shareOfPool: z.number().min(0).max(100),
  summary: z.string().min(1),
  characteristics: z.array(z.string().min(1)).min(3).max(6),
  typicalEmployers: z.array(z.string().min(1)).min(2).max(6),
  motivations: z.array(z.string().min(1)).min(2).max(5),
  objections: z.array(z.string().min(1)).min(1).max(4),
  outreachAngle: z.string().min(1),
  interviewConcerns: z.array(z.string().min(1)).min(1).max(4),
});

export const GeneratedCareerPathSchema = z.object({
  id: z.string().min(1),
  steps: z.array(z.string().min(1)).min(3).max(5),
  frequency: z.number().min(1).max(100),
});

export const GeneratedEmployerSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  category: z.enum(["Core target", "Emerging source", "Overfished", "Underexplored"]),
  estimatedPopulation: z.number().int().min(1).max(5000),
  medianTenureYears: z.number().min(0.3).max(15),
  movementLikelihood: pressureLevel,
  compensationPressure: pressureLevel,
  recruiterCompetition: pressureLevel,
  culturalTransferability: lowModHigh,
  recommendedPriority: lowMedHigh,
  talentRelevance: z.number().min(0).max(100),
  recruitability: z.number().min(0).max(100),
});

export const GeneratedMigrationFlowSchema = z.object({
  id: z.string().min(1),
  from: z.string().min(1),
  to: z.string().min(1),
  trend: z.enum(["Rising", "Stable", "Declining"]),
  insight: z.string().min(1),
});

export const GeneratedSwitchingCurvePointSchema = z.object({
  tenureBand: z.string().min(1),
  level: z.enum(["Very low", "Low", "Moderate", "High", "Very high"]),
  value: z.number().min(0).max(100),
  note: z.string().min(1).optional(),
});

export const GeneratedMotivationSchema = z.object({
  id: z.string().min(1),
  rank: z.number().int().min(1).max(10),
  factor: z.string().min(1),
  weightPercent: z.number().min(0).max(100),
  candidateWants: z.string().min(1).optional(),
  weakPositioning: z.string().min(1).optional(),
  strongPositioning: z.string().min(1).optional(),
});

export const GeneratedCompetitiveEmployerSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  hiringIntensity: z.enum(["Medium", "High", "Very high", "Rising"]),
  typicalAdvantage: z.string().min(1),
  risk: lowMedHigh,
  workModel: z.string().min(1),
  processSpeed: z.enum(["Slow", "Moderate", "Fast", "Very fast"]),
});

export const GeneratedAdjacentProfileSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  skillOverlapPercent: z.number().min(0).max(100),
  availability: lowMedHigh,
  adaptationRequired: z.string().min(1),
  searchValue: z.enum(["Selective", "Medium", "High", "Very high"]),
  additionalTechnicallyRelevant: z.number().int().min(0).max(20000),
  additionalRecruitable: z.number().int().min(0).max(5000),
  compensationPressureNote: z.string().min(1),
  adaptationTimeWeeks: z.number().min(1).max(30),
  recommendation: z.string().min(1),
});

export const GeneratedRiskSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  severity: z.enum(["Medium", "High", "Critical"]),
  whyItMatters: z.string().min(1),
  evidence: z.string().min(1),
  recommendedDecision: z.string().min(1),
  impactIfUnresolved: z.string().min(1),
});

export const GeneratedRecommendationSchema = z.object({
  prioritySegments: z.array(z.string().min(1)).min(2).max(6),
  employerStrategy: z
    .array(z.object({ label: z.string().min(1), percent: z.number().min(0).max(100) }))
    .min(3)
    .max(5),
  positioningLeadWith: z.array(z.string().min(1)).min(3).max(6),
  positioningAvoid: z.array(z.string().min(1)).min(2).max(5),
  processDesign: z.array(z.string().min(1)).min(3).max(7),
  timeline: z
    .array(z.object({ phase: z.string().min(1), detail: z.string().min(1) }))
    .min(4)
    .max(7),
});

export const GeneratedTaGuidanceSchema = z.object({
  recommendedModel: z.enum(["Internal TA", "Hybrid search", "Specialist search"]),
  explanation: z.string().min(1),
});

export const GeneratedChroBriefSchema = z.object({
  leadershipDecisions: z.array(z.string().min(1)).length(3),
  recommendedOwnershipModel: z.string().min(1),
  concludingLine: z.string().min(1),
});

export const GeneratedReportContentSchema = z.object({
  talentPool: GeneratedTalentPoolSchema,
  executiveInsight: z.string().min(1),
  funnel: z.array(GeneratedFunnelStageSchema).length(7),
  careerDNAStats: z.array(GeneratedCareerDNAStatSchema).min(7).max(10),
  experienceBands: z.array(GeneratedExperienceBandSchema).min(3).max(5),
  archetypes: z.array(GeneratedArchetypeSchema).length(4),
  careerPaths: z.array(GeneratedCareerPathSchema).min(4).max(6),
  careerPathInsights: z.array(z.string().min(1)).min(2).max(3),
  employers: z.array(GeneratedEmployerSchema).min(12).max(24),
  employerInsight: z.string().min(1),
  migrationFlows: z.array(GeneratedMigrationFlowSchema).min(4).max(6),
  switchingCurve: z.array(GeneratedSwitchingCurvePointSchema).length(5),
  bestEngagementWindow: z.string().min(1),
  motivations: z.array(GeneratedMotivationSchema).length(10),
  competitiveEmployers: z.array(GeneratedCompetitiveEmployerSchema).min(5).max(8),
  competitiveInsight: z.string().min(1),
  adjacentProfiles: z.array(GeneratedAdjacentProfileSchema).length(5),
  neighbourhoodInsight: z.string().min(1),
  risks: z.array(GeneratedRiskSchema).length(5),
  recommendation: GeneratedRecommendationSchema,
  taGuidance: GeneratedTaGuidanceSchema,
  chroBrief: GeneratedChroBriefSchema,
});

export type GeneratedReportContent = z.infer<typeof GeneratedReportContentSchema>;

// ---------------------------------------------------------------------------
// Gemini structured-output schema (Gemini API "Schema" object — an
// OpenAPI 3.0 subset with UPPERCASE type names, no $ref/definitions support).
// Hand-mirrored from the Zod schema above.
// ---------------------------------------------------------------------------

const STRING = { type: "STRING" } as const;
const NUMBER = { type: "NUMBER" } as const;
const stringEnum = (values: string[]) => ({ type: "STRING", enum: values });

const talentPoolSchema = {
  type: "OBJECT",
  properties: {
    technicallyRelevant: NUMBER,
    realisticallyRecruitable: NUMBER,
    highProbabilityMovers: NUMBER,
    medianTenureYears: NUMBER,
    competitivePressure: stringEnum(["Low", "Moderate", "High", "Very high"]),
    searchWindowWeeksMin: NUMBER,
    searchWindowWeeksMax: NUMBER,
    briefCoveragePercent: NUMBER,
  },
  required: [
    "technicallyRelevant",
    "realisticallyRecruitable",
    "highProbabilityMovers",
    "medianTenureYears",
    "competitivePressure",
    "searchWindowWeeksMin",
    "searchWindowWeeksMax",
    "briefCoveragePercent",
  ],
};

const funnelStageSchema = {
  type: "OBJECT",
  properties: {
    id: STRING,
    label: STRING,
    count: NUMBER,
    definition: STRING,
    whyRemoved: STRING,
    expansionLever: STRING,
  },
  required: ["id", "label", "count", "definition", "whyRemoved", "expansionLever"],
};

const careerDnaStatSchema = {
  type: "OBJECT",
  properties: { id: STRING, label: STRING, value: STRING },
  required: ["id", "label", "value"],
};

const experienceBandSchema = {
  type: "OBJECT",
  properties: { band: STRING, percent: NUMBER },
  required: ["band", "percent"],
};

const archetypeSchema = {
  type: "OBJECT",
  properties: {
    id: STRING,
    name: STRING,
    shareOfPool: NUMBER,
    summary: STRING,
    characteristics: { type: "ARRAY", items: STRING },
    typicalEmployers: { type: "ARRAY", items: STRING },
    motivations: { type: "ARRAY", items: STRING },
    objections: { type: "ARRAY", items: STRING },
    outreachAngle: STRING,
    interviewConcerns: { type: "ARRAY", items: STRING },
  },
  required: [
    "id",
    "name",
    "shareOfPool",
    "summary",
    "characteristics",
    "typicalEmployers",
    "motivations",
    "objections",
    "outreachAngle",
    "interviewConcerns",
  ],
};

const careerPathSchema = {
  type: "OBJECT",
  properties: {
    id: STRING,
    steps: { type: "ARRAY", items: STRING },
    frequency: NUMBER,
  },
  required: ["id", "steps", "frequency"],
};

const employerSchema = {
  type: "OBJECT",
  properties: {
    id: STRING,
    name: STRING,
    category: stringEnum(["Core target", "Emerging source", "Overfished", "Underexplored"]),
    estimatedPopulation: NUMBER,
    medianTenureYears: NUMBER,
    movementLikelihood: stringEnum(["Low", "Moderate", "High", "Very high"]),
    compensationPressure: stringEnum(["Low", "Moderate", "High", "Very high"]),
    recruiterCompetition: stringEnum(["Low", "Moderate", "High", "Very high"]),
    culturalTransferability: stringEnum(["Low", "Moderate", "High"]),
    recommendedPriority: stringEnum(["Low", "Medium", "High"]),
    talentRelevance: NUMBER,
    recruitability: NUMBER,
  },
  required: [
    "id",
    "name",
    "category",
    "estimatedPopulation",
    "medianTenureYears",
    "movementLikelihood",
    "compensationPressure",
    "recruiterCompetition",
    "culturalTransferability",
    "recommendedPriority",
    "talentRelevance",
    "recruitability",
  ],
};

const migrationFlowSchema = {
  type: "OBJECT",
  properties: {
    id: STRING,
    from: STRING,
    to: STRING,
    trend: stringEnum(["Rising", "Stable", "Declining"]),
    insight: STRING,
  },
  required: ["id", "from", "to", "trend", "insight"],
};

const switchingCurvePointSchema = {
  type: "OBJECT",
  properties: {
    tenureBand: STRING,
    level: stringEnum(["Very low", "Low", "Moderate", "High", "Very high"]),
    value: NUMBER,
    note: STRING,
  },
  required: ["tenureBand", "level", "value"],
};

const motivationSchema = {
  type: "OBJECT",
  properties: {
    id: STRING,
    rank: NUMBER,
    factor: STRING,
    weightPercent: NUMBER,
    candidateWants: STRING,
    weakPositioning: STRING,
    strongPositioning: STRING,
  },
  required: ["id", "rank", "factor", "weightPercent"],
};

const competitiveEmployerSchema = {
  type: "OBJECT",
  properties: {
    id: STRING,
    name: STRING,
    hiringIntensity: stringEnum(["Medium", "High", "Very high", "Rising"]),
    typicalAdvantage: STRING,
    risk: stringEnum(["Low", "Medium", "High"]),
    workModel: STRING,
    processSpeed: stringEnum(["Slow", "Moderate", "Fast", "Very fast"]),
  },
  required: ["id", "name", "hiringIntensity", "typicalAdvantage", "risk", "workModel", "processSpeed"],
};

const adjacentProfileSchema = {
  type: "OBJECT",
  properties: {
    id: STRING,
    title: STRING,
    skillOverlapPercent: NUMBER,
    availability: stringEnum(["Low", "Medium", "High"]),
    adaptationRequired: STRING,
    searchValue: stringEnum(["Selective", "Medium", "High", "Very high"]),
    additionalTechnicallyRelevant: NUMBER,
    additionalRecruitable: NUMBER,
    compensationPressureNote: STRING,
    adaptationTimeWeeks: NUMBER,
    recommendation: STRING,
  },
  required: [
    "id",
    "title",
    "skillOverlapPercent",
    "availability",
    "adaptationRequired",
    "searchValue",
    "additionalTechnicallyRelevant",
    "additionalRecruitable",
    "compensationPressureNote",
    "adaptationTimeWeeks",
    "recommendation",
  ],
};

const riskSchema = {
  type: "OBJECT",
  properties: {
    id: STRING,
    title: STRING,
    description: STRING,
    severity: stringEnum(["Medium", "High", "Critical"]),
    whyItMatters: STRING,
    evidence: STRING,
    recommendedDecision: STRING,
    impactIfUnresolved: STRING,
  },
  required: [
    "id",
    "title",
    "description",
    "severity",
    "whyItMatters",
    "evidence",
    "recommendedDecision",
    "impactIfUnresolved",
  ],
};

const recommendationSchema = {
  type: "OBJECT",
  properties: {
    prioritySegments: { type: "ARRAY", items: STRING },
    employerStrategy: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: { label: STRING, percent: NUMBER },
        required: ["label", "percent"],
      },
    },
    positioningLeadWith: { type: "ARRAY", items: STRING },
    positioningAvoid: { type: "ARRAY", items: STRING },
    processDesign: { type: "ARRAY", items: STRING },
    timeline: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: { phase: STRING, detail: STRING },
        required: ["phase", "detail"],
      },
    },
  },
  required: [
    "prioritySegments",
    "employerStrategy",
    "positioningLeadWith",
    "positioningAvoid",
    "processDesign",
    "timeline",
  ],
};

const taGuidanceSchema = {
  type: "OBJECT",
  properties: {
    recommendedModel: stringEnum(["Internal TA", "Hybrid search", "Specialist search"]),
    explanation: STRING,
  },
  required: ["recommendedModel", "explanation"],
};

const chroBriefSchema = {
  type: "OBJECT",
  properties: {
    leadershipDecisions: { type: "ARRAY", items: STRING },
    recommendedOwnershipModel: STRING,
    concludingLine: STRING,
  },
  required: ["leadershipDecisions", "recommendedOwnershipModel", "concludingLine"],
};

export const GENERATED_CONTENT_GEMINI_SCHEMA = {
  type: "OBJECT",
  properties: {
    talentPool: talentPoolSchema,
    executiveInsight: STRING,
    funnel: { type: "ARRAY", items: funnelStageSchema },
    careerDNAStats: { type: "ARRAY", items: careerDnaStatSchema },
    experienceBands: { type: "ARRAY", items: experienceBandSchema },
    archetypes: { type: "ARRAY", items: archetypeSchema },
    careerPaths: { type: "ARRAY", items: careerPathSchema },
    careerPathInsights: { type: "ARRAY", items: STRING },
    employers: { type: "ARRAY", items: employerSchema },
    employerInsight: STRING,
    migrationFlows: { type: "ARRAY", items: migrationFlowSchema },
    switchingCurve: { type: "ARRAY", items: switchingCurvePointSchema },
    bestEngagementWindow: STRING,
    motivations: { type: "ARRAY", items: motivationSchema },
    competitiveEmployers: { type: "ARRAY", items: competitiveEmployerSchema },
    competitiveInsight: STRING,
    adjacentProfiles: { type: "ARRAY", items: adjacentProfileSchema },
    neighbourhoodInsight: STRING,
    risks: { type: "ARRAY", items: riskSchema },
    recommendation: recommendationSchema,
    taGuidance: taGuidanceSchema,
    chroBrief: chroBriefSchema,
  },
  required: [
    "talentPool",
    "executiveInsight",
    "funnel",
    "careerDNAStats",
    "experienceBands",
    "archetypes",
    "careerPaths",
    "careerPathInsights",
    "employers",
    "employerInsight",
    "migrationFlows",
    "switchingCurve",
    "bestEngagementWindow",
    "motivations",
    "competitiveEmployers",
    "competitiveInsight",
    "adjacentProfiles",
    "neighbourhoodInsight",
    "risks",
    "recommendation",
    "taGuidance",
    "chroBrief",
  ],
} as const;
