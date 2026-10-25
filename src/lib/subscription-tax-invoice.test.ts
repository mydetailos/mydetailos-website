import {
  parseSubscriptionInvoiceFromHash,
  formatInvoiceAmount,
  formatInvoiceDate,
  formatInvoiceNumber,
  formatPaymentStatus,
} from "./subscription-tax-invoice";

describe("website subscription-tax-invoice", () => {
  it("formats invoice number properly", () => {
    expect(formatInvoiceNumber("SUB-2026-0004")).toBe("INV-2026-0004");
    expect(formatInvoiceNumber("INV-2026-0001")).toBe("INV-2026-0001");
  });

  it("formats currency amounts correctly", () => {
    expect(formatInvoiceAmount(1000)).toBe("1,000.00");
    expect(formatInvoiceAmount(36000.5)).toBe("36,000.50");
  });

  it("parses zero-auth hash data parameter properly", () => {
    const compact = {
      id: "cmvnt2aqz0003jn2a3vejng17",
      bn: "SUB-2026-0004",
      on: "TEST WORKSHOP",
      pn: "Starter",
      tm: 12,
      tl: "1 year",
      ps: "2026-10-25T00:00:00.000Z",
      pe: "2027-10-25T00:00:00.000Z",
      ba: 1000,
      eb: 0,
      eu: 0,
      ob: 0,
      rd: 0,
      gp: 18,
      ga: 180,
      ta: 1180,
      am: 1180,
      cu: "INR",
      st: "PAID",
      tr: "TXN-12345",
      ca: "2026-10-25T12:00:00.000Z",
    };
    const b64 = Buffer.from(JSON.stringify(compact)).toString("base64");
    const hash = `#data=${b64}`;

    const parsed = parseSubscriptionInvoiceFromHash(hash);
    expect(parsed).not.toBeNull();
    expect(parsed?.id).toBe("cmvnt2aqz0003jn2a3vejng17");
    expect(parsed?.billNumber).toBe("SUB-2026-0004");
    expect(parsed?.organizationName).toBe("TEST WORKSHOP");
    expect(parsed?.totalAmount).toBe(1180);
    expect(parsed?.paymentStatus).toBe("PAID");
  });
});
