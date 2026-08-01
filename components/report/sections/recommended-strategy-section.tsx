import { ReportSection } from "@/components/report/report-section";
import type { SearchRecommendation } from "@/lib/types";

export function RecommendedStrategySection({ recommendation }: { recommendation: SearchRecommendation }) {
  return (
    <ReportSection
      id="recommended-strategy"
      navGroupId="recommended-strategy"
      eyebrow="Recommended Search Strategy"
      title="A five-part plan calibrated to this specific brief."
    >
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-label text-slate mb-3">
            1. Priority talent segments
          </p>
          <ul className="space-y-1.5">
            {recommendation.prioritySegments.map((s) => (
              <li key={s} className="text-[13.5px] leading-relaxed text-ink-soft">&middot; {s}</li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-[11px] font-semibold uppercase tracking-label text-slate mb-3">
            2. Target employer strategy
          </p>
          <div className="space-y-2.5">
            {recommendation.employerStrategy.map((e) => (
              <div key={e.label}>
                <div className="flex justify-between text-[13px]">
                  <span className="text-ink-soft">{e.label}</span>
                  <span className="numeric text-slate">{e.percent}%</span>
                </div>
                <div className="mt-1 h-1.5 w-full bg-stone-100">
                  <div className="h-full bg-accent" style={{ width: `${e.percent}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="text-[11px] font-semibold uppercase tracking-label text-slate mb-3">
            3. Candidate positioning
          </p>
          <p className="text-[12px] font-medium text-accent-strong mb-1.5">Lead with</p>
          <ul className="space-y-1">
            {recommendation.positioningLeadWith.map((s) => (
              <li key={s} className="text-[13.5px] leading-relaxed text-ink-soft">&middot; {s}</li>
            ))}
          </ul>
          <p className="text-[12px] font-medium text-red mt-3 mb-1.5">Avoid leading with</p>
          <ul className="space-y-1">
            {recommendation.positioningAvoid.map((s) => (
              <li key={s} className="text-[13.5px] leading-relaxed text-slate">&middot; {s}</li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-[11px] font-semibold uppercase tracking-label text-slate mb-3">
            4. Process design
          </p>
          <ul className="space-y-1.5">
            {recommendation.processDesign.map((s) => (
              <li key={s} className="text-[13.5px] leading-relaxed text-ink-soft">&middot; {s}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-10">
        <p className="text-[11px] font-semibold uppercase tracking-label text-slate mb-4">
          5. Search timeline
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {recommendation.timeline.map((t) => (
            <div key={t.phase} className="border-t-2 border-accent pt-3">
              <p className="text-[12px] font-semibold text-ink">{t.phase}</p>
              <p className="mt-1 text-[12.5px] leading-snug text-slate">{t.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </ReportSection>
  );
}
