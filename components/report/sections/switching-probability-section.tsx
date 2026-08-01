"use client";

import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip as RechartsTooltip } from "recharts";
import { Clock } from "lucide-react";
import { ReportSection } from "@/components/report/report-section";
import type { SwitchingCurvePoint, SwitchingSignal } from "@/lib/types";

function ChartTooltip({ active, payload }: { active?: boolean; payload?: Array<{ payload: SwitchingCurvePoint }> }) {
  if (!active || !payload?.length) return null;
  const point = payload[0].payload;
  return (
    <div className="border border-border-strong bg-ink px-3.5 py-2.5 text-[12.5px] text-paper shadow-lg max-w-[220px]">
      <p className="font-semibold">{point.tenureBand}</p>
      <p className="mt-0.5 text-stone-100/85">Switching probability: {point.level}</p>
      {point.note && <p className="mt-1 text-stone-100/70">{point.note}</p>}
    </div>
  );
}

export function SwitchingProbabilitySection({
  signals,
  curve,
  bestWindow,
}: {
  signals: SwitchingSignal[];
  curve: SwitchingCurvePoint[];
  bestWindow: string;
}) {
  return (
    <ReportSection
      id="switching-probability"
      navGroupId="talent-movement"
      bordered
      eyebrow="Switching Probability"
      title="When this segment is most likely to consider a move."
      description="Senior candidates rarely move because they suddenly become “active.” They move when professional, organisational, and personal timing signals align."
    >
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1fr]">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-label text-slate mb-3">
            Signals that precede a move
          </p>
          <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {signals.map((signal) => (
              <li
                key={signal.id}
                className="flex items-start gap-2 border-l-2 border-border-strong pl-3 text-[13px] leading-snug text-ink-soft"
              >
                {signal.signal}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-[11px] font-semibold uppercase tracking-label text-slate mb-3">
            Switching probability by tenure
          </p>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={curve} margin={{ left: -20, right: 10, top: 10 }}>
                <defs>
                  <linearGradient id="switchGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0e5c4b" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#0e5c4b" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="tenureBand"
                  tick={{ fill: "#5b6660", fontSize: 11.5 }}
                  tickLine={false}
                  axisLine={{ stroke: "#ddd6c9" }}
                />
                <YAxis hide domain={[0, 100]} />
                <RechartsTooltip content={<ChartTooltip />} />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#0e5c4b"
                  strokeWidth={2}
                  fill="url(#switchGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-5 flex items-start gap-3 border border-accent/25 bg-accent-mist p-4">
            <Clock className="h-4 w-4 shrink-0 mt-0.5 text-accent-strong" aria-hidden />
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-label text-accent-strong">
                Best Engagement Window
              </p>
              <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-soft">{bestWindow}</p>
            </div>
          </div>
        </div>
      </div>
    </ReportSection>
  );
}
