"use client";

import Link from "next/link";
import { Printer, ArrowLeft } from "lucide-react";
import { useReportStore } from "@/lib/report-store";
import { Button } from "@/components/ui/button";
import { Disclaimer } from "@/components/shared/disclaimer";
import { PressureBadge, SeverityBadge } from "@/components/shared/status-badge";
import { computeScenarioOutput } from "@/lib/calculations";
import { formatDate } from "@/lib/formatters";

export default function CHROBriefPage() {
  const { report, hydrated } = useReportStore();

  if (hydrated && !report) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="text-slate">No report is currently loaded in this session.</p>
        <Button asChild variant="accent">
          <Link href="/generate">Generate a Talent Genome</Link>
        </Button>
      </div>
    );
  }

  if (!report) return null;

  const { brief, talentPool, chroBrief, risks, metadata, scenarioBaseline } = report;
  const output = computeScenarioOutput(scenarioBaseline, scenarioBaseline.assumptions);
  const topRisks = risks.filter((r) => r.severity === "Critical" || r.severity === "High").slice(0, 3);

  return (
    <div className="min-h-screen bg-paper">
      <div className="print-hide sticky top-0 z-10 flex items-center justify-between border-b border-border bg-paper px-6 py-3">
        <Button variant="ghost" size="sm" onClick={() => history.back()}>
          <ArrowLeft className="h-3.5 w-3.5" /> Back to report
        </Button>
        <Button variant="accent" size="sm" onClick={() => window.print()}>
          <Printer className="h-3.5 w-3.5" /> Print / Save as PDF
        </Button>
      </div>

      <main className="mx-auto max-w-[720px] px-8 py-10 sm:px-12">
        <div className="flex items-center justify-between border-b-2 border-ink pb-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 items-center justify-center border border-ink text-[11px] font-serif-display font-semibold">
              TG
            </span>
            <span className="font-serif-display text-[16px] text-ink">Talent Genome</span>
          </div>
          <span className="text-[11px] font-semibold uppercase tracking-label text-red">
            Confidential — Internal Circulation
          </span>
        </div>

        <h1 className="mt-6 font-serif-display text-[26px] leading-tight text-ink">
          CHRO Brief — {brief.role.title}
        </h1>
        <p className="mt-1 text-[13px] text-slate">
          {brief.role.location} &middot; {brief.role.experienceMin}–{brief.role.experienceMax} years &middot;{" "}
          {brief.role.industryPreference} &middot; Generated {formatDate(metadata.generatedOn)}
        </p>

        <div className="mt-6 grid grid-cols-2 gap-4 border border-border p-5 sm:grid-cols-4">
          <div>
            <p className="text-[10.5px] uppercase tracking-label text-slate">Real talent pool</p>
            <p className="mt-1 font-serif-display text-xl text-ink numeric">
              {talentPool.technicallyRelevant.toLocaleString("en-IN")}
            </p>
          </div>
          <div>
            <p className="text-[10.5px] uppercase tracking-label text-slate">Recruitable pool</p>
            <p className="mt-1 font-serif-display text-xl text-accent-strong numeric">
              {talentPool.realisticallyRecruitable.toLocaleString("en-IN")}
            </p>
          </div>
          <div>
            <p className="text-[10.5px] uppercase tracking-label text-slate">Search difficulty</p>
            <p className="mt-1 text-[13px] font-medium text-ink-soft">{output.searchDifficulty}</p>
          </div>
          <div>
            <p className="text-[10.5px] uppercase tracking-label text-slate">Time to close</p>
            <p className="mt-1 text-[13px] font-medium text-ink-soft">
              {talentPool.searchWindowWeeksMin}–{talentPool.searchWindowWeeksMax} wks
            </p>
          </div>
        </div>

        <div className="mt-5 flex items-center gap-3">
          <span className="text-[11px] uppercase tracking-label text-slate">Competitive pressure</span>
          <PressureBadge level={talentPool.competitivePressure} />
        </div>

        <div className="mt-6">
          <p className="text-[11px] font-semibold uppercase tracking-label text-slate mb-2">Key risks</p>
          <ul className="space-y-1.5">
            {topRisks.map((risk) => (
              <li key={risk.id} className="flex items-center gap-2 text-[13px] text-ink-soft">
                <SeverityBadge severity={risk.severity} /> {risk.title}
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
              <li key={d} className="flex gap-2 text-[13px] leading-relaxed text-ink-soft">
                <span className="text-slate-light">{i + 1}.</span> {d}
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-6">
          <p className="text-[11px] font-semibold uppercase tracking-label text-slate mb-1.5">
            Recommended ownership model
          </p>
          <p className="text-[13px] leading-relaxed text-ink-soft">{chroBrief.recommendedOwnershipModel}</p>
        </div>

        <p className="mt-6 border-t border-border pt-5 font-serif-display text-[15px] italic leading-relaxed text-accent-strong">
          {chroBrief.concludingLine}
        </p>

        <div className="mt-8 border-t border-border pt-4">
          <p className="text-[10.5px] font-semibold uppercase tracking-label text-slate-light mb-1.5">
            Brief input assumptions
          </p>
          <p className="text-[11.5px] leading-relaxed text-slate-light">
            {brief.role.primarySkill}
            {brief.role.secondarySkills.length > 0 ? `, ${brief.role.secondarySkills.join(", ")}` : ""} &middot;{" "}
            {brief.role.remotePolicy} &middot; ₹{brief.offerProcess.compMinLakh}–{brief.offerProcess.compMaxLakh}L
            &middot; {brief.offerProcess.interviewRounds} interview rounds &middot; {brief.offerProcess.noticePeriodDays}-day
            notice period
          </p>
        </div>

        <div className="mt-6">
          <Disclaimer />
        </div>

        <div className="mt-6 flex justify-between text-[10.5px] text-slate-light">
          <span>{metadata.reportId}</span>
          <span>Page 1 of 1</span>
        </div>
      </main>
    </div>
  );
}
