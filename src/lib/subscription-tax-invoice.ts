export type SubscriptionBillRow = {
  id: string;
  billNumber: string;
  planName: string;
  termMonths: number;
  termLabel: string;
  periodStart: string | Date;
  periodEnd: string | Date;
  baseAmount?: number | null;
  extraBranchCost?: number | null;
  extraUserCost?: number | null;
  onboardingFee?: number | null;
  referralDiscount?: number | null;
  gstPercent?: number | null;
  gstAmount?: number | null;
  totalAmount?: number | null;
  amount?: number | null;
  currency?: string | null;
  paymentStatus?: string | null;
  txnReference?: string | null;
  createdAt: string | Date;
  organizationName?: string | null;
};

export function formatPaymentStatus(st: string | null | undefined): string {
  if (!st) return "PAID";
  const s = String(st).toUpperCase();
  if (s === "PAID" || s === "VERIFIED" || s === "COMPLETED") return "PAID";
  if (s === "PENDING" || s === "INITIATED") return "PENDING";
  if (s === "FAILED") return "FAILED";
  return s;
}

export function formatInvoiceDate(iso: string | Date | null | undefined): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatInvoiceAmount(n: number | null | undefined): string {
  if (n == null || isNaN(n)) return "0.00";
  return n.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function formatInvoiceNumber(billNumber: string | null | undefined): string {
  if (!billNumber) return "INV-2026-0001";
  if (billNumber.startsWith("INV-")) return billNumber;
  if (billNumber.startsWith("SUB-")) return billNumber.replace(/^SUB-/, "INV-");
  return `INV-${billNumber}`;
}

export function parseSubscriptionInvoiceFromHash(
  hash: string
): SubscriptionBillRow | null {
  try {
    const match = hash.match(/[#&]data=([^&]+)/);
    if (!match || !match[1]) return null;
    const rawB64 = match[1];
    const decodedStr =
      typeof atob !== "undefined"
        ? decodeURIComponent(
            Array.prototype.map
              .call(atob(rawB64), (c: string) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
              .join("")
          )
        : Buffer.from(rawB64, "base64").toString("utf-8");
    const c = JSON.parse(decodedStr);
    return {
      id: c.id || "sub-invoice",
      billNumber: c.bn || "INV-2026-0001",
      organizationName: c.on || "Workshop",
      planName: c.pn || "Workshop Plan",
      termMonths: c.tm || 12,
      termLabel: c.tl || "Yearly",
      periodStart: c.ps || "",
      periodEnd: c.pe || "",
      baseAmount: c.ba,
      extraBranchCost: c.eb || 0,
      extraUserCost: c.eu || 0,
      onboardingFee: c.ob || 0,
      referralDiscount: c.rd || 0,
      gstPercent: c.gp ?? 18,
      gstAmount: c.ga || 0,
      totalAmount: c.ta ?? c.am ?? 0,
      amount: c.am ?? c.ta ?? 0,
      currency: c.cu || "INR",
      paymentStatus: c.st || "PAID",
      txnReference: c.tr || null,
      createdAt: c.ca || new Date().toISOString(),
    };
  } catch {
    return null;
  }
}
