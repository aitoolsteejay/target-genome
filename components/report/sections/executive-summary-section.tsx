import { SectionHeading } from "@/components/shared/section-heading";

export function ExecutiveSummarySection({ summary }: { summary: string }) {
  return (
    <section className="border-b border-border py-16 sm:py-20">
      <div className="mx-auto max-w-2xl px-5 sm:px-8">
        <SectionHeading eyebrow="Executive Summary" title="What this means for your process." />
        <p className="mt-8 font-serif-display text-[19px] leading-[1.75] text-ink-soft sm:text-[20px]">
          {summary}
        </p>
      </div>
    </section>
  );
}
