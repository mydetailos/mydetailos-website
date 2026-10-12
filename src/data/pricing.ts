export type PricingPlanId = string;

export interface PricingPlan {
  id: PricingPlanId;
  name: string;
  description: string;
  price: number | null;
  priceLabel: string;
  billingDuration: string;
  currency: string;
  branches: string;
  users: string;
  features: string[];
  highlighted?: boolean;
  ctaLabel: string;
  ctaHref: string;
  /** Backend plan code when loaded from public API */
  planCode?: string;
}

/**
 * Centralized mock pricing. Replace with GET /api/public/plans when backend is ready.
 */
export const pricingPlans: PricingPlan[] = [
  {
    id: "starter",
    name: "Starter",
    description: "For single-branch workshops getting started with digital operations.",
    price: 2999,
    priceLabel: "₹2,999",
    billingDuration: "per month, billed annually",
    currency: "INR",
    branches: "1 branch",
    users: "3 users",
    features: [
      "Job card management",
      "Customer & vehicle profiles",
      "Basic billing & invoices",
      "Customer portal access",
      "Email support",
    ],
    ctaLabel: "Start Free Trial",
    ctaHref: "/signup?plan=STARTER",
    planCode: "STARTER",
  },
  {
    id: "growth",
    name: "Growth",
    description: "For growing workshops that need inventory, staff, and deeper workflows.",
    price: 5999,
    priceLabel: "₹5,999",
    billingDuration: "per month, billed annually",
    currency: "INR",
    branches: "2 branches",
    users: "8 users",
    features: [
      "Everything in Starter",
      "Inventory & stock control",
      "Staff management",
      "Service history & reminders",
      "Priority support",
    ],
    highlighted: true,
    ctaLabel: "Start Free Trial",
    ctaHref: "/signup?plan=GROWTH",
    planCode: "GROWTH",
  },
  {
    id: "business",
    name: "Business",
    description: "For multi-branch teams that need reporting, rewards, and stronger controls.",
    price: 9999,
    priceLabel: "₹9,999",
    billingDuration: "per month, billed annually",
    currency: "INR",
    branches: "5 branches",
    users: "20 users",
    features: [
      "Everything in Growth",
      "Advanced reports & insights",
      "Rewards & membership",
      "Role-based access control",
      "Activity tracking",
    ],
    ctaLabel: "Start Free Trial",
    ctaHref: "/signup?plan=BUSINESS",
    planCode: "BUSINESS",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "Custom plans for large multi-branch automotive service networks.",
    price: null,
    priceLabel: "Custom",
    billingDuration: "annual contract",
    currency: "INR",
    branches: "Unlimited branches",
    users: "Custom user limits",
    features: [
      "Everything in Business",
      "Dedicated onboarding",
      "Custom integrations (planned)",
      "SLA & account support",
      "Tailored rollout",
    ],
    ctaLabel: "Contact Sales",
    ctaHref: "/contact",
  },
];

export const pricingNote =
  "Indicative fallback prices. Confirm current pricing and applicable GST in checkout or a written quote.";
