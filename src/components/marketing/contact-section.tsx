import { Mail, MessageSquare } from "lucide-react";
import Link from "next/link";
import { policySupportEmail } from "@/data/legal";
import { ContactForm } from "@/features/contact/contact-form";
import { FadeIn } from "@/components/ui/fade-in";

const contactChannels = [
  {
    icon: MessageSquare,
    title: "Sales and Support",
    primary: "Contact our team",
    note: "Submit your enquiry using the form.",
    href: "#contact-form",
  },
  {
    icon: Mail,
    title: "Email Support",
    primary: policySupportEmail,
    note: "For account, billing, and privacy enquiries.",
    href: `mailto:${policySupportEmail}`,
  },
] as const;

export function ContactSection() {
  return (
    <section className="contact-panel relative overflow-hidden py-10 sm:py-14 lg:py-16">
      <div aria-hidden className="contact-panel__glow" />
      <div aria-hidden className="contact-panel__streaks" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn className="max-w-2xl">
          <p className="flex items-center gap-2 text-xs font-semibold tracking-[0.2em] text-teal-700 uppercase">
            <span aria-hidden className="inline-flex gap-1">
              <span className="h-px w-4 self-center bg-teal-600" />
              <span className="h-px w-2 self-center bg-teal-600/50" />
            </span>
            Contact
          </p>
          <h2 className="mt-4 font-heading text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Talk to our team
          </h2>
          <p className="mt-4 text-lg leading-8 text-slate-600">
            Share your workshop details and we will follow up about product fit, pricing, or
            onboarding.
          </p>
        </FadeIn>

        <div className="mx-auto mt-10 max-w-xl sm:mt-12 lg:mx-0 lg:grid lg:max-w-none lg:grid-cols-[1.15fr_0.85fr] lg:items-start lg:gap-12">
          <FadeIn>
            <ContactForm />
          </FadeIn>

          <FadeIn delay={0.08} className="mt-10 space-y-4 lg:mt-0">
            <h3 className="text-lg font-semibold text-slate-900">Other ways to reach us</h3>
            <ul className="space-y-3">
              {contactChannels.map(({ icon: Icon, title, primary, note, href }) => (
                <li
                  key={title}
                  className="flex gap-4 rounded-2xl border border-teal-900/8 bg-white/80 p-4 shadow-sm shadow-teal-900/5 backdrop-blur-sm transition-colors hover:border-teal-500/25 hover:bg-white"
                >
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700 ring-1 ring-teal-500/15">
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-900">{title}</p>
                    <Link href={href} className="mt-1 block break-words text-sm text-teal-700 underline underline-offset-4">{primary}</Link>
                    <p className="mt-0.5 text-sm text-slate-500">{note}</p>
                  </div>
                </li>
              ))}
            </ul>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
