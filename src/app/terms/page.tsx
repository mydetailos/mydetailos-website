import type { Metadata } from "next";
import Link from "next/link";
import { PolicyPage } from "@/features/shared/policy-page";
import { buildMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Terms & Conditions",
  description: "Read the terms of service for using MY DETAIL OS public website and SaaS platform.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <PolicyPage
      title="Terms & Conditions"
      description="These terms govern access to MY DETAIL OS public website, signup flow, and linked application services."
    >
      <h2>Service and eligibility</h2>
      <p>MY DETAIL OS provides workshop management software through this website and the linked Workshop App for an organisation account. It is not a marketplace for buying vehicle repairs from third-party workshops. Workshop services and their customer transactions remain the responsibility of the relevant workshop.</p>
      <p>Account registration requires accurate information and a representative with authority to act for the workshop and capacity to enter a valid contract under applicable law. Do not register for another business without authority. Contact us before use if you cannot meet these requirements.</p>
      <h2>Account and workshop responsibilities</h2>
      <p>Keep contact information current, protect credentials and OTPs, and give staff only appropriate access. The workshop is responsible for the accuracy of its customer, vehicle, staff, invoice, tax, and payment records and for giving required notices and obtaining permissions for the information and messages it submits. Platform access does not itself authorise marketing messages or the use of another person&apos;s information.</p>
      <h2>Acceptable use</h2>
      <ul>
        <li>Use the service lawfully and respect the rights of customers, staff, and other users.</li>
        <li>Do not access another organisation&apos;s records, impersonate users, bypass access controls, or disclose credentials.</li>
        <li>Do not upload malicious code, infringing material, or unlawfully obtained personal information, or send unlawful, deceptive, or unsolicited messages.</li>
        <li>Do not disrupt the service, misuse payment/referral features, or copy and redistribute software or branding without the necessary rights.</li>
      </ul>
      <h2>Plans, trials, billing, and renewals</h2>
      <p>Features and branch/user limits depend on the selected plan and account configuration. Pricing is loaded from the platform when available; displayed fallback prices are not a final quotation. Confirm the plan, term, taxes, add-ons, and total in the applicable checkout or written quotation before payment.</p>
      <p>Trial length is configured by the platform and shown during signup. Paid activation and renewal use the available checkout or administrative payment-verification process; the inspected flow does not establish automatic recurring debits. See <Link href="/subscriptions">Subscriptions, Refunds &amp; Cancellation</Link> for the supported process and commercial details still awaiting approval.</p>
      <h2>Suspension, termination, and records</h2>
      <p>The platform supports administrative suspension and restoration of organisations and subscription-based access controls. Access may be restricted by the account&apos;s status, subscription entitlement, or action required to address unlawful use or a security issue. No specific advance-notice period or contractual cancellation deadline has been confirmed.</p>
      <p>Request cancellation or account closure through the published contact route. Suspension is not a refund or data-erasure operation. Discuss exports, outstanding billing, and retention before closing an account; export availability depends on the relevant account features. Confirmed contractual terms and mandatory legal rights remain applicable.</p>
      <h2>Intellectual property and your information</h2>
      <p>The MY DETAIL OS name, logos, website content, and software are protected by applicable intellectual-property law and belong to their respective rights holders. Use of the service does not transfer ownership or permit unauthorised copying, redistribution, or use of the brand. Third-party marks remain the property of their owners.</p>
      <p>Submitting workshop records does not transfer ownership of your user-provided content to MY DETAIL OS. You must have the rights and permissions needed for the service to host, process, display, and transmit that content for the functions you request. Personal-information handling is described in the <Link href="/privacy">Privacy Policy</Link>; it is not an unrestricted licence to exploit your data.</p>
      <h2>Third-party services and service disclaimer</h2>
      <p>Hosting, storage, payment, email, SMS, and WhatsApp functions depend on configured third-party services and their requirements. An accepted message or payment request is not proof of delivery or completed payment. Network outages, maintenance, provider restrictions, and service changes can affect availability. No uptime percentage or service-level guarantee is stated here.</p>
      <p>Website materials and software-generated calculations or reports do not replace professional tax, accounting, legal, or vehicle-safety advice. Check records and outputs before relying on them. This disclaimer does not exclude mandatory warranties, statutory consumer remedies, or liability that cannot lawfully be excluded.</p>
      <h2>Liability, disputes, and changes</h2>
      <p>No additional liability cap, blanket warranty waiver, exclusive court jurisdiction, or arbitration agreement is imposed by this page. Any such negotiated terms require express agreement and remain subject to applicable law. Contact support first about a service dispute; nothing here prevents access to competent courts, regulators, or consumer remedies where applicable.</p>
      <p>India-specific legal requirements may apply according to the operator, transaction, and user. The registered operator, approved governing-law clause, and dispute forum require confirmation; a city or jurisdiction has not been invented. Material policy changes require an appropriate publication and notice process, and renewed acceptance where applicable.</p>
    </PolicyPage>
  );
}
