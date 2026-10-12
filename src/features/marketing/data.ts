/**
 * Compatibility re-exports. Prefer importing from `@/data/*` for new code.
 */
import { policyLinks } from "@/data/legal";
export { featureGroups } from "@/data/features";
export { faqItems } from "@/data/faqs";
export { pricingPlans } from "@/data/pricing";
export { testimonials } from "@/data/testimonials";
export { primaryNav } from "@/data/navigation";

export const publicPages = [
  "/",
  "/features",
  "/solutions",
  "/pricing",
  "/how-it-works",
  "/about",
  "/faq",
  "/contact",
  "/login",
  "/signup",
  ...policyLinks.map((policy) => policy.href),
  "/demo",
] as const;

export const validityOptions = [
  { label: "1 Year", months: 12 },
  { label: "2 Years", months: 24 },
  { label: "3 Years", months: 36 },
  { label: "5 Years", months: 60 },
] as const;
