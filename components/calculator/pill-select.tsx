import { cn } from "@/lib/utils";

interface PillSelectProps {
  options: number[];
  value: number;
  onChange: (value: number) => void;
  suffix?: string;
  ariaLabel?: string;
}

export function PillSelect({ options, value, onChange, suffix = "", ariaLabel }: PillSelectProps) {
  return (
    <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={ariaLabel}>
      {options.map((option) => {
        const isActive = option === value;
        return (
          <button
            key={option}
            type="button"
            role="radio"
            aria-checked={isActive}
            onClick={() => onChange(option)}
            className={cn(
              "border px-4 py-2 text-[13.5px] font-medium transition-colors",
              isActive
                ? "border-accent bg-accent-soft text-accent-strong"
                : "border-border-strong text-ink-soft hover:border-ink"
            )}
          >
            {option}
            {suffix}
          </button>
        );
      })}
    </div>
  );
}
