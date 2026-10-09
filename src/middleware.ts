import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Marketing site (mydetailos.com / :3003) does not host workshop/customer app routes.
 * Tenant paths like /{orgSlug}/customer/login belong on the workshop app (:3002).
 */

const RESERVED_FIRST = new Set(
  [
    "login",
    "signup",
    "register",
    "pricing",
    "features",
    "solutions",
    "about",
    "contact",
    "demo",
    "faq",
    "privacy",
    "terms",
    "forgot-password",
    "how-it-works",
    "api",
    "_next",
    "brand",
    "favicon.ico",
    "robots.txt",
    "sitemap.xml",
  ].map((s) => s.toLowerCase())
);

/** First path segment after org slug that means "this is a workshop app route". */
const WORKSHOP_APP_SEGMENTS = new Set(
  [
    "customer",
    "login",
    "dashboard",
    "change-password",
    "reset-password",
    "job-cards",
    "bookings",
    "billing",
    "settings",
    "staff",
    "customers",
    "vehicles",
    "inventory",
    "reports",
    "saas-admin",
  ].map((s) => s.toLowerCase())
);

function workshopOrigin(): string {
  const fromEnv = process.env.NEXT_PUBLIC_WORKSHOP_APP_URL?.trim().replace(/\/$/, "");
  if (fromEnv) {
    if (/^https?:\/\//i.test(fromEnv)) return fromEnv;
    return `https://${fromEnv.replace(/^\/+/, "")}`;
  }
  if (process.env.NODE_ENV !== "production") {
    return "http://localhost:3002";
  }
  return "https://app.mydetailos.com";
}

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const segments = pathname.split("/").filter(Boolean);
  const first = segments[0]?.toLowerCase();
  const second = segments[1]?.toLowerCase();

  if (!first || RESERVED_FIRST.has(first) || first.includes(".")) {
    return NextResponse.next();
  }

  // /{orgSlug}/customer/... or /{orgSlug}/login|dashboard|...
  if (second && WORKSHOP_APP_SEGMENTS.has(second)) {
    const dest = `${workshopOrigin()}${pathname}${search}`;
    return NextResponse.redirect(dest);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
