"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from "recharts";
import { ReportSection } from "@/components/report/report-section";
import { cn } from "@/lib/utils";
import type { CareerArchetype, CareerDNAStat, ExperienceBand } from "@/lib/types";

const ACCENT = "#0e5c4b";
const ACCENT_LIGHT = "#bdd7cd";

function ArchetypeCard({
  archetype,
  isOpen,
  onToggle,
}: {
  archetype: CareerArchetype;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className={cn("border transition-colors", isOpen ? "border-accent" : "border-border")}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex w-full items-start justify-between gap-4 p-5 text-left"
      >
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-label text-slate">
            {archetype.shareOfPool}% of the pool
          </p>
          <h3 className="mt-1.5 font-serif-display text-[19px] text-ink">{archetype.name}</h3>
          <p className="mt-2 text-[13.5px] leading-relaxed text-slate">{archetype.summary}</p>
        </div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-1 gap-5 border-t border-border p-5 sm:grid-cols-2">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-label text-slate">
                  Characteristics
                </p>
                <ul className="mt-2 space-y-1.5">
                  {archetype.characteristics.map((c) => (
                    <li key={c} className="text-[13.5px] leading-relaxed text-ink-soft">
                      &middot; {c}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-label text-slate">
                  Typical current employers
                </p>
                <p className="mt-2 text-[13.5px] leading-relaxed text-ink-soft">
                  {archetype.typicalEmployers.join(", ")}
                </p>
                <p className="mt-4 text-[11px] font-semibold uppercase tracking-label text-slate">
                  Likely motivations
                </p>
                <p className="mt-2 text-[13.5px] leading-relaxed text-ink-soft">
                  {archetype.motivations.join(", ")}
                </p>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-label text-slate">
                  Likely objections
                </p>
                <p className="mt-2 text-[13.5px] leading-relaxed text-ink-soft">
                  {archetype.objections.join(" ")}
                </p>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-label text-accent-strong">
                  Best outreach angle
                </p>
                <p className="mt-2 text-[13.5px] leading-relaxed text-ink-soft">
                  {archetype.outreachAngle}
                </p>
                <p className="mt-4 text-[11px] font-semibold uppercase tracking-label text-slate">
                  Interview concerns
                </p>
                <p className="mt-2 text-[13.5px] leading-relaxed text-ink-soft">
                  {archetype.interviewConcerns.join(" ")}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function CareerDnaSection({
  stats,
  experienceBands,
  archetypes,
}: {
  stats: CareerDNAStat[];
  experienceBands: ExperienceBand[];
  archetypes: CareerArchetype[];
}) {
  const [openId, setOpenId] = useState<string | null>(archetypes[0]?.id ?? null);

  return (
    <ReportSection
      id="career-dna"
      eyebrow="The Career DNA"
      title="What this talent segment has in common."
      description="Shared career characteristics across the recruitable pool, and the four archetypes that make it up."
    >
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.1fr]">
        <div className="grid grid-cols-2 gap-x-6 gap-y-5">
          {stats.map((stat) => (
            <div key={stat.id} className="border-t border-border-strong pt-3">
              <p className="font-serif-display text-2xl text-ink numeric">{stat.value}</p>
              <p className="mt-1 text-[12.5px] leading-snug text-slate">{stat.label}</p>
            </div>
          ))}
        </div>

        <div>
          <p className="text-[11px] font-semibold uppercase tracking-label text-slate mb-3">
            Experience distribution
          </p>
          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={experienceBands} layout="vertical" margin={{ left: 0, right: 24 }}>
                <XAxis type="number" hide domain={[0, 40]} />
                <YAxis
                  type="category"
                  dataKey="band"
                  width={90}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "#5b6660", fontSize: 12.5 }}
                />
                <Bar dataKey="percent" radius={0} barSize={22} label={{ position: "right", fill: "#14201c", fontSize: 12.5, formatter: (v: unknown) => `${v ?? ""}%` }}>
                  {experienceBands.map((band, i) => (
                    <Cell key={band.band} fill={i === 0 ? ACCENT : ACCENT_LIGHT} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <p className="text-[11px] font-semibold uppercase tracking-label text-slate mb-4">
          Career archetypes
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {archetypes.map((archetype) => (
            <ArchetypeCard
              key={archetype.id}
              archetype={archetype}
              isOpen={openId === archetype.id}
              onToggle={() => setOpenId(openId === archetype.id ? null : archetype.id)}
            />
          ))}
        </div>
      </div>
    </ReportSection>
  );
}
