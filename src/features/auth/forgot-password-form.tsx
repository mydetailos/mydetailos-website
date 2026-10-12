"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { forgotPasswordPublic } from "@/services/auth";
import { mapApiError } from "@/lib/error-messages";
import { Button } from "@/components/ui/button";
import { FloatingInput } from "@/components/ui/floating-input";
import { Alert, AlertDescription, AlertTitle } from "@/features/shared/alert";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(false);
    setIsLoading(true);

    try {
      await forgotPasswordPublic(email.trim());
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
          <svg
            className="size-6 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-slate-900">Check your email</h3>
        <p className="text-sm leading-relaxed text-slate-600">
          If an account exists for <span className="font-semibold text-slate-900">{email}</span>,
          we sent a password reset link. Open it to choose a new password in the Workshop App.
        </p>
        <div className="pt-2">
          <Link href="/login" className="block">
            <Button
              type="button"
              className="h-12 w-full rounded-xl bg-teal-600 text-base font-semibold text-white shadow-sm hover:bg-teal-700"
            >
              Return to Login
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-5">
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

      <p className="text-sm leading-6 text-slate-600">
        Your email is used to process account recovery. Read our <Link href="/privacy" className="font-medium text-teal-700 underline">Privacy Policy</Link>.
      </p>

      <Button
        type="submit"
        size="lg"
        disabled={isLoading}
        className="h-11 w-full rounded-xl bg-teal-600 text-base font-semibold text-white shadow-sm hover:bg-teal-700 sm:h-12"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 size-4 animate-spin" />
            Sending reset link...
          </>
        ) : (
          "Send Reset Link"
        )}
      </Button>

      <p className="text-center text-sm text-slate-600">
        <Link href="/login" className="font-semibold text-teal-600 hover:underline">
          Back to Sign In
        </Link>
      </p>

      {error && (
        <Alert tone="error">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </form>
  );
}
