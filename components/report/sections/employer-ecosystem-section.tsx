"use client";

import { useState } from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  Cell,
} from "recharts";
import { ReportSection } from "@/components/report/report-section";
import { InsightPanel } from "@/components/shared/insight-panel";
import { PressureBadge } from "@/components/shared/status-badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { formatNumber } from "@/lib/formatters";
import type { EmployerCategory, EmployerIntelligence } from "@/lib/types";

const CATEGORIES: EmployerCategory[] = ["Core target", "Emerging source", "Overfished", "Underexplored"];

const CATEGORY_COLOR: Record<EmployerCategory, string> = {
  "Core target": "#0e5c4b",
  "Emerging source": "#3fa88a",
  Overfished: "#9a2f2f",
  Underexplored: "#a8631a",
};

function EmployerTooltip({ active, payload }: { active?: boolean; payload?: Array<{ payload: EmployerIntelligence }> }) {
  if (!active || !payload?.length) return null;
  const e = payload[0].payload;
  return (
    <div className="max-w-[240px] border border-border-strong bg-ink px-3.5 py-2.5 text-[12.5px] text-paper shadow-lg">
      <p className="font-semibold">{e.name}</p>
      <p className="mt-0.5 text-stone-100/70">{e.category}</p>
      <p className="mt-1.5 text-stone-100/85">
        Relevance {e.talentRelevance} &middot; Recruitability {e.recruitability}
      </p>
      <p className="mt-1 text-stone-100/85">~{formatNumber(e.estimatedPopulation)} relevant profiles</p>
    </div>
  );
}

function EmployerCard({ employer }: { employer: EmployerIntelligence }) {
  return (
    <div className="border border-border p-4">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[14px] font-medium text-ink">{employer.name}</p>
        <span
          className="text-[10.5px] font-semibold uppercase tracking-label px-1.5 py-0.5"
          style={{
            color: CATEGORY_COLOR[employer.category],
            border: `1px solid ${CATEGORY_COLOR[employer.category]}40`,
          }}
        >
          {employer.recommendedPriority}
        </span>
      </div>
      <dl className="mt-3 grid grid-cols-2 gap-y-2 text-[12px]">
        <dt className="text-slate-light">Relevant population</dt>
        <dd className="text-right text-ink-soft numeric">~{formatNumber(employer.estimatedPopulation)}</dd>
        <dt className="text-slate-light">Median tenure</dt>
        <dd className="text-right text-ink-soft numeric">{employer.medianTenureYears} yrs</dd>
        <dt className="text-slate-light">Movement likelihood</dt>
        <dd className="text-right"><PressureBadge level={employer.movementLikelihood} /></dd>
        <dt className="text-slate-light">Comp pressure</dt>
        <dd className="text-right"><PressureBadge level={employer.compensationPressure} /></dd>
        <dt className="text-slate-light">Recruiter competition</dt>
        <dd className="text-right"><PressureBadge level={employer.recruiterCompetition} /></dd>
        <dt className="text-slate-light">Cultural transfer</dt>
        <dd className="text-right text-ink-soft">{employer.culturalTransferability}</dd>
      </dl>
    </div>
  );
}

export function EmployerEcosystemSection({
  employers,
  insight,
}: {
  employers: EmployerIntelligence[];
  insight: string;
}) {
  const [activeCategory, setActiveCategory] = useState<EmployerCategory>("Core target");

  return (
    <ReportSection
      id="employer-ecosystem"
      eyebrow="Employer Ecosystem"
      title="Not every obvious target is a good target."
      description="Talent relevance measures how much of the profile an employer produces. Recruitability measures how likely those candidates are to actually respond."
    >
      <div className="h-72 w-full sm:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 10, right: 20, bottom: 10, left: 0 }}>
            <XAxis
              type="number"
              dataKey="talentRelevance"
              domain={[0, 100]}
              name="Talent relevance"
              tick={{ fill: "#5b6660", fontSize: 11.5 }}
              axisLine={{ stroke: "#ddd6c9" }}
              tickLine={false}
              label={{ value: "Talent relevance →", position: "insideBottomRight", fill: "#838d86", fontSize: 11, dy: 10 }}
            />
            <YAxis
              type="number"
              dataKey="recruitability"
              domain={[0, 100]}
              name="Recruitability"
              tick={{ fill: "#5b6660", fontSize: 11.5 }}
              axisLine={{ stroke: "#ddd6c9" }}
              tickLine={false}
              label={{ value: "Recruitability →", angle: -90, position: "insideLeft", fill: "#838d86", fontSize: 11 }}
            />
            <ZAxis type="number" dataKey="estimatedPopulation" range={[40, 260]} />
            <ReferenceLine x={50} stroke="#ddd6c9" />
            <ReferenceLine y={50} stroke="#ddd6c9" />
            <RechartsTooltip content={<EmployerTooltip />} />
            <Scatter data={employers} fillOpacity={0.8}>
              {employers.map((e) => (
                <Cell key={e.id} fill={CATEGORY_COLOR[e.category]} />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1.5">
        {CATEGORIES.map((cat) => (
          <span key={cat} className="flex items-center gap-1.5 text-[11.5px] text-slate">
            <span className="h-2 w-2 rounded-full" style={{ background: CATEGORY_COLOR[cat] }} />
            {cat}
          </span>
        ))}
      </div>

      <div className="mt-10">
        <Tabs value={activeCategory} onValueChange={(v) => setActiveCategory(v as EmployerCategory)}>
          <TabsList className="flex-wrap">
            {CATEGORIES.map((cat) => (
              <TabsTrigger key={cat} value={cat}>
                {cat} ({employers.filter((e) => e.category === cat).length})
              </TabsTrigger>
            ))}
          </TabsList>
          {CATEGORIES.map((cat) => (
            <TabsContent key={cat} value={cat}>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {employers
                  .filter((e) => e.category === cat)
                  .map((employer) => (
                    <EmployerCard key={employer.id} employer={employer} />
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>

      <InsightPanel className="mt-8">{insight}</InsightPanel>
    </ReportSection>
  );
}
