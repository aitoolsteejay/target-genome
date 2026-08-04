# Hiring Manager Time Leak

> "Discover how many leadership hours disappear every time you hire."

A premium, editorial calculator that quantifies the hidden cost of hiring: not recruitment
fees, but the hours your Engineering Directors, CTOs, Product Heads and Hiring Managers spend
interviewing candidates who were never the right fit. The goal is one reaction, *"I never
realised hiring was costing me this much leadership time."*

Internal TA still owns hiring. The message throughout is that specialist recruiters reduce
leadership time, not that they replace anyone.

Every number in the report (hours, totals, percentages) is computed by a documented mock
calculation engine, entirely deterministic. **Google Gemini** writes the prose around those
numbers: the executive summary and the "Where the Time Is Lost" recommendations. Without a
Gemini key, the app still works fully; it falls back to built-in template text automatically.

## Install and run

```bash
npm install
cp .env.example .env.local   # then add your Gemini key (optional, see below)
npm run dev
```

Open http://localhost:3000 (or whatever port the terminal prints if 3000 is taken).

```bash
npm run build && npm run start   # production build
npm run lint                     # ESLint
npx tsc --noEmit                 # type-check
```

### Adding a Gemini API key

1. Get a key at https://aistudio.google.com/apikey.
2. Locally: put `GEMINI_API_KEY=your-key` in `.env.local` (gitignored).
3. On Vercel: **Project → Settings → Environment Variables**, add `GEMINI_API_KEY` (and
   optionally `GEMINI_MODEL`), then redeploy.

Without the key, `/api/generate-report` skips Gemini and returns the deterministic template
text instead, no error, no broken UI.

## Deploying to Vercel

Standard Next.js App Router project. Vercel detects it automatically.

```bash
npm i -g vercel   # if you don't have the CLI
vercel             # first deploy, follow the prompts
vercel --prod      # subsequent production deploys
```

Or connect the repo at https://vercel.com/new. Add `GEMINI_API_KEY` under Environment
Variables before your first real report if you want AI-written narrative; the site works
without it either way.

- The generation route (`app/api/generate-report/route.ts`) runs on the **Node.js runtime**
  (not Edge, the Gemini SDK needs it) and declares `maxDuration = 60` for slower generations.
- No database or queue is required. Session state lives in the browser's `sessionStorage`.

## The user journey

1. **Homepage** (`app/page.tsx`), the headline, an animated calendar visual showing interview
   blocks fading out with "Only 1 candidate reached offer," and two CTAs.
2. **Calculator** (`app/calculate/page.tsx`), a 5-step wizard (role, hiring volume, current
   funnel counts, interview-time assumptions, leadership involvement), preloaded with a
   realistic example so it's never a blank form.
3. **Generation sequence** (`components/calculator/generation-sequence.tsx`), a premium
   animated sequence shown while the report is calculated and, if a Gemini key is configured,
   while the narrative is written. It loops until the real request finishes rather than running
   on a fixed timer.
4. **Report** (`app/report/page.tsx`, composed in `components/report/report-view.tsx`), the
   full breakdown: animated headline hour count, a vertical timeline of nine time categories,
   the "Hidden Cost" insight card, an executive calendar visualisation, a Sankey-style time-leak
   funnel, a specialist-supported comparison, a ranked "where the time is lost" list, a live
   "What If" simulator, a consulting-style executive summary, and, only after all of that, a
   lead-capture form. Every "i" icon throughout opens a short explanation of that metric.
5. **Example report** (`app/example/page.tsx`), the same report, instantly, using a canned
   input. This always bypasses Gemini entirely so "View Example Report" never has to wait on
   a network call.

## How a report is generated

1. `app/calculate/page.tsx` submits the finished `CalculatorInput` to `/api/generate-report`
   while showing the generation sequence, which loops until the request resolves.
2. The route (`app/api/generate-report/route.ts`) calls `computeTimeLeakReport()`
   (`lib/calculations.ts`) first, deterministically, no network. This produces every number in
   the report.
