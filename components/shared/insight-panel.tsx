import { Sparkle } from "lucide-react";
import { cn } from "@/lib/utils";

interface InsightPanelProps {
  children: React.ReactNode;
  className?: string;
  tone?: "light" | "dark";
}

export function InsightPanel({ children, className, tone = "light" }: InsightPanelProps) {
  return (
    <div
      className={cn(
        "border-l-2 px-5 py-4 sm:px-6 sm:py-5",
        tone === "light"
          ? "border-accent bg-accent-mist text-ink-soft"
          : "border-accent bg-white/[0.04] text-stone-100",
        className
      )}
    >
      <div className="flex gap-3">
        <Sparkle
          className={cn("h-4 w-4 shrink-0 mt-1", tone === "light" ? "text-accent" : "text-accent")}
          aria-hidden
        />
        <p className="text-[15px] sm:text-base leading-relaxed font-serif-display italic">
          {children}
        </p>
      </div>
    </div>
  );
}
