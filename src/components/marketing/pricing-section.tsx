"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Building2, Check, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/ui/fade-in";
import { pricingNote, pricingPlans, type PricingPlan } from "@/data/pricing";
import { getPublicPlans, mapPublicPlansToCards } from "@/api/pricing";
import { cn } from "@/lib/utils";

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

export function PricingSection({ compact = false }: { compact?: boolean }) {
  const reduceMotion = useReducedMotion();
  const [plans, setPlans] = useState<PricingPlan[]>(pricingPlans);
  const [note, setNote] = useState(pricingNote);

  useEffect(() => {
    let cancelled = false;
    getPublicPlans()
      .then((res) => {
        if (cancelled) return;
        const mapped = mapPublicPlansToCards(res);
        if (mapped.length) {
          setPlans(mapped);
          setNote(
            res.pricing.source === "platform_settings"
              ? "Live prices from platform admin. GST extra as applicable."
              : "Prices from platform configuration. GST extra as applicable."
          );
        }
      })
      .catch(() => {
        /* keep static fallback */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section
      id="pricing"
      className={cn(
        "relative overflow-hidden scroll-mt-[calc(3.5rem+env(safe-area-inset-top)+0.5rem)] sm:scroll-mt-[calc(4rem+env(safe-area-inset-top)+0.5rem)]",
        compact ? "mt-2" : "bg-[linear-gradient(180deg,#f8fafc_0%,#f0fdfa_42%,#ffffff_100%)] py-14 sm:py-20 lg:py-24"
      )}
    >
      {!compact && (
        <>
          <div
            aria-hidden
            className="pointer-events-none absolute top-0 left-1/2 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-teal-200/30 blur-[100px]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-teal-400/40 to-transparent"
          />
        </>
      )}

      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {!compact && (
          <FadeIn className="mx-auto max-w-2xl text-center">
            <p className="inline-flex items-center rounded-full bg-teal-50 px-3 py-1 text-sm font-semibold text-teal-700 ring-1 ring-inset ring-teal-500/20">
              Pricing
            </p>
            <h2 className="mt-5 text-balance font-heading text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-[2.75rem]">
              Plans that scale with your workshop.
            </h2>
            <p className="mt-4 text-base text-slate-600 sm:text-lg">
              Start with a free trial, then choose based on branches and team size.
            </p>
          </FadeIn>
        )}

        <div className={cn("grid gap-4 sm:gap-5 lg:grid-cols-4 lg:gap-5", compact ? "" : "mt-8 sm:mt-12")}>
          {plans.map((plan, index) => {
            const featured = Boolean(plan.highlighted);
            const fromX = index % 2 === 0 ? -36 : 36;

            return (
              <motion.article
                key={`${plan.id}-${plan.name}`}
                initial={reduceMotion ? false : { opacity: 0, y: 36, x: fromX * 0.35 }}
                whileInView={{ opacity: 1, y: 0, x: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.55, delay: index * 0.08, ease: EASE_OUT }}
                className={cn(
                  "group relative flex h-full flex-col overflow-hidden rounded-3xl p-6 transition-transform duration-300 hover:-translate-y-1.5 sm:p-7",
                  featured
                    ? "bg-slate-950 text-white shadow-[0_28px_60px_-28px_rgba(15,23,42,0.55)] ring-1 ring-teal-400/40 lg:-mt-3 lg:mb-[-0.75rem] lg:pb-8"
                    : "border border-slate-200/90 bg-white/90 shadow-[0_18px_40px_-28px_rgba(15,23,42,0.35)] backdrop-blur-sm hover:border-teal-300/60 hover:shadow-[0_24px_50px_-28px_rgba(15,118,110,0.28)]"
                )}
              >
                {featured && (
                  <>
                    <div
                      aria-hidden
                      className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-[radial-gradient(ellipse_at_top,rgba(251,134,18,0.28),transparent_70%)]"
                    />
                    <p className="relative mb-4 inline-flex w-fit items-center rounded-full bg-teal-400/15 px-2.5 py-1 text-[11px] font-bold tracking-[0.14em] text-teal-300 uppercase ring-1 ring-teal-400/25">
                      Most popular
                    </p>
                  </>
                )}

                <h3
                  className={cn(
                    "relative text-xl font-bold tracking-tight",
                    featured ? "text-white" : "text-slate-900"
                  )}
                >
                  {plan.name}
                </h3>
                <p
                  className={cn(
                    "relative mt-2 min-h-12 text-sm leading-relaxed",
                    featured ? "text-slate-300" : "text-slate-600"
                  )}
                >
                  {plan.description}
                </p>

                <div className="relative mt-6">
                  <p
                    className={cn(
                      "font-heading text-4xl font-bold tracking-tight",
                      featured ? "text-white" : "text-slate-900"
                    )}
                  >
                    {plan.priceLabel}
                  </p>
                  <p
                    className={cn(
                      "mt-1.5 text-xs",
                      featured ? "text-slate-400" : "text-slate-500"
                    )}
                  >
                    {plan.billingDuration}
                  </p>
                </div>

                <div className="relative mt-5 flex flex-wrap gap-2">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
                      featured
                        ? "bg-white/10 text-teal-100 ring-1 ring-white/10"
                        : "bg-teal-50 text-teal-800 ring-1 ring-teal-500/15"
                    )}
                  >
                    <Building2 className="size-3.5 opacity-80" aria-hidden />
                    {plan.branches}
                  </span>
                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
                      featured
                        ? "bg-white/10 text-teal-100 ring-1 ring-white/10"
                        : "bg-slate-100 text-slate-700 ring-1 ring-slate-200"
                    )}
                  >
                    <Users className="size-3.5 opacity-80" aria-hidden />
                    {plan.users}
                  </span>
                </div>

                <ul className="relative mt-6 flex-1 space-y-3">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className={cn(
                        "flex items-start gap-2.5 text-sm leading-snug",
                        featured ? "text-slate-200" : "text-slate-700"
                      )}
                    >
                      <span
                        className={cn(
                          "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full",
                          featured ? "bg-teal-400/20 text-teal-300" : "bg-teal-50 text-teal-600"
                        )}
                      >
                        <Check className="size-3" strokeWidth={2.5} aria-hidden />
                      </span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={plan.ctaHref}
                  className="relative mt-7"
                  {...(plan.ctaHref === "/signup" || plan.ctaHref === "/login"
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                >
                  <Button
                    variant={featured ? "default" : "outline"}
                    className={cn(
                      "btn-marketing group h-11 w-full rounded-full text-sm font-semibold transition-all duration-300",
                      plan.ctaHref === "/signup" || plan.ctaLabel.toLowerCase().includes("trial")
                        ? "trial-cta"
                        : "",
                      featured
                        ? "bg-teal-400 text-slate-950 hover:bg-teal-300"
                        : plan.ctaHref === "/signup" || plan.ctaLabel.toLowerCase().includes("trial")
                          ? "border-transparent bg-teal-600 text-white hover:bg-teal-500"
                          : "border-slate-200 bg-white text-slate-900 hover:border-teal-400 hover:bg-teal-50 hover:text-teal-900"
                    )}
                  >
                    <span className="inline-flex items-center justify-center gap-1.5">
                      {plan.ctaLabel}
                      {(plan.ctaHref === "/signup" ||
                        plan.ctaLabel.toLowerCase().includes("trial")) && (
                        <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                      )}
                    </span>
                  </Button>
                </Link>
              </motion.article>
            );
          })}
        </div>

        <FadeIn delay={0.35}>
          <p
            className={cn(
              "mt-8 text-center text-xs",
              compact ? "text-muted-foreground" : "text-slate-500"
            )}
          >
            {note}
          </p>
          <p className="mt-3 text-center text-sm leading-6 text-muted-foreground">
            Review <Link href="/subscriptions" className="text-teal-700 underline underline-offset-4">subscription, refund and cancellation disclosures</Link> and <Link href="/terms" className="text-teal-700 underline underline-offset-4">Terms &amp; Conditions</Link> before purchasing.
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
