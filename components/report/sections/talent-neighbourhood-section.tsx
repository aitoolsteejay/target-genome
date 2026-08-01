"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ReportSection } from "@/components/report/report-section";
import { InsightPanel } from "@/components/shared/insight-panel";
import { AnimatedCounter } from "@/components/shared/animated-counter";
import { cn } from "@/lib/utils";
import type { AdjacentProfile } from "@/lib/types";

const SEARCH_VALUE_COLOR: Record<AdjacentProfile["searchValue"], string> = {
  "Very high": "#0e5c4b",
  High: "#3fa88a",
  Medium: "#a8631a",
  Selective: "#838d86",
};

export function TalentNeighbourhoodSection({
  profiles,
  baseRecruitable,
  insight,
  roleTitle,
}: {
  profiles: AdjacentProfile[];
  baseRecruitable: number;
  insight: string;
  roleTitle: string;
}) {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const positions = useMemo(() => {
    const n = profiles.length;
    return profiles.map((_, i) => {
      const angle = (i / n) * 2 * Math.PI - Math.PI / 2;
      return {
        x: 50 + 40 * Math.cos(angle),
        y: 50 + 40 * Math.sin(angle),
      };
    });
  }, [profiles]);

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const selectedProfiles = profiles.filter((p) => selected.has(p.id));
  const combinedPool = baseRecruitable + selectedProfiles.reduce((sum, p) => sum + p.additionalRecruitable, 0);

  return (
    <ReportSection
      id="talent-neighbourhood"
      eyebrow="Talent Neighbourhood"
      title="Adjacent profiles that could do this job."
      description="Select one or more adjacent roles to see how much they would expand the recruitable pool."
    >
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.1fr]">
        <div className="relative mx-auto aspect-square w-full max-w-md">
          <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full overflow-visible" aria-hidden>
            {positions.map((pos, i) => (
              <line
                key={i}
                x1={50}
                y1={50}
                x2={pos.x}
                y2={pos.y}
                stroke={selected.has(profiles[i].id) ? "#0e5c4b" : "#ddd6c9"}
                strokeWidth={selected.has(profiles[i].id) ? 0.6 : 0.4}
              />
            ))}
          </svg>

          <div className="absolute left-1/2 top-1/2 flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center border-2 border-ink bg-paper-raised text-center p-1.5 shadow-sm">
            <p className="text-[10px] font-semibold uppercase tracking-label text-slate-light">Target role</p>
            <p className="mt-0.5 text-[11.5px] font-medium leading-tight text-ink">{roleTitle}</p>
          </div>

          {profiles.map((profile, i) => {
            const pos = positions[i];
            const isSelected = selected.has(profile.id);
            return (
              <button
                key={profile.id}
                type="button"
                onClick={() => toggle(profile.id)}
                aria-pressed={isSelected}
                style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                className={cn(
                  "absolute flex w-[104px] -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1 border px-2.5 py-2 text-center transition-colors",
                  isSelected
                    ? "border-accent bg-accent-soft shadow-md"
                    : "border-border-strong bg-paper-raised hover:border-accent/50"
                )}
              >
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ background: SEARCH_VALUE_COLOR[profile.searchValue] }}
                  aria-hidden
                />
                <span className="text-[11px] font-medium leading-tight text-ink-soft">{profile.title}</span>
                <span className="text-[10px] text-slate-light">{profile.skillOverlapPercent}% overlap</span>
              </button>
            );
          })}
        </div>

        <div>
          <div className="border border-border bg-paper-raised p-6">
            <p className="text-[11px] font-semibold uppercase tracking-label text-slate">
              Recruitable pool with selection
            </p>
            <p className="mt-2 font-serif-display text-4xl text-accent-strong numeric">
              <AnimatedCounter value={combinedPool} duration={0.6} />
            </p>
            <p className="mt-1.5 text-[12.5px] text-slate-light">
              Base {baseRecruitable} + {selectedProfiles.reduce((s, p) => s + p.additionalRecruitable, 0)} from{" "}
              {selectedProfiles.length} selected adjacent {selectedProfiles.length === 1 ? "profile" : "profiles"}
            </p>
          </div>

          <div className="mt-5 space-y-3">
            {profiles.map((profile) => {
              const isSelected = selected.has(profile.id);
              return (
                <motion.button
                  key={profile.id}
                  type="button"
                  onClick={() => toggle(profile.id)}
                  layout
                  className={cn(
                    "flex w-full items-start justify-between gap-4 border px-4 py-3 text-left transition-colors",
                    isSelected ? "border-accent bg-accent-mist" : "border-border hover:border-border-strong"
                  )}
                >
                  <div>
                    <p className="text-[13.5px] font-medium text-ink">{profile.title}</p>
                    <p className="mt-1 text-[12.5px] text-slate">
                      {profile.skillOverlapPercent}% skill overlap &middot; {profile.availability} availability
                      &middot; adapts in ~{profile.adaptationTimeWeeks} wks
                    </p>
                    <p className="mt-1 text-[12px] text-slate-light">
                      Adaptation needed: {profile.adaptationRequired}
                    </p>
                  </div>
                  <span className="shrink-0 text-right">
                    <span className="block text-[11px] uppercase tracking-label text-slate-light">
                      +recruitable
                    </span>
                    <span className="numeric font-serif-display text-lg text-accent-strong">
                      +{profile.additionalRecruitable}
                    </span>
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      <InsightPanel className="mt-8">{insight}</InsightPanel>
    </ReportSection>
  );
}
