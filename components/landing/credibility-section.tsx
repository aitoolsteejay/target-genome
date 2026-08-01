const items = [
  "Built from specialist search intelligence",
  "Designed for niche and senior hiring",
  "Combines market data, search patterns, and candidate behaviour",
  "Created for HR, TA, GCC, and business leaders",
];

export function CredibilitySection() {
  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-[1400px] px-5 py-10 sm:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <div key={item} className="flex items-start gap-3 border-t border-border-strong pt-5">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
              <p className="text-[13.5px] leading-snug text-ink-soft">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
