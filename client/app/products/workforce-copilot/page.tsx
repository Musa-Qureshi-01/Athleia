"use client";

import { ContextualPlaceholderPage } from "@/components/layouts/ContextualPlaceholderPage";

export default function WorkforceCopilotPage() {
  return (
    <ContextualPlaceholderPage
      badge="Product Suite · Copilot"
      title="Axios Workforce Copilot"
      line1="Context-aware AI copilot grounded directly in your company's P&IDs, manuals, and internal documentation."
      line2="Interactive sandbox environments are rolling out to enterprise pilot organizations."
      primaryCtaText="Request a copilot demo"
      primaryCtaHref="/get-a-demo"
    />
  );
}
