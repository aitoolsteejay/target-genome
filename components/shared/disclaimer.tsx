import { cn } from "@/lib/utils";

export function Disclaimer({ className }: { className?: string }) {
  return (
    <p className={cn("text-[12px] leading-relaxed text-slate-light", className)}>
      This tool uses illustrative assumptions about interview duration, preparation time, and
      leadership hourly value to demonstrate the Hiring Manager Time Leak experience. Production
      outputs should be calibrated against your organisation&apos;s actual interview process and
      compensation data.
    </p>
  );
}
