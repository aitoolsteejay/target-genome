"use client";

import { motion } from "framer-motion";

interface DayBlock {
  time: string;
  label: string;
}

const MONDAY: DayBlock[] = [
  { time: "9–10", label: "Interview" },
  { time: "10–11", label: "Interview" },
  { time: "2–3", label: "Interview" },
  { time: "4–5", label: "Interview" },
];

const TUESDAY: DayBlock[] = [
  { time: "9–10", label: "Interview" },
  { time: "11–12", label: "Interview" },
  { time: "1–2", label: "Interview" },
  { time: "3–4", label: "Interview" },
];

function DayColumn({ day, blocks, startDelay }: { day: string; blocks: DayBlock[]; startDelay: number }) {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-label text-slate-light">{day}</p>
      <div className="mt-2.5 space-y-1.5">
        {blocks.map((block, i) => (
          <motion.div
            key={`${day}-${i}`}
            initial={{ opacity: 1 }}
            animate={{ opacity: [1, 1, 0.12, 1] }}
            transition={{
              duration: 3.2,
              delay: startDelay + i * 0.35,
              repeat: Infinity,
              repeatDelay: 2.5,
              times: [0, 0.55, 0.75, 1],
            }}
            className="flex items-center gap-2 border border-border-strong bg-paper-raised px-2.5 py-2"
          >
            <span className="numeric text-[10.5px] text-slate-light shrink-0 w-9">{block.time}</span>
            <span className="text-[12px] font-medium text-ink-soft">{block.label}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export function CalendarLeakVisual() {
  return (
    <div className="relative border border-border-strong bg-paper-raised shadow-[0_1px_2px_rgba(28,26,23,0.04),0_16px_48px_-24px_rgba(28,26,23,0.25)]">
      <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
        <span className="text-[11px] font-semibold uppercase tracking-label text-slate">
          This Week: Hiring Manager
        </span>
      </div>

      <div className="grid grid-cols-2 gap-6 p-5 sm:p-7">
        <DayColumn day="Monday" blocks={MONDAY} startDelay={0} />
        <DayColumn day="Tuesday" blocks={TUESDAY} startDelay={0.7} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: [0, 0, 1, 1, 0], y: 0 }}
        transition={{ duration: 5.7, delay: 2.4, repeat: Infinity, repeatDelay: 0, times: [0, 0.28, 0.4, 0.85, 1] }}
        className="absolute inset-x-5 bottom-5 border border-accent/30 bg-accent-mist px-4 py-3 sm:inset-x-7"
      >
        <p className="text-[13px] font-medium text-accent-strong">
          Only 1 candidate reached offer.
        </p>
      </motion.div>
    </div>
  );
}
