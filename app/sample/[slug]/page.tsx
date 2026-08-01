"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { SiteHeader } from "@/components/navigation/site-header";
import { SiteFooter } from "@/components/navigation/site-footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ReportView } from "@/components/report/report-view";
import { useReportStore } from "@/lib/report-store";
import { SAMPLE_SEARCH_SUMMARIES, getSampleReport } from "@/data/sample-searches";

export default function SampleReportPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;
  const report = getSampleReport(slug);
  const { loadSample } = useReportStore();

  useEffect(() => {
    if (report) loadSample(report);
  }, [report, loadSample]);

  if (!report) {
    return (
      <>
        <SiteHeader />
        <main className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-label text-red">Not Found</p>
          <h1 className="mt-4 font-serif-display text-2xl text-ink">
            We don&apos;t have a sample report at this address.
          </h1>
          <div className="mt-7 flex flex-wrap justify-center gap-2">
            {SAMPLE_SEARCH_SUMMARIES.map((s) => (
              <Button key={s.slug} asChild variant="outline" size="sm">
                <Link href={`/sample/${s.slug}`}>{s.title}</Link>
              </Button>
            ))}
          </div>
        </main>
        <SiteFooter />
      </>
    );
  }

  const banner = (
    <div className="print-hide border-b border-border bg-accent-mist">
      <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-3 px-5 py-2.5 sm:px-8">
        <div className="flex items-center gap-2.5">
          <Badge variant="accent">Sample Report</Badge>
          <span className="text-[12.5px] text-ink-soft">
            Illustrative demo — switch samples below
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {SAMPLE_SEARCH_SUMMARIES.map((s) => (
            <Link
              key={s.slug}
              href={`/sample/${s.slug}`}
              className={
                s.slug === slug
                  ? "border border-accent bg-paper-raised px-2.5 py-1 text-[12px] font-medium text-accent-strong"
                  : "border border-transparent px-2.5 py-1 text-[12px] text-ink-soft hover:border-border-strong"
              }
            >
              {s.title}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );

  return <ReportView report={report} banner={banner} />;
}
