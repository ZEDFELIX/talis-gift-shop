import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { formatDateTime, formatKSh, statusTone } from "@/lib/utils";
import { ORDER_STATUSES, STATUS_LABELS, TIMELINE_STEPS } from "@/types";
import { updateOrderStatus, confirmPaymentManually } from "@/app/admin/actions";
import { StatusSelectForm, ConfirmSubmit } from "@/components/admin/controls";

export const dynamic = "force-dynamic";

export default async function AdminOrderDetailPage({ params }: { params: { id: string } }) {
  await requireAdmin();
  const order = await db.order.findUnique({
    where: { id: params.id },
    include: {
      user: true,
      items: true,
      events: { orderBy: { createdAt: "asc" } },
      payment: true
    }
  });
  if (!order) notFound();

  const canConfirmPayment = order.status === "PENDING" || order.status === "PAYMENT_PENDING";
  const canCancel = !["CANCELLED", "REFUNDED", "DELIVERED"].includes(order.status);
  const stepIndex = TIMELINE_STEPS.findIndex((s) => s === order.status);

  return (
    <div className="space-y-5">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link href="/admin/orders" className="text-xs uppercase tracking-[0.14em] text-espresso/50 hover:text-gold">← All orders</Link>
          <h1 className="mt-1 font-serif text-3xl text-ink">{order.orderNumber}</h1>
          <p className="text-sm text-espresso/55">Placed {formatDateTime(order.createdAt)}</p>
        </div>
        <span className={`rounded-full px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] ${statusTone(order.status)}`}>
          {STATUS_LABELS[order.status]}
        </span>
      </header>

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <section className="border border-beige bg-white">
            <h2 className="border-b border-beige p-5 font-serif text-lg text-ink">Items ({order.items.length})</h2>
            <ul className="divide-y divide-beige/70">
              {order.items.map((item) => (
                <li key={item.id} className="flex items-center gap-4 p-5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.imageUrl ?? "/images/box.svg"} alt="" width={52} height={65} loading="lazy" className="h-[65px] w-[52px] border border-beige object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{item.qty} × {item.name}</p>
                    {item.variantJson && item.variantJson !== "{}" && <p className="text-xs text-espresso/55">{item.variantJson.replace(/[{}"]/g, "").replace(/,/g, " · ")}</p>}
                    {item.personalizationJson && item.personalizationJson !== "{}" && (
                      <p className="mt-0.5 truncate text-xs italic text-gold">{item.personalizationJson.replace(/[{}"]/g, "").replace(/,/g, " · ")}</p>
                    )}
                    <p className="text-xs text-espresso/45">{formatKSh(item.unitPrice)} each</p>
                  </div>
                  <span className="font-semibold">{formatKSh(item.unitPrice * item.qty)}</span>
                </li>
              ))}
            </ul>
            <dl className="space-y-1.5 border-t border-beige bg-champagne/10 px-5 py-4 text-sm">
              <div className="flex justify-between"><dt className="text-espresso/60">Subtotal</dt><dd>{formatKSh(order.subtotal)}</dd></div>
              {order.discountTotal > 0 && <div className="flex justify-between text-green-800"><dt>Discount{order.discountCode ? ` (${order.discountCode})` : ""}</dt><dd>-{formatKSh(order.discountTotal)}</dd></div>}
              <div className="flex justify-between"><dt className="text-espresso/60">Delivery — {order.city}</dt><dd>{order.deliveryFee === 0 ? "Free" : formatKSh(order.deliveryFee)}</dd></div>
              <div className="flex justify-between border-t border-beige pt-1.5 font-semibold"><dt>Total</dt><dd className="font-serif text-base">{formatKSh(order.total)}</dd></div>
            </dl>
          </section>

          <section className="grid gap-6 sm:grid-cols-2">
            <div className="border border-beige bg-white p-5 text-sm">
              <h3 className="mb-2 font-serif text-lg text-ink">Customer</h3>
              <p className="font-medium">{order.user?.name ?? order.deliveryName}</p>
              <p className="text-espresso/60">{order.email}</p>
              <p className="text-espresso/60">{order.phone}</p>
            </div>
            <div className="border border-beige bg-white p-5 text-sm">
              <h3 className="mb-2 font-serif text-lg text-ink">Deliver to</h3>
              <p className="leading-relaxed text-espresso/75">{order.deliveryName}, {order.addressLine}, {order.city}</p>
              {order.instructions && <p className="mt-1 text-xs italic text-espresso/55">Note: {order.instructions}</p>}
              {order.recipientName && <p className="mt-2 text-xs"><span className="text-gold">Recipient:</span> {order.recipientName}</p>}
              {order.giftNote && <p className="mt-2 border-l-2 border-gold pl-3 font-serif italic text-espresso/80">&ldquo;{order.giftNote}&rdquo;</p>}
            </div>
          </section>

          <section className="border border-beige bg-white p-5">
            <h2 className="mb-3 font-serif text-lg text-ink">Event log</h2>
            <ol className="space-y-2.5 text-sm">
              {order.events.map((e) => (
                <li key={e.id} className="flex items-baseline justify-between gap-4 border-b border-dashed border-beige/70 pb-2 last:border-none">
                  <span><strong>{STATUS_LABELS[e.status] ?? e.status}</strong>{e.note ? ` — ${e.note}` : ""}</span>
                  <span className="shrink-0 text-xs text-espresso/45">{formatDateTime(e.createdAt)}</span>
                </li>
              ))}
              {order.events.length === 0 && <li className="text-espresso/50">No events recorded.</li>}
            </ol>
          </section>
        </div>

        <aside className="space-y-6">
          <section className="border border-beige bg-white p-5">
            <h3 className="mb-3 font-serif text-lg text-ink">Update status</h3>
            <StatusSelectForm action={updateOrderStatus} orderId={order.id} current={order.status} statuses={ORDER_STATUSES} />
            <p className="mt-2 text-xs leading-relaxed text-espresso/45">
              Moving into PAID or later marks payment received &amp; decrements stock. Cancelling before dispatch releases reserved stock.
            </p>
            {canCancel && (
              <form action={updateOrderStatus} className="mt-4 border-t border-beige pt-4">
                <input type="hidden" name="orderId" value={order.id} />
                <input type="hidden" name="status" value={order.payment?.status === "PAID" ? "REFUNDED" : "CANCELLED"} />
                <ConfirmSubmit
                  message={`Cancel ${order.orderNumber}?${order.payment?.status === "PAID" ? " It will be marked REFUNDED." : ""}`}
                  className="btn-base w-full border border-red-200 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-red-700 hover:bg-red-50"
                >
                  {order.payment?.status === "PAID" ? "Cancel & mark refunded" : "Cancel order"}
                </ConfirmSubmit>
              </form>
            )}
          </section>

          {canConfirmPayment && (
            <section className="border border-gold bg-champagne/15 p-5">
              <h3 className="font-serif text-lg text-ink">Confirm M-PESA payment</h3>
              <p className="mt-1 text-xs leading-relaxed text-espresso/60">
                Verify the payment in your M-PESA statement, then enter the reference to confirm manually.
              </p>
              <form action={confirmPaymentManually} className="mt-3 space-y-3">
                <input type="hidden" name="orderId" value={order.id} />
                <input name="reference" placeholder="e.g. QGH7XYZ21A" className="input-base py-2 text-sm" aria-label="M-PESA reference" />
                <ConfirmSubmit message={`Mark ${formatKSh(order.total)} as received for ${order.orderNumber}?`} className="btn-base w-full bg-green-700 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-white hover:bg-green-800">
                  Payment received
                </ConfirmSubmit>
              </form>
            </section>
          )}

          <section className="border border-beige bg-white p-5 text-sm">
            <h3 className="mb-2 font-serif text-lg text-ink">Payment</h3>
            {order.payment ? (
              <dl className="space-y-1 text-espresso/70">
                <div className="flex justify-between"><dt>Method</dt><dd className="font-medium">{order.payment.method}</dd></div>
                <div className="flex justify-between"><dt>Status</dt><dd className={`font-medium ${order.payment.status === "PAID" ? "text-green-800" : order.payment.status === "FAILED" ? "text-red-700" : ""}`}>{order.payment.status}</dd></div>
                <div className="flex justify-between"><dt>Provider</dt><dd>{order.payment.provider}</dd></div>
                {order.payment.rawRef && <div className="flex justify-between"><dt>Ref</dt><dd className="font-mono text-xs">{order.payment.rawRef}</dd></div>}
                <div className="flex justify-between"><dt>Amount</dt><dd>{formatKSh(order.payment.amount)}</dd></div>
              </dl>
            ) : (
              <p className="text-espresso/50">No payment record.</p>
            )}
            <p className="mt-3 border-t border-beige pt-2 text-xs text-espresso/45">
              Estimated delivery: {order.estimatedDelivery ? order.estimatedDelivery.toLocaleDateString("en-KE", { weekday: "short", day: "numeric", month: "long" }) : "—"}
              {stepIndex >= 0 && <> · Journey step {stepIndex + 1}/{TIMELINE_STEPS.length}</>}
            </p>
          </section>
        </aside>
      </div>
    </div>
  );
}
