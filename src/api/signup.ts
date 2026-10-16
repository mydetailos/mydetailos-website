import { apiClient, setToken } from "@/lib/api-client";
import type { SignupInput, SignupOtpSendResult, SignupResult } from "@/types";

export async function sendSignupOtp(
  phone: string,
  email?: string,
  channel?: "whatsapp" | "sms"
): Promise<SignupOtpSendResult> {
  return apiClient.post<SignupOtpSendResult>("/api/public/signup/otp/send", {
    phone,
    ...(email ? { email } : {}),
    ...(channel ? { channel } : {}),
  });
}

export async function signup(input: SignupInput): Promise<SignupResult> {
  const result = await apiClient.post<SignupResult>("/api/public/signup", input);
  if (result.accessToken) {
    setToken(result.accessToken);
  }
  return result;
}
