"use client";

import { motion } from "framer-motion";
import { SectionHeading } from "@/components/shared/section-heading";
import { formatHours } from "@/lib/formatters";
import type { TimeCategory } from "@/lib/types";

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
                  <span className="text-[14px] font-medium text-ink-soft">{category.label}</span>
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
            <span className="font-serif-display text-lg text-ink">Total Leadership Time</span>
            <span className="numeric font-serif-display text-3xl text-accent-strong">
              {formatHours(totalHours)}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
