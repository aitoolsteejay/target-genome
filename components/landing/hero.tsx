"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MiniReportPreview } from "@/components/landing/mini-report-preview";

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="mx-auto grid max-w-[1400px] gap-12 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:py-28">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-[11px] font-semibold uppercase tracking-label text-accent-strong"
          >
            Talent Intelligence, Before the Search
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="mt-5 font-serif-display text-[38px] leading-[1.1] text-ink sm:text-[48px] lg:text-[54px]"
          >
            Understand the people behind your talent pool.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12 }}
            className="mt-6 max-w-xl text-[16px] leading-relaxed text-slate sm:text-[17px]"
          >
            Enter a difficult role and uncover the career patterns, motivations, movement
            signals, competing employers, search risks, and hidden talent segments shaping your
            hiring market.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.18 }}
            className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <Button asChild size="lg" variant="accent">
              <Link href="/generate">
                Generate a Talent Genome
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/sample/principal-backend-engineer">Explore a Sample Report</Link>
            </Button>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 text-[13px] text-slate-light"
          >
            No sign-up required to view a sample. Full reports take under 10 seconds to generate.
          </motion.p>
        </div>

        <div className="lg:pt-4">
          <MiniReportPreview />
        </div>
      </div>
    </section>
  );
}
