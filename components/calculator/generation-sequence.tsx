"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Progress } from "@/components/ui/progress";

const STAGES = [
  "Reading hiring process",
  "Calculating interview effort",
  "Estimating leadership involvement",
  "Removing duplicate interview hours",
  "Estimating unsuitable interview ratio",
  "Measuring opportunity cost",
  "Comparing specialist recruitment benchmarks",
  "Building report",
];

const STAGE_DURATION_MS = 700;
const REASSURANCE_DELAY_MS = 5000;

interface Node {
  x: number;
  y: number;
  delay: number;
}

function useNetworkNodes(count: number): Node[] {
  return useMemo(() => {
    const nodes: Node[] = [];
    const cols = 8;
    for (let i = 0; i < count; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);
      nodes.push({
        x: 6 + col * (88 / (cols - 1)),
        y: 8 + row * 16,
        delay: (col + row) * 0.06,
      });
    }
    return nodes;
  }, [count]);
}

/**
 * Purely presentational: it doesn't know when the real generation call
 * finishes. It advances through the stage messages and then holds on the
 * last one (with a reassurance line after a while) for as long as the
 * parent keeps it mounted. The parent unmounts it once the async
 * report-generation call resolves or fails.
 */
export function GenerationSequence() {
  const [stageIndex, setStageIndex] = useState(0);
  const [showReassurance, setShowReassurance] = useState(false);
  const reduceMotion = useReducedMotion();
  const nodes = useNetworkNodes(32);

  useEffect(() => {
    if (stageIndex >= STAGES.length - 1) return;
    const timer = setTimeout(() => setStageIndex((i) => i + 1), STAGE_DURATION_MS);
    return () => clearTimeout(timer);
  }, [stageIndex]);

  useEffect(() => {
    const timer = setTimeout(() => setShowReassurance(true), REASSURANCE_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  const progress = Math.min(96, ((stageIndex + 1) / STAGES.length) * 100);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-charcoal px-6">
      <div className="w-full max-w-md">
        <p className="text-center text-[11px] font-semibold uppercase tracking-label text-stone-100/45">
          Calculating Your Time Leak
        </p>

        <div className="relative mx-auto mt-10 h-40 w-full max-w-sm">
          <svg viewBox="0 0 100 60" className="h-full w-full overflow-visible" aria-hidden>
            {!reduceMotion &&
              nodes.slice(0, -1).map((node, i) => {
                const next = nodes[i + 1];
                if (!next || (i + 1) % 8 === 0) return null;
                return (
                  <motion.line
                    key={`line-${i}`}
                    x1={node.x}
                    y1={node.y}
                    x2={next.x}
                    y2={next.y}
                    stroke="rgba(232,239,236,0.12)"
                    strokeWidth={0.3}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 0.6, 0.1] }}
                    transition={{ duration: 2, delay: node.delay, repeat: Infinity, repeatDelay: 1 }}
                  />
                );
              })}
            {nodes.map((node, i) => (
              <motion.circle
                key={`node-${i}`}
                cx={node.x}
                cy={node.y}
                r={0.9}
                fill="#2f9a6f"
                initial={{ opacity: 0.15, scale: 0.6 }}
                animate={
                  reduceMotion
                    ? { opacity: 0.5 }
                    : { opacity: [0.15, 1, 0.35], scale: [0.6, 1.15, 0.8] }
                }
                transition={{
                  duration: 2.2,
                  delay: node.delay,
                  repeat: reduceMotion ? 0 : Infinity,
                  repeatDelay: 0.6,
                }}
              />
            ))}
          </svg>
        </div>

        <div className="mt-8">
          <Progress value={progress} aria-label="Calculation progress" />
          <div className="mt-2 flex justify-between text-[11px] text-stone-100/40">
            <span>
              Step {Math.min(stageIndex + 1, STAGES.length)} of {STAGES.length}
            </span>
            <span>{Math.round(progress)}%</span>
          </div>
        </div>

        <div className="mt-6 h-7">
          <AnimatePresence mode="wait">
            <motion.p
              key={stageIndex}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
              className="text-center text-[14.5px] text-stone-100"
              aria-live="polite"
            >
              {STAGES[stageIndex]}…
            </motion.p>
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {showReassurance && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 text-center text-[12.5px] text-stone-100/45"
            >
              Writing a tailored summary takes a little longer than the maths. Still working.
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
