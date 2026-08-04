"use client";

import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface InfoTooltipProps {
  children: React.ReactNode;
  label?: string;
  className?: string;
}

/**
 * A small "i" icon that reveals an explanation on hover/focus. Drop this
 * next to any metric, label, or control whose meaning isn't obvious at a
 * glance.
 */
export function InfoTooltip({ children, label = "What does this mean?", className }: InfoTooltipProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          aria-label={label}
          className={cn(
            "print-hide inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-slate-light transition-colors hover:text-accent-strong",
            className
          )}
        >
          <Info className="h-3.5 w-3.5" />
        </button>
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-[260px]">
        {children}
      </TooltipContent>
    </Tooltip>
  );
}
