import { AlertTriangle, TrendingUp, Minus, TrendingDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { MigrationTrend, PressureLevel, Severity } from "@/lib/types";

export function SeverityBadge({ severity }: { severity: Severity }) {
  const variant = severity === "Critical" ? "red" : severity === "High" ? "amber" : "neutral";
  return (
    <Badge variant={variant}>
      {severity === "Critical" && <AlertTriangle className="h-3 w-3" aria-hidden />}
      <span>{severity}</span>
    </Badge>
  );
}

export function PressureBadge({ level }: { level: PressureLevel }) {
  const variant = level === "Very high" ? "red" : level === "High" ? "amber" : "neutral";
  return <Badge variant={variant}>{level}</Badge>;
}

const trendIcon: Record<MigrationTrend, typeof TrendingUp> = {
  Rising: TrendingUp,
  Stable: Minus,
  Declining: TrendingDown,
};

export function TrendBadge({ trend }: { trend: MigrationTrend }) {
  const Icon = trendIcon[trend];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-[11px] font-medium tracking-label uppercase",
        trend === "Rising" && "text-accent-strong",
        trend === "Declining" && "text-red",
        trend === "Stable" && "text-slate"
      )}
    >
      <Icon className="h-3.5 w-3.5" aria-hidden />
      {trend}
    </span>
  );
}
