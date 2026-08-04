"use client";

import { useEffect, useRef } from "react";
import { useCalculatorStore } from "@/lib/calculator-store";
import { ReportView } from "@/components/report/report-view";

export default function ExampleReportPage() {
  const { report, loadExample, hydrated } = useCalculatorStore();
  const triggered = useRef(false);

  useEffect(() => {
    if (hydrated && !triggered.current) {
      triggered.current = true;
      loadExample();
    }
  }, [hydrated, loadExample]);

  if (!report) return <div className="min-h-screen bg-paper" />;

  return <ReportView report={report} />;
}
