import type { SampleSearchSummary, TalentGenomeReport } from "@/lib/types";
import { principalBackendEngineerReport } from "./principal-backend-engineer";
import { sapIbpArchitectReport } from "./sap-ibp-architect";
import { semiconductorVerificationLeadReport } from "./semiconductor-verification-lead";
import { directorDataEngineeringReport } from "./director-data-engineering";

export { principalBackendEngineerReport } from "./principal-backend-engineer";
export { sapIbpArchitectReport } from "./sap-ibp-architect";
export { semiconductorVerificationLeadReport } from "./semiconductor-verification-lead";
export { directorDataEngineeringReport } from "./director-data-engineering";

export const SAMPLE_REPORTS: Record<string, TalentGenomeReport> = {
  "principal-backend-engineer": principalBackendEngineerReport,
  "sap-ibp-architect": sapIbpArchitectReport,
  "semiconductor-verification-lead": semiconductorVerificationLeadReport,
  "director-data-engineering": directorDataEngineeringReport,
};

export const SAMPLE_SEARCH_SUMMARIES: SampleSearchSummary[] = [
  {
    slug: "principal-backend-engineer",
    title: "Principal Backend Engineer",
    location: "Bengaluru",
    experience: "10–15 years",
    industry: "Product technology / fintech",
    workModel: "Hybrid",
  },
  {
    slug: "sap-ibp-architect",
    title: "SAP IBP Solution Architect",
    location: "Bengaluru, Pune, Hyderabad",
    experience: "12–18 years",
    industry: "Manufacturing / CPG",
    workModel: "Hybrid",
  },
  {
    slug: "semiconductor-verification-lead",
    title: "Semiconductor Verification Lead",
    location: "Bengaluru",
    experience: "12–17 years",
    industry: "Product semiconductor",
    workModel: "Onsite / hybrid",
  },
  {
    slug: "director-data-engineering",
    title: "Director of Data Engineering",
    location: "Hyderabad",
    experience: "15–20 years",
    industry: "Global capability centre",
    workModel: "Hybrid",
  },
];

export function getSampleReport(slug: string): TalentGenomeReport | undefined {
  return SAMPLE_REPORTS[slug];
}
