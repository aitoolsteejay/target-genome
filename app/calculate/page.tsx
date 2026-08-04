"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, ArrowLeft, ArrowRight, RotateCcw } from "lucide-react";
import { SiteHeader } from "@/components/navigation/site-header";
import { SiteFooter } from "@/components/navigation/site-footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RoleStep } from "@/components/calculator/role-step";
import { VolumeStep } from "@/components/calculator/volume-step";
import { ProcessStep } from "@/components/calculator/process-step";
import { InterviewDetailsStep } from "@/components/calculator/interview-details-step";
import { LeadershipStep } from "@/components/calculator/leadership-step";
import { GenerationSequence } from "@/components/calculator/generation-sequence";
import { EXAMPLE_INPUT } from "@/data/example-input";
import { ReportGenerationError, useCalculatorStore } from "@/lib/calculator-store";
import type { CalculatorInput, LeadershipRoleKey } from "@/lib/types";

const STEPS = [
  { title: "Basic Information", description: "Which role are you hiring for?" },
  { title: "Hiring Volume", description: "How many people are you hiring for this role?" },
  { title: "Current Hiring Process", description: "Walk us through your existing funnel." },
  { title: "Interview Details", description: "How long does each stage actually take?" },
  { title: "Leadership Involvement", description: "Who spends time in the room?" },
];

function cloneInput(input: CalculatorInput): CalculatorInput {
  return JSON.parse(JSON.stringify(input));
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const MIN_GENERATION_DISPLAY_MS = 2200;

type Status = "form" | "generating" | "error";

export default function CalculatePage() {
  const router = useRouter();
  const { submitInput } = useCalculatorStore();
  const [input, setInput] = useState<CalculatorInput>(() => cloneInput(EXAMPLE_INPUT));
  const [step, setStep] = useState(0);
  const [status, setStatus] = useState<Status>("form");
  const [generationError, setGenerationError] = useState<string | null>(null);

  function patch(fields: Partial<CalculatorInput>) {
    setInput((prev) => ({ ...prev, ...fields }));
  }

  async function runGeneration() {
    setStatus("generating");
    setGenerationError(null);
    try {
      await Promise.all([submitInput(input), delay(MIN_GENERATION_DISPLAY_MS)]);
      router.push("/report");
    } catch (err) {
      setStatus("error");
      setGenerationError(
        err instanceof ReportGenerationError
          ? err.message
          : "Something interrupted the calculation. This is usually temporary, try again."
      );
    }
  }

  if (status === "generating") {
    return <GenerationSequence />;
  }

  if (status === "error") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-charcoal px-6 text-center">
        <AlertTriangle className="h-8 w-8 text-orange" aria-hidden />
        <h1 className="mt-5 font-serif-display text-2xl text-paper">Could not build your report</h1>
        <p className="mt-3 max-w-md text-[14.5px] leading-relaxed text-stone-100/70">{generationError}</p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Button
            variant="outline"
            className="!border-white/20 !text-paper hover:!bg-white/10"
            onClick={() => setStatus("form")}
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to the form
          </Button>
          <Button variant="accent" onClick={runGeneration}>
            <RotateCcw className="h-3.5 w-3.5" />
            Try again
          </Button>
        </div>
      </div>
    );
  }

  const isLastStep = step === STEPS.length - 1;
  const isFirstStep = step === 0;

  return (
    <>
      <SiteHeader />
      <main className="flex-1 bg-paper">
        <div className="mx-auto max-w-3xl px-5 py-12 sm:px-8 sm:py-16">
          <div className="flex items-center gap-3">
            <Badge variant="accent">Step {step + 1} of {STEPS.length}</Badge>
          </div>
          <h1 className="mt-4 font-serif-display text-[28px] leading-[1.2] text-ink sm:text-[34px]">
            {STEPS[step].title}
          </h1>
          <p className="mt-2 text-[15px] leading-relaxed text-slate">{STEPS[step].description}</p>

          <div className="mt-4 flex gap-1.5">
            {STEPS.map((_, i) => (
              <div
                key={i}
                className={`h-1 flex-1 ${i <= step ? "bg-accent" : "bg-stone-200"}`}
              />
            ))}
          </div>

          <div className="mt-9 border border-border bg-paper-raised p-6 sm:p-8">
            {step === 0 && <RoleStep role={input.role} onChange={(role) => patch({ role })} />}
            {step === 1 && (
              <VolumeStep hiresNeeded={input.hiresNeeded} onChange={(hiresNeeded) => patch({ hiresNeeded })} />
            )}
            {step === 2 && <ProcessStep input={input} onChange={patch} />}
            {step === 3 && <InterviewDetailsStep input={input} onChange={patch} />}
            {step === 4 && (
              <LeadershipStep
                involvedRoles={input.involvedRoles}
                onChange={(roles: LeadershipRoleKey[]) => patch({ involvedRoles: roles })}
              />
            )}
          </div>

          <div className="mt-8 flex items-center justify-between">
            <Button variant="ghost" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={isFirstStep}>
              <ArrowLeft className="h-3.5 w-3.5" />
              Back
            </Button>

            {isLastStep ? (
              <Button size="lg" variant="accent" onClick={runGeneration}>
                Reveal My Time Leak
              </Button>
            ) : (
              <Button variant="accent" onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}>
                Next
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
