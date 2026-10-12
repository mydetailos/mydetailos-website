# MY DETAIL OS website legal-policy audit

This is an implementation audit, not legal advice, certification, or approval of commercial terms. The review date is 13 October 2026; it is not a policy effective date. Changes are confined to the website repository. Backend services and schemas were inspected read-only and were not changed for this task.

## Initial audit

1. Existing policies: `/privacy` and `/terms`, each containing only three general paragraphs. No cookies, refund, cancellation, disclaimer, marketplace, or separate IP policy route was present.
2. Missing content: actual information categories, enquiry purposes, workshop/customer responsibilities, processor disclosures, retention limitations, privacy request routes, children, processing locations, subscription/payment procedures, cancellation/refund uncertainty, IP and service disclaimers. Signup had no explicit terms acceptance; enquiry and access forms had no linked privacy notices.
3. Navigation: Terms and Privacy existed, but footer labels were ambiguous. "Security" linked to Privacy, and "Sitemap" incorrectly linked to Features rather than the sitemap. No broken existing policy route was identified. New policies needed footer, cross-link, metadata, sitemap, and public-route integration.
4. Client confirmation: registered operator and address, relevant tax/registration details, grievance officer, approved effective dates, actual deployed providers/locations, retention schedules, complaint procedures, contractual jurisdiction, refunds and cancellation conditions. The contact section contained an uncorroborated generic phone number, headquarters claim, and 24-hour response promise.

## Implementation evidence

| Surface | Verified implementation |
| --- | --- |
| Signup | Owner name, email, mobile number, workshop/branch names, password, selected plan, optional referral code; real `/api/public/signup` call; token stored and handed to the Workshop App. |
| Login/recovery | Email/password or mobile OTP; password recovery via backend; browser access-token storage. Backend hashes passwords and validates authentication/role-based access. |
| Contact/demo | Name, business name, email, phone, message, `public_website` source; real `/api/public/contact`. Demo page links to this contact flow; no independent scheduling feature was found. |
| Browser technology | `pd_token` in first-party local storage; no automatic storage expiry. Analytics functions are stubs; no active analytics/pixel/optional cookie integration found in source. Fonts are bundled through `next/font`, not an added client tracking provider. Production CDN/network technologies still need independent verification. |
| Pricing | Loads `/api/public/plans` with static fallback cards. Corrected the public "mock/demo" description and misleading synced-price fallback note. No prices or checkout calculations changed. |
| Trial | Backend-configured trial length, with website fallback display if lookup fails. No payment-card collection at signup. A fixed commercial promise was not added. |
| Renewal/payments | Subscription quote/renewal flows, optional Razorpay orders/payment links and manual verification, payment references/statuses and bills. No recurring debit mandate or consumer self-service cancellation/refund endpoint was identified in the inspected flow. |
| Suspension | Administrative organisation/subscription suspension/restoration exists; it is not proof of customer cancellation, refund processing, or record erasure. |
| Integrations | Twilio SMS/WhatsApp, Resend email, Razorpay subscription payments, PostgreSQL through Prisma, optional S3-compatible or local file storage. Deployment-specific hosting/database/storage vendor names, locations, contracts, and safeguards remain unverified. |
| Business model | Workshop management SaaS. Customer operational records and vendor ledgers do not establish a buyer/seller marketplace. |

## Completed corrections

