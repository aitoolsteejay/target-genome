"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { REPORT_NAV_ITEMS } from "@/lib/report-nav-items";
import { useReportNavigation } from "@/hooks/use-report-navigation";
import { cn } from "@/lib/utils";

const IDS = REPORT_NAV_ITEMS.map((i) => i.id);

function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - 88;
  window.scrollTo({ top, behavior: "smooth" });
}

export function ReportNavDesktop() {
  const activeId = useReportNavigation(IDS);

  return (
    <nav
      aria-label="Report sections"
      className="print-hide sticky top-24 hidden max-h-[calc(100vh-7rem)] w-56 shrink-0 overflow-y-auto pb-10 lg:block"
    >
      <p className="mb-3 text-[11px] font-semibold uppercase tracking-label text-slate-light">
        Report Sections
      </p>
      <ul className="space-y-0.5 border-l border-border">
        {REPORT_NAV_ITEMS.map((item) => {
          const isActive = item.id === activeId;
          return (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => scrollToSection(item.id)}
                aria-current={isActive ? "true" : undefined}
                className={cn(
                  "block w-full border-l-2 py-1.5 pl-3.5 text-left text-[13px] leading-snug transition-colors",
                  isActive
                    ? "border-accent text-accent-strong font-medium"
                    : "border-transparent text-slate hover:text-ink"
                )}
              >
                {item.label}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export function ReportNavMobile() {
  const activeId = useReportNavigation(IDS);
  const [open, setOpen] = useState(false);
  const activeLabel = REPORT_NAV_ITEMS.find((i) => i.id === activeId)?.label ?? "Sections";

  return (
    <div className="print-hide sticky top-16 z-30 border-b border-border bg-paper/95 backdrop-blur-sm lg:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between px-5 py-3 text-sm font-medium text-ink"
      >
        <span>
          <span className="text-slate-light">Section: </span>
          {activeLabel}
        </span>
        <ChevronDown className={cn("h-4 w-4 text-slate transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <ul className="max-h-[60vh] overflow-y-auto border-t border-border bg-paper-raised px-2 py-2">
          {REPORT_NAV_ITEMS.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => {
                  scrollToSection(item.id);
                  setOpen(false);
                }}
                className={cn(
                  "block w-full rounded-none px-3 py-2.5 text-left text-sm",
                  item.id === activeId ? "text-accent-strong font-medium" : "text-ink-soft"
                )}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
