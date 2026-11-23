"use client";

import { ContextualPlaceholderPage } from "@/components/layouts/ContextualPlaceholderPage";

export default function MaintenanceIntelligencePage() {
  return (
    <ContextualPlaceholderPage
      badge="Product Suite · Operations"
      title="Axios Maintenance Intelligence"
      line1="Transform live SCADA telemetry, vendor service sheets, and equipment failure logs into verified field recommendations."
      line2="Explore tailored deployment architectures by connecting directly with our technical team."
      primaryCtaText="See operational demo"
      primaryCtaHref="/get-a-demo"
    />
  );
}