- Privacy: expanded categories, purposes, workshop/platform roles, configured providers, limited security statements, retention/deletion limitations, contact/request/withdrawal routes, grievances, children, and processing-location uncertainty. No automated deletion, India-only hosting, certification, or universal compliance claim was made.
- Terms: preserved original account accuracy, backend entitlement, and Workshop App points; added authority/capacity requirements, acceptable use, data responsibilities, subscription references, suspension/closure disclosures, IP, third-party dependencies, and service disclaimer. No liability cap, blanket waiver, arbitration, exclusive venue, registered entity, or refund commitment was invented.
- Cookies & Browser Storage: justified by authentication local storage; distinguishes it from cookies, documents `pd_token`, token lifetime versus storage lifetime, cross-origin app handoff, and browser clearing. No fictitious analytics categories or unnecessary consent banner were added. Reassess consent before introducing optional tracking.
- Subscriptions, Refunds & Cancellation: documents current trial/payment/renewal behaviour, support-based requests, failed/duplicate/disputed-payment handling, and explicitly unapproved commercial terms. No automatic conversion, refund period, cancellation deadline, or non-refundable fee was invented.
- Separate disclaimer/IP pages: not necessary; included in Terms. No marketplace/vendor policy created because the inspected SaaS business model does not justify one.
- Forms: unchecked required Terms acceptance at signup, separate purpose-based Privacy notice, subscription-policy access, enquiry notice, and login/recovery privacy/storage links. No new marketing-consent assumption or API payload/schema change.
- Contact: removed the unverified generic phone, headquarters and response-time claims. Retained the existing published support email and working contact-form route. The mailbox's monitoring/ownership still requires client confirmation.
- UX/SEO: reused `PageShell`, omitted its promotional CTA for policy reading, added a readable responsive legal layout and labelled cross-navigation, explicit footer labels, canonical/title/description metadata, sitemap entries, and public-route entries.

## Indian legal framework and official sources

The applicability assessment is provisional until the registered operator, customer categories, contracts, deployment, and processing roles are confirmed. A workshop SaaS is not automatically a marketplace, and a business subscription is not automatically a covered consumer transaction.

Official documents directly examined:

