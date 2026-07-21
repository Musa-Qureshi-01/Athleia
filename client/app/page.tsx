import { Navbar } from "@/components/layouts/HeaderNav";
import { Footer } from "@/components/layouts/Footer";
import { HeroSection } from "@/sections/HeroSection";
import { PlatformOverviewSection } from "@/sections/PlatformOverviewSection";
import { ServicesShowcaseSection } from "@/sections/ServicesShowcaseSection";
import { WhyAthleiaSection } from "@/sections/WhyAthleiaSection";
import { DemoCTASection } from "@/sections/DemoCTASection";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <PlatformOverviewSection />
        <ServicesShowcaseSection />
        <WhyAthleiaSection />
        <DemoCTASection />
      </main>
      <Footer />
    </>
  );
}
