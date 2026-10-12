import type { Metadata } from "next";
import { PricingSection } from "@/components/marketing/pricing-section";
import { PageShell } from "@/features/shared/page-shell";
import { buildMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Pricing",
  description:
    "Compare Starter, Growth, Business, and Enterprise plans for MY DETAIL OS workshop management software.",
  path: "/pricing",
});

export default function PricingPage() {
  return (
    <PageShell
      title="Transparent plans for growing workshops"
      description="Compare plans for your workshop. Confirm the selected plan, applicable taxes, and subscription term before purchasing."
      showCta={false}
    >
      <PricingSection compact />
    </PageShell>
  );
}