3. If `GEMINI_API_KEY` is set, the route then calls `generateReportNarrativeWithGemini()`
   (`lib/gemini/client.ts`), which sends the role, inputs, and the *already-computed* category
   hours and loss-item hours (`lib/gemini/prompt.ts`) and asks for **structured JSON output**
   matching `GENERATED_CONTENT_GEMINI_SCHEMA`: an executive summary, and a title +
   recommendation for each of the four loss items. Gemini never receives an empty canvas; it is
   always grounded in real numbers, and it never returns numbers itself, only prose.
4. The response is validated against a mirrored Zod schema; a mismatch triggers one retry with
   a stricter reminder. The route then overlays just `executiveSummary` and each loss item's
   `title`/`recommendation` onto the deterministic report; `estimatedLossHours` and every other
   number are untouched.
5. If Gemini isn't configured, fails, or its output doesn't validate twice in a row, the route
   returns the deterministic report with its original built-in template text. The client never
   sees an error in that case, only if the calculation itself somehow fails.

## File structure

```
app/
  page.tsx                      Homepage
  calculate/page.tsx            5-step input wizard, async submit, error/retry states
  report/page.tsx                The full report (reads session state)
  example/page.tsx               Report for the canned example input (always local, no AI)
  api/generate-report/route.ts   POST endpoint: input in, full report out (Gemini or fallback)
components/
  landing/                  Homepage sections (hero, calendar visual, how-it-works, dark insight)
  calculator/                Wizard step components + the generation sequence
  report/
    report-view.tsx          Composes every report section
    report-header.tsx        The animated headline number
    lead-capture-section.tsx  Post-report lead form
    sections/                 One component per report section (timeline, hidden cost,
                               executive calendar, time-leak graph, comparison, loss items,
                               what-if simulator, executive summary)
  navigation/                Site header/footer
  shared/                    Animated counter, section heading, insight panel, disclaimer,
                             info tooltip
  ui/                        Local design-system primitives (button, input, select, slider,
                             checkbox, switch, tabs, tooltip, accordion, badge, card, ...)
data/
  role-options.ts            The role dropdown list (technical roles only)
  leadership-roles.ts        The 8 leadership roles + mock hourly rates + tier
  example-input.ts           The preloaded/example CalculatorInput
lib/
  types.ts                    The entire data model
  calculations.ts             The calculation engine, every constant documented, computes
                               every number in the report
  gemini/
    prompt.ts                  Builds the Gemini prompt from the input and computed numbers
    generated-content-schema.ts Gemini responseSchema + mirrored Zod validation schema
    client.ts                   Calls Gemini, validates, retries once, throws on failure
  calculator-store.tsx         Client-side session state (React context + sessionStorage,
                               calls /api/generate-report)
```

## Calculation logic

`lib/calculations.ts` turns a `CalculatorInput` into a `TimeLeakReport`. Nine genuinely
distinct categories are computed so they sum exactly to the reported total (no double
counting):

| Category | Formula |
|---|---|
| Resume Reviews | `resumesReviewedByManager × 6 min ÷ 60` |
| Interview Scheduling | `totalInterviewRounds × schedulingOverheadMins ÷ 60` |
| Recruiter Sync | `recruiterScreens × 10 min ÷ 60` |
| Technical Interviews | `technicalInterviews × (duration + prep) ÷ 60` |
| Hiring Manager Interviews | `hiringManagerInterviews × (duration + prep) ÷ 60` |
| Leadership Interviews | `leadershipInterviews × leadershipMultiplier × (duration + prep) ÷ 60` |
| Feedback Discussions | `totalInterviewRounds × feedbackMins ÷ 60` |
| Rejected Candidates | `max(0, technicalInterviews − offers) × 15 min ÷ 60` |
| Offer Fallout | `max(0, offers − joins) × 3 hours` |

`leadershipMultiplier` is the number of selected **leadership-tier** roles (Director, VP, CTO,
Founder, Product Head, as opposed to interviewer-tier roles like Engineering Manager or
Senior Engineer). Selecting three leadership roles who all sit in on the same rounds triples
the Leadership Interviews line, this is the lever "Move CTO interview later" in the What-If
simulator relaxes.

