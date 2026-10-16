import { apiClient, setToken, clearToken } from "@/lib/api-client";
import type { AuthSession, AuthUser } from "@/types";

export type LoginResponse = AuthSession & {
  branch?: unknown;
  organization?: {
    id: string;
    name: string;
    slug: string | null;
  } | null;
};

function toAuthSession(session: LoginResponse): AuthSession {
  if (session.accessToken) {
    setToken(session.accessToken);
  }
  return {
    accessToken: session.accessToken,
    user: {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
      role: session.user.role,
      organizationId: session.user.organizationId,
      branchId: session.user.branchId,
      mustChangePassword: session.user.mustChangePassword,
    },
  };
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  const session = await apiClient.post<LoginResponse>("/api/auth/login", { email, password });
  toAuthSession(session);
  return session;
}

export type OtpSendResult = {
  ok: true;
  delivery?: "whatsapp" | "sms" | "log_only";
  hint?: string;
  /** Present only when SMS is not configured (dev/demo). */
  devDemoCode?: string;
};

/** Staff login OTP — phone WhatsApp or SMS (10 digits). */
export async function sendLoginOtp(phone: string, channel?: "whatsapp" | "sms"): Promise<OtpSendResult> {
  const digits = phone.replace(/\D/g, "");
  const data = await apiClient.post<{
    ok?: boolean;
    delivery?: "whatsapp" | "sms" | "log_only";
    hint?: string;
    devDemoCode?: string;
  }>("/api/auth/otp/send", { phone: digits, ...(channel ? { channel } : {}) });
  return {
    ok: true,
    delivery: data?.delivery,
    hint: typeof data?.hint === "string" ? data.hint : undefined,
    devDemoCode: typeof data?.devDemoCode === "string" ? data.devDemoCode : undefined,
  };
}

export async function verifyLoginOtp(phone: string, code: string): Promise<LoginResponse> {
  const digits = phone.replace(/\D/g, "");
  const trimmed = code.replace(/\D/g, "");
  const session = await apiClient.post<LoginResponse>("/api/auth/otp/verify", {
    phone: digits,
    code: trimmed,
  });
  toAuthSession(session);
  return session;
}

export async function getMe(): Promise<AuthUser> {
  const me = await apiClient.get<{ user: AuthUser } | AuthUser>("/api/auth/me");
  if (me && typeof me === "object" && "user" in me && me.user) {
    return me.user;
  }
  return me as AuthUser;
}

export async function forgotPassword(email: string): Promise<{ message: string }> {
  const res = await apiClient.post<{ message?: string } | null>("/api/auth/forgot-password", {
    email,
  });
  return {
    message:
      (res && typeof res === "object" && res.message) ||
      "If an account exists for that email, a reset link has been sent.",
  };
}

export async function getResetPasswordStatus(token: string): Promise<{ valid: boolean }> {
  const res = await apiClient.get<{ pending?: boolean; valid?: boolean }>(
    `/api/auth/reset-password/status?token=${encodeURIComponent(token)}`
  );
  return { valid: Boolean(res.valid ?? res.pending) };
}

export async function resetPassword(
  token: string,
  newPassword: string
): Promise<{ message: string }> {
  // Backend expects `password`; keep newPassword alias for callers.
  const res = await apiClient.post<{ message?: string } | null>("/api/auth/reset-password", {
    token,
    password: newPassword,
    newPassword,
  });
  return {
    message:
      (res && typeof res === "object" && res.message) ||
      "Password updated. You can sign in with your new password.",
  };
}

export function logout(): void {
  clearToken();
}
