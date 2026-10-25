"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { apiClient } from "@/lib/api-client";
import {
  parseSubscriptionInvoiceFromHash,
  formatInvoiceAmount,
  formatInvoiceDate,
  formatInvoiceNumber,
  formatPaymentStatus,
  type SubscriptionBillRow,
} from "@/lib/subscription-tax-invoice";
import { Button } from "@/components/ui/button";
import { Printer, ArrowLeft, Loader2, FileQuestion } from "lucide-react";

export default function PublicSubscriptionInvoicePage() {
  const params = useParams();
  const id = (params?.id as string) || "";

  const [bill, setBill] = useState<SubscriptionBillRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 1. Try decoding bill data from URL hash first (allows zero-auth instantaneous viewing)
    if (typeof window !== "undefined" && window.location.hash) {
      const parsed = parseSubscriptionInvoiceFromHash(window.location.hash);
      if (parsed) {
        setBill(parsed);
        setLoading(false);
        return;
      }
    }

    // 2. Fallback to API if id exists
    if (!id) {
      setLoading(false);
      setError("No invoice ID provided.");
      return;
    }

    let cancelled = false;
    void (async () => {
      try {
        // Try public endpoint first, then standard bills endpoint
        let data: SubscriptionBillRow | null = null;
        try {
          data = await apiClient.get<SubscriptionBillRow>(
            `/api/public/subscription-bills/${encodeURIComponent(id)}`
          );
        } catch {
          data = await apiClient.get<SubscriptionBillRow>(
            `/api/organization/subscription/bills/${encodeURIComponent(id)}`
          );
        }

        if (!cancelled && data) {
          setBill(data);
          setLoading(false);
        }
      } catch {
        if (!cancelled) {
          setError("Invoice not found or session expired.");
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3 text-slate-500">
          <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
          <p className="text-sm font-medium">Loading Tax Invoice…</p>
        </div>
      </div>
    );
  }

  if (error || !bill) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-4 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
            <FileQuestion className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-slate-800">Invoice Unavailable</h2>
          <p className="text-sm text-slate-500">
            {error || "Could not retrieve the subscription invoice details."}
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors mt-2"
          >
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  const invoiceNo = formatInvoiceNumber(bill.billNumber);
  const invoiceDate = formatInvoiceDate(bill.createdAt);
  const orgName = bill.organizationName?.trim() || "Workshop";
  const periodStart = formatInvoiceDate(bill.periodStart);
  const periodEnd = formatInvoiceDate(bill.periodEnd);
  const statusLabel = formatPaymentStatus(bill.paymentStatus).toUpperCase();
  const txnRef = bill.txnReference?.trim() || "—";

  const baseAmt =
    bill.baseAmount != null
      ? bill.baseAmount
      : (bill.totalAmount ?? bill.amount ?? 0) - (bill.gstAmount ?? 0);
  const totalAmt = bill.totalAmount ?? bill.amount ?? 0;
  const gstRate = bill.gstPercent ?? 18;
  const gstAmt = bill.gstAmount ?? 0;

  const durationLabel = `${bill.termLabel || "Yearly"} (${bill.termMonths || 12} months)`;
  const planBaseDescription = `${bill.planName || "Workshop"} Base Plan • ${durationLabel}`;

  const rows: { desc: string; amount: string; isNegative?: boolean }[] = [
    {
      desc: planBaseDescription,
      amount: formatInvoiceAmount(baseAmt),
    },
  ];

  if (bill.extraBranchCost && bill.extraBranchCost > 0) {
    rows.push({
      desc: "Extra Branch Add-ons",
      amount: formatInvoiceAmount(bill.extraBranchCost),
    });
  }

  if (bill.extraUserCost && bill.extraUserCost > 0) {
    rows.push({
      desc: "Extra User Licenses",
      amount: formatInvoiceAmount(bill.extraUserCost),
    });
  }

  if (bill.onboardingFee && bill.onboardingFee > 0) {
    rows.push({
      desc: "One-time Setup & Onboarding",
      amount: formatInvoiceAmount(bill.onboardingFee),
    });
  }

  if (bill.referralDiscount && bill.referralDiscount > 0) {
    rows.push({
      desc: "Partner / Referral Discount",
      amount: `-${formatInvoiceAmount(bill.referralDiscount)}`,
      isNegative: true,
    });
  }

  rows.push({
    desc: `GST (${gstRate}%)`,
    amount: formatInvoiceAmount(gstAmt),
  });

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 pb-12 antialiased">
      {/* Top action header (hidden when printing) */}
      <header className="no-print sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 px-4 sm:px-8 py-3 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Home</span>
          </Link>
          <span className="text-slate-300">|</span>
          <span className="text-xs font-mono font-medium text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200/60">
            {invoiceNo}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            className="h-8 gap-1.5 bg-teal-600 hover:bg-teal-700 text-white font-medium shadow-xs"
            onClick={() => window.print()}
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / Save PDF</span>
          </Button>
        </div>
      </header>

      {/* Main Invoice Sheet Container */}
      <main className="max-w-[840px] mx-auto mt-6 sm:mt-8 px-3 sm:px-0">
        <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-11 print:p-0 print:border-none print:shadow-none print:rounded-none">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/my-detail-os-mark.png"
                alt="MY DETAIL OS Logo"
                width={48}
                height={48}
                className="w-12 h-12 rounded-xl object-contain border border-slate-200/80 shadow-xs"
              />
              <div>
                <div className="text-xl font-extrabold text-slate-900 tracking-tight leading-tight">
                  MY DETAIL OS
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-2xl font-extrabold text-slate-900 tracking-tight leading-none mb-1.5">
                TAX INVOICE
              </div>
              <div className="text-teal-700 font-bold text-xs sm:text-sm font-mono mb-1">
                Invoice #: {invoiceNo}
              </div>
              <div className="text-slate-500 text-xs">
                Date: {invoiceDate}
              </div>
            </div>
          </div>

          <hr className="border-t border-slate-100 mb-6" />

          {/* Two-column Billed By & Billed To */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-10 mb-8">
            {/* Legal Entity (Billed By) */}
            <div className="space-y-1 text-xs text-slate-600">
              <div className="text-[11px] font-bold text-sky-700 uppercase tracking-wider mb-1.5">
                BILLED BY (LEGAL ENTITY)
              </div>
              <div className="text-sm font-bold text-slate-900">
                Samriddhi Agencies
              </div>
              <div>124, Commercial Complex, Sector 14</div>
              <div>NOIDA, Haryana, 122001</div>
              <div>India</div>
              <div className="pt-1 text-slate-700 font-medium">
                GSTIN: <span className="font-mono">09XXXXXXXXXXXXX</span>
              </div>
              <div className="text-slate-700 font-medium">
                PAN: <span className="font-mono">AAAAA0000A</span>
              </div>
              <div>State: Haryana (Code 06)</div>
            </div>

            {/* Customer (Billed To) */}
            <div className="space-y-1 text-xs text-slate-600 sm:text-right">
              <div className="text-[11px] font-bold text-sky-700 uppercase tracking-wider mb-1.5">
                BILLED TO (CUSTOMER)
              </div>
              <div className="text-sm font-bold text-slate-900">
                {orgName}
              </div>
              <div className="text-slate-500">Subscribed Organization</div>
              <div className="pt-2 text-slate-700">
                Billing Cycle: <span className="font-semibold text-slate-900">{durationLabel}</span>
              </div>
              <div className="text-slate-700">
                Validity: <span className="font-semibold text-slate-900">{periodStart} to {periodEnd}</span>
              </div>
              <div className="pt-1">
                Status:{" "}
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  {statusLabel}
                </span>
              </div>
            </div>
          </div>

          {/* Line items table */}
          <div className="border border-slate-200/90 rounded-lg overflow-hidden mb-6">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/90 border-b border-slate-200/90 text-slate-600 font-semibold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-2.5 px-4">Description</th>
                  <th className="py-2.5 px-4 text-right">Amount (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rows.map((r, idx) => (
                  <tr key={idx} className={idx % 2 === 1 ? "bg-slate-50/40" : ""}>
                    <td className="py-2.5 px-4 text-slate-800">{r.desc}</td>
                    <td
                      className={`py-2.5 px-4 text-right font-mono font-medium ${
                        r.isNegative ? "text-rose-600" : "text-slate-900"
                      }`}
                    >
                      {r.amount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary / Total box */}
          <div className="flex justify-end mb-8">
            <div className="w-full sm:w-64 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600 py-1">
                <span>Subtotal (Base):</span>
                <span className="font-mono">₹{formatInvoiceAmount(baseAmt)}</span>
              </div>
              <div className="flex justify-between text-slate-600 py-1">
                <span>Total GST ({gstRate}%):</span>
                <span className="font-mono">₹{formatInvoiceAmount(gstAmt)}</span>
              </div>
              <div className="border-t-2 border-slate-900 pt-2 flex justify-between font-bold text-sm text-slate-900">
                <span>Grand Total:</span>
                <span className="font-mono">₹{formatInvoiceAmount(totalAmt)}</span>
              </div>
            </div>
          </div>

          {/* Payment & Transaction Info footer */}
          <div className="rounded-lg bg-slate-50 border border-slate-200/80 p-4 text-xs text-slate-600 space-y-1.5">
            <div className="font-semibold text-slate-800 text-[11px] uppercase tracking-wider mb-1">
              Payment Confirmation
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                Transaction Reference: <span className="font-mono font-medium text-slate-800">{txnRef}</span>
              </div>
              <div className="sm:text-right">
                Payment Status: <span className="font-bold text-emerald-700">{statusLabel}</span>
              </div>
            </div>
          </div>

          {/* Bottom disclaimer */}
          <div className="text-center text-[11px] text-slate-400 mt-8 pt-4 border-t border-slate-100">
            This is a computer-generated tax invoice issued by Samriddhi Agencies for MY DETAIL OS platform subscription. No signature required.
          </div>
        </div>
      </main>
    </div>
  );
}
