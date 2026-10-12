import type { Metadata } from "next";
import Link from "next/link";
import { PolicyPage } from "@/features/shared/policy-page";
import { buildMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Cookies & Browser Storage",
  description: "The authentication storage used by the MY DETAIL OS website, how it differs from cookies, and how to clear it.",
  path: "/cookies",
});

export default function CookiesPage() {
  return (
    <PolicyPage title="Cookies & Browser Storage" description="What this website stores in your browser and how you can manage it.">
      <h2>Cookies and local storage are different</h2>
      <p>Cookies are small browser records that can be sent with web requests. Local storage stays in your browser for an origin and is read by website code. This website uses local storage for account access; it is not an authentication cookie.</p>
      <h2>Authentication storage</h2>
      <ul>
        <li><strong>Name:</strong> <code>pd_token</code>.</li>
        <li><strong>Technology and purpose:</strong> first-party local storage holding an access token after login or signup. Website code attaches the token to authenticated API requests.</li>
        <li><strong>Category:</strong> account-access functionality, not advertising or visitor analytics.</li>
        <li><strong>Duration:</strong> local storage has no automatic browser expiry. The record remains until it is removed by the application or you clear site data; the server can reject an expired token even while the record remains.</li>
      </ul>
      <p>After successful account access, the website may transfer an access token to the Workshop App through a URL fragment for sign-in. That application is a separate origin and may have its own browser storage. Protect authenticated URLs and do not share them.</p>
      <h2>Analytics, advertising, and third-party sites</h2>
      <p>The inspected website has no active analytics provider, advertising pixel, or optional tracking-cookie integration. The analytics module is an unconfigured integration point and does not send analytics events. No analytics or advertising consent categories are offered for technologies that are not installed.</p>
      <p>Links to social networks, the Workshop App, and payment-provider services lead to separate sites with their own storage and privacy practices. Their policies apply when you use them. Hosting or network services may introduce operational technologies not declared in the application code; deployment-specific verification remains necessary.</p>
      <h2>Managing storage and preferences</h2>
      <p>Use your browser&apos;s privacy settings to clear cookies and site data for this website and, separately, the Workshop App. Clear local storage as well as cookies to remove a stored access token. Doing this can sign you out but does not delete account information on the server. Avoid signing in on a shared browser or clear site data afterwards.</p>
      <p>A cookie-only blocking setting may not block local storage. Disabling browser storage can prevent account-access functions from working. There are currently no optional tracking preferences to toggle; if optional tracking is introduced, this notice and any required consent controls must be updated before it is enabled.</p>
      <p>For server-side information and privacy requests, see the <Link href="/privacy">Privacy Policy</Link>.</p>
    </PolicyPage>
  );
}