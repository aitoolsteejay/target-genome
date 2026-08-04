const insights = [
  "The cost of a hire is not the recruitment fee. It is the Director, VP, or CTO time spent interviewing people who were never the right fit.",
  "Five interview stages do not reduce hiring mistakes. They just move the risk of a bad hire onto your most expensive calendars.",
  "Reducing leadership time is not about hiring less carefully. It is about deciding earlier who deserves that time at all.",
];

export function DarkInsightSection() {
  return (
    <section className="border-b border-border bg-charcoal py-20 sm:py-24">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
        <p className="text-[11px] font-semibold uppercase tracking-label text-stone-100/50">
          Interview Burden
        </p>
        <h2 className="mt-4 max-w-2xl font-serif-display text-[26px] leading-[1.25] text-paper sm:text-[30px]">
          Internal TA owns hiring. Specialist recruiters reduce leadership time.
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
      </div>
    </section>
  );
}
