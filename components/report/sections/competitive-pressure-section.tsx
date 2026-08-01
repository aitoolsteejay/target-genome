import { ReportSection } from "@/components/report/report-section";
import { InsightPanel } from "@/components/shared/insight-panel";
import { Badge } from "@/components/ui/badge";
import type { CompetitiveEmployer } from "@/lib/types";

const INTENSITY_VARIANT = {
  Medium: "neutral",
  High: "amber",
  "Very high": "red",
  Rising: "amber",
} as const;

export function CompetitivePressureSection({
  employers,
  insight,
}: {
  employers: CompetitiveEmployer[];
  insight: string;
}) {
  return (
    <ReportSection
      id="competitive-pressure"
      eyebrow="Competitive Hiring Pressure"
      title="Who else is chasing the same candidates."
      description="Simulated demand pressure across the employers most actively competing for this exact segment right now."
    >
      <div className="overflow-x-auto scroll-thin">
        <table className="w-full min-w-[560px] border-collapse text-left text-[13.5px]">
          <thead>
            <tr className="border-b border-border-strong text-[11px] uppercase tracking-label text-slate">
              <th className="py-3 pr-4 font-semibold">Employer</th>
              <th className="py-3 pr-4 font-semibold">Hiring intensity</th>
              <th className="py-3 pr-4 font-semibold">Typical advantage</th>
              <th className="py-3 pr-4 font-semibold">Work model</th>
              <th className="py-3 pr-4 font-semibold">Process speed</th>
              <th className="py-3 font-semibold">Risk</th>
            </tr>
          </thead>
          <tbody>
            {employers.map((e) => (
              <tr key={e.id} className="border-b border-border">
                <td className="py-3.5 pr-4 font-medium text-ink">{e.name}</td>
                <td className="py-3.5 pr-4">
                  <Badge variant={INTENSITY_VARIANT[e.hiringIntensity]}>{e.hiringIntensity}</Badge>
                </td>
                <td className="py-3.5 pr-4 text-ink-soft">{e.typicalAdvantage}</td>
                <td className="py-3.5 pr-4 text-ink-soft">{e.workModel}</td>
                <td className="py-3.5 pr-4 text-ink-soft">{e.processSpeed}</td>
                <td className="py-3.5">
                  <Badge variant={e.risk === "High" ? "red" : e.risk === "Medium" ? "amber" : "neutral"}>
                    {e.risk}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <InsightPanel className="mt-8">{insight}</InsightPanel>
    </ReportSection>
  );
}
