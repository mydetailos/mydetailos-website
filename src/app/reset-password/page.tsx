import { Suspense } from "react";
import type { Metadata } from "next";
import { ResetPasswordForm } from "@/features/auth/reset-password-form";
import { AuthPageShell } from "@/features/auth/auth-page-shell";
import { buildMetadata } from "@/lib/metadata";
import { Loader2 } from "lucide-react";

export const metadata: Metadata = buildMetadata({
  title: "Reset Password",
  description: "Set a new password for your MY DETAIL OS account.",
  path: "/reset-password",
});

export default function ResetPasswordPage() {
  return (
    <AuthPageShell
      title="Reset Password"
      description="Enter your new password below to secure your account."
    >
      <Suspense
        fallback={
          <div className="flex flex-col items-center gap-3 py-10">
            <Loader2 className="size-8 animate-spin text-teal-600" />
            <p className="text-sm text-slate-500">Loading…</p>
          </div>
        }
      >
        <ResetPasswordForm />
      </Suspense>
    </AuthPageShell>
  );
}
