import { Check } from "lucide-react";
import { ReportSection } from "@/components/report/report-section";
import { InsightPanel } from "@/components/shared/insight-panel";
import { cn } from "@/lib/utils";
import type { TASpecialistRecommendation } from "@/lib/types";

export function TaVsSpecialistSection({ guidance }: { guidance: TASpecialistRecommendation }) {
  return (
    <ReportSection
      id="ta-vs-specialist"
      navGroupId="recommended-strategy"
      bordered
      eyebrow="Internal TA vs Specialist Search"
      title="Who should run this search."
      description="A balanced read on ownership model — not a recommendation to outsource by default."
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {guidance.guidance.map((g) => {
          const isRecommended = g.model === guidance.recommendedModel;
          return (
            <div
              key={g.model}
              className={cn(
                "border p-5",
                isRecommended ? "border-accent bg-accent-mist" : "border-border"
              )}
            >
              <div className="flex items-center justify-between">
                <p className="font-serif-display text-[17px] text-ink">{g.model}</p>
                {isRecommended && (
                  <span className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-label text-accent-strong">
                    <Check className="h-3 w-3" /> Recommended
                  </span>
                )}
              </div>
              <p className="mt-2 text-[11px] font-semibold uppercase tracking-label text-slate">Use when</p>
              <ul className="mt-1.5 space-y-1">
                {g.useWhen.map((u) => (
                  <li key={u} className="text-[13px] leading-relaxed text-ink-soft">&middot; {u}</li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      <InsightPanel className="mt-8">{guidance.explanation}</InsightPanel>
    </ReportSection>
  );
}
