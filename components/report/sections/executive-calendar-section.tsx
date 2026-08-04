"use client";

import { motion } from "framer-motion";
import { SectionHeading } from "@/components/shared/section-heading";
import { InfoTooltip } from "@/components/shared/info-tooltip";
import { cn } from "@/lib/utils";
import type { CalendarUtilization } from "@/lib/types";

type BlockType = "interview" | "rejected" | "declined";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const DISPLAY_CAP = 25;

function buildDisplayBlocks(util: CalendarUtilization): BlockType[] {
  const total = Math.max(1, util.totalBlocks);
  const scale = total > DISPLAY_CAP ? DISPLAY_CAP / total : 1;

  const interview = Math.max(0, Math.round(util.interviewBlocks * scale));
  const rejected = Math.max(0, Math.round(util.rejectedBlocks * scale));
  const declined = Math.max(0, Math.round(util.offerDeclinedBlocks * scale));

  const blocks: BlockType[] = [];
  for (let i = 0; i < interview; i++) blocks.push("interview");
  for (let i = 0; i < rejected; i++) blocks.push("rejected");
  for (let i = 0; i < declined; i++) blocks.push("declined");
  return blocks.length > 0 ? blocks : ["interview"];
}

function distributeAcrossDays(blocks: BlockType[]): BlockType[][] {
  const columns: BlockType[][] = DAYS.map(() => []);
  blocks.forEach((block, i) => columns[i % DAYS.length].push(block));
  return columns;
}

const BLOCK_STYLE: Record<BlockType, { className: string; label: string }> = {
  interview: { className: "border-border-strong bg-stone-100 text-slate", label: "Interview" },
  rejected: { className: "border-red/30 bg-red-soft text-red", label: "Rejected Candidate" },
  declined: { className: "border-orange/30 bg-orange-soft text-orange", label: "Offer Declined" },
};

export function ExecutiveCalendarSection({ util }: { util: CalendarUtilization }) {
  const blocks = buildDisplayBlocks(util);
  const columns = distributeAcrossDays(blocks);

  return (
    <section className="border-b border-border py-16 sm:py-20">
      <div className="mx-auto max-w-4xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="The Executive Calendar"
          title="What one hiring week looks like on a leader's calendar."
          description="A proportional sample of your actual interview load, spread across a five-day week, not a literal schedule."
        />

        <div className="mt-10 grid grid-cols-5 gap-3">
          {columns.map((column, dayIndex) => (
            <div key={DAYS[dayIndex]}>
              <p className="text-center text-[11px] font-semibold uppercase tracking-label text-slate-light">
                {DAYS[dayIndex]}
              </p>
              <div className="mt-2 space-y-1.5">
                {column.map((block, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: (dayIndex * column.length + i) * 0.03 }}
                    className={cn(
                      "border px-1.5 py-2.5 text-center text-[10px] font-medium leading-tight sm:text-[11px]",
                      BLOCK_STYLE[block].className
                    )}
                  >
                    {BLOCK_STYLE[block].label}
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2">
          {(Object.keys(BLOCK_STYLE) as BlockType[]).map((type) => (
            <span key={type} className="flex items-center gap-1.5 text-[11.5px] text-slate">
              <span className={cn("h-2.5 w-2.5 border", BLOCK_STYLE[type].className)} />
              {BLOCK_STYLE[type].label}
            </span>
          ))}
        </div>

        <p className="mt-8 flex max-w-lg items-start gap-2 font-serif-display text-[19px] italic leading-relaxed text-ink">
          {util.wastedPercent}% of these calendar blocks never resulted in a hire.
          <InfoTooltip className="mt-1.5">
            The share of interview blocks that ended in a rejection or a declined offer, instead
            of a hire.
          </InfoTooltip>
        </p>
      </div>
    </section>
  );
}
