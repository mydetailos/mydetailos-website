"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Loader2, Smartphone } from "lucide-react";
import {
  loginPublic,
  sendLoginOtpPublic,
  verifyLoginOtpPublic,
} from "@/services/auth";
import { mapApiError } from "@/lib/error-messages";
import { siteConfig, workshopAppLoginUrl } from "@/config/site";
import { useAuthStore } from "@/store/auth-store";
import { Button } from "@/components/ui/button";
import { FloatingInput } from "@/components/ui/floating-input";
import { OtpInput } from "@/components/ui/otp-input";
import { Alert, AlertDescription, AlertTitle } from "@/features/shared/alert";
import { OpeningWorkshopOverlay } from "@/features/auth/opening-workshop-overlay";
import type { LoginResponse } from "@/api/auth";
import { apiClient } from "@/lib/api-client";
import { cn } from "@/lib/utils";

type LoginMethod = "email" | "mobile";

async function resolveOrgSlug(session: LoginResponse): Promise<string | null> {
  const direct = (session.organization?.slug ?? "").trim().toLowerCase();
  if (direct) return direct;

  // Fallback: entitlement payload includes organization.slug after token is stored.
  if (!session.user.organizationId) return null;
  try {
    const entitlement = await apiClient.get<{
      organization?: { slug?: string | null };
    }>("/api/organization/subscription");
    const slug = (entitlement?.organization?.slug ?? "").trim().toLowerCase();
    return slug || null;
  } catch {
    return null;
  }
}

