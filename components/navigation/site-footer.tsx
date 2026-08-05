import Image from "next/image";
import Link from "next/link";
import { Disclaimer } from "@/components/shared/disclaimer";

export function SiteFooter() {
  return (
    <footer className="print-hide mt-auto border-t border-border bg-paper">
      <div className="mx-auto max-w-[1400px] px-5 py-10 sm:px-8">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-center gap-2.5">
            <Image src="/antal-logo.jpg" alt="Antal" width={24} height={24} className="rounded-full" />
            <span className="flex flex-col leading-tight">
              <span className="font-serif-display text-[15px] text-ink">Hiring Manager Time Leak</span>
              <span className="text-[10px] font-semibold uppercase tracking-label text-accent">By Antal</span>
            </span>
          </div>

          <nav className="flex flex-wrap gap-x-6 gap-y-2 text-[13px] text-slate" aria-label="Footer">
            <Link href="/#how-it-works" className="hover:text-ink">How It Works</Link>
            <Link href="/calculate" className="hover:text-ink">Calculate My Time Leak</Link>
          </nav>
        </div>

        <div className="mt-8 border-t border-border pt-6">
          <Disclaimer />
        </div>
      </div>
    </footer>
  );
}
