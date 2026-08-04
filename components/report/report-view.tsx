import { SiteHeader } from "@/components/navigation/site-header";
import { SiteFooter } from "@/components/navigation/site-footer";
import { ReportHeader } from "@/components/report/report-header";
import { TimelineSection } from "@/components/report/sections/timeline-section";
import { HiddenCostSection } from "@/components/report/sections/hidden-cost-section";
import { ExecutiveCalendarSection } from "@/components/report/sections/executive-calendar-section";
import { TimeLeakGraphSection } from "@/components/report/sections/time-leak-graph-section";
import { ComparisonSection } from "@/components/report/sections/comparison-section";
import { LossItemsSection } from "@/components/report/sections/loss-items-section";
import { WhatIfSection } from "@/components/report/sections/what-if-section";
import { ExecutiveSummarySection } from "@/components/report/sections/executive-summary-section";
import { LeadCaptureSection } from "@/components/report/lead-capture-section";
import { Disclaimer } from "@/components/shared/disclaimer";
import type { TimeLeakReport } from "@/lib/types";

export function ReportView({ report }: { report: TimeLeakReport }) {
  return (
    <>
      <SiteHeader />
      <main className="flex-1 bg-paper">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
          <ReportHeader report={report} />
        </div>

        <TimelineSection categories={report.categories} totalHours={report.totalLeadershipHours} />
        <HiddenCostSection totalHours={report.totalLeadershipHours} joins={report.input.joins} />
        <ExecutiveCalendarSection util={report.calendarUtilization} />
        <TimeLeakGraphSection stages={report.funnelStages} />
        <ComparisonSection comparison={report.comparison} />
        <LossItemsSection items={report.lossItems} />
        <WhatIfSection report={report} />
        <ExecutiveSummarySection summary={report.executiveSummary} />

        <div className="mx-auto max-w-[1400px] px-5 py-10 sm:px-8">
          <Disclaimer />
        </div>
      </main>
      <LeadCaptureSection defaultRole={report.input.role} />
      <SiteFooter />
    </>
  );
}
