import type { SearchBrief, TalentGenomeReport } from "./types";
import { SAMPLE_REPORTS } from "@/data/sample-searches";

interface MatchRule {
  slug: string;
  keywords: string[];
}

const MATCH_RULES: MatchRule[] = [
  { slug: "sap-ibp-architect", keywords: ["sap", "ibp", "s/4hana", "apo", "supply chain planning"] },
  {
    slug: "semiconductor-verification-lead",
    keywords: ["systemverilog", "uvm", "verification", "semiconductor", "asic", "rtl", "silicon"],
  },
  {
    slug: "director-data-engineering",
    keywords: ["data engineering", "snowflake", "data platform", "data director", "data governance"],
  },
  {
    slug: "principal-backend-engineer",
    keywords: ["java", "backend", "distributed systems", "microservices", "aws"],
  },
];

const DEFAULT_SLUG = "principal-backend-engineer";

export interface GeneratedReport {
  report: TalentGenomeReport;
  matchedSlug: string;
  isApproximateMatch: boolean;
}

function buildHaystack(brief: SearchBrief): string {
  return [brief.role.title, brief.role.primarySkill, ...brief.role.secondarySkills, brief.role.function]
    .join(" ")
    .toLowerCase();
}

function matchSampleSlug(brief: SearchBrief): { slug: string; matched: boolean } {
  const haystack = buildHaystack(brief);
  for (const rule of MATCH_RULES) {
    if (rule.keywords.some((keyword) => haystack.includes(keyword))) {
      return { slug: rule.slug, matched: true };
    }
  }
  return { slug: DEFAULT_SLUG, matched: false };
}

/**
 * Demo report generation. In production this would call a service that
 * assembles the report from live search data; here it maps the submitted
 * brief onto the nearest of four fully-modelled sample markets and overlays
 * the user's own brief so the header, metadata and assumptions reflect what
 * they actually entered.
 */
export function generateReport(brief: SearchBrief, generatedOn: string): GeneratedReport {
  const { slug, matched } = matchSampleSlug(brief);
  const base = SAMPLE_REPORTS[slug] ?? SAMPLE_REPORTS[DEFAULT_SLUG];

  const report: TalentGenomeReport = {
    ...base,
    brief,
    metadata: {
      ...base.metadata,
      generatedOn,
    },
  };

  return { report, matchedSlug: slug, isApproximateMatch: !matched };
}
