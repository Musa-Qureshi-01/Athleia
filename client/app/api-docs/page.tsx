"use client";

import { ContextualPlaceholderPage } from "@/components/layouts/ContextualPlaceholderPage";

export default function ApiDocsPage() {
  return (
    <ContextualPlaceholderPage
      badge="Developer APIs & SDKs"
      title="Axios Developer APIs"
      line1="Programmatic access to Axios enterprise context, semantic search endpoints, and permission-aware ingestion."
      line2="Developer documentation and early-access API keys are currently being distributed to enterprise partners."
      primaryCtaText="Request API Access"
      primaryCtaHref="/get-a-demo"
    />
  );
}
