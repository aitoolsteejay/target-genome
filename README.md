# Talent Genome

A premium talent-intelligence prototype for a specialist recruitment company. Enter a
difficult, niche, or senior role and receive a deep, visual, insight-led Talent Genome
Report — recruitable market size, career patterns, motivations, switching windows,
competitive pressure, adjacent talent, search risks, and a recommended strategy.

Every submitted brief is sent to **Google Gemini**, which generates the full analytical
content for that specific role. If no Gemini API key is configured (e.g. a fresh clone, or
before you've added the key on Vercel), the app automatically falls back to four
fully-modelled sample markets matched by keyword — so it's always fully functional, with or
without a key.

## Run it locally

```bash
npm install
cp .env.example .env.local   # then add your Gemini key (optional — see below)
npm run dev
```

Open http://localhost:3000. If port 3000 is taken, Next.js will pick the next free port —
check the terminal output.

```bash
npm run build && npm run start   # production build
npm run lint                     # ESLint
npx tsc --noEmit                 # type-check
```

### Adding a Gemini API key

1. Get a key at https://aistudio.google.com/apikey.
2. Locally: put `GEMINI_API_KEY=your-key` in `.env.local` (gitignored).
3. On Vercel: **Project → Settings → Environment Variables** → add `GEMINI_API_KEY` (and
   optionally `GEMINI_MODEL`, default `gemini-2.5-flash`) → redeploy.

Without the key, `/api/generate-report` skips Gemini entirely and returns one of the four
sample reports (nearest match by keyword) — no error, no broken UI.

## Deploying to Vercel

This is a standard Next.js App Router project — Vercel detects it automatically.

```bash
npm i -g vercel   # if you don't have the CLI
vercel             # first deploy, follow the prompts
vercel --prod      # subsequent production deploys
```

Or connect the repo at https://vercel.com/new and Vercel will build and deploy on every
push. Either way:

- Add `GEMINI_API_KEY` under **Environment Variables** before your first real report
  generation (the site works without it, but every request uses the fallback path).
- The generation route (`app/api/generate-report/route.ts`) runs on the **Node.js runtime**
  (not Edge — the Gemini SDK needs it) and declares `maxDuration = 60` for the occasional
  slower generation. Vercel's Hobby plan supports this out of the box; if you're on an
  older plan/config with a hard 10s cap, either upgrade or lower `maxDuration` and accept
  that very large/complex briefs may time out into the fallback path.
- No database, queue, or other external service is required — session state lives in
  `sessionStorage` in the browser.

## Structure

```
app/
  page.tsx                     Homepage
  generate/page.tsx            Role Intelligence form + async generation + error/retry states
  report/page.tsx              Report for a freshly-generated brief (reads session state)
  report/brief/page.tsx        Standalone printable one-page CHRO brief
  sample/[slug]/page.tsx       The 4 canned sample reports
  api/generate-report/route.ts POST endpoint: brief in, full report out (Gemini or fallback)
components/
  landing/                     Homepage sections
  form/                        Role Intelligence form fields
  report/                      Report shell, header, generation sequence, and one
                                component per report section (funnel, career DNA,
                                employer ecosystem, simulator, risks, etc.)
  navigation/                  Site header/footer, report section nav (desktop + mobile)
  shared/                      Cross-cutting bits: section heading, insight panel,
                                animated counter, disclaimer, status badges
  ui/                          Small local design-system primitives (button, input,
                                select, slider, tabs, tooltip, accordion, ...)
data/
  sample-searches/             One file per sample role, each exporting a full
                                SearchBrief + TalentGenomeReport (used as fallback content
                                and as the four browsable /sample/[slug] reports)
  resistance.ts                Candidate resistance patterns (shared across all reports)
  comparable-searches.ts       "147 comparable searches" intelligence (shared)
  switching-signals.ts         Generic switching-timing signals (shared)
  ta-guidance.ts                Internal TA / Hybrid / Specialist criteria (shared)
lib/
  types.ts                     The entire data model (SearchBrief, TalentGenomeReport, ...)
  calculations.ts               Documented demo heuristics (funnel math, scenario simulator)
  gemini/
    prompt.ts                   Builds the Gemini prompt from a SearchBrief
    generated-content-schema.ts Gemini responseSchema + mirrored Zod validation schema
    client.ts                   Calls Gemini, validates, retries once, throws on failure
  report-assembler.ts           Combines Gemini content + derived + shared data into a report
  report-generator.ts           Fallback: maps a brief to the nearest sample market
  report-store.tsx              Client-side session state (React context + sessionStorage,
                                 calls /api/generate-report)
  validate-brief.ts             Form validation
hooks/
  use-report-navigation.ts      Scroll-spy for the report's section nav
```

## How a report is generated

1. `app/generate/page.tsx` validates the brief client-side, then POSTs it to
   `/api/generate-report` while showing the generation sequence (which loops until the
   request resolves — it doesn't know how long Gemini will take).
2. The route validates the brief server-side, and if `GEMINI_API_KEY` is set, calls
   `generateReportContentWithGemini()` (`lib/gemini/client.ts`), which sends a detailed
   prompt (`lib/gemini/prompt.ts`) and asks for **structured JSON output** matching
   `GENERATED_CONTENT_GEMINI_SCHEMA`. The response is validated against a mirrored Zod
   schema; a schema mismatch triggers one retry with a stricter reminder.
3. `lib/report-assembler.ts` combines that generated content with fields that are derived
   in code rather than generated (`metadata`, `executiveMetrics`, `scenarioBaseline`,
   `scenarioPresets` — all deterministic functions of the brief and the generated
   `talentPool`) and static shared data (`resistanceFactors`, `comparableSearches`,
   `switchingSignals`, `taGuidance.guidance` — genuinely portfolio-wide patterns, not
   role-specific) into a complete `TalentGenomeReport`.
4. If Gemini isn't configured, or fails, or its output doesn't validate twice in a row, the
   route silently falls back to `lib/report-generator.ts`, which matches the brief to the
   nearest of the four hand-authored sample reports by keyword and overlays the submitted
   brief on top. The client only sees a hard error if *that* also fails.

## Key calculation assumptions

Everything in `lib/calculations.ts` and the numeric-consistency rules in
`lib/gemini/prompt.ts` are documented heuristics, not a validated market model:

- Gemini is instructed to keep `realisticallyRecruitable` at 5%–15% of
  `technicallyRelevant`, `highProbabilityMovers` at 15%–25% of it, and to build the 7-stage
  funnel as a monotonically decreasing narrative ending at `realisticallyRecruitable`.
- The **Search Assumption Simulator** recomputes recruitable pool, competitive pressure,
  search duration, and offer-acceptance probability live from a `ScenarioBaseline` using
  multiplicative levers (e.g. allowing remote-across-country multiplies the recruitable
  pool by ~2.3×, each year shaved off the experience floor adds ~14%, dropping a mandatory
  interview round shifts acceptance probability and duration). Every constant is commented
  in place in `lib/calculations.ts`.
- `classifyBriefBreadth()` flags a brief as "narrow" or "broad" based on how many
  mutually-reinforcing constraints (tight experience band, onsite-only, mandatory domain,
  3+ mandatory skills, 5+ interview rounds) are stacked — not on any real supply/demand
  signal.
- `ScenarioBaseline` is derived directly from the submitted brief's own numbers (comp
  ceiling, experience floor, interview rounds, notice period, secondary-skill count), not
  generated — so the live simulator's starting point always matches what was actually
  submitted.

## Easiest places to connect real data

- `lib/gemini/prompt.ts` — the single place to change what Gemini is told about the market;
  add few-shot examples or firm-specific playbooks here without touching any component.
- `lib/gemini/generated-content-schema.ts` — if you need to change what Gemini generates
  (add/remove a field), update the Zod schema and the mirrored `GENERATED_CONTENT_GEMINI_SCHEMA`
  together, then update `lib/report-assembler.ts`'s mapping.
- `lib/report-generator.ts` — the fallback path; replace with a call to a real
  search/market-intelligence service if you want the "no AI key" path to use real data too.
- `lib/calculations.ts` — replace the heuristic constants with a model trained on validated
  internal search data once you have it; the function signatures (`computeScenarioOutput`,
  `classifyBriefBreadth`) are the integration seam.
- `components/report/lead-capture-section.tsx` — currently a local-only mock submission;
  wire the two form actions to your actual CRM/email endpoints.

## Limitations of this prototype

- All market intelligence — whether Gemini-generated or from the fallback samples — is
  simulated and clearly disclaimed in the UI. Gemini produces plausible, internally
  consistent, well-reasoned figures; it is not a source of real labour-market data.
- Gemini calls add real latency (typically several seconds) and, once you add a billed API
  key, real cost per report generation — there's no caching or rate limiting built in.
- The lead-capture form and "send me the brief" action do not send real email — no CRM or
  email API is wired up.
- PDF export uses the browser's native print dialog ("Print" / "Download PDF" both call
  `window.print()`) rather than a dedicated PDF-generation service.
