import { SiteHeader } from "@/components/navigation/site-header";
import { SiteFooter } from "@/components/navigation/site-footer";
import { Hero } from "@/components/landing/hero";
import { CredibilitySection } from "@/components/landing/credibility-section";
import { RevealsSection } from "@/components/landing/reveals-section";
import { DarkInsightsSection } from "@/components/landing/dark-insights-section";
import { FinalCta } from "@/components/landing/final-cta";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <CredibilitySection />
        <RevealsSection />
        <DarkInsightsSection />
        <FinalCta />
      </main>
      <SiteFooter />
    </>
  );
}
