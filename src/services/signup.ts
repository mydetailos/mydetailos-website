import * as signupApi from "@/api/signup";
import type { SignupInput, SignupOtpSendResult, SignupResult } from "@/types";

/**
 * Public signup OTP dispatch — sends verification code via WhatsApp.
 */
export async function sendSignupOtpPublic(
  phone: string,
  email?: string,
  channel?: "whatsapp" | "sms"
): Promise<SignupOtpSendResult> {
  return signupApi.sendSignupOtp(phone, email, channel);
}

/**
 * Public signup — always calls the real backend API (no mocks).
 */
export async function signupPublic(input: SignupInput): Promise<SignupResult> {
  return signupApi.signup(input);
}
