import { BenchmarkSection } from "./components/BenchmarkSection";
import { BentoFeatures } from "./components/BentoFeatures";
import { CyberCanvas } from "./components/CyberCanvas";
import { DownloadSection } from "./components/DownloadSection";
import { FaqSection } from "./components/FaqSection";
import { HeroSection } from "./components/HeroSection";
import { MetricsBar } from "./components/MetricsBar";
import { ScrollProgressBar } from "./components/ScrollProgressBar";
import { SiteFooter } from "./components/SiteFooter";
import { SiteHeader } from "./components/SiteHeader";
import { WorkflowShowcase } from "./components/WorkflowShowcase";

export default function App() {
  return (
    <>
      <ScrollProgressBar />
      <CyberCanvas />
      <SiteHeader />
      <main className="relative">
        <HeroSection />
        <MetricsBar />
        <BentoFeatures />
        <WorkflowShowcase />
        <BenchmarkSection />
        <DownloadSection />
        <FaqSection />
      </main>
      <SiteFooter />
    </>
  );
}