- [DPDP Act commencement notification, G.S.R. 843(E), 13 November 2025](https://www.meity.gov.in/static/uploads/2025/11/c56ceae6c383460ca69577428d36828b.pdf): specified institutional provisions commence at publication; section 6(9) and section 27(1)(d) after one year; core sections 3-17 and other listed provisions after eighteen months. Section 44(2), relevant to the IT Act transition, is also in the eighteen-month phase. Do not treat assent in 2023 or the announcement in 2025 as commencement of every duty.
- [Final DPDP Rules, G.S.R. 846(E), 13 November 2025](https://www.meity.gov.in/static/uploads/2025/11/53450e6e5dc0bfa85ebd78686cadad39.pdf): rule 1(2)-(4) puts Rules 1, 2, 17-21 at publication, Rule 4 after one year, and Rules 3, 5-16, 22-23 after eighteen months. Rule 3 requires an independently understandable notice with itemised information/purposes and routes for withdrawal, rights, and Board complaints when applicable. Other rules address security, breaches, retention, contact information, children/guardians, and rights procedures. Counsel must check any subsequent amendments and applicable notifications before publication.
- [PIB announcement, 14 November 2025](https://www.pib.gov.in/PressReleseDetailm.aspx?PRID=2190014): confirms phased implementation and notice/rights/contact expectations. The Gazette is the controlling source for commencement, not the press-release headline.
- [IT Act, 2000 on India Code](https://www.indiacode.nic.in/bitstream/123456789/13116/1/it_act_2000_updated.pdf): reviewed for electronic transactions and the existing data-protection/security framework. Counsel must assess sections 43A, 72A and applicable 2011 SPDI Rules through the transition, including privacy notices, consent where required, grievance handling, retention and provider/transfer safeguards.

The Consumer Affairs pages/PDF for the Consumer Protection Act, 2019 and Consumer Protection (E-Commerce) Rules, 2020 could not be reliably retrieved during this review. [Department of Consumer Affairs](https://consumeraffairs.gov.in/) is the official verification starting point. No unverified legal deadline was inserted. Counsel must verify the current instruments, amendments, business/consumer applicability, grievance acknowledgement/redress timelines, operator disclosures, fair cancellation/refund terms, and explicit affirmative purchase consent. Absence of a marketplace does not itself exclude all e-commerce requirements.

Contract/IP review should also consider capacity/authority, electronic acceptance, applicable Indian contract requirements, brand/content/software rights, and non-excludable consumer remedies. No forum, governing-law clause, warranty waiver or liability limit should be finalised without approval.

## Required client decisions before final publication

1. What is the exact contracting entity, legal form, registered address, registration number, applicable GSTIN, and invoice issuer? Supply approved public disclosures, not credentials.
2. Who is the designated grievance/privacy contact, and what monitored email, postal/phone contact and escalation procedure should be published? Is `support@mydetailos.com` monitored for privacy and billing requests?
3. Approve policy wording, versions, effective dates and change-notification process. The audit date is not an effective date.
4. Identify the production hosting, database, file-storage and other processors, processing countries/regions, subcontractors, contractual safeguards, and any transfer/residency restrictions. Configured SDKs alone do not verify production locations.
5. Approve retention schedules for enquiries, account/staff/customer/vehicle records, bills, activity logs, uploads, and backups; define deletion/withdrawal verification, legal holds, processor deletion, response timelines and export arrangements. Current pages cannot substitute for missing operational controls.
6. Confirm workshop-versus-platform data roles and processor arrangements; child/guardian handling, permitted staff processing, language/accessibility requirements and any applicable exemptions. No child-specific consent mechanism currently exists on this website.
7. Approve actual trial limitations, post-expiry access/data handling, cancellation process/effective dates, unused-term treatment, and whether recurring mandates will ever be offered. Confirm the signup fallback duration cannot misrepresent a configured trial.
8. Approve refund eligibility, duplicate/failed payment treatment, exclusions (if lawful), review/processing timelines, payment-dispute escalation, and communication templates. No non-refundable fee or refund guarantee has been approved.
9. Approve governing law, jurisdiction, warranties, service levels, liability terms and any negotiated enterprise conditions. Mandatory remedies must remain available.
10. Confirm whether analytics, pixels, cookies, embedded widgets or other tracking are injected outside source at the hosting/CDN layer. Introduce purpose-specific preferences and prior consent where required before enabling optional tracking.

## Follow-up requiring implementation outside this website-only scope

- Persist accepted policy version/time and appropriate consent evidence on the backend before representing that an auditable acceptance system exists. The new checkbox is a frontend gate only, not proof of server-side consent logging.
- Define monitored privacy/grievance operations and appropriate rights/withdrawal channels; ensure withdrawal is comparably easy where required. A support link alone is not legal compliance.
- Implement approved retention, deletion, export, breach-response and processor safeguards; confirm rules specific to any Significant Data Fiduciary designation.
- Show final approved commercial terms at actual Workshop App checkout and cancellation/refund workflows. The website notice does not modify checkout, payment mandates, or gateway refunds.

## Files created

- `src/data/legal.ts`
- `src/features/shared/policy-page.tsx`
- `src/app/cookies/page.tsx`
- `src/app/subscriptions/page.tsx`
- `src/__tests__/legal-policies.test.tsx`
- `docs/legal-policy-audit.md`

## Files modified

- `src/app/privacy/page.tsx`
- `src/app/terms/page.tsx`
- `src/app/pricing/page.tsx`
- `src/data/navigation.ts`
- `src/data/pricing.ts`
- `src/features/marketing/data.ts`
- `src/features/auth/signup-form.tsx`
- `src/features/auth/login-form.tsx`
- `src/features/auth/forgot-password-form.tsx`
- `src/features/contact/contact-form.tsx`
- `src/components/marketing/contact-section.tsx`
- `src/components/marketing/pricing-section.tsx`
- `src/middleware.ts`
- `src/__tests__/signup-form.test.tsx`

## Verification

- Focused policy/signup tests: 10 passed.
- Full TypeScript check: passed.
- ESLint on all changed source/test files: passed.
- Production build: passed; all four legal routes are generated. Existing Next.js middleware-to-proxy deprecation warning remains; no unrelated migration performed.
- Full Jest suite: 19 passed, 3 failed. Existing failures: missing `useReducedMotion` in the shared Framer Motion mock affects pricing/home tests; the login test's broad password label selector matches both the field and its visibility button. These were not introduced by policy changes.
- Full lint: 12 errors and 42 warnings in untouched files, including test setup, feature content, navbar effects, marketing animations/testimonials and the opening-workshop overlay. Unrelated fixes were not made.
- Browser/link/responsive verification results are recorded below after preview checks.

Footer policy URLs: `/privacy`, `/terms`, `/cookies`, `/subscriptions`; sitemap link: `/sitemap.xml`.

The pages deliberately mark unresolved details. They should not be presented as final approved contracts or as proof of legal compliance until the client and an Indian legal professional complete the listed review.