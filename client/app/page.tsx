import { Navbar } from "@/components/layouts/HeaderNav";
import { Footer } from "@/components/layouts/Footer";
import { HeroSection } from "@/sections/HeroSection";
import { TrustSection } from "@/sections/TrustSection";
import { KnowledgePrioritySection } from "@/sections/KnowledgePrioritySection";
import { ArchitectureSection } from "@/sections/ArchitectureSection";
import { CapabilitiesSection } from "@/sections/CapabilitiesSection";
import { UseCasesSection } from "@/sections/UseCasesSection";
import { SecuritySection } from "@/sections/SecuritySection";
import { CTASection } from "@/sections/CTASection";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <TrustSection />
        <KnowledgePrioritySection />
        <ArchitectureSection />
        <CapabilitiesSection />
        <UseCasesSection />
        <SecuritySection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
