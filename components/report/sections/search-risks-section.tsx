"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { ReportSection } from "@/components/report/report-section";
import { SeverityBadge } from "@/components/shared/status-badge";
import { cn } from "@/lib/utils";
import type { SearchRisk } from "@/lib/types";

export function SearchRisksSection({ risks }: { risks: SearchRisk[] }) {
  const [openId, setOpenId] = useState<string | null>(risks[0]?.id ?? null);

  return (
    <ReportSection
      id="search-risks"
      eyebrow="Search Risk Analysis"
      title="What could keep this role open longer than it should be."
      description="Ranked by severity — expand any risk for the evidence, the decision it forces, and the cost of leaving it unresolved."
    >
      <div className="divide-y divide-border border-t border-b border-border">
        {risks.map((risk, i) => {
          const isOpen = openId === risk.id;
          return (
            <div key={risk.id}>
              <button
                type="button"
                onClick={() => setOpenId(isOpen ? null : risk.id)}
                aria-expanded={isOpen}
                className="flex w-full items-start justify-between gap-4 py-5 text-left"
              >
                <div className="flex items-start gap-4">
                  <span className="numeric text-[13px] text-slate-light mt-0.5">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <p className="text-[15px] font-medium text-ink">{risk.title}</p>
                    <p className="mt-1 max-w-2xl text-[13.5px] leading-relaxed text-slate">
                      {risk.description}
                    </p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <SeverityBadge severity={risk.severity} />
                  <ChevronDown
                    className={cn("h-4 w-4 text-slate transition-transform", isOpen && "rotate-180")}
                  />
                </div>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.22 }}
                    className="overflow-hidden"
                  >
                    <div className="grid grid-cols-1 gap-5 pb-6 pl-9 sm:grid-cols-3">
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-label text-slate">
                          Why it matters
                        </p>
                        <p className="mt-2 text-[13.5px] leading-relaxed text-ink-soft">{risk.whyItMatters}</p>
                      </div>
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-label text-slate">
                          Evidence
                        </p>
                        <p className="mt-2 text-[13.5px] leading-relaxed text-ink-soft">{risk.evidence}</p>
                      </div>
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-label text-accent-strong">
                          Recommended decision
                        </p>
                        <p className="mt-2 text-[13.5px] leading-relaxed text-ink-soft">
                          {risk.recommendedDecision}
                        </p>
                        <p className="mt-3 text-[12.5px] leading-relaxed text-red">
                          If unresolved: {risk.impactIfUnresolved}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </ReportSection>
  );
}
