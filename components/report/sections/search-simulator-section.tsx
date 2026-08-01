"use client";

import { useMemo, useState } from "react";
import { RotateCcw } from "lucide-react";
import { ReportSection } from "@/components/report/report-section";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { PressureBadge } from "@/components/shared/status-badge";
import { AnimatedCounter } from "@/components/shared/animated-counter";
import { computeScenarioOutput, classifyBriefBreadth } from "@/lib/calculations";
import { cn } from "@/lib/utils";
import type { ScenarioAssumptions, ScenarioBaseline, ScenarioPreset, SearchBrief } from "@/lib/types";

interface SearchSimulatorSectionProps {
  baseline: ScenarioBaseline;
  presets: ScenarioPreset[];
  brief: SearchBrief;
}

export function SearchSimulatorSection({ baseline, presets, brief }: SearchSimulatorSectionProps) {
  const [assumptions, setAssumptions] = useState<ScenarioAssumptions>(baseline.assumptions);
  const [comparePreset, setComparePreset] = useState<ScenarioPreset | null>(null);

  const currentOutput = useMemo(
    () => computeScenarioOutput(baseline, baseline.assumptions),
    [baseline]
  );
  const liveOutput = useMemo(
    () => computeScenarioOutput(baseline, assumptions),
    [baseline, assumptions]
  );
  const compareOutput = useMemo(
    () =>
      comparePreset
        ? computeScenarioOutput(baseline, { ...baseline.assumptions, ...comparePreset.overrides })
        : null,
    [baseline, comparePreset]
  );

  const isModified = JSON.stringify(assumptions) !== JSON.stringify(baseline.assumptions);

  function patch(next: Partial<ScenarioAssumptions>) {
    setAssumptions((prev) => ({ ...prev, ...next }));
  }

  function applyPreset(preset: ScenarioPreset) {
    setAssumptions({ ...baseline.assumptions, ...preset.overrides });
  }

  function reset() {
    setAssumptions(baseline.assumptions);
    setComparePreset(null);
  }

  const simulatedBrief: SearchBrief = {
    ...brief,
    role: { ...brief.role, experienceMin: assumptions.experienceMin },
    offerProcess: { ...brief.offerProcess, compMaxLakh: assumptions.compMaxLakh, interviewRounds: assumptions.interviewRounds },
  };
  const liveBreadth = classifyBriefBreadth(simulatedBrief);

  return (
    <ReportSection
      id="search-simulator"
      eyebrow="Search Assumption Simulator"
      title="Change one assumption. See the market move."
      description="Every control below recalculates the recruitable pool, competitive pressure, and expected timeline live — using the same demo heuristics documented in the codebase."
      headerRight={
        isModified ? (
          <Button size="sm" variant="ghost" onClick={reset}>
            <RotateCcw className="h-3.5 w-3.5" /> Reset
          </Button>
        ) : null
      }
    >
      <div className="flex flex-wrap gap-2">
        {presets.map((preset) => (
          <button
            key={preset.id}
            type="button"
            onClick={() => applyPreset(preset)}
            title={preset.description}
            className="border border-border-strong px-3 py-1.5 text-[12.5px] font-medium text-ink-soft transition-colors hover:border-accent hover:text-accent-strong"
          >
            {preset.label}
          </button>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1fr]">
        <div className="space-y-7">
          <div>
            <div className="flex items-center justify-between">
              <Label htmlFor="sim-comp" className="mb-0">Maximum compensation</Label>
              <span className="numeric text-sm text-ink-soft">₹{assumptions.compMaxLakh}L</span>
            </div>
            <Slider
              id="sim-comp"
              className="mt-3"
              min={Math.round(baseline.assumptions.compMaxLakh * 0.6)}
              max={Math.round(baseline.assumptions.compMaxLakh * 1.6)}
              step={1}
              value={[assumptions.compMaxLakh]}
              onValueChange={([v]) => patch({ compMaxLakh: v })}
            />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <Label htmlFor="sim-exp" className="mb-0">Minimum experience</Label>
              <span className="numeric text-sm text-ink-soft">{assumptions.experienceMin} yrs</span>
            </div>
            <Slider
              id="sim-exp"
              className="mt-3"
              min={Math.max(2, baseline.assumptions.experienceMin - 6)}
              max={baseline.assumptions.experienceMin + 4}
              step={1}
              value={[assumptions.experienceMin]}
              onValueChange={([v]) => patch({ experienceMin: v })}
            />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <Label htmlFor="sim-rounds" className="mb-0">Interview rounds</Label>
              <span className="numeric text-sm text-ink-soft">{assumptions.interviewRounds}</span>
            </div>
            <Slider
              id="sim-rounds"
              className="mt-3"
              min={2}
              max={7}
              step={1}
              value={[assumptions.interviewRounds]}
              onValueChange={([v]) => patch({ interviewRounds: v })}
            />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <Label htmlFor="sim-notice" className="mb-0">Notice-period tolerance</Label>
              <span className="numeric text-sm text-ink-soft">{assumptions.noticePeriodToleranceDays} days</span>
            </div>
            <Slider
              id="sim-notice"
              className="mt-3"
              min={15}
              max={120}
              step={5}
              value={[assumptions.noticePeriodToleranceDays]}
              onValueChange={([v]) => patch({ noticePeriodToleranceDays: v })}
            />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <Label htmlFor="sim-skills" className="mb-0">Mandatory secondary skills</Label>
              <span className="numeric text-sm text-ink-soft">{assumptions.mandatorySkillsCount}</span>
            </div>
            <Slider
              id="sim-skills"
              className="mt-3"
              min={0}
              max={4}
              step={1}
              value={[assumptions.mandatorySkillsCount]}
              onValueChange={([v]) => patch({ mandatorySkillsCount: v })}
            />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="flex items-center justify-between border border-border px-4 py-3">
              <Label htmlFor="sim-remote" className="mb-0 text-[13px]">Remote nationwide</Label>
              <Switch
                id="sim-remote"
                checked={assumptions.allowRemoteAcrossCountry}
                onCheckedChange={(v) => patch({ allowRemoteAcrossCountry: v })}
              />
            </div>
            <div className="flex items-center justify-between border border-border px-4 py-3">
              <Label htmlFor="sim-industry" className="mb-0 text-[13px]">Industry match required</Label>
              <Switch
                id="sim-industry"
                checked={assumptions.requireIndustryMatch}
                onCheckedChange={(v) => patch({ requireIndustryMatch: v })}
              />
            </div>
            <div className="flex items-center justify-between border border-border px-4 py-3">
              <Label htmlFor="sim-leadership" className="mb-0 text-[13px]">Leadership required</Label>
              <Switch
                id="sim-leadership"
                checked={assumptions.leadershipRequired}
                onCheckedChange={(v) => patch({ leadershipRequired: v })}
              />
            </div>
          </div>
        </div>

        <div>
          <div className="border border-border bg-paper-raised">
            <div className={cn("grid", compareOutput ? "grid-cols-2" : "grid-cols-1")}>
              <div className="p-6">
                <p className="text-[11px] font-semibold uppercase tracking-label text-slate">
                  {isModified ? "Revised brief" : "Current brief"}
                </p>
                <p className="mt-2 font-serif-display text-4xl text-accent-strong numeric">
                  <AnimatedCounter value={liveOutput.recruitable} duration={0.5} />
                </p>
                <p className="text-[12px] text-slate-light">recruitable candidates</p>

                <dl className="mt-5 space-y-2.5 text-[12.5px]">
                  <div className="flex justify-between">
                    <dt className="text-slate-light">Technically relevant</dt>
                    <dd className="numeric text-ink-soft">{liveOutput.technicallyRelevant.toLocaleString("en-IN")}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-slate-light">High-probability movers</dt>
                    <dd className="numeric text-ink-soft">{liveOutput.highProbabilityMovers.toLocaleString("en-IN")}</dd>
                  </div>
                  <div className="flex justify-between items-center">
                    <dt className="text-slate-light">Competitive pressure</dt>
                    <dd><PressureBadge level={liveOutput.competitivePressure} /></dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-slate-light">Search duration</dt>
                    <dd className="numeric text-ink-soft">
                      {liveOutput.searchDurationWeeksMin}–{liveOutput.searchDurationWeeksMax} wks
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-slate-light">Search difficulty</dt>
                    <dd className="text-ink-soft">{liveOutput.searchDifficulty}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-slate-light">Offer acceptance probability</dt>
                    <dd className="numeric text-ink-soft">{liveOutput.offerAcceptanceProbability}%</dd>
                  </div>
                </dl>
              </div>

              {compareOutput && (
                <div className="border-l border-border bg-accent-mist p-6">
                  <p className="text-[11px] font-semibold uppercase tracking-label text-accent-strong">
                    {comparePreset?.label}
                  </p>
                  <p className="mt-2 font-serif-display text-4xl text-accent-strong numeric">
                    {compareOutput.recruitable}
                  </p>
                  <p className="text-[12px] text-slate-light">recruitable candidates</p>
                  <dl className="mt-5 space-y-2.5 text-[12.5px]">
                    <div className="flex justify-between">
                      <dt className="text-slate-light">Technically relevant</dt>
                      <dd className="numeric text-ink-soft">{compareOutput.technicallyRelevant.toLocaleString("en-IN")}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-slate-light">High-probability movers</dt>
                      <dd className="numeric text-ink-soft">{compareOutput.highProbabilityMovers.toLocaleString("en-IN")}</dd>
                    </div>
                    <div className="flex justify-between items-center">
                      <dt className="text-slate-light">Competitive pressure</dt>
                      <dd><PressureBadge level={compareOutput.competitivePressure} /></dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-slate-light">Search duration</dt>
                      <dd className="numeric text-ink-soft">
                        {compareOutput.searchDurationWeeksMin}–{compareOutput.searchDurationWeeksMax} wks
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-slate-light">Search difficulty</dt>
                      <dd className="text-ink-soft">{compareOutput.searchDifficulty}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-slate-light">Offer acceptance probability</dt>
                      <dd className="numeric text-ink-soft">{compareOutput.offerAcceptanceProbability}%</dd>
                    </div>
                  </dl>
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between text-[12px] text-slate-light">
            <span>
              Baseline (Current Brief): {currentOutput.recruitable} recruitable &middot;{" "}
              {currentOutput.searchDurationWeeksMin}–{currentOutput.searchDurationWeeksMax} wks
            </span>
            <label className="flex items-center gap-2 cursor-pointer">
              Compare vs
              <select
                className="border border-border-strong bg-paper-raised px-2 py-1 text-[12px]"
                value={comparePreset?.id ?? ""}
                onChange={(e) => setComparePreset(presets.find((p) => p.id === e.target.value) ?? null)}
              >
                <option value="">— none —</option>
                {presets.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {liveBreadth !== "balanced" && (
            <p className={cn("mt-4 text-[12.5px]", liveBreadth === "narrow" ? "text-red" : "text-amber")}>
              {liveBreadth === "narrow"
                ? "These assumptions create an unusually narrow market. Consider reviewing which requirements are genuinely non-negotiable."
                : "This combination is broad enough that it may not differentiate high-potential candidates from merely technically relevant ones."}
            </p>
          )}
        </div>
      </div>
    </ReportSection>
  );
}
