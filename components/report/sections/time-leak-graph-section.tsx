"use client";

import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";
import { cn } from "@/lib/utils";
import type { FunnelHoursStage } from "@/lib/types";

const DISPLAY_ORDER = [
  "total",
  "resumes",
  "screens",
  "technical",
  "manager",
  "leadership",
  "offers",
  "rejected",
  "offer-rejected",
  "joins",
];

const TONE_CLASS: Record<FunnelHoursStage["tone"], string> = {
  neutral: "bg-ink-soft/80",
  accent: "bg-accent",
  red: "bg-red",
  orange: "bg-orange",
};

export function TimeLeakGraphSection({ stages }: { stages: FunnelHoursStage[] }) {
  const ordered = DISPLAY_ORDER.map((id) => stages.find((s) => s.id === id)).filter(
    (s): s is FunnelHoursStage => Boolean(s)
  );

  return (
    <section className="border-b border-border py-16 sm:py-20">
      <div className="mx-auto max-w-2xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="The Time Leak Graph"
          title="Where the hours actually go before a single hire lands."
          description="Each bar shows the share of total leadership hours still attributable to candidates who are still in the running at that stage."
        />

        <div className="mt-10 space-y-1">
          {ordered.map((stage, i) => (
            <div key={stage.id}>
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                className="flex items-center gap-3"
              >
                <div className="flex-1">
                  <div className="flex items-baseline justify-between text-[12.5px]">
                    <span className="font-medium text-ink-soft">{stage.label}</span>
                    <span className="numeric text-slate">{stage.percentOfTotal}%</span>
                  </div>
                  <div className="mt-1 h-7 w-full bg-stone-100">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${Math.max(stage.percentOfTotal, 2)}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.7, delay: i * 0.07 + 0.05, ease: "easeOut" }}
                      className={cn("h-full", TONE_CLASS[stage.tone])}
                    />
                  </div>
                </div>
              </motion.div>
              {i < ordered.length - 1 && (
                <div className="flex justify-center py-0.5">
                  <ArrowDown className="h-3 w-3 text-border-strong" aria-hidden />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
