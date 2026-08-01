import { ArrowRight } from "lucide-react";
import { ReportSection } from "@/components/report/report-section";
import { TrendBadge } from "@/components/shared/status-badge";
import type { MigrationFlow } from "@/lib/types";

export function MigrationRadarSection({ flows }: { flows: MigrationFlow[] }) {
  return (
    <ReportSection
      id="talent-migration-radar"
      navGroupId="talent-movement"
      bordered={false}
      eyebrow="Talent Migration Radar"
      title="Where this segment is moving between employer categories."
      description="Simulated demo signal — directional patterns in how candidates move between employer types, not a live market feed."
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {flows.map((flow) => (
          <div key={flow.id} className="border border-border p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[13.5px] font-medium text-ink">
                <span>{flow.from}</span>
                <ArrowRight className="h-3.5 w-3.5 text-slate-light" aria-hidden />
                <span>{flow.to}</span>
              </div>
              <TrendBadge trend={flow.trend} />
            </div>
            <p className="mt-3 text-[13.5px] leading-relaxed text-slate">{flow.insight}</p>
          </div>
        ))}
      </div>
    </ReportSection>
  );
}
