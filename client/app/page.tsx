import { TopAnnouncementBar } from "@/components/layouts/TopAnnouncementBar";
import { Navbar } from "@/components/layouts/HeaderNav";
import { Footer } from "@/components/layouts/Footer";
import { VerticalScrollNavigator } from "@/components/ui/VerticalScrollNavigator";
import { FloatingAssistantWidget } from "@/components/ui/FloatingAssistantWidget";
import { HeroSection } from "@/sections/HeroSection";
import { CustomerLogosSection } from "@/sections/CustomerLogosSection";
import { ValuePropositionSection } from "@/sections/ValuePropositionSection";
import { SecurityGovernanceSection } from "@/sections/SecurityGovernanceSection";
import { MetricsSection } from "@/sections/MetricsSection";
import { IndustrySolutionsSection } from "@/sections/IndustrySolutionsSection";
import { CustomerStoriesSection } from "@/sections/CustomerStoriesSection";
import { ProductBenefitsSection } from "@/sections/ProductBenefitsSection";
import { WorkAIInstituteSection } from "@/sections/WorkAIInstituteSection";
import { FAQSection } from "@/sections/FAQSection";
import { PreFooterBanner } from "@/sections/PreFooterBanner";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-neutral-900 selection:bg-[#1F45EC]/15 selection:text-[#1F45EC] font-sans antialiased">
      {/* 1. Top Announcement Bar */}
      <TopAnnouncementBar />

      {/* 2. Primary Enterprise Navigation with Mega-Menus */}
      <Navbar />

      {/* 3. Left-Side Vertical Scroll Capsule Navigator */}
      <VerticalScrollNavigator />

      <main className="flex-1">
        {/* 1st: Wide Centered Hero with Blue Pill CTA and 3D Iridescent Fluid Banner with Typing Animation */}
        <HeroSection />

        {/* 2nd: Enterprise Customer Trust Logo Showcase & Axios:GO 2026 Conference Banner */}
        <CustomerLogosSection />

        {/* 3rd: Enterprise AI Value Proposition (Problem Statement & Solution: Context, Intelligence, Permissions, Efficiency) */}
        <ValuePropositionSection />

        {/* 4th: Security & Governance Console (Hidden on mobile per clean mobile layout rules) */}
        <div className="hidden md:block">
          <SecurityGovernanceSection />
        </div>

        {/* 5th: Six Website-Ready Statistics (19%, 62%, 2.8 hrs, 40%, 8-10 hrs, 35%) */}
        <MetricsSection />

        {/* 6th: Industry Interactive Showcase (Industrials, Financial Services, Healthcare, Retail, Technology, Consulting) */}
        <IndustrySolutionsSection />

        {/* 7th: Customer Stories (One platform. Every team. · Booking.com, Zillow, TIME, Ericsson, GCash) */}
        <CustomerStoriesSection />

        {/* 8th: Numbered Product Capabilities (01 Search across everything, 02 Enterprise agents, 03 Workflow execution) */}
        <ProductBenefitsSection />

        {/* 9th: Work AI Institute (Leading voices in AI · "We help you face the future of work" · Why Axios not others) */}
        <WorkAIInstituteSection />

        {/* 10th: Frequently Asked Questions (Security, Permissions, VPC Deployment, Cost Savings) */}
        <FAQSection />

        {/* 11th: Pre-Footer Action Banner (See Enterprise AI in action) */}
        <PreFooterBanner />
      </main>

      {/* 12th: Exact Boxy Footer with Clear Line Dividers */}
      <Footer />

      {/* Floating AI Assistant Widget ("Ask Query" pill) */}
      <FloatingAssistantWidget />
    </div>
  );
}
