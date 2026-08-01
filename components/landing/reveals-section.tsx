import {
  Users,
  GitBranch,
  Compass,
  Swords,
  ShieldAlert,
  Network,
} from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";

const blocks = [
  {
    icon: Users,
    title: "Real recruitable market",
    description:
      "The gap between technically relevant profiles and the smaller group actually likely to consider your role, under your real constraints.",
  },
  {
    icon: GitBranch,
    title: "Career movement patterns",
    description:
      "The repeated career paths that produce this profile — often through employers your original target list did not include.",
  },
  {
    icon: Compass,
    title: "Candidate motivation signals",
    description:
      "What this segment actually optimises for, ranked and evidenced — not assumed from a generic job-seeker survey.",
  },
  {
    icon: Swords,
    title: "Competitive hiring pressure",
    description:
      "Who else is pursuing the same narrow segment right now, and what they are offering that your brief currently is not.",
  },
  {
    icon: ShieldAlert,
    title: "Search design risks",
    description:
      "Where your current requirements interact to narrow the market further than any single constraint would suggest.",
  },
  {
    icon: Network,
    title: "Adjacent talent opportunities",
    description:
      "Roles with high skill overlap that can expand your recruitable pool without lowering the capability bar.",
  },
];

export function RevealsSection() {
  return (
    <section id="how-it-works" className="border-b border-border py-20 sm:py-24">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
        <SectionHeading
          eyebrow="What Talent Genome Reveals"
          title="Six things your ATS and job boards will not tell you."
        />

        <div className="mt-14 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {blocks.map((block, i) => (
            <div key={block.title}>
              <div className="flex items-center gap-3">
                <span className="text-[11px] font-semibold text-slate-light numeric">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <block.icon className="h-[18px] w-[18px] text-accent" aria-hidden />
              </div>
              <h3 className="mt-3 font-serif-display text-lg text-ink">{block.title}</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-slate">{block.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
