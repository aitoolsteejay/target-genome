import type { LeadershipRoleDefinition } from "@/lib/types";

/**
 * Mock hourly values, used only internally to compute a de-emphasised
 * opportunity-cost figure. Roles tiered "leadership" multiply leadership-
 * interview hours when several are selected together for the same rounds —
 * see lib/calculations.ts.
 */
export const LEADERSHIP_ROLES: LeadershipRoleDefinition[] = [
  { key: "engineering_manager", label: "Engineering Manager", hourlyRateInr: 4000, tier: "interviewer" },
  { key: "senior_engineer", label: "Senior Engineer", hourlyRateInr: 3000, tier: "interviewer" },
  { key: "principal_engineer", label: "Principal Engineer", hourlyRateInr: 5500, tier: "interviewer" },
  { key: "director", label: "Director", hourlyRateInr: 8000, tier: "leadership" },
  { key: "vp", label: "VP", hourlyRateInr: 10000, tier: "leadership" },
  { key: "cto", label: "CTO", hourlyRateInr: 12000, tier: "leadership" },
  { key: "founder", label: "Founder", hourlyRateInr: 12000, tier: "leadership" },
  { key: "product_head", label: "Product Head", hourlyRateInr: 9000, tier: "leadership" },
];

export function getRoleDefinition(key: string): LeadershipRoleDefinition | undefined {
  return LEADERSHIP_ROLES.find((r) => r.key === key);
}
