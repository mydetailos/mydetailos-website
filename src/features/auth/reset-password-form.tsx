"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AlertCircle, Check, Loader2 } from "lucide-react";
import { getResetPasswordStatus, resetPassword } from "@/api/auth";
import { mapApiError } from "@/lib/error-messages";
import { Button } from "@/components/ui/button";
import { FloatingInput } from "@/components/ui/floating-input";

type ResetLinkState = "absent" | "checking" | "active" | "inactive" | "error";

export function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token")?.trim() ?? "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [linkState, setLinkState] = useState<ResetLinkState>(() =>
    token ? "checking" : "absent"
  );

  useEffect(() => {
    if (!token) {
      setLinkState("absent");
      return;
    }
    let cancelled = false;
    setLinkState("checking");
    void (async () => {
      try {
        const { valid } = await getResetPasswordStatus(token);
        if (cancelled) return;
        setLinkState(valid ? "active" : "inactive");
      } catch {
        if (!cancelled) setLinkState("error");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    if (!token) {
      setError("This link is missing a reset token. Open the link from your email again.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    try {
      await resetPassword(token, password);
      setSuccess(true);
    } catch (err) {
      setError(mapApiError(err));
    } finally {
      setIsLoading(false);
    }
  }

  if (success) {
    return (
      <div className="space-y-5 text-center">
        <div className="mx-auto mb-1 flex size-12 items-center justify-center rounded-full bg-green-100">
          <Check className="size-6 text-green-600" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900">Password reset successful</h3>
        <p className="text-sm leading-relaxed text-slate-600">
          Your password has been changed. You can now sign in to your account with your new password.
        </p>
        <div className="pt-2">
          <Link href="/login" className="block">
            <Button
              type="button"
              className="h-11 w-full rounded-xl bg-teal-600 text-base font-semibold text-white shadow-sm hover:bg-teal-700 sm:h-12"
            >
              Return to Sign In
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="space-y-5 text-center">
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-center">
          <p className="text-sm text-amber-800 leading-relaxed">
            This page needs a valid link from your reset email. Please request a new link
            from the forgot password page.
          </p>
        </div>
        <Link href="/forgot-password" className="block">
          <Button
            type="button"
            className="h-11 w-full rounded-xl bg-teal-600 text-base font-semibold text-white shadow-sm hover:bg-teal-700 sm:h-12"
          >
            Request New Reset Link
          </Button>
        </Link>
        <p className="text-center text-sm text-slate-600">
          <Link href="/login" className="font-semibold text-teal-600 hover:underline">
            Back to Sign In
          </Link>
        </p>
      </div>
    );
  }

  if (linkState === "checking") {
    return (
      <div className="flex flex-col items-center gap-3 py-10">
        <Loader2 className="size-8 animate-spin text-teal-600" />
        <p className="text-sm text-slate-500">Validating your reset link…</p>
      </div>
    );
  }

  if (linkState === "inactive") {
    return (
      <div className="space-y-5 text-center">
        <div className="rounded-xl border border-amber-200/90 bg-amber-50/90 p-5 space-y-3">
          <div className="mx-auto flex size-10 items-center justify-center rounded-full bg-amber-100 text-amber-700">
            <AlertCircle className="size-5" />
          </div>
          <p className="text-sm text-slate-700 leading-relaxed">
            Password reset links work only once and expire after 1 hour. If you still need to
            change your password, request a fresh email link.
          </p>
        </div>
        <div className="space-y-3 pt-2">
          <Link href="/forgot-password" className="block">
            <Button
              type="button"
              className="h-11 w-full rounded-xl bg-teal-600 text-base font-semibold text-white shadow-sm hover:bg-teal-700 sm:h-12"
            >
              Request New Reset Link
            </Button>
          </Link>
          <p className="text-center text-sm text-slate-600">
            <Link href="/login" className="font-semibold text-teal-600 hover:underline">
              Back to Sign In
            </Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {linkState === "error" ? (
        <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-3">
          Couldn&apos;t verify this link right now. You can still try saving your new
          password below, or request a fresh link.
        </p>
      ) : null}

      <FloatingInput
        id="new-password"
        type="password"
        label="New Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        minLength={8}
        autoComplete="new-password"
      />

      <FloatingInput
        id="confirm-password"
        type="password"
        label="Confirm Password"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        required
        minLength={8}
        autoComplete="new-password"
      />

      <p className="text-xs text-slate-500 leading-relaxed">
        At least 8 characters with uppercase, lowercase, a number, and a special character.
      </p>

      {error ? (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700"
        >
          {error}
        </div>
      ) : null}

      <Button
        type="submit"
        size="lg"
        disabled={isLoading || !password || !confirm}
        className="h-11 w-full rounded-xl bg-teal-600 text-base font-semibold text-white shadow-sm hover:bg-teal-700 sm:h-12 transition-colors disabled:opacity-50"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 size-4 animate-spin" />
            Updating Password…
          </>
        ) : (
          "Save New Password"
        )}
      </Button>

      <p className="text-center text-sm text-slate-600 pt-2">
        <Link href="/login" className="font-semibold text-teal-600 hover:underline">
          Back to Sign In
        </Link>
      </p>
    </form>
  );
}
