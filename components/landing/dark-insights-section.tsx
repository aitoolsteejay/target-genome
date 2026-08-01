const insights = [
  "The market may contain 2,340 technically relevant profiles. Fewer than 200 are likely to be realistically recruitable under the current brief.",
  "Candidates in this segment change companies every 2.7 years, but switching probability rises sharply in the six months after a promotion cycle.",
  "Compensation is not the primary attraction lever for this group. Architecture ownership and leadership credibility rank higher.",
];

export function DarkInsightsSection() {
  return (
    <section id="intelligence" className="border-b border-border bg-charcoal py-20 sm:py-24">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
        <p className="text-[11px] font-semibold uppercase tracking-label text-stone-100/50">
          About the Intelligence
        </p>
        <h2 className="mt-4 max-w-2xl font-serif-display text-[26px] leading-[1.25] text-paper sm:text-[30px]">
          Every report is built from the same intelligence a specialist search team uses before
          opening a role.
        </h2>

        <div className="mt-14 grid grid-cols-1 gap-10 lg:grid-cols-3 lg:gap-12">
          {insights.map((insight, i) => (
            <div key={i} className="border-t border-white/15 pt-6">
              <p className="font-serif-display text-[19px] italic leading-[1.5] text-stone-100">
                {insight}
              </p>
            </div>
          ))}
        </div>

        <p className="mt-14 text-[12px] text-stone-100/40">
          Illustrative simulated insights, consistent with patterns observed across comparable
          specialist searches.
        </p>
      </div>
    </section>
  );
}
