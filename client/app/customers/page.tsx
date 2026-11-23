"use client";

import { ContextualPlaceholderPage } from "@/components/layouts/ContextualPlaceholderPage";

export default function CustomersPage() {
  return (
    <ContextualPlaceholderPage
      badge="Customer Stories"
      title="How Industry Leaders Build with Axios"
      line1="Explore how Fortune 500 engineering and operations teams eliminate repetitive manual search and reduce equipment downtime."
      line2="Our comprehensive customer case study directory and video series are rolling out to the public website."
      primaryCtaText="Schedule a briefing"
      primaryCtaHref="/get-a-demo"
    />
  );
}
