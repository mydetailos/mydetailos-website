"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { signupPublic } from "@/services/signup";
import { mapApiError } from "@/lib/error-messages";
import { workshopAppLoginUrl } from "@/config/site";
import { useAuthStore } from "@/store/auth-store";
import { Button } from "@/components/ui/button";
import { FloatingInput } from "@/components/ui/floating-input";
import { Alert, AlertDescription, AlertTitle } from "@/features/shared/alert";
import { OpeningWorkshopOverlay } from "@/features/auth/opening-workshop-overlay";

function validatePassword(password: string): string | null {
  if (password.length < 8) return "Password must be at least 8 characters.";
  if (!/[A-Z]/.test(password)) return "Password must include an uppercase letter.";
  if (!/[a-z]/.test(password)) return "Password must include a lowercase letter.";
  if (!/[0-9]/.test(password)) return "Password must include a number.";
  if (!/[#@$%&*!?+-]/.test(password)) {
    return "Password must include one of these special characters: # @ $ % & * ! ? + -";
  }
  return null;
}

function normalizePlanCode(raw: string | null): string | undefined {
  if (!raw) return undefined;
  const code = raw.trim().toUpperCase().replace(/[\s-]+/g, "_");
  if (!code || code.length < 2 || code.length > 24) return undefined;
  return code;
}

export function SignupForm() {
  const searchParams = useSearchParams();
  const planCode = useMemo(
    () => normalizePlanCode(searchParams.get("plan") ?? searchParams.get("planCode")),
    [searchParams]
  );
  const referralCode = useMemo(() => {
    const raw = (searchParams.get("ref") ?? searchParams.get("referral") ?? "").trim().toUpperCase();
    return /^[A-Z0-9-]{4,24}$/.test(raw) ? raw : undefined;
  }, [searchParams]);
  const [businessName, setBusinessName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [branchName, setBranchName] = useState("HQ");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [redirectHref, setRedirectHref] = useState<string | null>(null);
  const setSession = useAuthStore((s) => s.setSession);

  const passwordMismatch = useMemo(
    () => confirmPassword.length > 0 && password !== confirmPassword,
    [password, confirmPassword]
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setRedirectHref(null);

    if (!acceptedTerms) {
      setError("Please read and accept the Terms & Conditions before creating an account.");
      return;
    }

    if (passwordMismatch) {
      setError("Password and confirm password must match.");
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    const phoneDigits = phone.replace(/\D/g, "");
    if (phoneDigits.length < 10) {
      setError("Enter a valid 10-digit mobile number.");
      return;
    }

    setIsRedirecting(true);

    try {
      const result = await signupPublic({
        businessName: businessName.trim(),
        ownerName: ownerName.trim(),
        email: email.trim(),
        phone: phoneDigits.slice(-10),
        password,
        branchName: branchName.trim() || "HQ",
        ...(planCode ? { planCode } : {}),
        ...(referralCode ? { referralCode } : {}),
      });

      setSession(result.user, result.accessToken);
      const orgSlug = (result.organization?.slug ?? "").trim().toLowerCase() || null;
      if (!orgSlug) {
        setError("Organization slug was not returned. Please contact support.");
        setIsRedirecting(false);
        return;
      }
      const dest = workshopAppLoginUrl({
        accessToken: result.accessToken,
        next: result.user.mustChangePassword ? "/change-password" : "/dashboard",
        orgSlug,
        referralCode,
      });

      let destUrl: URL;
      try {
        destUrl = new URL(dest);
      } catch {
        setError(
          "Workshop app URL is invalid. Set NEXT_PUBLIC_WORKSHOP_APP_URL on Vercel (include https://)."
        );
        setIsRedirecting(false);
        return;
      }

      const isHostedMarketing = !/^localhost$|^127\.0\.0\.1$/.test(window.location.hostname);
      if (isHostedMarketing && /localhost|127\.0\.0\.1/.test(destUrl.hostname)) {
        setError(
          "Workshop app URL is misconfigured (points to localhost). Set NEXT_PUBLIC_WORKSHOP_APP_URL on Vercel."
        );
        setIsRedirecting(false);
        return;
      }
      if (destUrl.origin === window.location.origin) {
        setError(
          "Workshop app URL points at this marketing site. Set NEXT_PUBLIC_WORKSHOP_APP_URL to the workshop app, then redeploy."
        );
        setIsRedirecting(false);
        return;
      }

      setRedirectHref(dest);
      window.location.assign(dest);
    } catch (err) {
      setError(mapApiError(err));
      setIsRedirecting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-5">
      {isRedirecting ? <OpeningWorkshopOverlay href={redirectHref} /> : null}

      <div className="grid gap-3.5 sm:grid-cols-2 sm:gap-5">
        <FloatingInput
          id="ownerName"
          label="Owner Name"
          value={ownerName}
          onChange={(e) => setOwnerName(e.target.value)}
          required
          autoComplete="name"
          placeholder="John Doe"
        />
        <FloatingInput
          id="email"
          type="email"
          label="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          placeholder="john@example.com"
        />

        <div className="sm:col-span-2">
          <label
            htmlFor="phone"
            className="mb-1.5 block text-sm font-medium text-slate-600 sm:mb-2"
          >
            Mobile Number
          </label>
          <div className="flex gap-2">
            <div className="flex h-11 shrink-0 items-center justify-center rounded-xl border-2 border-slate-200 bg-slate-50 px-3 text-sm font-medium text-slate-500 sm:h-12">
              +91
            </div>
            <input
              id="phone"
              type="tel"
              inputMode="numeric"
              autoComplete="tel-national"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
              required
              maxLength={10}
              placeholder="10-digit mobile number"
              className="block h-11 w-full rounded-xl border-2 border-slate-200 bg-white px-3.5 text-base text-slate-900 placeholder:text-slate-400 focus:border-teal-600 focus:outline-none focus:ring-0 sm:h-12 sm:text-sm"
            />
          </div>
        </div>

        <div className="sm:col-span-2">
          <FloatingInput
            id="businessName"
            label="Workshop / Business Name"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            required
            autoComplete="organization"
            placeholder="My Workshop"
          />
        </div>

        <div className="sm:col-span-2">
          <FloatingInput
            id="branchName"
            label="Branch Name"
            value={branchName}
            onChange={(e) => setBranchName(e.target.value)}
            autoComplete="off"
            placeholder="HQ"
          />
        </div>

        <div className="space-y-1.5 sm:col-span-2 sm:space-y-2">
          <FloatingInput
            id="password"
            type="password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
            placeholder="Strong password"
          />
          <p className="text-xs leading-snug text-slate-500 sm:leading-relaxed">
            Min. 8 characters with uppercase, lowercase, a number, and a special character
            (#@$%&*!?+-).
          </p>
        </div>

        <div className="space-y-1.5 sm:col-span-2 sm:space-y-2">
          <FloatingInput
            id="confirmPassword"
            type="password"
            label="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            autoComplete="new-password"
            placeholder="Confirm password"
          />
          {passwordMismatch && (
            <p className="text-xs font-medium text-red-600">Passwords do not match.</p>
          )}
        </div>
      </div>

      <div className="space-y-3 text-sm leading-6 text-slate-600">
        <label className="flex items-start gap-3" htmlFor="acceptedTerms">
          <input
            id="acceptedTerms"
            type="checkbox"
            checked={acceptedTerms}
            onChange={(event) => setAcceptedTerms(event.target.checked)}
            required
            className="mt-1 size-4 shrink-0 accent-teal-600"
          />
          <span>I have read and accept the <Link href="/terms" target="_blank" rel="noopener noreferrer" className="font-medium text-teal-700 underline">Terms &amp; Conditions</Link> and am authorised to create this workshop account.</span>
        </label>
        <p>
          We use your details to create and administer your account. Read the <Link href="/privacy" target="_blank" rel="noopener noreferrer" className="font-medium text-teal-700 underline">Privacy Policy</Link> and <Link href="/subscriptions" target="_blank" rel="noopener noreferrer" className="font-medium text-teal-700 underline">subscription, refund and cancellation disclosures</Link> before registering. Terms acceptance is not consent to unrelated marketing.
        </p>
      </div>

      <Button
        type="submit"
        size="lg"
        disabled={isRedirecting || passwordMismatch}
        className="trial-cta mt-0.5 h-11 w-full rounded-xl bg-teal-600 text-base font-semibold text-white hover:bg-teal-500 sm:mt-1 sm:h-12"
      >
        <span className="inline-flex items-center justify-center gap-2">
          <span className="sm:hidden">Start Free Trial</span>
          <span className="hidden sm:inline">Sign Up & Start Free Trial</span>
        </span>
      </Button>

      <p className="text-center text-sm text-slate-600">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-teal-600 hover:underline">
          Sign In
        </Link>
      </p>

      {error && (
        <Alert tone="error">
          <AlertTitle>Signup failed</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </form>
  );
}
