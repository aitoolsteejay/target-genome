import type { ComparableSearch } from "@/lib/types";

/**
 * Aggregated, anonymised learning across the firm's specialist search
 * practice. This is practice-wide intelligence rather than role-specific
 * output, so it is shared across every sample report — demo data throughout.
 */
export const COMPARABLE_SEARCHES: ComparableSearch = {
  sampleSize: 147,
  stats: [
    { id: "shortlist", label: "Median time to first qualified shortlist", value: "9 days" },
    { id: "accepted-offer", label: "Median time to accepted offer", value: "81 days" },
    { id: "passive-share", label: "Successful hires who were passive candidates", value: "71%" },
    { id: "outside-target", label: "Successful hires from outside the original target-employer list", value: "63%" },
    { id: "brief-changed", label: "Searches that required a change to the original role brief", value: "42%" },
    { id: "timing-failures", label: "Failed offers linked to process timing rather than compensation", value: "38%" },
    { id: "scope-priority", label: "Shortlisted candidates who prioritised scope above compensation", value: "31%" },
    { id: "offers-per-hire", label: "Average offers required per successful hire", value: "1.8" },
  ],
  whatChangedTheOutcome: [
    "Engaging candidates before they became actively job-seeking",
    "Involving the hiring manager in the first serious conversation",
    "Sharing compensation expectations early in the process",
    "Removing one interview stage from the original design",
    "Expanding the target-company universe beyond the original brief",
    "Reframing the role narrative around ownership rather than requirements",
    "Reconsidering adjacent talent profiles the brief had originally excluded",
  ],
  stories: [
    {
      id: "search-a",
      code: "Search A",
      role: "Principal Data Architect",
      originalIssue: "Original market assumption limited to candidates from cloud-native product companies.",
      whatChanged: "Search expanded to enterprise transformation leaders with equivalent platform depth.",
      result: "Successful hire came from an employer absent from the original target list.",
    },
    {
      id: "search-b",
      code: "Search B",
      role: "Engineering Director",
      originalIssue: "Strong pipeline, but consistently low offer conversion.",
      whatChanged: "Hiring manager joined the first candidate conversation and clarified the actual mandate.",
      result: "Offer accepted after a 19-day process from first conversation to signed offer.",
    },
    {
      id: "search-c",
      code: "Search C",
      role: "SAP Specialist",
      originalIssue: "Role had been open for five months with no viable finalist.",
      whatChanged: "Compensation stayed unchanged, but the location requirement became flexible.",
      result: "Recruitable pool expanded substantially and a finalist was identified within three weeks.",
    },
  ],
};
