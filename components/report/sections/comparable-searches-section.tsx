import { ReportSection } from "@/components/report/report-section";
import { Badge } from "@/components/ui/badge";
import type { ComparableSearch } from "@/lib/types";

export function ComparableSearchesSection({ data }: { data: ComparableSearch }) {
  return (
    <ReportSection
      id="similar-searches"
      eyebrow="Search Intelligence from Similar Assignments"
      title="What comparable searches have taught us."
      description={`Across ${data.sampleSize} comparable specialist searches. Simulated demo data, illustrative of the kind of pattern this intelligence layer surfaces in production.`}
    >
      <div className="grid grid-cols-2 gap-px border border-border bg-border sm:grid-cols-4">
        {data.stats.map((stat) => (
          <div key={stat.id} className="bg-paper-raised p-5">
            <p className="font-serif-display text-2xl text-ink numeric">{stat.value}</p>
            <p className="mt-1.5 text-[12px] leading-snug text-slate">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.2fr]">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-label text-slate mb-3">
            What changed the outcome
          </p>
          <ul className="space-y-2">
            {data.whatChangedTheOutcome.map((item) => (
              <li key={item} className="flex gap-2.5 text-[13.5px] leading-relaxed text-ink-soft">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-[11px] font-semibold uppercase tracking-label text-slate mb-3">
            Anonymised search stories
          </p>
          <div className="space-y-4">
            {data.stories.map((story) => (
              <div key={story.id} className="border border-border p-4">
                <div className="flex items-center gap-2">
                  <Badge variant="neutral">{story.code}</Badge>
                  <span className="text-[13px] font-medium text-ink">{story.role}</span>
                </div>
                <dl className="mt-3 space-y-1.5 text-[13px]">
                  <div>
                    <dt className="inline text-slate-light">Original issue — </dt>
                    <dd className="inline text-ink-soft">{story.originalIssue}</dd>
                  </div>
                  <div>
                    <dt className="inline text-slate-light">What changed — </dt>
                    <dd className="inline text-ink-soft">{story.whatChanged}</dd>
                  </div>
                  <div>
                    <dt className="inline text-accent-strong">Result — </dt>
                    <dd className="inline text-ink-soft">{story.result}</dd>
                  </div>
                </dl>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ReportSection>
  );
}
