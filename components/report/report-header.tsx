"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Download, Printer, Share2, SquarePen, MessageCircle, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/formatters";
import { classifyBriefBreadth } from "@/lib/calculations";
import type { TalentGenomeReport } from "@/lib/types";

interface ReportHeaderProps {
  report: TalentGenomeReport;
  isApproximateMatch?: boolean;
}

export function ReportHeader({ report, isApproximateMatch }: ReportHeaderProps) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const { brief, metadata, talentPool } = report;

  const breadth = classifyBriefBreadth(brief);

  function handleShare() {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  }

  function scrollToLeadCapture() {
    document.getElementById("expert-review")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <header className="border-b border-border pb-10 pt-10 sm:pt-14">
      <div className="flex flex-wrap items-center gap-2.5">
        <Badge variant="red">Confidential Talent Intelligence Brief</Badge>
        <span className="text-[12px] text-slate-light">
          Report {metadata.reportId} &middot; Generated {formatDate(metadata.generatedOn)}
        </span>
      </div>

      <p className="mt-6 text-[11px] font-semibold uppercase tracking-label text-accent-strong">
        Talent Genome
      </p>
      <h1 className="mt-2 font-serif-display text-[32px] leading-[1.15] text-ink sm:text-[42px]">
        {brief.role.title}
      </h1>
      <p className="mt-2 text-[15px] text-slate">
        {brief.role.primarySkill}
        {brief.role.secondarySkills.length > 0 ? `, ${brief.role.secondarySkills.join(" and ")}` : ""}
      </p>

      <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-2 text-[13.5px]">
        <div className="flex gap-1.5">
          <dt className="text-slate-light">Location</dt>
          <dd className="text-ink-soft font-medium">{brief.role.location || "Remote — India"}</dd>
        </div>
        <div className="flex gap-1.5">
          <dt className="text-slate-light">Experience</dt>
          <dd className="text-ink-soft font-medium">
            {brief.role.experienceMin}–{brief.role.experienceMax} years
          </dd>
        </div>
        <div className="flex gap-1.5">
          <dt className="text-slate-light">Industry</dt>
          <dd className="text-ink-soft font-medium">{brief.role.industryPreference}</dd>
        </div>
        <div className="flex gap-1.5">
          <dt className="text-slate-light">Work model</dt>
          <dd className="text-ink-soft font-medium">{brief.role.remotePolicy}</dd>
        </div>
      </dl>

      <div className="print-hide mt-7 flex flex-wrap gap-2.5">
        <Button size="sm" variant="outline" onClick={() => window.print()}>
          <Download className="h-3.5 w-3.5" aria-hidden />
          Download PDF
        </Button>
        <Button size="sm" variant="outline" onClick={() => window.print()}>
          <Printer className="h-3.5 w-3.5" aria-hidden />
          Print
        </Button>
        <Button size="sm" variant="outline" onClick={handleShare}>
          {copied ? <Check className="h-3.5 w-3.5" aria-hidden /> : <Share2 className="h-3.5 w-3.5" aria-hidden />}
          {copied ? "Link copied" : "Share Report"}
        </Button>
        <Button size="sm" variant="outline" onClick={() => router.push("/generate")}>
          <SquarePen className="h-3.5 w-3.5" aria-hidden />
          Edit Search
        </Button>
        <Button size="sm" variant="accent" onClick={scrollToLeadCapture}>
          <MessageCircle className="h-3.5 w-3.5" aria-hidden />
          Request Expert Review
        </Button>
      </div>

      {isApproximateMatch && (
        <p className="mt-6 text-[12.5px] text-amber">
          This exact combination sits outside our current sample intelligence set. The figures
          below show the closest comparable market as a proxy — treat magnitudes as directional.
        </p>
      )}

      {breadth === "narrow" && (
        <p className="mt-6 text-[12.5px] text-red">
          This brief creates an unusually narrow market. Consider reviewing which requirements are
          genuinely non-negotiable.
        </p>
      )}
      {breadth === "broad" && (
        <p className="mt-6 text-[12.5px] text-amber">
          This market is large, but the current brief may not differentiate high-potential
          candidates from technically relevant ones.
        </p>
      )}

      <p className="mt-8 max-w-3xl text-[15.5px] leading-relaxed text-ink-soft">
        This is a technically relevant market of approximately {talentPool.technicallyRelevant.toLocaleString("en-IN")} people. However, after
        accounting for career stage, compensation, tenure, location, work model, recent movement,
        and competitive demand, the realistically recruitable market is closer to{" "}
        {talentPool.realisticallyRecruitable} candidates.
      </p>

      <p className="mt-4 max-w-3xl font-serif-display text-[17px] italic leading-relaxed text-accent-strong">
        The challenge is not talent availability. It is gaining the attention of the right{" "}
        {talentPool.briefCoveragePercent}% before competing employers do.
      </p>
    </header>
  );
}
