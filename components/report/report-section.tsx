"use client";

import { useState, type ReactNode } from "react";
import { Minus, Plus } from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";
import { cn } from "@/lib/utils";

interface ReportSectionProps {
  id?: string;
  navGroupId?: string;
  eyebrow?: string;
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
  headerRight?: ReactNode;
  defaultOpen?: boolean;
  bordered?: boolean;
}

export function ReportSection({
  id,
  navGroupId,
  eyebrow,
  title,
  description,
  children,
  className,
  headerRight,
  defaultOpen = true,
  bordered = true,
}: ReportSectionProps) {
  const [open, setOpen] = useState(defaultOpen);
  const anchorId = navGroupId ?? id;

  return (
    <div
      id={anchorId}
      className={cn("scroll-mt-28 py-12 sm:py-14 print-avoid-break", bordered && "border-b border-border", className)}
    >
      <div className="flex items-start justify-between gap-6">
        <SectionHeading eyebrow={eyebrow} title={title} description={description} />
        <div className="flex shrink-0 items-center gap-3">
          {headerRight}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? `Collapse ${title}` : `Expand ${title}`}
            className="print-hide flex h-8 w-8 items-center justify-center border border-border-strong text-slate transition-colors hover:border-accent hover:text-accent-strong"
          >
            {open ? <Minus className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>

      <div className={cn("mt-9", !open && "hidden print:block")}>{children}</div>
    </div>
  );
}
