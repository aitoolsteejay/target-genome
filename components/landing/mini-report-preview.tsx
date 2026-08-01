"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Minus } from "lucide-react";
import { AnimatedCounter } from "@/components/shared/animated-counter";
import { Badge } from "@/components/ui/badge";

export function MiniReportPreview() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
      className="relative border border-border-strong bg-paper-raised shadow-[0_1px_2px_rgba(20,32,28,0.04),0_16px_48px_-24px_rgba(20,32,28,0.25)]"
    >
      <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
        <span className="text-[11px] font-semibold uppercase tracking-label text-slate">
          Talent Genome — Preview
        </span>
        <Badge variant="dark" className="!border-red/30 !text-red !bg-red-soft">
          Confidential
        </Badge>
      </div>

      <div className="px-5 pt-5 sm:px-7 sm:pt-6">
        <h3 className="font-serif-display text-xl text-ink">Principal Backend Engineer</h3>
        <p className="mt-1 text-[13px] text-slate">
          Bengaluru &middot; 10–15 years &middot; Java, AWS, Distributed Systems
        </p>
      </div>

      <div className="grid grid-cols-2 gap-px bg-border mt-6">
        <div className="bg-paper-raised px-5 py-5 sm:px-7">
          <p className="text-[11px] uppercase tracking-label text-slate">Estimated talent pool</p>
          <p className="mt-1.5 font-serif-display text-3xl text-ink numeric">
            <AnimatedCounter value={2340} />
          </p>
        </div>
        <div className="bg-paper-raised px-5 py-5 sm:px-7">
          <p className="text-[11px] uppercase tracking-label text-slate">Realistically recruitable</p>
          <p className="mt-1.5 font-serif-display text-3xl text-accent-strong numeric">
            <AnimatedCounter value={182} />
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-px bg-border">
        <div className="bg-paper-raised px-5 py-4 sm:px-7">
          <p className="text-[11px] uppercase tracking-label text-slate">Switching probability</p>
          <p className="mt-1.5 flex items-center gap-1.5 text-sm font-medium text-ink">
            <ArrowUpRight className="h-3.5 w-3.5 text-accent-strong" aria-hidden />
            Rising
          </p>
        </div>
        <div className="bg-paper-raised px-5 py-4 sm:px-7">
          <p className="text-[11px] uppercase tracking-label text-slate">Competitive pressure</p>
          <p className="mt-1.5 flex items-center gap-1.5 text-sm font-medium text-red">
            <Minus className="h-3.5 w-3.5 rotate-90" aria-hidden />
            Very high
          </p>
        </div>
      </div>

      <div className="border-t border-border bg-ink px-5 py-4 sm:px-7">
        <p className="text-[13px] leading-relaxed text-stone-100">
          <span className="font-semibold text-paper">63%</span> of successful hires for similar
          roles came from companies that were not included in the original target list.
        </p>
      </div>
    </motion.div>
  );
}
