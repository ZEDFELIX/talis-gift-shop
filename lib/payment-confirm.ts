import { db } from "@/lib/db";

export async function confirmOrderPaidByReference(reference: string, rawRef?: string): Promise<boolean> {
  return db.$transaction(async (tx) => {
    const payment = await tx.payment.findFirst({ where: { reference }, include: { order: true } });
    if (!payment || payment.status === "PAID") return false;

    await tx.payment.update({
      where: { id: payment.id },
      data: { status: "PAID", rawRef: rawRef ?? null }
    });

    const note = rawRef && !rawRef.startsWith("ws_") ? `M-PESA payment confirmed (Ref ${rawRef}).` : "M-PESA payment confirmed.";
    await tx.order.update({
      where: { id: payment.orderId },
      data: {
        status: "PAID",
        events: { create: { status: "PAID", note } }
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
    return true;
  });
}

export async function markPaymentFailedByReference(reference: string) {
  await db.payment.updateMany({ where: { reference }, data: { status: "FAILED" } });
}
