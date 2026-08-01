"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, AlertTriangle, ArrowLeft, RotateCcw } from "lucide-react";
import { SiteHeader } from "@/components/navigation/site-header";
import { SiteFooter } from "@/components/navigation/site-footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RoleSection } from "@/components/form/role-section";
import { HiringContextSection } from "@/components/form/hiring-context-section";
import { OfferProcessSection } from "@/components/form/offer-process-section";
import { AttractionSection } from "@/components/form/attraction-section";
import { GenerationSequence } from "@/components/report/generation-sequence";
import { principalBackendEngineerBrief } from "@/data/sample-searches/principal-backend-engineer";
import { SAMPLE_SEARCH_SUMMARIES, SAMPLE_REPORTS } from "@/data/sample-searches";
import { ReportGenerationError, useReportStore } from "@/lib/report-store";
import {
  OFFER_TAB_ERROR_KEYS,
  ROLE_TAB_ERROR_KEYS,
  validateBrief,
} from "@/lib/validate-brief";
import type { SearchBrief } from "@/lib/types";

function cloneBrief(brief: SearchBrief): SearchBrief {
  return JSON.parse(JSON.stringify(brief));
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const MIN_GENERATION_DISPLAY_MS = 2600;

type TabKey = "role" | "context" | "offer" | "attraction";
type Status = "form" | "generating" | "error";

export default function GeneratePage() {
  const router = useRouter();
  const { generateFromBrief, brief: storedBrief, hydrated } = useReportStore();
  const [brief, setBrief] = useState<SearchBrief>(() => cloneBrief(principalBackendEngineerBrief));
  const [prefilledFromStore, setPrefilledFromStore] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [tab, setTab] = useState<TabKey>("role");
  const [status, setStatus] = useState<Status>("form");
  const [generationError, setGenerationError] = useState<string | null>(null);

  useEffect(() => {
    // "Edit Search" from the report page should reopen with the brief that
    // produced it, not the default sample — sync once, after session
    // storage has hydrated.
    if (hydrated && storedBrief && !prefilledFromStore) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setBrief(cloneBrief(storedBrief));
      setPrefilledFromStore(true);
    }
  }, [hydrated, storedBrief, prefilledFromStore]);

  const roleErrorCount = useMemo(
    () => ROLE_TAB_ERROR_KEYS.filter((k) => errors[k]).length,
    [errors]
  );
  const offerErrorCount = useMemo(
    () => OFFER_TAB_ERROR_KEYS.filter((k) => errors[k]).length,
    [errors]
  );

  function patchRole(patch: Partial<SearchBrief["role"]>) {
    setBrief((b) => ({ ...b, role: { ...b.role, ...patch } }));
  }
  function patchContext(patch: Partial<SearchBrief["hiringContext"]>) {
    setBrief((b) => ({ ...b, hiringContext: { ...b.hiringContext, ...patch } }));
  }
  function patchOffer(patch: Partial<SearchBrief["offerProcess"]>) {
    setBrief((b) => ({ ...b, offerProcess: { ...b.offerProcess, ...patch } }));
  }
  function patchAttraction(patch: Partial<SearchBrief["attraction"]>) {
    setBrief((b) => ({ ...b, attraction: { ...b.attraction, ...patch } }));
  }

  function loadSample(slug: string) {
    const sample = SAMPLE_REPORTS[slug];
    if (!sample) return;
    setBrief(cloneBrief(sample.brief));
    setErrors({});
  }

  async function runGeneration(finalBrief: SearchBrief) {
    setStatus("generating");
    setGenerationError(null);
    try {
      await Promise.all([generateFromBrief(finalBrief), delay(MIN_GENERATION_DISPLAY_MS)]);
      router.push("/report");
    } catch (err) {
      setStatus("error");
      setGenerationError(
        err instanceof ReportGenerationError
          ? err.message
          : "Something interrupted report generation. This is usually transient — try again."
      );
    }
  }

  function handleSubmit() {
    const validationErrors = validateBrief(brief);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      if (ROLE_TAB_ERROR_KEYS.some((k) => validationErrors[k])) setTab("role");
      else if (OFFER_TAB_ERROR_KEYS.some((k) => validationErrors[k])) setTab("offer");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const finalBrief: SearchBrief = {
      ...brief,
      id: `tg-${Date.now()}`,
      slug: brief.role.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
    };
    runGeneration(finalBrief);
  }

  if (status === "generating") {
    return <GenerationSequence roleTitle={brief.role.title || "your role"} />;
  }

  if (status === "error") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-charcoal px-6 text-center">
        <AlertTriangle className="h-8 w-8 text-amber" aria-hidden />
        <h1 className="mt-5 font-serif-display text-2xl text-paper">Report generation failed</h1>
        <p className="mt-3 max-w-md text-[14.5px] leading-relaxed text-stone-100/70">
          {generationError}
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Button variant="outline" className="!border-white/20 !text-paper hover:!bg-white/10" onClick={() => setStatus("form")}>
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to the brief
          </Button>
          <Button
            variant="accent"
            onClick={() =>
              runGeneration({
                ...brief,
                id: `tg-${Date.now()}`,
                slug: brief.role.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
              })
            }
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Try again
          </Button>
        </div>
      </div>
    );
  }

  const hasErrors = Object.keys(errors).length > 0;

  return (
    <>
      <SiteHeader />
      <main className="flex-1 bg-paper">
        <div className="mx-auto max-w-4xl px-5 py-12 sm:px-8 sm:py-16">
          <div className="flex items-center gap-3">
            <Badge variant="red">Confidential</Badge>
            <p className="text-[11px] font-semibold uppercase tracking-label text-slate">
              Role Intelligence Briefing
            </p>
          </div>
          <h1 className="mt-4 font-serif-display text-[30px] leading-[1.2] text-ink sm:text-[36px]">
            Tell us about the role you are trying to fill.
          </h1>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-slate">
            This briefing works like a confidential search intake — the more precisely you
            describe the role, the sharper the resulting Talent Genome. Every field is preloaded
            with a sample brief; edit anything that doesn&apos;t match your search.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-2">
            <span className="text-[12px] text-slate-light">Start from a sample brief:</span>
            {SAMPLE_SEARCH_SUMMARIES.map((s) => (
              <button
                key={s.slug}
                type="button"
                onClick={() => loadSample(s.slug)}
                className="border border-border-strong px-3 py-1.5 text-[12px] font-medium text-ink-soft transition-colors hover:border-accent hover:text-accent-strong"
              >
                {s.title}
              </button>
            ))}
          </div>

          {hasErrors && (
            <div className="mt-8 flex items-start gap-3 border border-red/30 bg-red-soft px-4 py-3.5 text-[13.5px] text-red">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" aria-hidden />
              <p>Please resolve the highlighted fields before generating the report.</p>
            </div>
          )}

          <div className="mt-8 border border-border bg-paper-raised p-5 sm:p-8">
            <Tabs value={tab} onValueChange={(v) => setTab(v as TabKey)}>
              <TabsList className="flex-wrap">
                <TabsTrigger value="role">
                  A · Role {roleErrorCount > 0 && <span className="ml-1.5 text-red">({roleErrorCount})</span>}
                </TabsTrigger>
                <TabsTrigger value="context">B · Hiring Context</TabsTrigger>
                <TabsTrigger value="offer">
                  C · Offer &amp; Process{" "}
                  {offerErrorCount > 0 && <span className="ml-1.5 text-red">({offerErrorCount})</span>}
                </TabsTrigger>
                <TabsTrigger value="attraction">D · Role Attraction</TabsTrigger>
              </TabsList>

              <TabsContent value="role">
                <RoleSection role={brief.role} onChange={patchRole} errors={errors} />
              </TabsContent>
              <TabsContent value="context">
                <HiringContextSection context={brief.hiringContext} onChange={patchContext} />
              </TabsContent>
              <TabsContent value="offer">
                <OfferProcessSection offer={brief.offerProcess} onChange={patchOffer} errors={errors} />
              </TabsContent>
              <TabsContent value="attraction">
                <AttractionSection attraction={brief.attraction} onChange={patchAttraction} />
              </TabsContent>
            </Tabs>
          </div>

          <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[12.5px] text-slate-light max-w-md">
              Generating a Talent Genome sends this brief to our server to build the analysis —
              nothing is stored beyond this session.
            </p>
            <Button size="lg" variant="accent" onClick={handleSubmit} className="shrink-0">
              Generate Talent Genome
            </Button>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
