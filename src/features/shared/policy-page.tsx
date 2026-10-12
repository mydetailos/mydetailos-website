import Link from "next/link";
import type { ReactNode } from "react";
import { PageShell } from "@/features/shared/page-shell";
import { policyLinks, policySupportEmail } from "@/data/legal";

export function PolicyPage({ title, description, children }: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <PageShell title={title} description={description} showCta={false}>
      <div className="max-w-3xl">
        <nav aria-label="Legal policies" className="mb-8 flex flex-wrap gap-x-5 gap-y-3 border-y border-border py-4 text-sm">
          {policyLinks.map((policy) => (
            <Link key={policy.href} href={policy.href} className="font-medium text-teal-700 underline underline-offset-4 hover:text-teal-900">
              {policy.label}
            </Link>
          ))}
        </nav>
        <article className="space-y-5 break-words text-base leading-7 text-muted-foreground [&_h2]:mt-9 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-foreground [&_h2]:tracking-normal [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6 [&_a]:text-teal-700 [&_a]:underline [&_a]:underline-offset-4">
          {children}
          <h2>Contact and publication details</h2>
          <p>
            Send policy questions or complaints through our <Link href="/contact">contact form</Link> or the published support address, <a href={`mailto:${policySupportEmail}`}>{policySupportEmail}</a>. Include the relevant workshop or account and the nature of your request, but never send passwords, OTPs, or full payment-card details.
          </p>
          <p className="border-l-2 border-amber-500 pl-4 text-sm">
            Pending operator confirmation: the registered legal entity, registered address, applicable registration details, designated grievance officer and contact details, and approved policy effective date have not yet been confirmed for publication. MY DETAIL OS is the product brand, not a verified registered company name. This page does not certify legal compliance.
          </p>
        </article>
      </div>
    </PageShell>
  );
}