# Hiring Manager Time Leak

**By Antal.** _"Discover how many leadership hours disappear every time you hire."_

A premium, editorial calculator that quantifies the hidden cost of hiring — not recruitment
fees, but the actual **hours** your Engineering Directors, CTOs, Product Heads and Hiring
Managers spend interviewing candidates who were never the right fit. The goal is one reaction:
*"I never realised hiring was costing me this much leadership time."*

The message throughout is deliberately **not** "replace your internal TA team." Internal TA
still owns hiring end to end. The pitch is narrower and more honest: a specialist recruitment
partner (Antal) reduces how much of that hiring load lands on your leaders' calendars, by
qualifying candidates earlier so fewer unsuitable people ever reach an interview.

Every number in the report (hours, totals, percentages) is produced by a documented,
deterministic mock calculation engine — no AI is involved in the math, ever. **Google Gemini**
is optionally used to write the *prose* around those numbers (the executive summary and the
"Where the Time Is Lost" recommendations). Without a Gemini key, the app still works fully; it
silently falls back to built-in template text.

There is **no backend, no database, no authentication**. A submission is computed server-side
in one Next.js Route Handler (so the Gemini API key never reaches the browser), and the result
is held in the browser's `sessionStorage` for the rest of the session. Nothing is persisted
anywhere.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Environment Variables](#environment-variables)
- [Deploying to Vercel](#deploying-to-vercel)
- [Project Structure](#project-structure)
- [The User Journey](#the-user-journey)
- [Data Model](#data-model)
- [Calculation Logic — Internal ("Current Process") Hours](#calculation-logic--internal-current-process-hours)
- [Calculation Logic — Specialist-Supported Hours](#calculation-logic--specialist-supported-hours)
- [Where the Time Is Lost](#where-the-time-is-lost)
- [The Hiring Funnel](#the-hiring-funnel)
- [How a Report Is Generated (AI Narrative Layer)](#how-a-report-is-generated-ai-narrative-layer)
- [PDF Export](#pdf-export)
- [Design System & Branding](#design-system--branding)
- [Mock Assumptions Reference](#mock-assumptions-reference)
- [Known Issues](#known-issues)
- [Future Integrations](#future-integrations)
- [Limitations](#limitations)

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS v4 (CSS-first `@theme inline` tokens in `app/globals.css`) |
| Animation | Framer Motion |
| UI primitives | Radix UI, wrapped as local `components/ui/*` (shadcn-style) |
| Icons | Lucide React |
| Class utilities | `class-variance-authority`, `clsx`, `tailwind-merge` (`cn()` in `lib/utils.ts`) |
| AI narrative | Google Gemini via `@google/genai`, structured JSON output, validated with Zod |
| Analytics | `@vercel/analytics` |
| Hosting | Vercel (or any Node.js host — no special infra required) |

> ⚠️ **This is not the Next.js you already know.** This project pins a version with breaking
> changes from what most training data assumes. Before touching any App Router/route-handler/
> image code, read the relevant guide under `node_modules/next/dist/docs/` and respect any
> deprecation notice you see (see the repo's `AGENTS.md`).

---

## Quick Start

```bash
npm install
cp .env.example .env.local     # optional — see Environment Variables below
npm run dev
```

Open http://localhost:3000 (or whatever port the terminal prints if 3000 is in use).

```bash
npm run build && npm run start   # production build + serve
npm run lint                     # ESLint (eslint-config-next)
npx tsc --noEmit                 # type-check, no separate test suite exists
```

There is no test runner configured in `package.json` — correctness is enforced by
`tsc --noEmit`, ESLint, and manual/browser verification of the calculator + report flow.

---

## Environment Variables

Only one integration is optional; everything else needs zero configuration.

| Variable | Required? | Default | Purpose |
|---|---|---|---|
| `GEMINI_API_KEY` | No | — | Enables AI-written executive summary + loss-item copy. Get one at https://aistudio.google.com/apikey |
| `GEMINI_MODEL` | No | `gemini-flash-latest` | Override the model. The default is a Google-maintained *alias* (not a pinned version like `gemini-2.5-flash`), chosen specifically so it never silently becomes deprecated. |

**Local:** put both in `.env.local` (already gitignored — `.gitignore` has `.env*` with an
explicit `!.env.example` exception so the template itself stays tracked).

**Vercel:** Project → Settings → Environment Variables → add `GEMINI_API_KEY` (and optionally
`GEMINI_MODEL`) → redeploy.

Without a key, `POST /api/generate-report` still returns a complete, fully-computed report —
it just skips the Gemini call entirely and uses the deterministic template text baked into
`lib/calculations.ts`. There is no degraded/error state visible to the user either way.

---

## Deploying to Vercel

Standard Next.js App Router project — Vercel detects it with zero config.

```bash
npm i -g vercel   # if you don't already have the CLI
vercel            # first deploy, follow the prompts
vercel --prod     # subsequent production deploys
```

Or connect the GitHub repo directly at https://vercel.com/new.

- `app/api/generate-report/route.ts` explicitly declares `export const runtime = "nodejs"`
  (the Gemini SDK needs the Node runtime, not Edge) and `export const maxDuration = 60` to give
  slower generations room to finish.
- No database, queue, KV store, or blob storage is required anywhere in this project.
- Vercel Analytics is wired in globally via `<Analytics />` in `app/layout.tsx`.

---

## Project Structure

```
app/
  layout.tsx                        Root layout: fonts, metadata, <Analytics/>, the sticky
                                     "Powered By Myntmore" badge, CalculatorStoreProvider
  page.tsx                          Homepage (Hero, How It Works, Dark Insight, Final CTA)
  globals.css                       Tailwind v4 theme tokens (colors, fonts), print stylesheet
  calculate/page.tsx                5-step input wizard: async submit, generation animation,
                                     error/retry state
  report/page.tsx                   Reads the report from session state; empty-state CTA if
                                     none exists yet
  api/generate-report/route.ts      POST endpoint: CalculatorInput in, TimeLeakReport out.
                                     Always computes deterministically first, then optionally
                                     overlays Gemini narrative

components/
  landing/                          Homepage sections
    hero.tsx                          Headline + CTA + animated calendar visual
    calendar-leak-visual.tsx          The "this week: hiring manager" animated mini-calendar
    how-it-works-section.tsx          "Four inputs. One number your leadership team has never seen."
    dark-insight-section.tsx          Dark full-bleed section: "Internal TA owns hiring..."
    final-cta.tsx                     Closing CTA before the footer

  calculator/                       The 5-step wizard
    role-step.tsx                     Step 1 — role dropdown (data/role-options.ts)
    volume-step.tsx                   Step 2 — number of hires (plain numeric input)
    process-step.tsx                  Step 3 — funnel counts (resumes, screens, interviews, …)
    interview-details-step.tsx        Step 4 — timing pills (duration/prep/feedback/scheduling)
    leadership-step.tsx               Step 5 — leadership-role checkboxes + mock hourly rate
    pill-select.tsx                   Shared pill-button selector used in step 4
    field.tsx                         Shared labeled-field wrapper with optional info tooltip
    generation-sequence.tsx           Full-screen animated "calculating" sequence; loops on the
                                       final stage until the real async request resolves

  report/
    report-view.tsx                   Composes every report section in order
    report-header.tsx                 Animated headline hour count, "Edit Inputs" +
                                       "Download PDF" buttons, print-only letterhead
    contact-section.tsx               Closing "reach out to vnair@antal.com" panel + Antal
                                       track-record blurb (no lead-capture form, no CRM)
    sections/
      timeline-section.tsx              "Where the Hours Go" — 9-category vertical timeline
      hidden-cost-section.tsx           "The Hidden Cost" insight callout
      time-leak-graph-section.tsx       "The Hiring Funnel" — candidate-count funnel chart +
                                         a separate "where candidates dropped out" panel
      comparison-section.tsx            "A Specialist-Supported Process" — current vs.
                                         specialist-supported hours + hours-returned callout
      loss-items-section.tsx            "Where the Time Is Lost" — ranked loss list
      executive-summary-section.tsx     Prose summary (deterministic template or Gemini)

  navigation/
    site-header.tsx                   Sticky header: Antal logo, nav, "Calculate My Time Leak"
    site-footer.tsx                   Footer: Antal logo, nav, disclaimer

  shared/
    animated-counter.tsx               Scroll-triggered count-up (Framer Motion `useInView`)
    section-heading.tsx                 Eyebrow + title + description pattern used everywhere
    info-tooltip.tsx                    The "ⓘ" icon + Radix tooltip used on every metric
    insight-panel.tsx                   Reusable callout-box wrapper
    disclaimer.tsx                      The "illustrative assumptions" legal-ish footer text
    powered-by-badge.tsx                Sticky bottom-right "Powered By Myntmore" → myntmore.com

  ui/                                Local design-system primitives wrapping Radix UI:
                                     button, input, textarea, label, select, checkbox,
                                     radio-group, switch, slider, tabs, accordion, progress,
                                     tooltip, badge, card

data/
  role-options.ts                   16 technical roles for the Step 1 dropdown (Software
                                     Engineer → Engineering Director; no Sales/Marketing/etc.)
  leadership-roles.ts               8 leadership roles, each with a mock hourly rate (₹) and a
                                     tier ("interviewer" or "leadership") — see getRoleDefinition()
  example-input.ts                  EXAMPLE_INPUT — preloads the calculator form so it's never
                                     a blank page (~86.5 total hours when run through the engine)

lib/
  types.ts                          The entire data model: CalculatorInput, TimeLeakReport,
                                     TimeCategory, FunnelHoursStage, SpecialistComparison,
                                     LossItem, LeadershipRoleDefinition, RoleOption
  calculations.ts                   The calculation engine — every constant documented,
                                     computes every number the report ever shows
  calculator-store.tsx              Client-side session state: React Context + sessionStorage,
                                     exposes submitInput() (calls the API route), reset()
  formatters.ts                     formatNumber / formatHours / formatPercent / formatCurrency
                                     (formatWorkingDays/formatWeeks exist but are currently unused)
  utils.ts                          cn() — clsx + tailwind-merge
  gemini/
    prompt.ts                         Builds the Gemini prompt from the input + already-
                                       computed category hours + loss items
    generated-content-schema.ts       Zod schema (validates Gemini's response) + the mirrored
                                       Gemini responseSchema (Gemini's own OpenAPI-subset format)
    client.ts                         Calls Gemini with structured-JSON output, retries once on
                                       schema mismatch, throws GeminiGenerationError otherwise

public/
  antal-logo.jpg                    The Antal logo used in the header, footer, print letterhead,
                                     and the contact section
```

---

## The User Journey

1. **Homepage** (`app/page.tsx`) — headline, an animated calendar visual showing interview
   blocks with "Only 1 candidate reached offer," a "Four inputs, one number" explainer, a dark
   full-bleed "Internal TA owns hiring" section, and a closing CTA. Single call to action
   throughout: **Calculate My Time Leak**.
2. **Calculator** (`app/calculate/page.tsx`) — a 5-step wizard (role → hiring volume → current
   funnel counts → interview-timing assumptions → leadership involvement), preloaded with
   `EXAMPLE_INPUT` so the form is never blank. Every field that isn't self-explanatory has an
   "ⓘ" tooltip.
3. **Generation sequence** (`components/calculator/generation-sequence.tsx`) — a full-screen
   animated sequence shown while the request is in flight. It's purely presentational: it loops
   through stage messages and holds on the last one (with a reassurance line after 5 seconds)
   until the parent unmounts it — it has no idea how long the real request will take.
4. **Report** (`app/report/page.tsx` → `components/report/report-view.tsx`) — in order: the
   animated headline hour count with Edit/Download-PDF buttons, the 9-category hour timeline,
   the "Hidden Cost" insight card, the hiring funnel + drop-off panel, the specialist-supported
   comparison, the ranked "Where the Time Is Lost" list, the executive summary, a disclaimer,
   and finally the "reach out to vnair@antal.com" contact section.
5. **Contact** (`components/report/contact-section.tsx`) — no form, no lead capture, no CRM
   integration. Just Antal's track-record copy and a `mailto:vnair@antal.com` button.

There is intentionally **no example-report route anymore**, and no lead-capture form or
What-If simulator either — all three were deliberately removed from an earlier version of this
app in favor of the simpler flow described above.

---

## Data Model

Everything flows through two shapes, both in `lib/types.ts`:

```ts
CalculatorInput = {
  role: string
  hiresNeeded: number

  // funnel counts
  resumesReviewedByManager, recruiterScreens, technicalInterviews,
  hiringManagerInterviews, leadershipInterviews, finalInterviews,
  offers, joins: number

  // timing, in minutes
  avgInterviewDurationMins, avgPrepTimeMins,
  avgFeedbackTimeMins, avgSchedulingOverheadMins: number

  involvedRoles: LeadershipRoleKey[]
}

TimeLeakReport = {
  input: CalculatorInput
  generatedOn: string                    // ISO timestamp

  totalLeadershipHours, workingDaysEquivalent, weeksEquivalent,
  hoursPerHire, opportunityCostInr: number

  categories: TimeCategory[]             // the 9-row timeline
  funnelStages: FunnelHoursStage[]        // the candidate funnel
  comparison: SpecialistComparison        // current vs. specialist-supported
  lossItems: LossItem[]                  // ranked "where the time is lost"
  executiveSummary: string               // template or Gemini prose
}
```

`computeTimeLeakReport(input): TimeLeakReport` in `lib/calculations.ts` is the single function
that turns one into the other. It is pure and synchronous — no I/O, no randomness (aside from
`new Date().toISOString()` for `generatedOn`).

---

## Calculation Logic — Internal ("Current Process") Hours

Function: `computeCategories(input)` in `lib/calculations.ts`.

```ts
interviewMinutes      = avgInterviewDurationMins + avgPrepTimeMins
totalInterviewRounds  = technicalInterviews + hiringManagerInterviews
                       + leadershipInterviews + finalInterviews
multiplier            = leadershipMultiplier(input)   // see below, minimum 1
```

**`leadershipMultiplier`** counts how many *distinct leadership-tier* roles (Director, VP,
CTO, Founder/MD/CEO/CXO, Product Head — see `data/leadership-roles.ts`) were selected in step
5. If a Director, VP, and CTO are all selected, `multiplier = 3`: the model assumes all three
sit in on the same leadership rounds, so that category is charged three people's time, not one.

| # | Category | Formula | What it represents |
|---|---|---|---|
| 1 | Resume Reviews | `resumesReviewedByManager × 6 min ÷ 60` | HM's own resume screening |
| 2 | Interview Scheduling | `totalInterviewRounds × avgSchedulingOverheadMins ÷ 60` | Coordination per round |
| 3 | Recruiter Sync | `recruiterScreens × 10 min ÷ 60` | HM/recruiter sync per screen |
| 4 | Technical Interviews | `technicalInterviews × interviewMinutes ÷ 60` | Actual technical-round time |
| 5 | Hiring Manager Interviews | `hiringManagerInterviews × interviewMinutes ÷ 60` | Actual HM-round time |
| 6 | Leadership Interviews | `leadershipInterviews × multiplier × interviewMinutes ÷ 60` | Leadership-round time, scaled |
| 7 | Feedback Discussions | `totalInterviewRounds × avgFeedbackTimeMins ÷ 60` | Post-interview debrief |
| 8 | Rejected Candidates | `max(0, technicalInterviews − offers) × 15 min ÷ 60` | Closeout overhead |
| 9 | Offer Fallout | `max(0, offers − joins) × 3 hours` | Rework after a declined offer |

Every category is rounded to 1 decimal place (`roundToOneDecimal`). Rollups:

```ts
totalLeadershipHours  = round(sum of all 9 categories, 1 decimal)
workingDaysEquivalent = round(totalLeadershipHours / 8, 1 decimal)
weeksEquivalent        = round(totalLeadershipHours / 40, 1 decimal)
hoursPerHire           = round(totalLeadershipHours / max(1, joins), 1 decimal)
opportunityCostInr     = round(totalLeadershipHours × avgHourlyRate)
                         // avgHourlyRate = mean hourlyRateInr of selected involvedRoles,
                         // or ₹5,000 if none selected. Computed but not currently rendered
                         // anywhere in the UI.
```

**Worked example** (the shipped `EXAMPLE_INPUT`: 70 resumes, 35 screens, 16 technical, 10 HM, 4
leadership, 3 final, 3 offers, 1 join, 60/20/15/10-minute timings, Director+VP+CTO selected →
multiplier 3):

| Category | Hours |
|---|---|
| Resume Reviews | 7.0 |
| Interview Scheduling | 5.5 |
| Recruiter Sync | 5.8 |
| Technical Interviews | 21.3 |
| Hiring Manager Interviews | 13.3 |
| Leadership Interviews | 16.0 |
| Feedback Discussions | 8.3 |
| Rejected Candidates | 3.3 |
| Offer Fallout | 6.0 |
| **Total** | **86.5** → 10.8 working days, 2.2 weeks |

---

## Calculation Logic — Specialist-Supported Hours

Function: `buildComparison(categories, totalHours)` in `lib/calculations.ts`.

This is **not** a re-derivation from raw inputs — it takes the already-computed category hours
and applies a documented reduction heuristic, so the two figures stay comparable and grounded
in the same numbers shown in the timeline above.

```ts
technical  = hours("technical-interviews")
hm         = hours("hiring-manager-interviews")
leadership = hours("leadership-interviews")
rejected   = hours("rejected-candidates")

reduction = clamp(
  0.55 × (technical + hm + leadership)   // interview time saved by earlier qualification
  + 0.75 × rejected,                      // rejection-closeout overhead mostly eliminated
  0,
  totalHours × 0.75                       // cap: specialist figure never drops below 25% of current
)

currentHours              = round(totalHours, 1 decimal)
specialistSupportedHours  = round(max(0, totalHours − reduction), 1 decimal)
hoursReturned             = round(currentHours) − round(specialistSupportedHours)
daysReturned              = round(hoursReturned / 8, 1 decimal)
```

> **Why `hoursReturned` is computed the way it is.** It is deliberately derived from the two
> *already-rounded, on-screen* numbers (`round(currentHours) − round(specialistSupportedHours)`),
> not from the raw unrounded `reduction`. Rounding all three independently from unrounded
> intermediates caused a real, shipped bug: the UI showed "87 hours" and "67 hours" side by
> side but "Hours Returned: 19" instead of 20 — because 86.5 → 87 and 67.4 → 67 independently,
> while the unrounded reduction (19.6) rounded to a different-looking 19. Anchoring
> `hoursReturned` to the two numbers a reader can actually see and subtract themselves
> guarantees the arithmetic on screen is always self-consistent.

**Worked example** (same demo data, `totalHours = 86.5`):

```
reduction = min(0.55×(21.3+13.3+16.0) + 0.75×3.3, 86.5×0.75)
          = min(27.83 + 2.475, 64.875)
          = 30.3

specialistSupportedHours = round(86.5 − 30.3, 1) = 56.2
hoursReturned            = round(86.5) − round(56.2) = 87 − 56 = 31
daysReturned             = round(31 / 8, 1) = 3.9
```

→ **87 hours → 56 hours, 31 hours returned (≈3.9 working days).**

---

## Where the Time Is Lost

Function: `buildLossItems(input, categories)`. Four **fixed** loss types, each with an
`estimatedLossHours` tied to real categories, filtered to only those with `> 0` hours and
sorted descending:

| id | Title (default) | Formula | Recommendation (default) |
|---|---|---|---|
| `unsuitable-technical` | Too many unsuitable technical interviews | `technical × 0.45` | Improve qualification before technical rounds. |
| `leadership-too-early` | Leadership involved too early | `leadership × 0.6` | Delay executive interviews until shortlist. |
| `stage-count` | "`{N}` interview stages" (N = number of non-zero funnel stages) | `scheduling + feedback × 0.5` | Reduce to three structured rounds. |
| `offer-fallout` | Offer fallout | `offerFallout + rejected × 0.3` | Improve candidate engagement before offer. |

Gemini (when configured) may rewrite the `title` and `recommendation` text for each item that
survives the `> 0` filter — `estimatedLossHours` and `id` are never touched by AI.

---

## The Hiring Funnel

Function: `buildFunnelStages(input)`, rendered by
`components/report/sections/time-leak-graph-section.tsx`. Two distinct pieces:

1. **The main chain** — a monotonic, sequential candidate funnel: Candidates Reviewed (100%) →
   Resume Review → Recruiter Screens → Technical Interviews → Manager Interviews → Leadership
   Interviews → Offers → Joined. Each stage's percentage is `count ÷ base × 100`, clamped to
   never exceed the previous stage's percentage (so the chart always reads as a narrowing
   funnel even if raw counts aren't perfectly monotonic).
2. **A separate "where candidates dropped out" panel** — `Rejected` (the gap between the
   Technical and Offers stages) and `Offer Rejected` (the gap between Offers and Joined),
   each with a one-line plain-English explanation. These are deliberately *not* rendered as
   part of the sequential chain, because they're drop-off measurements spanning several stages,
   not additional funnel steps after "Offers."

This section used to be framed as "The Time Leak Graph" measuring hours (the first bar was
literally labeled "100 Hours"), which conflated candidate counts with leadership hours and
looked confusing next to a genuine hours breakdown elsewhere in the report. It was relabeled
"The Hiring Funnel" and reworded to be honest about what it actually measures: candidates, not
hours.

---

## How a Report Is Generated (AI Narrative Layer)

1. `app/calculate/page.tsx` POSTs the finished `CalculatorInput` to `/api/generate-report`
   while showing the generation sequence (which just loops until the request resolves).
2. The route handler validates the request shape (`isWellFormedInput` — checks every numeric
   field is present and finite; see [Known Issues](#known-issues) for what it does *not* check),
   then calls `computeTimeLeakReport()` — deterministic, no network, produces every number.
3. If `GEMINI_API_KEY` is set, the route calls `generateReportNarrativeWithGemini()`
   (`lib/gemini/client.ts`), sending the role, raw inputs, and the **already-computed** category
   hours + loss-item hours (`lib/gemini/prompt.ts`) and requesting **structured JSON output**
   matching `GENERATED_CONTENT_GEMINI_SCHEMA`: a 2–3 sentence executive summary, and a
   title + recommendation for each of the four loss items. Gemini is explicitly instructed
   never to invent or change a number — it only ever receives numbers, never returns them.
4. The response is validated against a mirrored Zod schema (`GeneratedReportContentSchema`); on
   a mismatch, one retry fires with a stricter reminder appended to the prompt. The route then
   overlays just `executiveSummary` and each loss item's `title`/`recommendation` onto the
   deterministic report — `estimatedLossHours` and every other number pass through the spread
   untouched.
5. If Gemini isn't configured, fails, or its output doesn't validate on either attempt, the
   route silently returns the deterministic report with its original built-in template text.
   The client never sees an error unless the *deterministic calculation itself* fails.

---

## PDF Export

The "Download PDF" button in the report header calls `window.print()` — there is no
server-side PDF generation, no headless-browser rendering, no extra dependency. The quality
comes entirely from a dedicated `@media print` block in `app/globals.css`:

- Forces background colors to actually print (`print-color-adjust: exact` and vendor prefixes),
  since browsers strip them by default.
- Adds a print-only letterhead at the top of the report (`report-header.tsx`'s `print-only`
  paragraph): the Antal logo, "Hiring Manager Time Leak · By Antal," and the report's generated
  date — since the sticky site header (which normally carries branding) is hidden in print via
  the existing `print-hide` convention.
- Sets `break-inside: avoid` on every `<section>` so a card or callout never splits across a
  page boundary.
- Flips the dark `contact-section.tsx` to a light, ink-on-white layout specifically for print
  (via Tailwind's `print:` variant), so a business report doesn't waste a page printing a solid
  black panel.
- Hides every interactive element that makes no sense on paper (`print-hide`): the sticky
  header, footer, the "Powered By Myntmore" badge, the "Edit Inputs"/"Download PDF" buttons
  themselves, and every info-tooltip trigger.

---

## Design System & Branding

- **Colors** (`app/globals.css`, Tailwind v4 `@theme inline` tokens): a pure white
  (`#ffffff`) background, **Antal purple** (`#6E4B9E`) as the primary accent (CTAs, links, the
  big headline number), and **Antal green** (`#4D9B49`) as a secondary accent used specifically
  for the "Estimated Reduction / Hours Returned" callout — the one unambiguously positive number
  in the report. Neutral grays (`ink`, `slate`, `border`) replaced an earlier warm-beige
  editorial palette to stay consistent with the cool purple/green brand pair.
- **Typography:** Source Serif 4 for display headings (`font-serif-display`), Inter for
  everything else, both loaded via `next/font/google` in `app/layout.tsx`.
- **Branding:** the Antal logo (`public/antal-logo.jpg`) appears in the header (38px), footer
  (32px), the print-only PDF letterhead (18px), and as a 40px badge above the contact section's
  headline. A sticky "Powered By Myntmore" badge (`components/shared/powered-by-badge.tsx`) sits
  bottom-right on every page, linking to `myntmore.com` in a new tab.
- **Motion:** Framer Motion throughout — `whileInView` scroll-reveals, an `AnimatedCounter`
  count-up (careful `useInView` margin so it still triggers for elements pinned near the very
  top of the page), and the full-screen generation sequence's looping stage messages.

---

## Mock Assumptions Reference

Every constant below is a documented illustrative heuristic, not a validated benchmark. Replace
the constants — not the function shapes — once real interview-analytics or ATS timing data
exists.

**Time costs** (`lib/calculations.ts`):
- Resume review: 6 minutes/resume
- Recruiter sync: 10 minutes/screened candidate
- Rejection closeout: 15 minutes/candidate
- Offer-fallout rework: 3 hours/declined offer

**Mock hourly rates** (`data/leadership-roles.ts`, used only for the currently-unrendered
`opportunityCostInr` figure):

| Role | Tier | ₹/hour |
|---|---|---|
| Engineering Manager | interviewer | 4,000 |
| Senior Engineer | interviewer | 3,000 |
| Principal Engineer | interviewer | 5,500 |
| Director | leadership | 8,000 |
| VP | leadership | 10,000 |
| CTO | leadership | 12,000 |
| Founder / Managing Director / CEO / CXO | leadership | 12,000 |
| Product Head | leadership | 9,000 |

**Specialist-supported reduction:** 55% of technical + HM + leadership interview hours, 75% of
rejection-closure overhead, capped so the specialist figure never drops below 25% of the total.

**Loss-item multipliers:** unsuitable-technical `× 0.45`, leadership-too-early `× 0.6`,
stage-count `= scheduling + feedback × 0.5`, offer-fallout `= offerFallout + rejected × 0.3`.

---

## Known Issues

Found during a full correctness review of `lib/calculations.ts`, `app/api/generate-report/route.ts`,
and `lib/gemini/*`. Listed for transparency — **not yet fixed** as of this README:

- **`finalInterviews` time is dropped.** It's counted toward scheduling/feedback overhead
  (`totalInterviewRounds`) but never gets its own "time in the room" category, unlike
  technical/HM/leadership rounds — silently undercounts `totalLeadershipHours` whenever
  `finalInterviews > 0`.
- **`joins: 0` still reads as "one successful hire"** in the executive summary — the
  `joins > 1 ? ... : "one successful hire"` check treats 0 and 1 identically.
- **Funnel vs. timeline can disagree on leadership involvement.** The funnel chart falls back
  to `finalInterviews` when `leadershipInterviews` is 0 (`leadershipInterviews || finalInterviews`);
  the hours category does not have the same fallback. The two sections can contradict each
  other for the same input.
- **`resumesReviewedByManager: 0` flattens the entire funnel to 100%** at every stage, instead
  of correctly reflecting attrition from whatever the real starting stage is.
- **Rejected-candidate hours only look at `technicalInterviews − offers`**, so rejections that
  happen at the HM/leadership stage (when the technical stage is small or skipped) are
  invisible to the model.
- **No non-negativity validation** on any funnel/timing field, client- or server-side — a
  negative input produces a negative "hours" line item with no error surfaced anywhere.
- **Duplicate Gemini loss-item ids are not rejected by the schema.** If Gemini ever returns two
  items with the same `id`, one canonical loss item silently falls back to template text while
  the response is still reported as `source: "gemini"`.
- **The funnel's monotonic clamp can mask out-of-order input** (e.g. more technical interviews
  entered than recruiter screens) by silently capping the later stage at the earlier one's
  percentage, with no indication anything was adjusted.

None of these are visible in the shipped `EXAMPLE_INPUT` scenario — they surface on specific
edge-case inputs (zeros, unusual funnel shapes, or a misbehaving/duplicate Gemini response).

---

## Future Integrations

- **ATS integration**: pull `resumesReviewedByManager`, interview counts, and actual scheduled
  durations directly from Greenhouse/Lever/Ashby instead of manual entry — `CalculatorInput` is
  already the exact shape an ATS webhook would need to populate.
- **Calendar integration**: read actual interview block durations from Google/Outlook calendars
  for the Hiring Manager and leadership participants, replacing the fixed duration/prep/feedback
  assumptions with real per-organisation averages.
- **Compensation data**: replace the mock hourly rates with real (anonymised) banded
  compensation data, and actually render `opportunityCostInr` once it's trustworthy.
- **Benchmarking**: aggregate anonymised submissions across companies to replace the fixed
  specialist-reduction percentages with a real distribution by role/seniority/industry.
- **CRM handoff**: `contact-section.tsx` is currently a static `mailto:` link with no CRM or
  email API behind it — wiring a real contact-capture flow (if the business wants one back)
  would live here.

---

## Limitations

- Gemini calls add real latency (typically a few seconds) and, with a billed API key, real cost
  per report. There is no caching or rate limiting built in.
- The contact section sends no data anywhere — it is a static `mailto:` link, not a form
  submission. There is no lead capture, no CRM, no email automation.
- Without a Gemini key, or on any Gemini failure, the executive summary and loss-item
  recommendations are static per-request template text (still personalized with the submitted
  role, hours, and top loss item — just not LLM-written).
- No automated test suite exists; correctness is enforced by `tsc --noEmit`, ESLint, and manual
  verification.