export function LoginForm() {
  const [loginMethod, setLoginMethod] = useState<LoginMethod>("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpHint, setOtpHint] = useState<string | null>(null);
  const [resendCountdown, setResendCountdown] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [redirectHref, setRedirectHref] = useState<string | null>(null);
  const setSession = useAuthStore((s) => s.setSession);
  const verifyOtpLock = useRef(false);

  useEffect(() => {
    if (!otpSent || resendCountdown <= 0) return;
    const interval = setInterval(() => {
      setResendCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [otpSent, resendCountdown]);

  async function finishWithSession(session: LoginResponse): Promise<boolean> {
    setSession(session.user, session.accessToken);

    if (session.user.role === "PLATFORM_OWNER") {
      setInfo("Platform owner accounts sign in via the Admin Portal.");
      setIsLoading(false);
      setIsRedirecting(false);
      return false;
    }

    const orgSlug = await resolveOrgSlug(session);
    if (!orgSlug) {
      setError(
        session.user.organizationId
          ? "Your workshop is missing a URL slug. Ask support to set the organization slug, then try again."
          : "Your account is not linked to a workshop organization. Contact support or complete signup again."
      );
      setIsLoading(false);
      setIsRedirecting(false);
      return false;
    }

    const dest = workshopAppLoginUrl({
      accessToken: session.accessToken,
      next: session.user.mustChangePassword ? "/change-password" : "/dashboard",
      orgSlug,
    });

    let destUrl: URL;
    try {
      destUrl = new URL(dest);
    } catch {
      setError(
        `Workshop app URL is invalid. Set NEXT_PUBLIC_WORKSHOP_APP_URL on Vercel to your live workshop origin (include https://). Current: ${siteConfig.workshopAppUrl}`
      );
      setIsLoading(false);
      setIsRedirecting(false);
      return false;
    }

    const isHostedMarketing = !/^localhost$|^127\.0\.0\.1$/.test(window.location.hostname);
    if (isHostedMarketing && /localhost|127\.0\.0\.1/.test(destUrl.hostname)) {
      setError(
        `Workshop app URL is misconfigured (points to localhost). Set NEXT_PUBLIC_WORKSHOP_APP_URL on Vercel to your live workshop URL. Current target: ${siteConfig.workshopAppUrl}`
      );
      setIsLoading(false);
      setIsRedirecting(false);
      return false;
    }

    if (destUrl.origin === window.location.origin) {
      setError(
        `Workshop app URL points at this marketing site (${destUrl.origin}). Set NEXT_PUBLIC_WORKSHOP_APP_URL to the workshop app origin, then redeploy.`
      );
      setIsLoading(false);
      setIsRedirecting(false);
      return false;
    }

    setRedirectHref(dest);
    setIsRedirecting(true);
    setIsLoading(false);
    window.location.href = dest;
    return true;
  }

  async function handleEmailSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setInfo(null);
    setRedirectHref(null);
    setIsRedirecting(true);

    try {
      const session = await loginPublic(email.trim(), password);
      await finishWithSession(session);
    } catch (err) {
      setError(mapApiError(err));
      setIsRedirecting(false);
    }
  }

  async function handleSendOtp() {
    if (resendCountdown > 0 && otpSent) return;
    const digits = mobile.replace(/\D/g, "");
    if (digits.length !== 10) {
      setError("Enter a valid 10-digit mobile number");
      return;
    }
    setError(null);
    setOtpHint(null);
    setIsLoading(true);
    try {
      const result = await sendLoginOtpPublic(digits);
      setOtp("");
      setOtpSent(true);
      setResendCountdown(30);
      if (result.delivery === "whatsapp") {
        setOtpHint("OTP sent to your WhatsApp number.");
      } else if (result.delivery === "sms") {
        setOtpHint("OTP sent to your mobile number via SMS.");
      } else if (result.devDemoCode) {
        setOtpHint(`Dev/demo code: ${result.devDemoCode}`);
      } else if (result.hint) {
        setOtpHint(result.hint);
      } else {
        setOtpHint("OTP sent — check WhatsApp or SMS.");
      }
    } catch (err) {
      setError(mapApiError(err));
      if (!otpSent) setOtpSent(false);
    } finally {
      setIsLoading(false);
    }
  }

  async function runMobileOtpVerify(code?: string) {
    const digits = (code ?? otp).replace(/\D/g, "");
    if ((digits.length !== 6 && digits.length !== 4) || verifyOtpLock.current) return;
    verifyOtpLock.current = true;
    setError(null);
    setInfo(null);
    setRedirectHref(null);
    setIsRedirecting(true);
    try {
      const session = await verifyLoginOtpPublic(mobile, digits);
      await finishWithSession(session);
    } catch (err) {
      setError(mapApiError(err));
      setIsRedirecting(false);
      setOtp("");
    } finally {
      verifyOtpLock.current = false;
    }
  }

  async function handleMobileSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!otpSent) {
      await handleSendOtp();
      return;
    }
    await runMobileOtpVerify();
  }

  function switchTo(method: LoginMethod) {
    if (loginMethod === method) return;
    setLoginMethod(method);
    setError(null);
    setInfo(null);
    setRedirectHref(null);
    setOtp("");
    setOtpSent(false);
    setOtpHint(null);
    setResendCountdown(0);
  }

  return (
    <div className="space-y-4 sm:space-y-5">
      {isRedirecting ? <OpeningWorkshopOverlay href={redirectHref} /> : null}

      {/* Top Segmented Method Switcher */}
      <div className="grid grid-cols-2 p-1 rounded-xl bg-slate-100 border border-slate-200 text-sm font-semibold">
        <button
          type="button"
          onClick={() => switchTo("email")}
          className={cn(
            "py-2 rounded-lg transition-all text-center",
            loginMethod === "email"
              ? "bg-white text-slate-900 shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          )}
        >
          Email &amp; Password
        </button>
        <button
          type="button"
          onClick={() => switchTo("mobile")}
          className={cn(
            "py-2 rounded-lg transition-all text-center flex items-center justify-center gap-1.5",
            loginMethod === "mobile"
              ? "bg-white text-slate-900 shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          )}
        >
          <Smartphone className="size-4 text-teal-600" />
          Mobile OTP
        </button>
      </div>

      {loginMethod === "email" ? (
        <form onSubmit={handleEmailSubmit} className="space-y-3.5 sm:space-y-5">
          <FloatingInput
            id="email"
            type="email"
            label="Email"
            placeholder="example@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
          <div className="space-y-1.5">
            <FloatingInput
              id="password"
              type="password"
              label="Password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
            <div className="flex justify-end">
              <Link
                href="/forgot-password"
                className="text-sm font-semibold text-teal-700 hover:text-teal-600"
              >
                Forgot Password?
              </Link>
            </div>
          </div>

          <Button
            type="submit"
            size="lg"
            disabled={isLoading || isRedirecting}
            className="h-11 w-full rounded-xl bg-teal-600 text-base font-semibold text-white shadow-sm hover:bg-teal-700 sm:h-12"
          >
            Sign In
          </Button>
        </form>
      ) : (
        <form onSubmit={handleMobileSubmit} className="space-y-3.5 sm:space-y-5">
          <div>
            <label
              htmlFor="mobile"
              className="mb-1.5 block text-sm font-medium text-slate-600 sm:mb-2"
            >
              Mobile Number
            </label>
            <div className="flex gap-2">
              <div className="flex h-11 shrink-0 items-center justify-center rounded-xl border-2 border-slate-200 bg-slate-50 px-3 text-sm font-medium text-slate-500 sm:h-12">
                +91
              </div>
              <input
                id="mobile"
                type="tel"
                inputMode="numeric"
                autoComplete="tel-national"
                placeholder="10-digit mobile number"
                value={mobile}
                onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
                required
                maxLength={10}
                className="block h-11 w-full rounded-xl border-2 border-slate-200 bg-white px-3.5 text-base text-slate-900 placeholder:text-slate-400 focus:border-teal-600 focus:outline-none focus:ring-0 disabled:opacity-50 sm:h-12 sm:text-sm"
              />
            </div>
          </div>

          {!otpSent ? (
            <Button
              type="submit"
              size="lg"
              disabled={isLoading || isRedirecting || mobile.length < 10}
              className="h-11 w-full rounded-xl bg-teal-600 text-base font-semibold text-white shadow-sm hover:bg-teal-700 sm:h-12"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Sending OTP...
                </>
              ) : (
                "Send OTP via WhatsApp"
              )}
            </Button>
          ) : (
            <>
              <div className="space-y-2.5 sm:space-y-3">
                <div className="flex items-baseline justify-between gap-x-3">
                  <span className="text-sm font-medium text-slate-600">Enter 6-digit OTP</span>
                  {resendCountdown > 0 ? (
                    <span className="text-xs font-medium text-slate-400">
                      Resend OTP in {resendCountdown}s
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => void handleSendOtp()}
                      disabled={isLoading || isRedirecting}
                      className="inline-flex min-h-10 items-center text-sm font-semibold text-teal-700 hover:text-teal-600 disabled:opacity-50"
                    >
                      Resend OTP
                    </button>
                  )}
                </div>
                <OtpInput
                  length={6}
                  value={otp}
                  onChange={setOtp}
                  onComplete={(v) => void runMobileOtpVerify(v)}
                  disabled={isLoading || isRedirecting}
                />
                {otpHint && <p className="text-center text-xs text-slate-500">{otpHint}</p>}
              </div>

              <Button
                type="submit"
                size="lg"
                disabled={isLoading || isRedirecting || otp.length < 4}
                className="h-11 w-full rounded-xl bg-teal-600 text-base font-semibold text-white shadow-sm hover:bg-teal-700 sm:h-12"
              >
                Verify &amp; Sign In
              </Button>
            </>
          )}
        </form>
      )}

      <p className="text-center text-sm text-slate-600">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="font-semibold text-teal-600 hover:underline">
          Sign Up
        </Link>
      </p>

      <p className="text-center text-xs leading-5 text-slate-500">
        Account access uses your login details and browser storage. Read the{" "}
        <Link href="/privacy" className="text-teal-700 underline">
          Privacy Policy
        </Link>{" "}
        and{" "}
        <Link href="/cookies" className="text-teal-700 underline">
          Cookies &amp; Browser Storage
        </Link>{" "}
        notice.
      </p>

      {error && (
        <Alert tone="error">
          <AlertTitle>Sign in failed</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {info && (
        <Alert tone="success">
          <AlertTitle>Admin Portal</AlertTitle>
          <AlertDescription>{info}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
