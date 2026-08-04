"use client";

import { motion } from "framer-motion";
import { SectionHeading } from "@/components/shared/section-heading";
import { InfoTooltip } from "@/components/shared/info-tooltip";
import { formatHours } from "@/lib/formatters";
import type { TimeCategory } from "@/lib/types";

const CATEGORY_EXPLANATIONS: Record<string, string> = {
  "resume-reviews": "Time the Hiring Manager spends reading resumes before anyone is contacted.",
  "interview-scheduling": "Time spent coordinating calendars, sending invites, and handling reschedules for every interview round.",
  "recruiter-sync": "Time the recruiter and Hiring Manager spend syncing on each candidate who gets a screening call.",
  "technical-interviews": "Time spent running and preparing for technical interview rounds.",
  "hiring-manager-interviews": "Time the Hiring Manager spends running and preparing for their own interview rounds.",
  "leadership-interviews": "Time spent by Directors, VPs, or other leaders running and preparing for their rounds. This grows if more than one leader sits in on the same round.",
  "feedback-discussions": "Time spent writing feedback or a scorecard, and discussing the candidate with the panel, after each round.",
  "rejected-candidates": "Time spent closing out candidates who reached a technical interview but did not get an offer.",
  "offer-fallout": "Extra time spent restarting the process after a candidate turns down an offer.",
};

export function TimelineSection({
  categories,
  totalHours,
}: {
  categories: TimeCategory[];
  totalHours: number;
}) {
  const max = Math.max(...categories.map((c) => c.hours), 1);

  return (
    <section className="border-b border-border py-16 sm:py-20">
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Where The Hours Go"
          title="A leadership hour, spent nine different ways."
        />

        <div className="mt-10 space-y-0">
          {categories.map((category, i) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="relative flex items-center gap-4 border-l-2 border-border-strong py-3.5 pl-6"
            >
              <span className="absolute -left-[5px] top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-accent" />
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-3">
                  <span className="flex items-center gap-1.5 text-[14px] font-medium text-ink-soft">
                    {category.label}
                    {CATEGORY_EXPLANATIONS[category.id] && (
                      <InfoTooltip>{CATEGORY_EXPLANATIONS[category.id]}</InfoTooltip>
                    )}
                  </span>
                  <span className="numeric shrink-0 font-serif-display text-lg text-ink">
                    {formatHours(category.hours)}
                  </span>
                </div>
                <div className="mt-1.5 h-1.5 w-full bg-stone-100">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${(category.hours / max) * 100}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: i * 0.06 + 0.1 }}
                    className="h-full bg-accent"
                  />
                </div>
              </div>
            </motion.div>
          ))}

          <div className="mt-6 flex items-center justify-between border-t-2 border-ink pt-5">
            <span className="flex items-center gap-1.5 font-serif-display text-lg text-ink">
              Total Leadership Time
              <InfoTooltip>
                The sum of every category above: the full leadership time this hire took from
                start to finish.
              </InfoTooltip>
            </span>
            <span className="numeric font-serif-display text-3xl text-accent-strong">
              {formatHours(totalHours)}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
