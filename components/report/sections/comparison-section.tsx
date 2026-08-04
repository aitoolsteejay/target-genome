"use client";

import { SectionHeading } from "@/components/shared/section-heading";
import { AnimatedCounter } from "@/components/shared/animated-counter";
import { formatHours } from "@/lib/formatters";
import type { SpecialistComparison } from "@/lib/types";

export function ComparisonSection({ comparison }: { comparison: SpecialistComparison }) {
  return (
    <section className="border-b border-border py-16 sm:py-20">
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="A Specialist-Supported Process"
          title="Qualifying candidates earlier changes the calendar math."
          description="A specialist recruitment process typically reduces unnecessary leadership interviews by qualifying candidates earlier — not by claiming to be a better judge of talent."
        />

        <div className="mt-10 grid grid-cols-1 gap-px border border-border bg-border sm:grid-cols-2">
          <div className="bg-paper-raised p-7">
            <p className="text-[11px] font-semibold uppercase tracking-label text-slate">
              Current Process
            </p>
            <p className="mt-2 text-[13px] text-slate-light">Leadership Time</p>
            <p className="mt-1 numeric font-serif-display text-4xl text-ink">
              {formatHours(comparison.currentHours)}
            </p>
          </div>
          <div className="bg-paper-raised p-7">
            <p className="text-[11px] font-semibold uppercase tracking-label text-accent-strong">
              Specialist Supported
            </p>
            <p className="mt-2 text-[13px] text-slate-light">Leadership Time</p>
            <p className="mt-1 numeric font-serif-display text-4xl text-accent-strong">
              {formatHours(comparison.specialistSupportedHours)}
            </p>
          </div>
        </div>

        <div className="mt-10 border border-accent/25 bg-accent-mist px-7 py-10 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-label text-accent-strong">
            Estimated Reduction
          </p>
          <p className="mt-3 numeric font-serif-display text-[56px] leading-none text-accent-strong sm:text-[68px]">
            <AnimatedCounter value={comparison.hoursReturned} duration={1.2} />
          </p>
          <p className="mt-2 text-[13px] font-semibold uppercase tracking-label text-accent-strong">
            Hours Returned
          </p>
          <p className="mt-5 text-[15px] text-ink-soft">
            Equivalent to nearly{" "}
            <span className="font-semibold text-ink">{comparison.daysReturned} working days</span>{" "}
            returned to your Engineering Leaders.
          </p>
        </div>
      </div>
    </section>
  );
}
