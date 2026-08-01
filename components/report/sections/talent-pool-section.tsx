"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { ReportSection } from "@/components/report/report-section";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { formatNumber } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import type { TalentFunnelStage } from "@/lib/types";

export function TalentPoolSection({ funnel }: { funnel: TalentFunnelStage[] }) {
  const [selected, setSelected] = useState<string>(funnel[funnel.length - 2]?.id ?? funnel[0]?.id);
  const max = funnel[0]?.count ?? 1;
  const activeStage = funnel.find((s) => s.id === selected) ?? funnel[0];

  return (
    <ReportSection
      id="talent-pool"
      navGroupId="talent-pool"
      eyebrow="Talent Pool Funnel"
      title="How the market narrows, stage by stage."
      description="Select any stage to see why candidates were removed and what assumption would expand it."
    >
      <div className="space-y-2.5">
        {funnel.map((stage, i) => {
          const widthPercent = Math.max(6, (stage.count / max) * 100);
          const isActive = stage.id === selected;
          return (
            <Tooltip key={stage.id}>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={() => setSelected(stage.id)}
                  aria-expanded={isActive}
                  className="group block w-full text-left"
                >
                  <div className="flex items-baseline justify-between gap-3 text-[13px]">
                    <span
                      className={cn(
                        "font-medium",
                        isActive ? "text-accent-strong" : "text-ink-soft"
                      )}
                    >
                      {i + 1}. {stage.label}
                    </span>
                    <span className="numeric font-serif-display text-lg text-ink shrink-0">
                      {formatNumber(stage.count)}
                    </span>
                  </div>
                  <div className="mt-1.5 h-8 w-full bg-stone-100">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${widthPercent}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.7, delay: i * 0.06, ease: "easeOut" }}
                      className={cn(
                        "h-full transition-colors",
                        isActive ? "bg-accent" : "bg-ink-soft/70 group-hover:bg-accent/70"
                      )}
                    />
                  </div>
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" className="max-w-sm">
                <p className="font-semibold text-paper">{stage.label}</p>
                <p className="mt-1 text-stone-100/85">{stage.definition}</p>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>

      {activeStage && (
        <motion.div
          key={activeStage.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="mt-8 grid grid-cols-1 gap-6 border border-border bg-paper-raised p-6 sm:grid-cols-3"
        >
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-label text-slate">Definition</p>
            <p className="mt-2 text-[14px] leading-relaxed text-ink-soft">{activeStage.definition}</p>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-label text-slate">
              Why candidates were removed
            </p>
            <p className="mt-2 text-[14px] leading-relaxed text-ink-soft">{activeStage.whyRemoved}</p>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-label text-accent-strong flex items-center gap-1">
              What would expand this
              <ChevronRight className="h-3 w-3" />
            </p>
            <p className="mt-2 text-[14px] leading-relaxed text-ink-soft">{activeStage.expansionLever}</p>
          </div>
        </motion.div>
      )}
    </ReportSection>
  );
}
