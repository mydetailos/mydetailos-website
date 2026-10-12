import type { Metadata } from "next";
import Link from "next/link";
import { PolicyPage } from "@/features/shared/policy-page";
import { buildMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Privacy Policy",
  description: "How MY DETAIL OS collects and uses website, account, workshop, customer, and subscription information, and how to raise privacy requests.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <PolicyPage
      title="Privacy Policy"
      description="Information about data collected through our website and workshop management services."
    >
      <h2>Scope and workshop responsibilities</h2>
      <p>MY DETAIL OS is workshop management software. This notice covers visitors, account holders, and information processed through the service. A workshop decides which staff and customer records to enter and how to use them for its business. Customers and staff should normally contact their workshop first about those records; they may also contact us about processing by the platform. Workshop responsibilities do not remove any obligations that apply to MY DETAIL OS.</p>
      <h2>Information collected</h2>
      <ul>
        <li>Enquiries and demo requests: name, business name, email, phone number, message, and the website source of the enquiry. Demo enquiries currently use the contact form.</li>
        <li>Registration and access: owner name, email, mobile number, workshop and branch names, password, selected plan, and a referral code when supplied. Login, OTP, password-reset, and account activity records support access and security.</li>
        <li>Workshop operations, when entered or uploaded: customer and staff contact/profile information, vehicle registration and service details, job cards, inspections and photos, appointments, invoices, payment records, inventory, attendance, payroll, and related business records.</li>
        <li>Subscriptions: plan, term, branch/user allowances, billing information, tax information when provided, transaction identifiers, and payment status. Payment credentials entered with a payment provider are handled by that provider; do not put card details in our forms.</li>
        <li>Browser authentication storage and technical information needed to deliver requests. Hosting and service providers may process network information such as IP addresses and request logs. See <Link href="/cookies">Cookies &amp; Browser Storage</Link>.</li>
      </ul>
      <h2>Purposes and basis for processing</h2>
      <p>Information is used to respond to the enquiry you submit, create and administer your account, authenticate access, provide workshop functions, manage subscriptions and payments, deliver requested service messages, troubleshoot problems, and maintain relevant operational records. Required form fields are needed to complete the requested flow; without them the form cannot be submitted.</p>
      <p>Where applicable law requires consent, processing must be based on valid consent for the stated purpose. Applicable permitted uses and legal obligations may provide another basis in particular circumstances. Accepting the service terms is not blanket consent to unrelated advertising. A purpose-specific legal-basis review and any additional consent mechanisms require operator and legal review.</p>
      <h2>Sharing and service providers</h2>
      <p>Authorised workshop users access records according to backend authentication and role-based permissions. Information is also processed by the hosting and database services used to operate the platform. The deployed provider names, processing locations, and contractual safeguards still require operator confirmation.</p>
      <ul>
        <li>Twilio handles recipient numbers and message content for configured SMS/WhatsApp features; WhatsApp delivery also involves WhatsApp/Meta.</li>
        <li>Resend handles recipient email addresses and content for configured email and password-reset delivery.</li>
        <li>Razorpay handles configured online subscription checkout; transaction references and statuses are recorded by the platform. Manual payment verification is also supported.</li>
        <li>Uploaded files may use configured S3-compatible storage or server-local storage. The actual storage provider must be confirmed for the deployment. Treat documents shared through public links as accessible to anyone with the link.</li>
      </ul>
      <p>Provider availability depends on configuration and the feature used. Their own notices may apply to their processing. Records may also need to be disclosed to comply with applicable legal requirements; this notice does not imply that all integrations run for every visitor.</p>
      <h2>Retention, deletion, and security</h2>
      <p>Account and business records remain in the service until changed or removed through the available account or administrative processes. No universal automatic deletion period or verified backup-erasure timetable is published. Retention schedules for enquiries, operational records, billing, logs, and backups must be confirmed by the operator, taking account of applicable legal requirements.</p>
      <p>You can request correction or deletion through the contact route below. Closing or suspending access, or clearing browser storage, does not by itself erase server records. Requests may require identity and workshop-authority checks and may be subject to legal retention obligations; do not assume immediate or complete deletion.</p>
      <p>The backend hashes account passwords and validates authentication and role-based access. These controls do not guarantee complete security or establish a security certification. Contact us if you suspect unauthorised access; protect your password, OTPs, and authenticated browser sessions.</p>
      <h2>Your requests, consent withdrawal, and complaints</h2>
      <p>Use the contact route below to ask about your information, request access or correction, request deletion, withdraw consent where processing is consent-based, or raise a privacy grievance. State the relevant purpose or record. Withdrawing consent may prevent the related service from being provided; it does not automatically remove records that must otherwise be retained lawfully.</p>
      <p>Rights under the Digital Personal Data Protection Act, 2023 and Rules, 2025, including access to information, correction/erasure, grievance redressal, and nomination, are subject to their applicable commencement provisions and legal conditions. These pages do not represent that every statutory provision is already in force or that a self-service rights system exists. Applicable statutory remedies and timelines are not restricted by this notice.</p>
      <h2>Children and processing locations</h2>
      <p>The public account flow is intended for workshop representatives able to enter a valid contract, not for children. No child-specific account or verifiable parental-consent flow is implemented on this website. Do not submit a child&apos;s information without first confirming the applicable requirements with the workshop and operator. Contact us if a child&apos;s information has been submitted inappropriately.</p>
      <p>Hosting and provider processing locations have not been verified for publication. We do not promise India-only storage or a particular international-transfer arrangement. Ask for deployment-specific information before submitting information that has residency restrictions.</p>
    </PolicyPage>
  );
}