From there:
- **Working days / weeks equivalent** = total hours ÷ 8 or ÷ 40.
- **Specialist-supported comparison**: removes ~35% of Technical + Hiring Manager + Leadership
  interview hours (the share attributable to candidates who shouldn't have reached that stage)
  and ~50% of Rejected-Candidate overhead, capped at 70% of the total.
- **Where the Time Is Lost**: four fixed loss types (unsuitable technical interviews,
  leadership involved too early, stage-count overhead, offer fallout), each with an
  `estimatedLossHours` formula tied to real categories, ranked by hours descending. Gemini may
  rewrite the `title` and `recommendation` for each; the hours never change.
- **What-If simulator** (`computeWhatIf`) recomputes live from the *already-generated report's*
  categories, not from raw input, using percentage levers for process compression, recruiter
  qualification, offer-fallout reduction, and a boolean for delaying leadership involvement.
- **Executive calendar**: block counts and the "wasted %" annotation are derived from the same
  rejected/declined counts as the categories, then capped and distributed across a 5-day grid
  for the visual (not literally scheduled by time slot).

## Mock assumptions

Every constant is a documented illustrative heuristic, not a validated benchmark:

- Resume review: 6 minutes/resume. Recruiter sync: 10 minutes/screen. Rejection overhead: 15
  minutes/candidate. Offer-fallout rework: 3 hours/declined offer.
- Mock hourly rates (`data/leadership-roles.ts`): Engineering Manager ₹4,000, Senior Engineer
  ₹3,000, Principal Engineer ₹5,500, Director ₹8,000, VP ₹10,000, CTO/Founder ₹12,000, Product
  Head ₹9,000, used only to compute a de-emphasised opportunity-cost figure, never surfaced as
  a headline number.
- Specialist-supported reduction: 35% of technical/HM/leadership hours, 50% of rejection
  overhead, capped at 70% of the total.
- What-If levers: process compression cuts scheduling (−60%) and feedback (−50%) most,
  interview time least (−15%); recruiter qualification cuts unsuitable technical interviews
  (−40%) and rejection overhead (−50%); delaying leadership interviews removes 40% of that
  category.

Replace the constants at the top of `lib/calculations.ts`, not the function shapes, once real
interview-analytics or ATS timing data exists.

## Future integrations

- **ATS integration**: pull `resumesReviewedByManager`, interview counts, and actual scheduled
  durations directly from Greenhouse/Lever/Ashby instead of manual entry, `CalculatorInput` is
  the exact shape an ATS webhook would need to populate.
- **Calendar integration**: read actual interview block durations from Google/Outlook calendars
  for the Hiring Manager and leadership participants, replacing the fixed duration/prep/feedback
  assumptions with real per-org averages.
- **Compensation data**: replace the mock hourly rates with real (anonymised) banded
  compensation data to make the opportunity-cost figure defensible in an internal business case.
- **Benchmarking**: aggregate anonymised submissions across companies to replace the fixed 35%
  specialist-reduction assumption with a real distribution by role/seniority/industry.
- **CRM handoff**: wire the lead-capture form (`components/report/lead-capture-section.tsx`) to
  a real CRM/email endpoint instead of the current local-only mock submission.

## Where AI is used, and where it could go further

Implemented today: Gemini writes the executive summary and the four "Where the Time Is Lost"
titles/recommendations, grounded in the real computed hours (see "How a report is generated"
above). Not yet implemented:

- **Personalised loss diagnosis**: today the four loss *types* are still fixed (technical
  interview overload, early leadership involvement, stage count, offer fallout). An LLM given
  the full `CalculatorInput` could identify genuinely different, role-specific leak types a
  fixed formula can't, for example a Data Scientist search losing time to take-home assignment
  review rather than live technical-interview overload.
- **Smarter What-If defaults**: rather than generic 0–100% sliders, an LLM could recommend a
  starting scenario tailored to the submitted process (e.g. "your bottleneck is stage count,
  not qualification, try this preset first").
- **Natural-language process intake**: let a hiring manager describe their process in a
  paragraph ("we do a recruiter call, two technical rounds, then the whole leadership team
  weighs in") and have an LLM extract the structured `CalculatorInput` fields, instead of
  requiring the 5-step form for a first pass.

## Limitations

- Gemini calls add real latency (typically a few seconds) and, once you add a billed API key,
  real cost per report, there's no caching or rate limiting built in.
- The lead-capture form does not send real email; no CRM or email API is wired up.
- The example report and the fallback path use static/template text; only a real Gemini key
  makes the executive summary and loss-item recommendations genuinely bespoke per submission.
