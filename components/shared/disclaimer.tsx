import { cn } from "@/lib/utils";

export function Disclaimer({ className }: { className?: string }) {
  return (
    <p className={cn("text-[12px] leading-relaxed text-slate-light", className)}>
      This prototype uses simulated market intelligence to demonstrate the Talent Genome
      experience. Production outputs should be generated using validated internal search data,
      licensed talent-market datasets, candidate conversations, and approved third-party sources.
    </p>
  );
}
