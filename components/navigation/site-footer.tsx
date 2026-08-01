import Link from "next/link";
import { Disclaimer } from "@/components/shared/disclaimer";

export function SiteFooter() {
  return (
    <footer className="print-hide mt-auto border-t border-border bg-paper">
      <div className="mx-auto max-w-[1400px] px-5 py-10 sm:px-8">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-center gap-2.5">
            <span className="flex h-6 w-6 items-center justify-center border border-ink text-[10px] font-serif-display font-semibold">
              TG
            </span>
            <span className="font-serif-display text-[15px] text-ink">Talent Genome</span>
          </div>

          <nav className="flex flex-wrap gap-x-6 gap-y-2 text-[13px] text-slate" aria-label="Footer">
            <Link href="/#how-it-works" className="hover:text-ink">How It Works</Link>
            <Link href="/sample/principal-backend-engineer" className="hover:text-ink">Sample Report</Link>
            <Link href="/#intelligence" className="hover:text-ink">About the Intelligence</Link>
            <Link href="/generate" className="hover:text-ink">Generate a Genome</Link>
          </nav>
        </div>

        <div className="mt-8 border-t border-border pt-6">
          <Disclaimer />
        </div>
      </div>
    </footer>
  );
}
