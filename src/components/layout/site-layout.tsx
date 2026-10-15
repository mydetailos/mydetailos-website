"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ScrollToTop } from "@/components/marketing/scroll-to-top";

export function SiteLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage =
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname === "/forgot-password" ||
    pathname === "/reset-password";

  // Feature pages have dark hero sections that need to reach the absolute top of the screen
  const isFeaturePage = pathname.startsWith("/features/");
  const hasNoTopPadding = isFeaturePage;

  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden">
      <Navbar />
      <main
        className={
          hasNoTopPadding
            ? "flex-1"
            : "flex-1 pt-[calc(3.5rem+env(safe-area-inset-top))] sm:pt-[calc(4rem+env(safe-area-inset-top))]"
        }
      >
        {children}
      </main>
      {!isAuthPage && <Footer />}
      <ScrollToTop />
    </div>
  );
}
