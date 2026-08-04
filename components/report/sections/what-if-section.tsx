"use client";

import { useMemo, useState } from "react";
import { RotateCcw } from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { AnimatedCounter } from "@/components/shared/animated-counter";
import { InfoTooltip } from "@/components/shared/info-tooltip";
import { computeWhatIf, DEFAULT_WHAT_IF_ASSUMPTIONS } from "@/lib/calculations";
import type { TimeLeakReport, WhatIfAssumptions } from "@/lib/types";

export function WhatIfSection({ report }: { report: TimeLeakReport }) {
  const [assumptions, setAssumptions] = useState<WhatIfAssumptions>(DEFAULT_WHAT_IF_ASSUMPTIONS);

  const output = useMemo(() => computeWhatIf(report, assumptions), [report, assumptions]);
  const isModified = JSON.stringify(assumptions) !== JSON.stringify(DEFAULT_WHAT_IF_ASSUMPTIONS);

  function patch(next: Partial<WhatIfAssumptions>) {
    setAssumptions((prev) => ({ ...prev, ...next }));
  }

  return (
    <section className="border-b border-border py-16 sm:py-20">
      <div className="mx-auto max-w-4xl px-5 sm:px-8">
        <div className="flex items-start justify-between gap-4">
          <SectionHeading
            eyebrow="What If?"
            title="Adjust the process. Watch the hours move."
            description="Every control below recalculates instantly against this report. Nothing is sent anywhere, so feel free to try different combinations."
          />
          {isModified && (
            <Button size="sm" variant="ghost" onClick={() => setAssumptions(DEFAULT_WHAT_IF_ASSUMPTIONS)}>
              <RotateCcw className="h-3.5 w-3.5" /> Reset
            </Button>
          )}
        </div>

        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1fr]">
          <div className="space-y-8">
            <div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Label htmlFor="wi-rounds" className="mb-0">Reduce interview rounds</Label>
                  <InfoTooltip>
                    Slide right to simulate combining or removing rounds, for example going from
                    five stages down to three. This mainly saves scheduling and feedback time.
                  </InfoTooltip>
                </span>
                <span className="text-[12.5px] text-slate-light">5 to 3 rounds</span>
              </div>
              <Slider
                id="wi-rounds"
                className="mt-3"
                min={0}
                max={100}
                step={5}
                value={[assumptions.processCompression]}
                onValueChange={([v]) => patch({ processCompression: v })}
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Label htmlFor="wi-qualification" className="mb-0">Increase recruiter qualification</Label>
                  <InfoTooltip>
                    Slide right to simulate better screening before candidates reach a technical
                    interview, so fewer unsuitable candidates take up interview time.
                  </InfoTooltip>
                </span>
                <span className="numeric text-[12.5px] text-slate-light">{assumptions.recruiterQualification}%</span>
              </div>
              <Slider
                id="wi-qualification"
                className="mt-3"
                min={0}
                max={100}
                step={5}
                value={[assumptions.recruiterQualification]}
                onValueChange={([v]) => patch({ recruiterQualification: v })}
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Label htmlFor="wi-fallout" className="mb-0">Reduce offer fallout</Label>
                  <InfoTooltip>
                    Slide right to simulate fewer declined offers, so less time is spent
                    restarting the process after a candidate says no.
                  </InfoTooltip>
                </span>
                <span className="numeric text-[12.5px] text-slate-light">{assumptions.offerFalloutReduction}%</span>
              </div>
              <Slider
                id="wi-fallout"
                className="mt-3"
                min={0}
                max={100}
                step={5}
                value={[assumptions.offerFalloutReduction]}
                onValueChange={([v]) => patch({ offerFalloutReduction: v })}
              />
            </div>

            <div className="flex items-center justify-between border border-border px-4 py-3.5">
              <span className="flex items-center gap-1.5">
                <Label htmlFor="wi-delay" className="mb-0 text-[13.5px]">Move CTO interview later</Label>
                <InfoTooltip>
                  Turn this on to simulate bringing your most senior leaders in only for a final,
                  shortlisted round instead of earlier in the process.
                </InfoTooltip>
              </span>
              <Switch
                id="wi-delay"
                checked={assumptions.delayLeadershipInterviews}
                onCheckedChange={(v) => patch({ delayLeadershipInterviews: v })}
              />
            </div>
          </div>

          <div className="border border-border bg-paper-raised p-7">
            <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-label text-slate">
              Total Hours
              <InfoTooltip>The recalculated total leadership hours with your changes applied.</InfoTooltip>
            </p>
            <p className="mt-1.5 numeric font-serif-display text-4xl text-ink">
              <AnimatedCounter value={output.totalHours} duration={0.5} />
            </p>

            <div className="mt-6 grid grid-cols-2 gap-5 border-t border-border pt-6">
              <div>
                <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-label text-slate">
                  Weeks Lost
                  <InfoTooltip>Total hours converted into working weeks, assuming a 40-hour week.</InfoTooltip>
                </p>
                <p className="mt-1.5 numeric font-serif-display text-2xl text-ink-soft">{output.weeksLost}</p>
              </div>
              <div>
                <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-label text-accent-strong">
                  Leadership Hours Returned
                  <InfoTooltip>How many hours these changes would save compared to your current process.</InfoTooltip>
                </p>
                <p className="mt-1.5 numeric font-serif-display text-2xl text-accent-strong">
                  {output.leadershipHoursReturned}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
