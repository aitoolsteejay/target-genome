"use client";

import Link from "next/link";
import { SiteHeader } from "@/components/navigation/site-header";
import { SiteFooter } from "@/components/navigation/site-footer";
import { Button } from "@/components/ui/button";
import { useReportStore } from "@/lib/report-store";
import { ReportView } from "@/components/report/report-view";

export default function ReportPage() {
  const { report, isApproximateMatch, hydrated } = useReportStore();

  if (!hydrated) {
    return <div className="min-h-screen bg-paper" />;
  }

  if (!report) {
    return (
      <>
        <SiteHeader />
        <main className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-label text-accent-strong">
            No Report Loaded
          </p>
          <h1 className="mt-4 max-w-lg font-serif-display text-[26px] leading-tight text-ink">
            There isn&apos;t a Talent Genome in this session yet.
          </h1>
          <p className="mt-3 max-w-md text-[14.5px] leading-relaxed text-slate">
            Generate one from a role brief, or open a sample report to see the full experience.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Button asChild variant="accent" size="lg">
              <Link href="/generate">Generate a Talent Genome</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/sample/principal-backend-engineer">Explore a Sample Report</Link>
            </Button>
          </div>
        </main>
        <SiteFooter />
      </>
    );
  }

  return <ReportView report={report} isApproximateMatch={isApproximateMatch} />;
}
