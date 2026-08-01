import type { SearchModelGuidance } from "@/lib/types";

/**
 * The criteria distinguishing Internal TA / Hybrid / Specialist search are
 * general hiring-operations judgement, not specific to any one role, so this
 * list is shared across every generated report. Only `recommendedModel` and
 * `explanation` vary per brief.
 */
export const SEARCH_MODEL_GUIDANCE: SearchModelGuidance[] = [
  {
    model: "Internal TA",
    useWhen: [
      "Talent pool is broad",
      "Role is standard",
      "Employer brand is strong",
      "Timeline is flexible",
      "Search complexity is low",
    ],
  },
  {
    model: "Hybrid search",
    useWhen: [
      "Internal TA can manage process",
      "A specialist partner maps passive and adjacent candidates",
      "Role is difficult but not executive-search level",
    ],
  },
  {
    model: "Specialist search",
    useWhen: [
      "Recruitable pool is narrow",
      "Passive engagement is required",
      "Role has previously failed to close",
      "Business impact is high",
      "Search needs market calibration",
      "Internal TA lacks time or specialist networks",
    ],
  },
];
