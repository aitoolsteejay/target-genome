"use client";

import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from "recharts";
import { X, Check } from "lucide-react";
import { ReportSection } from "@/components/report/report-section";
import { cn } from "@/lib/utils";
import type { MotivationFactor } from "@/lib/types";

export function MotivationGenomeSection({ motivations }: { motivations: MotivationFactor[] }) {
  const topFive = motivations.filter((m) => m.rank <= 5);
  const [activeId, setActiveId] = useState(topFive[0]?.id);
  const active = topFive.find((m) => m.id === activeId) ?? topFive[0];

  return (
    <ReportSection
      id="motivation-genome"
      eyebrow="Motivation Genome"
      title="What this segment actually optimises for."
      description="Simulated insight based on patterns observed across comparable specialist searches — not a universal fact about every candidate."
    >
      <div className="h-[340px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={motivations}
            layout="vertical"
            margin={{ left: 0, right: 30 }}
            barCategoryGap={10}
          >
            <XAxis type="number" hide domain={[0, 70]} />
            <YAxis
              type="category"
              dataKey="factor"
              width={190}
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#2a3733", fontSize: 12 }}
            />
            <Bar dataKey="weightPercent" barSize={16} label={{ position: "right", fill: "#14201c", fontSize: 12, formatter: (v: unknown) => `${v ?? ""}%` }}>
              {motivations.map((m) => (
                <Cell key={m.id} fill={m.rank <= 5 ? "#0e5c4b" : "#c9ded6"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-10">
        <p className="text-[11px] font-semibold uppercase tracking-label text-slate mb-4">
          Positioning guidance for the top five motivators
        </p>
        <div className="flex flex-wrap gap-2">
          {topFive.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setActiveId(m.id)}
              className={cn(
                "border px-3.5 py-1.5 text-[12.5px] font-medium transition-colors",
                activeId === m.id
                  ? "border-accent bg-accent-soft text-accent-strong"
                  : "border-border-strong text-slate hover:text-ink"
              )}
            >
              {m.rank}. {m.factor}
            </button>
          ))}
        </div>

        {active && (
          <div className="mt-6 grid grid-cols-1 gap-5 border border-border bg-paper-raised p-6 sm:grid-cols-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-label text-slate">
                What candidates want
              </p>
              <p className="mt-2 text-[14px] leading-relaxed text-ink-soft">{active.candidateWants}</p>
            </div>
            <div>
              <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-label text-red">
                <X className="h-3 w-3" /> Weak positioning
              </p>
              <p className="mt-2 text-[14px] leading-relaxed text-slate italic">
                &ldquo;{active.weakPositioning}&rdquo;
              </p>
            </div>
            <div>
              <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-label text-accent-strong">
                <Check className="h-3 w-3" /> Stronger positioning
              </p>
              <p className="mt-2 text-[14px] leading-relaxed text-ink-soft italic">
                &ldquo;{active.strongPositioning}&rdquo;
              </p>
            </div>
          </div>
        )}
      </div>
    </ReportSection>
  );
}
