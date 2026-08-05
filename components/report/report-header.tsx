"use client";

import Image from "next/image";
import Link from "next/link";
import { Download, SquarePen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatedCounter } from "@/components/shared/animated-counter";
import { InfoTooltip } from "@/components/shared/info-tooltip";
import type { TimeLeakReport } from "@/lib/types";

export function ReportHeader({ report }: { report: TimeLeakReport }) {
  const { input, totalLeadershipHours, workingDaysEquivalent, weeksEquivalent, generatedOn } = report;

  const generatedLabel = new Date(generatedOn).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <header className="border-b border-border pb-12 pt-12 text-center sm:pt-16">
      <p className="print-only mb-8 flex items-center justify-between border-b border-border pb-4 text-left text-[12px] text-slate">
        <span className="flex items-center gap-2 font-serif-display text-[15px] text-ink">
          <Image src="/antal-logo.jpg" alt="" width={18} height={18} className="rounded-full" />
          Hiring Manager Time Leak &middot; By Antal
        </span>
        <span>{generatedLabel}</span>
      </p>

      <p className="text-[11px] font-semibold uppercase tracking-label text-accent-strong">
        {input.role || "This role"} &middot; {input.hiresNeeded} {input.hiresNeeded === 1 ? "hire" : "hires"}
      </p>

      <h1 className="mx-auto mt-5 max-w-3xl font-serif-display text-[28px] leading-[1.25] text-ink sm:text-[34px]">
        Your Hiring Process Consumes
      </h1>
      <p className="mt-2 font-serif-display text-[64px] leading-none text-accent-strong numeric sm:text-[92px]">
        <AnimatedCounter value={totalLeadershipHours} duration={1.4} />
      </p>
      <p className="mt-1 flex items-center justify-center gap-1.5 font-serif-display text-[24px] text-ink sm:text-[28px]">
        Leadership Hours
        <InfoTooltip>
          The total time your Hiring Manager and any leaders involved spent on this hiring
          process: reviewing resumes, coordinating, interviewing, writing feedback, and dealing
          with rejections or declined offers.
        </InfoTooltip>
      </p>

      <p className="mx-auto mt-6 max-w-md text-[15px] leading-relaxed text-slate">
        Equivalent to <span className="font-semibold text-ink-soft">{workingDaysEquivalent} full working days</span>{" "}
        or <span className="font-semibold text-ink-soft">{weeksEquivalent} weeks</span> of senior leadership time.
      </p>

      <div className="print-hide mt-8 flex flex-wrap justify-center gap-3">
        <Button variant="outline" size="sm" asChild>
          <Link href="/calculate">
            <SquarePen className="h-3.5 w-3.5" />
            Edit Inputs
          </Link>
        </Button>
        <Button variant="accent" size="sm" onClick={() => window.print()}>
          <Download className="h-3.5 w-3.5" />
          Download PDF
        </Button>
      </div>
    </header>
  );
}
