import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { AccountShell } from "@/components/account/account-shell";
import { OrderTimeline } from "@/components/account/order-timeline";
import { ReorderButton } from "@/components/account/reorder-button";
import { ButtonLink, Divider } from "@/components/ui";
import { STATUS_LABELS } from "@/types";
import { formatDate, formatDateTime, formatKSh, statusTone } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AccountOrderDetailPage({ params }: { params: { id: string } }) {
  const user = await requireUser(`/account/orders/${params.id}`);
  const order = await db.order.findFirst({
    where: { orderNumber: params.id.toUpperCase(), userId: user.id },
    include: { events: { orderBy: { createdAt: "asc" } }, items: true, payment: true }
  });
  if (!order) notFound();

  return (
    <AccountShell active="orders" title={order.orderNumber}>
      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <header className="flex flex-wrap items-center justify-between gap-3 border border-beige bg-white p-5">
            <div>
              <p className="font-serif text-2xl text-ink">{order.orderNumber}</p>
              <p className="mt-0.5 text-xs text-espresso/50">Placed {formatDate(order.createdAt)} · {order.payment?.method ?? "—"} · {formatKSh(order.total)}</p>
            </div>
            <span className={`rounded-full px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] ${statusTone(order.status)}`}>
              {STATUS_LABELS[order.status]}
            </span>
          </header>

          {order.status === "PAYMENT_PENDING" && order.payment?.method === "MPESA" && (
            <div className="border border-gold/50 bg-champagne/15 p-5 text-sm">
              <p className="font-semibold">Payment pending</p>
              <Link href={`/checkout/success?order=${order.orderNumber}`} className="mt-1 inline-block font-semibold uppercase tracking-[0.14em] text-gold underline underline-offset-4">
                Complete M-PESA payment →
              </Link>
            </div>
          )}

          <section aria-label="Items" className="border border-beige bg-white p-5">
            <h3 className="mb-2 font-serif text-xl text-ink">Your gifts</h3>
            <Divider />
            <ul className="divide-y divide-beige/70">
              {order.items.map((item) => (
                <li key={item.id} className="flex items-center gap-4 py-3.5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.imageUrl ?? "/images/box.svg"} alt="" width={56} height={70} loading="lazy" className="h-[70px] w-14 border border-beige object-cover" />
                  <div className="min-w-0 flex-1 text-sm">
                    <p className="font-medium">{item.qty} × {item.name}</p>
                    {item.variantJson && <p className="text-xs text-espresso/55">{item.variantJson}</p>}
                    {item.personalizationJson && item.personalizationJson !== "{}" && (
                      <p className="truncate text-xs italic text-gold">{item.personalizationJson.replace(/[{}"]/g, "").replace(/,/g, " · ")}</p>
                    )}
                    <p className="mt-0.5 text-xs text-espresso/45">{formatKSh(item.unitPrice)} each</p>
                  </div>
                  <span className="font-semibold">{formatKSh(item.unitPrice * item.qty)}</span>
                </li>
              ))}
            </ul>
            <dl className="mt-4 space-y-2 border-t border-beige pt-4 text-sm">
              <div className="flex justify-between"><dt className="text-espresso/60">Subtotal</dt><dd>{formatKSh(order.subtotal)}</dd></div>
              {order.discountTotal > 0 && <div className="flex justify-between text-green-800"><dt>Discount{order.discountCode ? ` (${order.discountCode})` : ""}</dt><dd>-{formatKSh(order.discountTotal)}</dd></div>}
              <div className="flex justify-between"><dt className="text-espresso/60">Delivery — {order.city}</dt><dd>{order.deliveryFee === 0 ? "Free" : formatKSh(order.deliveryFee)}</dd></div>
              <div className="flex justify-between border-t border-beige pt-2.5 font-semibold"><dt>Total</dt><dd className="font-serif text-lg">{formatKSh(order.total)}</dd></div>
            </dl>
          </section>

          <section aria-label="Order timeline" className="border border-beige bg-white p-5 sm:p-7">
            <h3 className="mb-5 font-serif text-xl text-ink">Journey of your gift</h3>
            <OrderTimeline events={order.events.map((e) => ({ status: e.status, note: e.note, createdAt: e.createdAt.toISOString() }))} currentStatus={order.status} />
          </section>
        </div>

        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <div className="border border-beige bg-white p-5 text-sm">
            <h3 className="mb-3 font-serif text-lg text-ink">Delivery details</h3>
            <p className="leading-relaxed text-espresso/75">
              {order.deliveryName}<br />
              {order.addressLine},<br />
              {order.city}
            </p>
            <p className="mt-2 text-xs text-espresso/50">{order.phone} · {order.email}</p>
            {order.recipientName && <p className="mt-2 text-xs"><span className="text-gold">For:</span> {order.recipientName}</p>}
            {order.giftNote && <p className="mt-3 border-l-2 border-gold pl-3 font-serif italic text-espresso/80">&ldquo;{order.giftNote}&rdquo;</p>}
            <p className="mt-3 text-xs text-espresso/55">Estimated delivery: <strong>{formatDate(order.estimatedDelivery)}</strong></p>
          </div>
          <div className="flex flex-col gap-3">
            <ReorderButton orderNumber={order.orderNumber} />
            <ButtonLink href={`/track-order?order=${order.orderNumber}&contact=${encodeURIComponent(user.email)}`} variant="light">Track Live</ButtonLink>
          </div>
          {order.payment && (
            <div className="border border-beige bg-white p-5 text-xs leading-relaxed text-espresso/60">
              Payment: {order.payment.method} · Status <strong className={order.payment.status === "PAID" ? "text-green-800" : "text-espresso"}>{order.payment.status.toLowerCase()}</strong>
              {order.payment.rawRef ? <> · Ref {order.payment.rawRef}</> : null}
              <br />Last update {formatDateTime(order.updatedAt)}
            </div>
          )}
        </aside>
      </div>
    </AccountShell>
  );
}
