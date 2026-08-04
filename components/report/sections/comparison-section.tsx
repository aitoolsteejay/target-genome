"use client";

import { SectionHeading } from "@/components/shared/section-heading";
import { AnimatedCounter } from "@/components/shared/animated-counter";
import { InfoTooltip } from "@/components/shared/info-tooltip";
import { formatHours } from "@/lib/formatters";
import type { SpecialistComparison } from "@/lib/types";

export function ComparisonSection({ comparison }: { comparison: SpecialistComparison }) {
  return (
    <section className="border-b border-border py-16 sm:py-20">
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="A Specialist-Supported Process"
          title="Qualifying candidates earlier changes the calendar math."
          description="A specialist recruitment process typically cuts down unnecessary leadership interviews by qualifying candidates earlier. This is not a claim that a specialist judges talent better."
        />

        <div className="mt-10 grid grid-cols-1 gap-px border border-border bg-border sm:grid-cols-2">
          <div className="bg-paper-raised p-7">
            <p className="text-[11px] font-semibold uppercase tracking-label text-slate">
              Current Process
            </p>
            <p className="mt-2 flex items-center gap-1.5 text-[13px] text-slate-light">
              Leadership Time
              <InfoTooltip>Total leadership hours under your current process, as entered.</InfoTooltip>
            </p>
            <p className="mt-1 numeric font-serif-display text-4xl text-ink">
              {formatHours(comparison.currentHours)}
            </p>
          </div>
          <div className="bg-paper-raised p-7">
            <p className="text-[11px] font-semibold uppercase tracking-label text-accent-strong">
              Specialist Supported
            </p>
            <p className="mt-2 flex items-center gap-1.5 text-[13px] text-slate-light">
              Leadership Time
              <InfoTooltip>
                An estimate of leadership hours if candidates were better qualified before
                reaching your Hiring Manager and leadership team.
              </InfoTooltip>
            </p>
            <p className="mt-1 numeric font-serif-display text-4xl text-accent-strong">
              {formatHours(comparison.specialistSupportedHours)}
            </p>
          </div>
        </div>

        <div className="mt-10 border border-accent-secondary/25 bg-accent-secondary-mist px-7 py-10 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-label text-accent-secondary-strong">
            Estimated Reduction
          </p>
          <p className="mt-3 numeric font-serif-display text-[56px] leading-none text-accent-secondary-strong sm:text-[68px]">
            <AnimatedCounter value={comparison.hoursReturned} duration={1.2} />
          </p>
          <p className="mt-2 flex items-center justify-center gap-1.5 text-[13px] font-semibold uppercase tracking-label text-accent-secondary-strong">
            Hours Returned
            <InfoTooltip>
              The difference between your current process and the specialist-supported estimate:
              the hours your leaders would get back.
            </InfoTooltip>
          </p>
          <p className="mt-5 text-[15px] text-ink-soft">
            Equivalent to nearly{" "}
            <span className="font-semibold text-ink">{comparison.daysReturned} working days</span>{" "}
            given back to your engineering leaders.
          </p>
        </div>
      </div>
    </section>
  );
}
