import { NextRequest, NextResponse } from "next/server";
import { getPaymentProvider } from "@/lib/payments";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const provider = getPaymentProvider();
  const result = await provider.handleWebhook(req.headers, body);

  if (!result.verified) {
    return NextResponse.json({ error: "Verification failed" }, { status: 401 });
  }

  if (result.reference && result.success) {
    await db.$transaction(async (tx) => {
      const payment = await tx.payment.findFirst({ where: { reference: result.reference! }, include: { order: true } });
      if (!payment || payment.status === "PAID") return;

      await tx.payment.update({
        where: { id: payment.id },
        data: { status: "PAID", rawRef: result.providerRef ?? null }
      });

      await tx.order.update({
        where: { id: payment.orderId },
        data: {
          status: "PAID",
          events: { create: { status: "PAID", note: `M-PESA payment confirmed${result.providerRef ? ` (Ref ${result.providerRef})` : ""}.` } }
        }
      });

      const items = await tx.orderItem.findMany({ where: { orderId: payment.orderId } });
      for (const item of items) {
        if (item.productId) {
          await tx.inventory.updateMany({
            where: { productId: item.productId },
            data: {
              reserved: { decrement: item.qty },
              quantity: { decrement: item.qty }
            }
          });
          await tx.product.update({ where: { id: item.productId }, data: { soldCount: { increment: item.qty } } });
        }
      }
    });
  } else if (result.reference) {
    await db.payment.updateMany({ where: { reference: result.reference }, data: { status: "FAILED" } });
  }

  return NextResponse.json({ received: true });
}
