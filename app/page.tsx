import { SiteHeader } from "@/components/navigation/site-header";
import { SiteFooter } from "@/components/navigation/site-footer";
import { Hero } from "@/components/landing/hero";
import { HowItWorksSection } from "@/components/landing/how-it-works-section";
import { DarkInsightSection } from "@/components/landing/dark-insight-section";
import { FinalCta } from "@/components/landing/final-cta";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <HowItWorksSection />
        <DarkInsightSection />
        <FinalCta />
      </main>
      <SiteFooter />
    </>
  );
}
