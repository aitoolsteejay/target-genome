"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import type { SearchBrief, TalentGenomeReport } from "./types";

interface StoredState {
  brief: SearchBrief;
  report: TalentGenomeReport;
  isApproximateMatch: boolean;
}

export class ReportGenerationError extends Error {
  fieldErrors?: Record<string, string>;
  constructor(message: string, fieldErrors?: Record<string, string>) {
    super(message);
    this.name = "ReportGenerationError";
    this.fieldErrors = fieldErrors;
  }
}

interface ReportStoreValue {
  brief: SearchBrief | null;
  report: TalentGenomeReport | null;
  isApproximateMatch: boolean;
  hydrated: boolean;
  generateFromBrief: (brief: SearchBrief) => Promise<TalentGenomeReport>;
  loadSample: (report: TalentGenomeReport) => void;
  reset: () => void;
}

const ReportContext = createContext<ReportStoreValue | null>(null);
const STORAGE_KEY = "talent-genome:active-report";

export function ReportStoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<StoredState | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // One-time hydration from sessionStorage after mount — intentionally an
    // effect (not a lazy initializer) so server and client render the same
    // `null` state on first paint and avoid a hydration mismatch.
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (raw) setState(JSON.parse(raw));
    } catch {
      /* sessionStorage unavailable — proceed without persistence */
    }
    setHydrated(true);
  }, []);

  const persist = useCallback((next: StoredState | null) => {
    setState(next);
    try {
      if (next) sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      else sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore persistence failures */
    }
  }, []);

  const generateFromBrief = useCallback(
    async (brief: SearchBrief) => {
      const res = await fetch("/api/generate-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brief }),
      });

      const payload = await res.json().catch(() => null);

      if (!res.ok || !payload?.report) {
        throw new ReportGenerationError(
          payload?.error || "Report generation failed. Please try again.",
          payload?.fieldErrors
        );
      }

      const report: TalentGenomeReport = payload.report;
      const isApproximateMatch: boolean = Boolean(payload.isApproximateMatch);
      persist({ brief, report, isApproximateMatch });
      return report;
    },
    [persist]
  );

  const loadSample = useCallback(
    (report: TalentGenomeReport) => {
      persist({ brief: report.brief, report, isApproximateMatch: false });
    },
    [persist]
  );

  const reset = useCallback(() => persist(null), [persist]);

  return (
    <ReportContext.Provider
      value={{
        brief: state?.brief ?? null,
        report: state?.report ?? null,
        isApproximateMatch: state?.isApproximateMatch ?? false,
        hydrated,
        generateFromBrief,
        loadSample,
        reset,
      }}
    >
      {children}
    </ReportContext.Provider>
  );
}

export function useReportStore() {
  const ctx = useContext(ReportContext);
  if (!ctx) throw new Error("useReportStore must be used within ReportStoreProvider");
  return ctx;
}
