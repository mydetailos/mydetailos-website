import { render, screen, within } from "@testing-library/react";
import PrivacyPage, { metadata as privacyMetadata } from "@/app/privacy/page";
import TermsPage, { metadata as termsMetadata } from "@/app/terms/page";
import CookiesPage, { metadata as cookiesMetadata } from "@/app/cookies/page";
import SubscriptionsPage, { metadata as subscriptionsMetadata } from "@/app/subscriptions/page";
import sitemap from "@/app/sitemap";
import { Footer } from "@/components/layout/footer";
import { policyLinks } from "@/data/legal";

jest.mock("@/features/shared/page-shell", () => ({
  PageShell: ({ title, description, children }: { title: string; description: string; children: React.ReactNode }) => (
    <section><h1>{title}</h1><p>{description}</p>{children}</section>
  ),
}));

describe("legal policies", () => {
  it.each([
    [PrivacyPage, "Privacy Policy"],
    [TermsPage, "Terms & Conditions"],
    [CookiesPage, "Cookies & Browser Storage"],
    [SubscriptionsPage, "Subscriptions, Refunds & Cancellation"],
  ] as const)("renders %p with working policy and contact links", (Page, title) => {
    render(<Page />);
    expect(screen.getByRole("heading", { level: 1, name: title })).toBeInTheDocument();
    const navigation = within(screen.getByRole("navigation", { name: "Legal policies" }));
    for (const policy of policyLinks) {
      expect(navigation.getByRole("link", { name: policy.label })).toHaveAttribute("href", policy.href);
    }
    expect(screen.getByRole("link", { name: "support@mydetailos.com" })).toHaveAttribute("href", "mailto:support@mydetailos.com");
    expect(screen.getByText(/pending operator confirmation:/i)).toBeInTheDocument();
  });

  it("links every policy and the actual sitemap from the footer", () => {
    render(<Footer />);
    for (const policy of policyLinks) {
      expect(screen.getByRole("link", { name: policy.label })).toHaveAttribute("href", policy.href);
    }
    expect(screen.getByRole("link", { name: "Sitemap" })).toHaveAttribute("href", "/sitemap.xml");
  });

  it("includes each legal route in the sitemap and canonical metadata", () => {
    const entries = sitemap();
    const metadata = [privacyMetadata, termsMetadata, cookiesMetadata, subscriptionsMetadata];
    for (const [index, policy] of policyLinks.entries()) {
      expect(entries.some((entry) => entry.url.endsWith(policy.href))).toBe(true);
      expect(metadata[index].alternates?.canonical).toEqual(expect.stringMatching(new RegExp(`${policy.href}$`)));
      expect(metadata[index].description).toBeTruthy();
    }
  });

  it("distinguishes local storage from cookies without fictitious tracking preferences", () => {
    render(<CookiesPage />);
    expect(screen.getByText("pd_token")).toBeInTheDocument();
    expect(screen.getByText(/local storage has no automatic browser expiry/i)).toBeInTheDocument();
    expect(screen.getByText(/no active analytics provider/i)).toBeInTheDocument();
    expect(screen.queryByRole("checkbox")).not.toBeInTheDocument();
  });

  it("preserves unresolved refund terms rather than inventing a guarantee", () => {
    render(<SubscriptionsPage />);
    expect(screen.getByText(/refund eligibility, time limits, partial-term treatment/i)).toBeInTheDocument();
    expect(screen.getByText(/do not establish automatic recurring charges/i)).toBeInTheDocument();
  });
});