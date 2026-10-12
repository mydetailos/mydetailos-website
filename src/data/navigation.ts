import type { LucideIcon } from "lucide-react";
import { policyLinks } from "@/data/legal";

export interface MegaMenuItem {
  label: string;
  href: string;
  description?: string;
  icon?: LucideIcon;
}

export interface MegaMenuColumn {
  title: string;
  items: MegaMenuItem[];
}

export interface NavItem {
  label: string;
  href: string;
  /** "columns" = titled link lists; "rich" = icon + title + description grid */
  megaMenuLayout?: "columns" | "rich";
  megaMenu?: MegaMenuColumn[];
}

export const primaryNav: NavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "Features",
    href: "/#features",
    megaMenuLayout: "columns",
    megaMenu: [
      {
        title: "Core Modules",
        items: [
          { label: "Appointments & Pickup-Drop", href: "/features/bookings" },
          { label: "Job Cards", href: "/features/job-cards" },
          { label: "GST Billing", href: "/features/billing" },
          { label: "CRM", href: "/features/customers" },
          { label: "ERP", href: "/features/erp" },
          { label: "Inventory", href: "/features/inventory-hub" },
          { label: "Service Reminders", href: "/features/service-reminders" },
          { label: "Customer Engagement", href: "/features/customer-engagement" },
          { label: "WhatsApp Automation", href: "/features/messages-log" },
          { label: "Automation", href: "/features/automation" },
          { label: "Finance", href: "/features/finance" },
          { label: "Accounting", href: "/features/accounting" },
          { label: "Payroll", href: "/features/payroll" },
          { label: "Attendance", href: "/features/attendance" },
          { label: "Digital Gate Pass", href: "/features/digital-gate-pass" },
          { label: "Test Drive", href: "/features/test-drive" },
          { label: "Insurance Claims", href: "/features/insurance-claims" },
        ],
      },
      {
        title: "Workshop Solutions",
        items: [
          { label: "Workshop Management", href: "/features/workshop-management" },
          { label: "Automobile Workshop", href: "/features/automobile-workshop" },
          { label: "Auto Repair Shop", href: "/features/auto-repair-shop" },
          { label: "Car Garage", href: "/features/car-garage" },
          { label: "Car Workshop", href: "/features/car-workshop" },
          { label: "Bike Workshop", href: "/features/bike-workshop" },
          { label: "Truck Workshop", href: "/features/truck-workshop" },
          { label: "EV Garage", href: "/features/ev-garage" },
          { label: "Car Detailing", href: "/features/car-detailing" },
          { label: "Fleet Workshop", href: "/features/fleet-workshop" },
        ],
      },
      {
        title: "Buying & Business",
        items: [
          { label: "Best Garage Software", href: "/features/best-garage-software" },
          { label: "Best Workshop Software", href: "/features/best-workshop-software" },
          { label: "Software India (Garage)", href: "/features/software-india-garage" },
          { label: "Software India (Workshop)", href: "/features/software-india-workshop" },
          { label: "Marketing", href: "/features/marketing" },
          { label: "Multi-Branch", href: "/features/multi-branch" },
          { label: "Service History", href: "/features/service-history" },
          { label: "Reports & Analytics", href: "/features/analytics" },
        ],
      },
      {
        title: "Apps & Mobile",
        items: [
          { label: "Garage App", href: "/mobile" },
          { label: "Workshop App", href: "/mobile" },
        ],
      },
    ],
  },
  {
    label: "Solutions",
    href: "/solutions",
    megaMenuLayout: "columns",
    megaMenu: [
      {
        title: "Service Workshops",
        items: [
          { label: "Independent workshops", href: "/features/automobile-workshop" },
          { label: "Multi-brand service workshops", href: "/features/workshop-management" },
          { label: "Auto repair centers", href: "/features/auto-repair-shop" },
          { label: "Motorcycle service centers", href: "/features/bike-workshop" },
        ],
      },
      {
        title: "Detailing & Care",
        items: [
          { label: "Car detailing centers", href: "/features/car-detailing" },
          { label: "Car wash & detailing", href: "/features/car-wash" },
          { label: "Oil / lube service chains", href: "/features/oil-lube" },
        ],
      },
      {
        title: "Fleet & Retail",
        items: [
          { label: "Fleet operation businesses", href: "/features/fleet-workshop" },
          { label: "Tyre / battery retailers", href: "/features/ev-garage" },
          { label: "Service & repair franchisees", href: "/features/multi-branch" },
        ],
      },
      {
        title: "OEM & Partners",
        items: [
          { label: "OEM distributors", href: "/features/inventory" },
          { label: "Oils / lubricants OEMs", href: "/features/inventory-hub" },
        ],
      },
    ],
  },
  { label: "Pricing", href: "/#pricing" },
  { label: "About", href: "/#about" },
  { label: "FAQ", href: "/#faq" },
  { label: "Contact", href: "/#contact" },
];

export const footerNav = {
  column1: [
    { label: "Careers", href: "/contact" },
    { label: "Press and media", href: "/contact" },
    { label: "Investor relations", href: "/contact" },
    ...policyLinks,
    { label: "Security & Data Handling", href: "/privacy" },
    { label: "Sitemap", href: "/sitemap.xml" },
  ],
  considering: [
    { label: "About MY DETAIL OS", href: "/about" },
    { label: "Customer Engagement", href: "/features/customer-engagement" },
    { label: "Communications", href: "/features/messages-log" },
    { label: "Customer Data Platform", href: "/features/customers" },
    { label: "Customer stories", href: "/about" },
    { label: "Contact sales", href: "/contact" },
  ],
  products: [
    { label: "Job Cards", href: "/features/job-cards" },
    { label: "GST Billing", href: "/features/billing" },
    { label: "Inventory Control", href: "/features/inventory-hub" },
    { label: "Service Reminders", href: "/features/service-reminders" },
    { label: "WhatsApp Automation", href: "/features/messages-log" },
    { label: "Reports & Analytics", href: "/features/analytics" },
  ],
  useCases: [
    { label: "Automobile Workshop", href: "/features/automobile-workshop" },
    { label: "Car Detailing", href: "/features/car-detailing" },
    { label: "Auto Repair Shop", href: "/features/auto-repair-shop" },
    { label: "Bike Workshop", href: "/features/bike-workshop" },
    { label: "Fleet Workshop", href: "/features/fleet-workshop" },
  ],
  resources: [
    { label: "Developer resources", href: "/how-it-works" },
    { label: "API Documentation", href: "/contact" },
    { label: "Integrations", href: "/features" },
    { label: "Support center", href: "/contact" },
    { label: "Community", href: "/faq" },
  ],
} as const;

/** Workshop-type landing pages linked from the home grid (may not all appear in mega menus). */
const WORKSHOP_TYPE_SLUGS = [
  "car-garage",
  "bike-workshop",
  "car-wash",
  "auto-spa",
  "fleet-workshop",
  "car-detailing",
  "oil-lube",
  "ceramic-ppf",
  "multi-branch",
  "automobile-workshop",
] as const;

/** All feature/solution page slugs linked from primary mega menus + workshop type grid. */
export function getAllFeatureSlugs(): string[] {
  const slugs = new Set<string>(WORKSHOP_TYPE_SLUGS);
  for (const item of primaryNav) {
    for (const column of item.megaMenu ?? []) {
      for (const link of column.items) {
        if (link.href.startsWith("/features/")) {
          slugs.add(link.href.replace("/features/", ""));
        }
      }
    }
  }
  return Array.from(slugs);
}
