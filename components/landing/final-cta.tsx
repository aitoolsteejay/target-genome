import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FinalCta() {
  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-[1400px] px-5 py-20 text-center sm:px-8 sm:py-24">
        <h2 className="mx-auto max-w-2xl font-serif-display text-[30px] leading-[1.2] text-ink sm:text-[36px]">
          Before you open the role, understand the market.
        </h2>
        <div className="mt-9 flex justify-center">
          <Button asChild size="lg" variant="accent">
            <Link href="/generate">
              Build My Talent Genome
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
