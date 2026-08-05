"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import type { CalculatorInput, TimeLeakReport } from "./types";

export class ReportGenerationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ReportGenerationError";
  }
}

interface CalculatorStoreValue {
  input: CalculatorInput | null;
  report: TimeLeakReport | null;
  hydrated: boolean;
  submitInput: (input: CalculatorInput) => Promise<TimeLeakReport>;
  reset: () => void;
}

const CalculatorContext = createContext<CalculatorStoreValue | null>(null);
const STORAGE_KEY = "hiring-manager-time-leak:report";

interface StoredState {
  input: CalculatorInput;
  report: TimeLeakReport;
}

export function CalculatorStoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<StoredState | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // One-time hydration from sessionStorage after mount. This is
    // intentionally an effect (not a lazy initializer) so server and client
    // render the same `null` state on first paint and avoid a hydration
    // mismatch.
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (raw) setState(JSON.parse(raw));
    } catch {
      /* sessionStorage unavailable, proceed without persistence */
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

  const submitInput = useCallback(
    async (input: CalculatorInput) => {
      const res = await fetch("/api/generate-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input }),
      });

      const payload = await res.json().catch(() => null);

      if (!res.ok || !payload?.report) {
        throw new ReportGenerationError(
          payload?.error || "Report generation failed. Please try again."
        );
      }

      const report: TimeLeakReport = payload.report;
      persist({ input, report });
      return report;
    },
    [persist]
  );

  const reset = useCallback(() => persist(null), [persist]);

  return (
    <CalculatorContext.Provider
      value={{
        input: state?.input ?? null,
        report: state?.report ?? null,
        hydrated,
        submitInput,
        reset,
      }}
    >
      {children}
    </CalculatorContext.Provider>
  );
}

export function useCalculatorStore() {
  const ctx = useContext(CalculatorContext);
  if (!ctx) throw new Error("useCalculatorStore must be used within CalculatorStoreProvider");
  return ctx;
}
