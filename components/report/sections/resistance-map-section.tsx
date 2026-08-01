import { ReportSection } from "@/components/report/report-section";
import { SeverityBadge } from "@/components/shared/status-badge";
import type { ResistanceFactor, ResistanceStage } from "@/lib/types";

const STAGES: { key: ResistanceStage; title: string; description: string }[] = [
  { key: "Ignore", title: "Reasons They Ignore the Message", description: "Why qualified candidates never reply to the first outreach." },
  { key: "Drop", title: "Reasons They Drop During Interviews", description: "Where the process itself causes otherwise-interested candidates to disengage." },
  { key: "Reject", title: "Reasons They Reject the Offer", description: "What surfaces late enough to undo an otherwise successful process." },
];

function ResistanceCard({ factor }: { factor: ResistanceFactor }) {
  return (
    <div className="border border-border p-5">
      <div className="flex items-start justify-between gap-3">
        <p className="text-[14.5px] font-medium text-ink leading-snug">{factor.issue}</p>
        <SeverityBadge severity={factor.severity} />
      </div>
      <p className="mt-2.5 text-[13.5px] leading-relaxed text-slate">{factor.impact}</p>
      <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
        <span className="text-[11.5px] text-slate-light">
          Company control: <span className="font-medium text-ink-soft">{factor.control}</span>
        </span>
      </div>
      <p className="mt-3 text-[13px] leading-relaxed text-accent-strong">
        <span className="font-medium">Recommended fix — </span>
        {factor.recommendedFix}
      </p>
    </div>
  );
}

export function ResistanceMapSection({ factors }: { factors: ResistanceFactor[] }) {
  return (
    <ReportSection
      id="candidate-resistance"
      eyebrow="Candidate Resistance Map"
      title="Where this search is most likely to lose candidates."
      description="The most common reasons candidates ignore, delay, or reject opportunities in searches like this one."
    >
      <div className="space-y-12">
        {STAGES.map((stage) => {
          const stageFactors = factors.filter((f) => f.stage === stage.key);
          if (stageFactors.length === 0) return null;
          return (
            <div key={stage.key}>
              <h3 className="font-serif-display text-lg text-ink">{stage.title}</h3>
              <p className="mt-1 text-[13px] text-slate">{stage.description}</p>
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {stageFactors.map((factor) => (
                  <ResistanceCard key={factor.id} factor={factor} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </ReportSection>
  );
}
