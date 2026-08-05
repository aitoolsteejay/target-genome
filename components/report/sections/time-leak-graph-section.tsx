"use client";

import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";
import { cn } from "@/lib/utils";
import type { FunnelHoursStage } from "@/lib/types";

const MAIN_CHAIN_ORDER = ["total", "resumes", "screens", "technical", "manager", "leadership", "offers", "joins"];

const DROP_OFF_ORDER = ["rejected", "offer-rejected"];

const DROP_OFF_EXPLANATION: Record<string, string> = {
  rejected: "Of everyone who started, this share reached interviews but was never a fit and never got an offer.",
  "offer-rejected": "Of everyone who started, this share received an offer and turned it down.",
};

const TONE_CLASS: Record<FunnelHoursStage["tone"], string> = {
  neutral: "bg-ink-soft/80",
  accent: "bg-accent",
  red: "bg-red",
  orange: "bg-orange",
};

function pickStages(stages: FunnelHoursStage[], order: string[]): FunnelHoursStage[] {
  return order.map((id) => stages.find((s) => s.id === id)).filter((s): s is FunnelHoursStage => Boolean(s));
}

export function TimeLeakGraphSection({ stages }: { stages: FunnelHoursStage[] }) {
  const mainChain = pickStages(stages, MAIN_CHAIN_ORDER);
  const dropOffs = pickStages(stages, DROP_OFF_ORDER);

  return (
    <section className="border-b border-border py-16 sm:py-20">
      <div className="mx-auto max-w-2xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="The Hiring Funnel"
          title="How your candidate pool narrows before a single hire."
          description="Each bar shows what percentage of your starting pool of candidates is still active at that stage, compared to where you started. The narrower the bar, the fewer candidates are left."
        />

        <div className="mt-10 space-y-1">
          {mainChain.map((stage, i) => (
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
              {i < mainChain.length - 1 && (
                <div className="flex justify-center py-0.5">
                  <ArrowDown className="h-3 w-3 text-border-strong" aria-hidden />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-10 border-t border-border pt-8">
          <p className="text-[11px] font-semibold uppercase tracking-label text-slate">
            Where candidates dropped out along the way
          </p>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {dropOffs.map((stage) => (
              <div key={stage.id} className="border border-border p-4">
                <div className="flex items-baseline justify-between text-[12.5px]">
                  <span className="font-medium text-ink-soft">{stage.label}</span>
                  <span className="numeric text-slate">{stage.percentOfTotal}%</span>
                </div>
                <div className="mt-1.5 h-2 w-full bg-stone-100">
                  <div
                    className={cn("h-full", TONE_CLASS[stage.tone])}
                    style={{ width: `${Math.max(stage.percentOfTotal, 2)}%` }}
                  />
                </div>
                <p className="mt-2.5 text-[12.5px] leading-relaxed text-slate">
                  {DROP_OFF_EXPLANATION[stage.id]}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
