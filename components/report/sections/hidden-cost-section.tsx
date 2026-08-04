import { formatHours } from "@/lib/formatters";

const NOT_SPENDING_ON = ["Product strategy", "Engineering", "Customers", "Team leadership", "Revenue"];

export function HiddenCostSection({
  totalHours,
  joins,
}: {
  totalHours: number;
  joins: number;
}) {
  const hireLabel = joins > 1 ? `${joins} hires` : "1 hire";

  return (
    <section className="border-b border-border py-16 sm:py-20">
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <div className="border-l-2 border-accent bg-accent-mist px-6 py-8 sm:px-10 sm:py-10">
          <p className="text-[11px] font-semibold uppercase tracking-label text-accent-strong">
            The Hidden Cost
          </p>
          <p className="mt-4 font-serif-display text-[22px] leading-relaxed text-ink sm:text-[26px]">
            Your hiring process is consuming approximately{" "}
            <span className="text-accent-strong">{formatHours(totalHours)}</span> of leadership time
            to successfully make {hireLabel}.
          </p>

          <p className="mt-6 text-[14px] font-medium text-ink-soft">
            This is time your senior leaders are not spending on:
          </p>
          <ul className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {NOT_SPENDING_ON.map((item) => (
              <li key={item} className="flex items-center gap-2 text-[13.5px] text-ink-soft">
                <span className="h-1 w-1 shrink-0 rounded-full bg-accent" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
