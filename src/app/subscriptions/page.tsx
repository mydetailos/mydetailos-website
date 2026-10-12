import type { Metadata } from "next";
import Link from "next/link";
import { PolicyPage } from "@/features/shared/policy-page";
import { buildMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Subscriptions, Refunds & Cancellation",
  description: "MY DETAIL OS trial, subscription, payment-verification, cancellation, and refund enquiry processes, with commercial terms awaiting confirmation.",
  path: "/subscriptions",
});

export default function SubscriptionsPage() {
  return (
    <PolicyPage title="Subscriptions, Refunds & Cancellation" description="The current subscription process and how to raise billing, cancellation, or refund requests.">
      <h2>Plans and purchase information</h2>
      <p>Subscriptions provide workshop software access with plan-specific features and branch/user allowances. Review the <Link href="/pricing">pricing page</Link>, then confirm the plan, billing term, taxes, add-ons, discounts, and payable total in checkout or a written quotation. Displayed fallback prices do not replace the final quote. No purchase is made by merely viewing a plan.</p>
      <h2>Free trials and paid activation</h2>
      <p>The trial duration is configured by the platform and displayed during signup. Registration creates a trial account without collecting payment-card details in the signup form. Check your subscription screen for its actual expiry and entitlement. A paid plan is activated through the available payment or administrative verification process, not by a promise on this page.</p>
      <p>The inspected signup and renewal flows do not establish automatic recurring charges or automatic paid conversion at trial expiry. No automatic-renewal mandate is promised or imposed here. If such a facility is offered later, its charges and consent requirements must be disclosed separately before authorisation.</p>
      <h2>Billing, payments, and renewal</h2>
      <p>Online subscription payments use Razorpay where configured; manual payments may require platform-administrator verification. The account records payment references and statuses and provides subscription bills through the available account features. A pending request, payment link, or checkout opening is not proof of successful payment or renewed access.</p>
      <p>Renewal is requested through the account&apos;s available subscription flow or support. Term options and eligible add-ons depend on the current plan and quote. Confirm renewal pricing before authorising payment; no cancellation deadline or price-lock guarantee has been approved for publication.</p>
      <h2>Cancellation and account closure</h2>
      <p>No customer self-service subscription cancellation endpoint was found in the inspected flow. Contact support with your workshop/account identifier, the subscription concerned, and whether you want to stop future renewal, request closure, or dispute a charge. Ask for written confirmation of the resulting access and billing status.</p>
      <p>Administrative suspension changes access status; it is not necessarily customer-requested cancellation, a refund, or erasure of records. Discuss necessary exports and outstanding records before closure. A specific cancellation notice period, effective date, or entitlement to unused-term credit has not been confirmed.</p>
      <h2>Refund requests</h2>
      <p>Refund eligibility, time limits, partial-term treatment, excluded charges, and processing periods have not been approved for publication. This page does not invent a money-back guarantee or declare charges non-refundable. Applicable statutory rights and remedies are preserved.</p>
      <p>To request review of a charge, contact support with the workshop identifier, bill or payment reference, transaction date, amount, and reason. Do not send card numbers, passwords, or OTPs. Obtain written confirmation of any approved refund amount, payment method, and expected processing timeline. Payment-provider or bank settlement timing may differ from the operator&apos;s review process.</p>
      <h2>Failed, duplicate, or disputed payments</h2>
      <p>If a payment fails or money is debited without updated access, check the payment status and contact support before paying again. Provide the transaction reference and relevant receipt with sensitive details removed. Manual verification or gateway status reconciliation may be necessary. You may also use the provider&apos;s or bank&apos;s applicable dispute process; this policy does not limit lawful remedies.</p>
      <h2>Commercial details awaiting approval</h2>
      <ul>
        <li>Trial limitations and the treatment of records and access after trial expiry.</li>
        <li>Cancellation effective dates, notice requirements, and unused-term treatment.</li>
        <li>Refund eligibility, duplicate-payment handling, approval and processing timelines, and any lawful exclusions.</li>
        <li>Invoice issuer, applicable tax registration, payment contact, and complaint-resolution commitments.</li>
      </ul>
      <p>Ask for the applicable written commercial terms before purchasing if these details affect your decision. Read these disclosures with the <Link href="/terms">Terms &amp; Conditions</Link>; neither page overrides mandatory consumer protections.</p>
    </PolicyPage>
  );
}