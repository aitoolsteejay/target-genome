import { SectionHeading } from "@/components/shared/section-heading";
import { formatHours } from "@/lib/formatters";
import type { LossItem } from "@/lib/types";

export function LossItemsSection({ items }: { items: LossItem[] }) {
  return (
    <section className="border-b border-border py-16 sm:py-20">
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Where The Time Is Lost"
          title="Ranked by leadership hours at stake."
        />

        <div className="mt-10 divide-y divide-border border-t border-b border-border">
          {items.map((item) => (
            <div key={item.id} className="flex items-start gap-5 py-6">
              <span className="numeric font-serif-display text-2xl text-slate-light">
                {String(item.rank).padStart(2, "0")}
              </span>
              <div className="flex-1">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="text-[16px] font-medium text-ink">{item.title}</p>
                  <p className="numeric font-serif-display text-xl text-accent-strong">
                    {formatHours(item.estimatedLossHours)}
                  </p>
                </div>
                <p className="mt-1.5 text-[13.5px] leading-relaxed text-slate">
                  <span className="font-medium text-ink-soft">Recommendation — </span>
                  {item.recommendation}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
