import Image from "next/image";
import { Mail } from "lucide-react";

export function ContactSection() {
  return (
    <section className="print-avoid-break border-t border-border bg-charcoal py-20 print:bg-paper-raised print:py-10">
      <div className="mx-auto max-w-xl px-5 text-center sm:px-8">
        <Image
          src="/antal-logo.jpg"
          alt="Antal"
          width={40}
          height={40}
          className="mx-auto rounded-full print:hidden"
        />
        <p className="mt-4 text-[11px] font-semibold uppercase tracking-label text-stone-100/50 print:mt-0 print:text-slate">
          Want to reclaim these hours?
        </p>
        <h2 className="mt-3 font-serif-display text-[26px] leading-tight text-paper sm:text-[30px] print:text-ink">
          Talk to our specialist recruiters about this role.
        </h2>
        <p className="mt-3 text-[14.5px] leading-relaxed text-stone-100/70 print:text-slate">
          We&apos;ll review your hiring process and identify where leadership time can be reduced.
        </p>

        <p className="mt-6 border-l-2 border-accent/60 pl-4 text-left text-[14px] leading-relaxed text-stone-100/70 print:text-slate">
          At Antal, we&apos;ve been helping organisations hire technology talent for over 30 years
          globally and 18+ years in India. Our focus has always been on quality over volume, which
          is why close to 75% of the profiles we share progress to interviews and 75-80% of offers
          result in joiners.
        </p>

        <a
          href="mailto:vnair@antal.com"
          className="mt-8 inline-flex items-center gap-2 border border-white/20 bg-white/5 px-5 py-3 text-[14px] font-semibold text-paper transition-colors hover:border-accent hover:bg-white/10 print:border-ink print:bg-transparent print:text-ink"
        >
          <Mail className="h-4 w-4" aria-hidden />
          Reach out to vnair@antal.com
        </a>
      </div>
    </section>
  );
}
