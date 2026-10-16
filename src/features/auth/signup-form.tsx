"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Loader2, ShieldCheck } from "lucide-react";
import { sendSignupOtpPublic, signupPublic } from "@/services/signup";
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

  // Step state
  const [step, setStep] = useState<"details" | "verify">("details");

  // Form fields
  const [businessName, setBusinessName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [branchName, setBranchName] = useState("HQ");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  // OTP state
  const [otp, setOtp] = useState("");
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(30);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);
  const [devDemoCode, setDevDemoCode] = useState<string | null>(null);

  // Global submit / navigation state
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [redirectHref, setRedirectHref] = useState<string | null>(null);
  const setSession = useAuthStore((s) => s.setSession);

  const passwordMismatch = useMemo(
    () => confirmPassword.length > 0 && password !== confirmPassword,
    [password, confirmPassword]
  );

  // Resend countdown timer
  useEffect(() => {
    if (step !== "verify" || resendCountdown <= 0) return;
    const interval = setInterval(() => {
      setResendCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [step, resendCountdown]);

  // Step 1: Submit Details & Send OTP
  async function handleDetailsSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccessNotice(null);
    setDevDemoCode(null);

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

    setIsSendingOtp(true);

    try {
      const tenDigits = phoneDigits.slice(-10);
      const res = await sendSignupOtpPublic(tenDigits, email.trim());
      setStep("verify");
      setOtp("");
      setResendCountdown(30);
      setSuccessNotice(`Verification code sent to +91 ${tenDigits}`);
      if (res.devDemoCode) {
        setDevDemoCode(res.devDemoCode);
      }
    } catch (err) {
      setError(mapApiError(err));
    } finally {
      setIsSendingOtp(false);
    }
  }

  // Resend OTP in Step 2
  async function handleResendOtp() {
    if (resendCountdown > 0 || isSendingOtp) return;
    setError(null);
    setSuccessNotice(null);
    setIsSendingOtp(true);
    try {
      const phoneDigits = phone.replace(/\D/g, "").slice(-10);
      const res = await sendSignupOtpPublic(phoneDigits, email.trim());
      setResendCountdown(30);
      setSuccessNotice(`Verification code sent to +91 ${phoneDigits}`);
      if (res.devDemoCode) {
        setDevDemoCode(res.devDemoCode);
      }
    } catch (err) {
      setError(mapApiError(err));
    } finally {
      setIsSendingOtp(false);
    }
  }

  const isVerifyingLock = useRef(false);
  const otpInputRef = useRef<HTMLInputElement | null>(null);

  // Step 2: Verify OTP & Provision Account
  async function executeSignupVerify(codeToVerify?: string) {
    const cleanOtp = (codeToVerify ?? otp).replace(/\D/g, "").slice(0, 6);
    if (cleanOtp.length < 4 || isVerifyingLock.current) return;
    isVerifyingLock.current = true;
    setError(null);
    setRedirectHref(null);
    setIsRedirecting(true);

    try {
      const phoneDigits = phone.replace(/\D/g, "").slice(-10);
      const result = await signupPublic({
        businessName: businessName.trim(),
        ownerName: ownerName.trim(),
        email: email.trim(),
        phone: phoneDigits,
        password,
        branchName: branchName.trim() || "HQ",
        otp: cleanOtp,
        ...(planCode ? { planCode } : {}),
        ...(referralCode ? { referralCode } : {}),
      });

      setSession(result.user, result.accessToken);
      const orgSlug = (result.organization?.slug ?? "").trim().toLowerCase() || null;
      if (!orgSlug) {
        setError("Organization slug was not returned. Please contact support.");
        setIsRedirecting(false);
        isVerifyingLock.current = false;
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
        isVerifyingLock.current = false;
        return;
      }

      const isHostedMarketing = !/^localhost$|^127\.0\.0\.1$/.test(window.location.hostname);
      if (isHostedMarketing && /localhost|127\.0\.0\.1/.test(destUrl.hostname)) {
        setError(
          "Workshop app URL is misconfigured (points to localhost). Set NEXT_PUBLIC_WORKSHOP_APP_URL on Vercel."
        );
        setIsRedirecting(false);
        isVerifyingLock.current = false;
        return;
      }
      if (destUrl.origin === window.location.origin) {
        setError(
          "Workshop app URL points at this marketing site. Set NEXT_PUBLIC_WORKSHOP_APP_URL to the workshop app, then redeploy."
        );
        setIsRedirecting(false);
        isVerifyingLock.current = false;
        return;
      }

      setRedirectHref(dest);
      window.location.assign(dest);
    } catch (err) {
      setError(mapApiError(err));
      setIsRedirecting(false);
      isVerifyingLock.current = false;
      setTimeout(() => {
        otpInputRef.current?.focus();
        otpInputRef.current?.select();
      }, 50);
    }
  }

  function handleOtpChange(val: string) {
    const clean = val.replace(/\D/g, "").slice(0, 6);
    setOtp(clean);
    if (clean.length === 6) {
      void executeSignupVerify(clean);
    }
  }

  function handleOtpPaste(e: React.ClipboardEvent<HTMLInputElement>) {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    setOtp(pasted);
    if (pasted.length === 6) {
      void executeSignupVerify(pasted);
    }
  }

  async function handleVerifySubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await executeSignupVerify();
  }

  return (
    <div className="space-y-4">
      {isRedirecting ? <OpeningWorkshopOverlay href={redirectHref} /> : null}

      {step === "details" ? (
        <form onSubmit={handleDetailsSubmit} className="space-y-3.5 sm:space-y-5">
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
            <label className="flex items-start gap-3 cursor-pointer select-none" htmlFor="acceptedTerms">
              <input
                id="acceptedTerms"
                type="checkbox"
                checked={acceptedTerms}
                onChange={(event) => setAcceptedTerms(event.target.checked)}
                required
                className="mt-1 size-4 shrink-0 accent-teal-600 cursor-pointer"
              />
              <span>
                I have read and accept the{" "}
                <Link
                  href="/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="font-medium text-teal-700 underline"
                >
                  Terms &amp; Conditions
                </Link>{" "}
                and am authorised to create this workshop account.
              </span>
            </label>
            <p>
              We use your details to create and administer your account. Read the{" "}
              <Link
                href="/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-teal-700 underline"
              >
                Privacy Policy
              </Link>{" "}
              and{" "}
              <Link
                href="/subscriptions"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-teal-700 underline"
              >
                subscription, refund and cancellation disclosures
              </Link>{" "}
              before registering. Terms acceptance is not consent to unrelated marketing.
            </p>
          </div>

          <Button
            type="submit"
            size="lg"
            disabled={!acceptedTerms || isSendingOtp || isRedirecting || passwordMismatch}
            className="trial-cta mt-0.5 h-11 w-full rounded-xl bg-teal-600 text-base font-semibold text-white hover:bg-teal-500 disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none sm:mt-1 sm:h-12"
          >
            {isSendingOtp ? (
              <span className="inline-flex items-center justify-center gap-2">
                <Loader2 className="size-4 animate-spin" />
                <span>Sending Verification Code...</span>
              </span>
            ) : (
              <span className="inline-flex items-center justify-center gap-2">
                <span className="sm:hidden">Start Free Trial</span>
                <span className="hidden sm:inline">Sign Up & Start Free Trial</span>
              </span>
            )}
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
      ) : (
        /* Step 2: Verification Screen (Matching Screenshot 1) */
        <form onSubmit={handleVerifySubmit} className="space-y-5">
          <div className="text-center space-y-2">
            <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-teal-600/10 text-teal-700 ring-8 ring-teal-50">
              <ShieldCheck className="size-8" />
            </div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
              Create Your Account
            </h2>
            <p className="text-sm text-slate-500">
              Get started with your free trial
            </p>
            <div className="pt-2 text-sm text-slate-600">
              <p>We have sent a 6-digit OTP verification code via WhatsApp to:</p>
              <p className="mt-1 text-base font-bold text-slate-900">
                +91 {phone.replace(/\D/g, "").slice(-10)}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <label htmlFor="otp" className="font-medium text-slate-700">
                Enter Verification Code
              </label>
              {resendCountdown > 0 ? (
                <span className="font-medium text-slate-400">
                  Resend OTP in {resendCountdown}s
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={isSendingOtp || isRedirecting}
                  className="font-semibold text-teal-600 hover:text-teal-700 hover:underline disabled:opacity-50"
                >
                  {isSendingOtp ? "Sending..." : "Resend OTP"}
                </button>
              )}
            </div>

            <input
              ref={otpInputRef}
              id="otp"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              value={otp}
              onChange={(e) => handleOtpChange(e.target.value)}
              onPaste={handleOtpPaste}
              placeholder="123456"
              autoFocus
              disabled={isRedirecting}
              className="block h-12 w-full rounded-xl border-2 border-slate-200 bg-white px-3.5 text-center font-mono text-2xl font-bold tracking-[0.35em] text-slate-900 placeholder:font-normal placeholder:tracking-[0.25em] placeholder:text-slate-300 focus:border-teal-600 focus:outline-none focus:ring-0 disabled:opacity-50"
            />
          </div>

          <Button
            type="submit"
            size="lg"
            disabled={isRedirecting || otp.length < 4}
            className="trial-cta h-11 w-full rounded-xl bg-teal-600 text-base font-semibold text-white shadow-sm hover:bg-teal-500 sm:h-12"
          >
            {isRedirecting ? (
              <span className="inline-flex items-center justify-center gap-2">
                <Loader2 className="size-4 animate-spin" />
                <span>Verifying & Setting up...</span>
              </span>
            ) : (
              "Verify & Start Free Trial"
            )}
          </Button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => {
                setStep("details");
                setError(null);
                setSuccessNotice(null);
              }}
              disabled={isRedirecting}
              className="text-sm font-medium text-slate-600 hover:text-slate-900 hover:underline"
            >
              Go Back &amp; Edit Info
            </button>
          </div>

          {devDemoCode && (
            <p className="text-center text-xs text-amber-600 font-mono bg-amber-50 p-2 rounded-lg border border-amber-200">
              Dev Demo Code: {devDemoCode}
            </p>
          )}

          {successNotice && (
            <div className="rounded-xl border border-teal-200 bg-teal-50/80 p-3.5 text-xs text-teal-800 flex items-start gap-2.5">
              <CheckCircle2 className="size-4 shrink-0 text-teal-600 mt-0.5" />
              <div>
                <span className="font-semibold block text-slate-900">OTP Sent Successfully</span>
                <span className="text-slate-600">{successNotice}</span>
              </div>
            </div>
          )}

          {error && (
            <Alert tone="error">
              <AlertTitle>Verification failed</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </form>
      )}
    </div>
  );
}
