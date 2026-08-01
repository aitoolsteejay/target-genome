"use client";

import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { ReportSection } from "@/components/report/report-section";
import { InsightPanel } from "@/components/shared/insight-panel";
import type { CareerPath } from "@/lib/types";

export function CareerFlowSection({
  paths,
  insights,
}: {
  paths: CareerPath[];
  insights: string[];
}) {
  const maxFrequency = Math.max(...paths.map((p) => p.frequency));

  return (
    <ReportSection
      id="talent-movement"
      navGroupId="talent-movement"
      eyebrow="Career Journey &amp; Talent Flow"
      title="Where the strongest candidates actually come from."
      description="The repeated career paths that produce this profile — line weight reflects how often each path recurs in the market."
    >
      <div className="space-y-5">
        {paths.map((path, i) => {
          const weight = path.frequency / maxFrequency;
          return (
            <motion.div
              key={path.id}
              initial={{ opacity: 0, x: -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="flex flex-wrap items-center gap-x-1.5 gap-y-2 border-l-2 py-2 pl-4"
              style={{ borderColor: `rgba(14,92,75,${0.3 + weight * 0.7})` }}
            >
              {path.steps.map((step, si) => (
                <span key={si} className="flex items-center gap-1.5">
                  <span
                    className={
                      si === path.steps.length - 1
                        ? "border border-accent bg-accent-soft px-2.5 py-1 text-[12.5px] font-medium text-accent-strong"
                        : "border border-border-strong bg-paper-raised px-2.5 py-1 text-[12.5px] text-ink-soft"
                    }
                  >
                    {step}
                  </span>
                  {si < path.steps.length - 1 && (
                    <ChevronRight className="h-3 w-3 text-slate-light" aria-hidden />
                  )}
                </span>
              ))}
              <span className="ml-2 text-[11px] text-slate-light">
                observed in {path.frequency}% of comparable profiles
              </span>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-8 space-y-4">
        {insights.map((insight, i) => (
          <InsightPanel key={i}>{insight}</InsightPanel>
        ))}
      </div>
    </ReportSection>
  );
}
