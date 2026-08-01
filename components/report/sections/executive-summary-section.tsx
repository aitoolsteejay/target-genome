"use client";

import { Info } from "lucide-react";
import { ReportSection } from "@/components/report/report-section";
import { InsightPanel } from "@/components/shared/insight-panel";
import { AnimatedCounter } from "@/components/shared/animated-counter";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { ExecutiveMetric } from "@/lib/types";

function isNumeric(value: string) {
  return /^[\d,]+$/.test(value.trim());
}

function MetricTile({ metric }: { metric: ExecutiveMetric }) {
  const numeric = isNumeric(metric.value);
  return (
    <div className="bg-paper-raised p-5">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[12px] uppercase tracking-label text-slate">{metric.label}</p>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              aria-label={`Explain ${metric.label}`}
              className="print-hide text-slate-light hover:text-accent-strong"
            >
              <Info className="h-3.5 w-3.5" />
            </button>
          </TooltipTrigger>
          <TooltipContent>{metric.explanation}</TooltipContent>
        </Tooltip>
      </div>
      <p className="mt-2.5 font-serif-display text-3xl text-ink numeric">
        {numeric ? <AnimatedCounter value={Number(metric.value.replace(/,/g, ""))} /> : metric.value}
      </p>
      <p className="mt-2 hidden text-[12.5px] leading-snug text-slate-light print:block">
        {metric.explanation}
      </p>
    </div>
  );
}

export function ExecutiveSummarySection({
  metrics,
  insight,
}: {
  metrics: ExecutiveMetric[];
  insight: string;
}) {
  return (
    <ReportSection
      id="executive-summary"
      eyebrow="Executive Intelligence Summary"
      title="Six numbers that frame this search."
      description="No more than six headline indicators — each one changes how this role should be positioned, targeted or timed."
    >
      <div className="grid grid-cols-1 gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
        {metrics.map((metric) => (
          <MetricTile key={metric.id} metric={metric} />
        ))}
      </div>
      <InsightPanel className="mt-8">{insight}</InsightPanel>
    </ReportSection>
  );
}
