import { ClipboardList, Calculator, GitBranch, SlidersHorizontal } from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";

const steps = [
  {
    icon: ClipboardList,
    title: "Describe your process",
    description:
      "Role, hiring volume, current funnel counts, interview length, and which leaders actually sit in the room.",
  },
  {
    icon: Calculator,
    title: "See the leadership hours",
    description:
      "Every resume pass, sync, interview and rejection converted into hours — and into a share of your senior leaders' calendars.",
  },
  {
    icon: GitBranch,
    title: "Find where it leaks",
    description:
      "A ranked breakdown of exactly which stages consume the most executive time relative to the hires they produce.",
  },
  {
    icon: SlidersHorizontal,
    title: "Test what reduces it",
    description:
      "Adjust interview depth, qualification quality, and offer timing live, and watch the hours move.",
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="border-b border-border py-20 sm:py-24">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
        <SectionHeading
          eyebrow="How It Works"
          title="Four inputs. One number your leadership team has never seen."
        />

        <div className="mt-14 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <div key={step.title}>
              <div className="flex items-center gap-3">
                <span className="text-[11px] font-semibold text-slate-light numeric">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <step.icon className="h-[18px] w-[18px] text-accent" aria-hidden />
              </div>
              <h3 className="mt-3 font-serif-display text-lg text-ink">{step.title}</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-slate">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
