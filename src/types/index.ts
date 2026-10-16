// ─── Auth ─────────────────────────────────────────────────────────────────────
export type UserRole =
  | "PLATFORM_OWNER"
  | "SUPER_ADMIN"
  | "ADMIN"
  | "BRANCH_MANAGER"
  | "MANAGER"
  | "SUPERVISOR"
  | "RECEPTIONIST"
  | "MECHANIC";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  organizationId: string | null;
  branchId: string | null;
  mustChangePassword?: boolean;
}

export interface AuthSession {
  accessToken: string;
  user: AuthUser;
}

// ─── Subscription / Pricing ───────────────────────────────────────────────────
export type PlanCode = string;
export type SubscriptionStatus =
  | "ACTIVE"
  | "PAST_DUE"
  | "EXPIRED"
  | "CANCELLED"
  | "TRIAL";
export type SubscriptionPaymentStatus = "PAID" | "PENDING" | "PROCESSING" | "FAILED";
export type GraceOrLockStatus = "OK" | "GRACE" | "LOCKED" | "SUSPENDED";

/** Normalized quote shape used by the pricing calculator UI. */
export interface PricingQuote {
  planCode: PlanCode;
  planName: string;
  termMonths: number;
  termLabel: string;
  baseBranches: number | null;
  baseUsers: number | null;
  extraBranches: number;
  extraUsers: number;
  basePlanAmount: number;
  extraBranchAmount: number;
  extraUserAmount: number;
  onboardingFee: number;
  subtotal: number;
  referralDiscount: number;
  taxableAmount: number;
  gstRate: number;
  gstAmount: number;
  totalAmount: number;
  currency: string;
}

/** Raw backend quote envelope from POST /api/public/pricing/quote */
export interface PricingQuoteBreakdown {
  planCode: string;
  planName: string;
  termMonths: number;
  termLabel: string;
  extraBranches: number;
  extraUsers: number;
  baseAmount: number;
  extraBranchCost: number;
  extraUserCost: number;
  onboardingFee: number;
  referralDiscount: number;
  gstPercent: number;
  gstAmount: number;
  subTotalBeforeTax: number;
  finalAmount: number;
  includedBranches: number | null;
  includedUsers: number | null;
  currency: string;
}

// ─── Signup ───────────────────────────────────────────────────────────────────
export interface SignupInput {
  businessName: string;
  ownerName: string;
  email: string;
  phone: string;
  password: string;
  branchName?: string;
  referralCode?: string;
  /** Optional plan from pricing CTA (?plan=GROWTH). Defaults to STARTER on API. */
  planCode?: string;
  /** Verification code (OTP) sent to WhatsApp / mobile */
  otp: string;
}

export interface SignupOtpSendResult {
  ok: boolean;
  delivery: "whatsapp" | "sms" | "log_only";
  hint?: string;
  devDemoCode?: string;
}

export interface SignupResult {
  accessToken: string;
  user: AuthUser;
  organizationId: string;
  organization?: {
    id: string;
    name: string;
    slug: string | null;
    isActive?: boolean;
  };
  branch?: { id: string; name: string; organizationId: string };
  subscription?: {
    id: string;
    planCode: string;
    planName: string;
    status: string;
  };
}

// ─── Pricing Calculator Form ──────────────────────────────────────────────────
export interface PricingCalculatorInput {
  termMonths: 12 | 24 | 36 | 60;
  extraBranches: number;
  extraUsers: number;
  referralCode: string;
}

// ─── Contact Form ─────────────────────────────────────────────────────────────
export interface ContactFormInput {
  name: string;
  businessName: string;
  email: string;
  phone: string;
  message: string;
}

// ─── API Client ───────────────────────────────────────────────────────────────
export interface ApiErrorShape {
  message: string;
  code?: string;
  statusCode?: number;
}

export interface ApiResponse<T> {
  data: T;
  error: ApiErrorShape | null;
}
