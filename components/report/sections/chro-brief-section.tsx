"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ReportSection } from "@/components/report/report-section";
import { Button } from "@/components/ui/button";
import { PressureBadge, SeverityBadge } from "@/components/shared/status-badge";
import { computeScenarioOutput } from "@/lib/calculations";
import type { TalentGenomeReport } from "@/lib/types";

export function ChroBriefSection({ report }: { report: TalentGenomeReport }) {
  const { brief, talentPool, chroBrief, risks, scenarioBaseline } = report;
  const output = computeScenarioOutput(scenarioBaseline, scenarioBaseline.assumptions);
  const topRisks = risks.filter((r) => r.severity === "Critical" || r.severity === "High").slice(0, 3);

  return (
    <ReportSection
      id="chro-brief"
      eyebrow="The One-Page CHRO Brief"
      title="A summary built for internal circulation."
      description="Everything a business head or CHRO needs to make a go/no-go decision, without reading the full report."
      headerRight={
        <Button size="sm" variant="outline" asChild>
          <Link href="/report/brief" target="_blank">
            Open one-page brief
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </Button>
      }
    >
      <div className="border border-border p-6 sm:p-8">
        <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-border pb-4">
          <h3 className="font-serif-display text-xl text-ink">{brief.role.title}</h3>
          <span className="text-[12px] text-slate-light">{brief.role.location}</span>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div>
            <p className="text-[11px] uppercase tracking-label text-slate">Real talent pool</p>
            <p className="mt-1 font-serif-display text-2xl text-ink numeric">
              {talentPool.technicallyRelevant.toLocaleString("en-IN")}
            </p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-label text-slate">Recruitable pool</p>
            <p className="mt-1 font-serif-display text-2xl text-accent-strong numeric">
              {talentPool.realisticallyRecruitable.toLocaleString("en-IN")}
            </p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-label text-slate">Search difficulty</p>
            <p className="mt-1 text-[14px] font-medium text-ink-soft">{output.searchDifficulty}</p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-label text-slate">Est. time to close</p>
            <p className="mt-1 text-[14px] font-medium text-ink-soft">
              {talentPool.searchWindowWeeksMin}–{talentPool.searchWindowWeeksMax} wks
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <span className="text-[11px] uppercase tracking-label text-slate">Competitive pressure</span>
          <PressureBadge level={talentPool.competitivePressure} />
        </div>

        <div className="mt-6">
          <p className="text-[11px] font-semibold uppercase tracking-label text-slate mb-2">Key risks</p>
          <ul className="space-y-1.5">
            {topRisks.map((risk) => (
              <li key={risk.id} className="flex items-center gap-2 text-[13.5px] text-ink-soft">
                <SeverityBadge severity={risk.severity} />
                {risk.title}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6">
          <p className="text-[11px] font-semibold uppercase tracking-label text-slate mb-2">
            Three decisions leadership must make
          </p>
          <ol className="space-y-1.5">
            {chroBrief.leadershipDecisions.map((d, i) => (
              <li key={d} className="flex gap-2 text-[13.5px] leading-relaxed text-ink-soft">
                <span className="text-slate-light">{i + 1}.</span> {d}
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-label text-slate mb-1.5">
              Recommended ownership model
            </p>
            <p className="text-[13.5px] leading-relaxed text-ink-soft">{chroBrief.recommendedOwnershipModel}</p>
          </div>
        </div>

        <p className="mt-7 border-t border-border pt-5 font-serif-display text-[16px] italic leading-relaxed text-accent-strong">
          {chroBrief.concludingLine}
        </p>
      </div>
    </ReportSection>
  );
}
