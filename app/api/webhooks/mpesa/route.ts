import { NextRequest, NextResponse } from "next/server";
import { getPaymentProvider } from "@/lib/payments";
import { confirmOrderPaidByReference, markPaymentFailedByReference } from "@/lib/payment-confirm";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const provider = getPaymentProvider();
  const result = await provider.handleWebhook(req.url, req.headers, body);

  if (!result.verified) {
    return NextResponse.json({ error: "Verification failed" }, { status: 401 });
  }

  if (result.reference) {
    if (result.success) {
      await confirmOrderPaidByReference(result.reference, result.providerRef);
    } else {
      await markPaymentFailedByReference(result.reference);
    }
  }

  return NextResponse.json({ received: true });
}
