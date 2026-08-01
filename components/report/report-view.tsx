import { SiteHeader } from "@/components/navigation/site-header";
import { SiteFooter } from "@/components/navigation/site-footer";
import { ReportNavDesktop, ReportNavMobile } from "@/components/navigation/report-nav";
import { ReportHeader } from "@/components/report/report-header";
import { ExecutiveSummarySection } from "@/components/report/sections/executive-summary-section";
import { TalentPoolSection } from "@/components/report/sections/talent-pool-section";
import { CareerDnaSection } from "@/components/report/sections/career-dna-section";
import { CareerFlowSection } from "@/components/report/sections/career-flow-section";
import { EmployerEcosystemSection } from "@/components/report/sections/employer-ecosystem-section";
import { MigrationRadarSection } from "@/components/report/sections/migration-radar-section";
import { SwitchingProbabilitySection } from "@/components/report/sections/switching-probability-section";
import { MotivationGenomeSection } from "@/components/report/sections/motivation-genome-section";
import { ResistanceMapSection } from "@/components/report/sections/resistance-map-section";
import { CompetitivePressureSection } from "@/components/report/sections/competitive-pressure-section";
import { TalentNeighbourhoodSection } from "@/components/report/sections/talent-neighbourhood-section";
import { SearchSimulatorSection } from "@/components/report/sections/search-simulator-section";
import { SearchRisksSection } from "@/components/report/sections/search-risks-section";
import { ComparableSearchesSection } from "@/components/report/sections/comparable-searches-section";
import { RecommendedStrategySection } from "@/components/report/sections/recommended-strategy-section";
import { TaVsSpecialistSection } from "@/components/report/sections/ta-vs-specialist-section";
import { ChroBriefSection } from "@/components/report/sections/chro-brief-section";
import { LeadCaptureSection } from "@/components/report/lead-capture-section";
import { Disclaimer } from "@/components/shared/disclaimer";
import type { TalentGenomeReport } from "@/lib/types";

export function ReportView({
  report,
  isApproximateMatch,
  banner,
}: {
  report: TalentGenomeReport;
  isApproximateMatch?: boolean;
  banner?: React.ReactNode;
}) {
  return (
    <>
      <SiteHeader />
      {banner}
      <ReportNavMobile />
      <main className="flex-1 bg-paper">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
          <ReportHeader report={report} isApproximateMatch={isApproximateMatch} />

          <div className="flex gap-12">
            <ReportNavDesktop />

            <div className="min-w-0 flex-1">
              <ExecutiveSummarySection metrics={report.executiveMetrics} insight={report.executiveInsight} />
              <TalentPoolSection funnel={report.funnel} />
              <CareerDnaSection
                stats={report.careerDNAStats}
                experienceBands={report.experienceBands}
                archetypes={report.archetypes}
              />
              <EmployerEcosystemSection employers={report.employers} insight={report.employerInsight} />
              <CareerFlowSection paths={report.careerPaths} insights={report.careerPathInsights} />
              <MigrationRadarSection flows={report.migrationFlows} />
              <SwitchingProbabilitySection
                signals={report.switchingSignals}
                curve={report.switchingCurve}
                bestWindow={report.bestEngagementWindow}
              />
              <MotivationGenomeSection motivations={report.motivations} />
              <ResistanceMapSection factors={report.resistanceFactors} />
              <CompetitivePressureSection
                employers={report.competitiveEmployers}
                insight={report.competitiveInsight}
              />
              <TalentNeighbourhoodSection
                profiles={report.adjacentProfiles}
                baseRecruitable={report.talentPool.realisticallyRecruitable}
                insight={report.neighbourhoodInsight}
                roleTitle={report.brief.role.title}
              />
              <SearchSimulatorSection
                baseline={report.scenarioBaseline}
                presets={report.scenarioPresets}
                brief={report.brief}
              />
              <SearchRisksSection risks={report.risks} />
              <ComparableSearchesSection data={report.comparableSearches} />
              <RecommendedStrategySection recommendation={report.recommendation} />
              <TaVsSpecialistSection guidance={report.taGuidance} />
              <ChroBriefSection report={report} />

              <div className="py-10">
                <Disclaimer />
              </div>
            </div>
          </div>
        </div>
      </main>
      <LeadCaptureSection defaultRole={report.brief.role.title} />
      <SiteFooter />
    </>
  );
}
