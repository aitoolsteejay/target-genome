import type { SwitchingSignal } from "@/lib/types";

/**
 * Behavioural timing signals that precede a senior candidate becoming open to
 * a move. These are general specialist-search patterns, not role-specific,
 * so every generated report — Gemini-authored or sample — shares this list.
 */
export const SWITCHING_SIGNALS: SwitchingSignal[] = [
  { id: "s1", signal: "24–36 months in the current company" },
  { id: "s2", signal: "Promotion cycle recently completed" },
  { id: "s3", signal: "Manager or business leader recently changed" },
  { id: "s4", signal: "Major return-to-office policy change" },
  { id: "s5", signal: "Equity vesting milestone approaching" },
  { id: "s6", signal: "Organisational restructuring" },
  { id: "s7", signal: "Scope reduction after reorganisation" },
  { id: "s8", signal: "Company acquisition or integration" },
  { id: "s9", signal: "Two consecutive years without title progression" },
  { id: "s10", signal: "Platform or product initiative cancelled" },
];
