import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
}

export function SectionHeading({ eyebrow, title, description, className }: SectionHeadingProps) {
  return (
    <div className={cn("max-w-3xl", className)}>
      {eyebrow && (
        <p className="text-[11px] font-semibold uppercase tracking-label text-accent-strong mb-3">
          {eyebrow}
        </p>
      )}
      <h2 className="font-serif-display text-[28px] sm:text-[32px] leading-[1.15] text-ink">
        {title}
      </h2>
      {description && (
        <p className="mt-3 text-[15px] leading-relaxed text-slate">{description}</p>
      )}
    </div>
  );
}
