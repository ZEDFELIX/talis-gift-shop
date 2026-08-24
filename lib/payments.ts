export interface InitializePaymentInput {
  phone: string;
  amount: number;
  reference: string;
  description: string;
}

export interface PaymentInitResult {
  ok: boolean;
  providerRef?: string;
  configured: boolean;
  message: string;
}

export interface WebhookResult {
  verified: boolean;
  reference?: string;
  providerRef?: string;
  success: boolean;
  raw?: unknown;
}

export interface PaymentProvider {
  readonly name: string;
  isConfigured(): boolean;
  initializePayment(input: InitializePaymentInput): Promise<PaymentInitResult>;
  handleWebhook(headers: Headers, body: string): Promise<WebhookResult>;
  checkPaymentStatus(reference: string): Promise<{ status: "PENDING" | "PAID" | "FAILED" }>;
  refundPayment(reference: string, amount?: number): Promise<{ ok: boolean; message: string }>;
}

function normalizePhone(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("254")) return digits.slice(0, 12);
  if (digits.startsWith("0")) return `254${digits.slice(1, 10)}`;
  if (digits.startsWith("7") || digits.startsWith("1")) return `254${digits}`;
  return digits;
}

export class MpesaPaymentProvider implements PaymentProvider {
  readonly name = "mpesa";

  private get env() {
    return process.env.MPESA_ENV === "live" ? "https://api.safaricom.co.ke" : "https://sandbox.safaricom.co.ke";
  }

  isConfigured() {
    return Boolean(
      process.env.MPESA_CONSUMER_KEY &&
      process.env.MPESA_CONSUMER_SECRET &&
      process.env.MPESA_PASSKEY &&
      process.env.MPESA_SHORTCODE
    );
  }

  private async accessToken(): Promise<string> {
    const auth = Buffer.from(
      `${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`
    ).toString("base64");
    const res = await fetch(`${this.env}/oauth/v1/generate?grant_type=client_credentials`, {
      headers: { Authorization: `Basic ${auth}` },
      cache: "no-store"
    });
    if (!res.ok) throw new Error("MPESA_AUTH_FAILED");
    const data = (await res.json()) as { access_token: string };
    return data.access_token;
  }

  async initializePayment(input: InitializePaymentInput): Promise<PaymentInitResult> {
    if (!this.isConfigured()) {
      return { ok: false, configured: false, message: "M-PESA is not yet configured. Pay manually using the details shown." };
    }
    try {
      const token = await this.accessToken();
      const timestamp = new Date().toISOString().replace(/[-T:.Z]/g, "").slice(0, 14);
      const password = Buffer.from(`${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`).toString("base64");
      const res = await fetch(`${this.env}/mpesa/stkpush/v1/processrequest`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          BusinessShortCode: process.env.MPESA_SHORTCODE,
          Password: password,
          Timestamp: timestamp,
          TransactionType: "CustomerBuyGoodsOnline",
          Amount: input.amount,
          PartyA: normalizePhone(input.phone),
          PartyB: process.env.MPESA_SHORTCODE,
          PhoneNumber: normalizePhone(input.phone),
          CallBackURL: `${process.env.NEXT_PUBLIC_SITE_URL || ""}/api/webhooks/mpesa`,
          AccountReference: input.reference,
          TransactionDesc: input.description
        }),
        cache: "no-store"
      });
      const data = (await res.json()) as { CheckoutRequestID?: string; ResponseCode?: string; errorMessage?: string };
      if (data.ResponseCode === "0" && data.CheckoutRequestID) {
        return { ok: true, configured: true, providerRef: data.CheckoutRequestID, message: "STK push sent. Enter your M-PESA PIN to complete payment." };
      }
      return { ok: false, configured: true, message: data.errorMessage || "Could not send the STK push. Please pay manually." };
    } catch {
      return { ok: false, configured: true, message: "M-PESA is temporarily unavailable. Please pay manually using the details shown." };
    }
  }

  async handleWebhook(headers: Headers, body: string): Promise<WebhookResult> {
    const expected = process.env.MPESA_WEBHOOK_SECRET;
    if (!expected) return { verified: false, success: false };
    const provided = headers.get("x-callback-secret");
    if (!provided || provided !== expected) return { verified: false, success: false };
    let parsed: Record<string, any>;
    try {
      parsed = JSON.parse(body);
    } catch {
      return { verified: false, success: false };
    }
    const stk = parsed?.Body?.stkCallback;
    if (!stk) return { verified: false, success: false };
    const success = stk.ResultCode === 0;
    let amount: number | undefined;
    let receipt: string | undefined;
    for (const item of stk.CallbackMetadata?.Item ?? []) {
      if (item.Name === "Amount") amount = item.Value;
      if (item.Name === "MpesaReceiptNumber") receipt = item.Value;
    }
    return {
      verified: true,
      reference: stk.CheckoutRequestID,
      providerRef: receipt ?? stk.CheckoutRequestID,
      success,
      raw: { amount, receipt }
    };
  }

  async checkPaymentStatus(): Promise<{ status: "PENDING" | "PAID" | "FAILED" }> {
    return { status: "PENDING" };
  }

  async refundPayment(reference: string): Promise<{ ok: boolean; message: string }> {
    void reference;
    return { ok: false, message: "Refunds are processed manually via M-PESA B2C by the Talis team." };
  }
}

let cached: PaymentProvider | null = null;

export function getPaymentProvider(): PaymentProvider {
  if (!cached) cached = new MpesaPaymentProvider();
  return cached;
}
