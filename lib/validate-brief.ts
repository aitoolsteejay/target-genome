import type { SearchBrief } from "./types";

export function validateBrief(brief: SearchBrief): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!brief.role.title.trim()) errors.title = "Role title is required.";
  if (!brief.role.primarySkill.trim()) errors.primarySkill = "Primary skill is required.";

  if (
    Number.isNaN(brief.role.experienceMin) ||
    Number.isNaN(brief.role.experienceMax) ||
    brief.role.experienceMin < 0 ||
    brief.role.experienceMax < brief.role.experienceMin
  ) {
    errors.experience = "Maximum experience must be greater than or equal to minimum experience.";
  }

  if (brief.role.remotePolicy !== "Remote — anywhere in country" && !brief.role.location.trim()) {
    errors.location = "Location is required unless the role is fully remote across the country.";
  }

  if (
    Number.isNaN(brief.offerProcess.compMinLakh) ||
    Number.isNaN(brief.offerProcess.compMaxLakh) ||
    brief.offerProcess.compMinLakh <= 0 ||
    brief.offerProcess.compMaxLakh < brief.offerProcess.compMinLakh
  ) {
    errors.compensation = "Maximum compensation must be greater than or equal to minimum compensation.";
  }

  if (!brief.offerProcess.interviewRounds || brief.offerProcess.interviewRounds < 1) {
    errors.interviewRounds = "At least one interview round is required.";
  }

  return errors;
}

export const ROLE_TAB_ERROR_KEYS = ["title", "primarySkill", "experience", "location"];
export const OFFER_TAB_ERROR_KEYS = ["compensation", "interviewRounds"];
