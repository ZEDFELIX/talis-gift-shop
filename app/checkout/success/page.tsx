import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import { Breadcrumbs, ButtonLink, Divider } from "@/components/ui";
import { OrderTimeline } from "@/components/account/order-timeline";
import { MpesaPanel } from "@/components/checkout/mpesa-panel";
import { formatKSh } from "@/lib/utils";

export const metadata: Metadata = { title: "Thank You" };
export const dynamic = "force-dynamic";

export default async function CheckoutSuccessPage({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
  const orderNumber = (Array.isArray(searchParams.order) ? searchParams.order[0] : searchParams.order)?.toUpperCase();
  const order = orderNumber
    ? await db.order.findUnique({
        where: { orderNumber },
        include: { events: { orderBy: { createdAt: "asc" } }, items: true, payment: true }
      })
    : null;

  if (!order) {
    return (
      <div className="container-talis py-20 text-center">
        <h1 className="font-serif text-3xl text-ink">We couldn&apos;t find that order</h1>
        <p className="mx-auto mt-3 max-w-sm text-sm text-espresso/60">If you just placed an order, check your email for the confirmation — or track it below.</p>
        <ButtonLink href="/track-order" variant="primary" className="mt-8">Track Your Order</ButtonLink>
      </div>
    );
  }

  const awaitingMpesa = order.status === "PAYMENT_PENDING" && order.payment?.method === "MPESA";

  return (
    <div className="container-talis max-w-3xl py-12 md:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [] }) }}
      />
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Order Confirmed" }]} />

      <div className="text-center">
        <span aria-hidden className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-gold/15 font-serif text-3xl text-gold">✓</span>
        <h1 className="mt-5 h-serif text-3xl text-ink sm:text-4xl">YOUR GIFT IS ON ITS WAY</h1>
        <p className="mt-2 font-script text-3xl text-gold">thank you for letting Talis be part of your moment</p>
        <p className="mt-3 text-sm text-espresso/60">Beyond the Feeling.</p>
      </div>

      <div className="mt-10 border border-beige bg-white p-6 sm:p-8">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <div>
            <p className="eyebrow mb-1">Order number</p>
            <p className="font-serif text-2xl tracking-wide text-ink">{order.orderNumber}</p>
          </div>
          <div className="text-right text-sm">
            <p className="text-espresso/60">Estimated delivery</p>
            <p className="font-semibold">{order.estimatedDelivery ? new Date(order.estimatedDelivery).toLocaleDateString("en-KE", { weekday: "short", day: "numeric", month: "short" }) : "—"}</p>
          </div>
        </div>

        <Divider />

        <ul className="divide-y divide-beige/70">
          {order.items.map((item) => (
            <li key={item.id} className="flex items-center gap-4 py-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.imageUrl ?? "/images/box.svg"} alt="" width={52} height={64} loading="lazy" className="h-16 w-[52px] border border-beige object-cover" />
              <div className="min-w-0 flex-1 text-sm">
                <p className="truncate font-medium">{item.qty} × {item.name}</p>
                {item.personalizationJson && item.personalizationJson !== "{}" && (
                  <p className="truncate text-xs italic text-gold">{item.personalizationJson.replace(/[{"}]/g, " ").trim()}</p>
                )}
                {order.giftNote && !item.giftBoxId && null}
              </div>
              <span>{formatKSh(item.unitPrice * item.qty)}</span>
            </li>
          ))}
        </ul>

        <dl className="mt-4 space-y-2 border-t border-beige pt-4 text-sm">
          <div className="flex justify-between"><dt className="text-espresso/65">Subtotal</dt><dd>{formatKSh(order.subtotal)}</dd></div>
          {order.discountTotal > 0 && (
            <div className="flex justify-between text-green-800"><dt>Discount{order.discountCode ? ` (${order.discountCode})` : ""}</dt><dd>-{formatKSh(order.discountTotal)}</dd></div>
          )}
          <div className="flex justify-between"><dt className="text-espresso/65">Delivery — {order.city}</dt><dd>{order.deliveryFee === 0 ? "Free" : formatKSh(order.deliveryFee)}</dd></div>
          <div className="flex justify-between border-t border-beige pt-2.5 font-semibold"><dt>Total</dt><dd className="font-serif text-lg">{formatKSh(order.total)}</dd></div>
        </dl>

        <div className="mt-6 grid gap-4 border-t border-beige pt-5 text-sm sm:grid-cols-2">
          <div>
            <p className="eyebrow mb-1.5">Delivering to</p>
            <p className="text-espresso/75">{order.deliveryName}<br />{order.addressLine},<br />{order.city}{order.instructions ? ` · ${order.instructions}` : ""}</p>
            <p className="mt-1 text-xs text-espresso/50">{order.phone} · {order.email}</p>
          </div>
          {order.giftNote && (
            <div>
              <p className="eyebrow mb-1.5">Your message</p>
              <p className="font-serif italic leading-relaxed text-espresso/80">&ldquo;{order.giftNote}&rdquo;</p>
            </div>
          )}
        </div>

        {awaitingMpesa && (
          <MpesaPanel orderNumber={order.orderNumber} total={order.total} />
        )}

        {order.status === "PAID" && order.payment?.method === "COD" && (
          <p className="mt-6 border border-dashed border-gold/50 bg-champagne/10 p-4 text-sm text-espresso/70">
            Pay <strong>{formatKSh(order.total)}</strong> in cash when your gift arrives. Thank you!
          </p>
        )}
      </div>

      <section className="mt-8 border border-beige bg-white p-6 sm:p-8">
        <h2 className="mb-5 font-serif text-xl text-ink">Order timeline</h2>
        <OrderTimeline events={order.events.map((e) => ({ status: e.status, note: e.note, createdAt: e.createdAt.toISOString() }))} currentStatus={order.status} />
      </section>

      <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
        <ButtonLink href={`/track-order?order=${order.orderNumber}`} variant="primary">Track This Order</ButtonLink>
        <ButtonLink href="/shop" variant="light">Continue Shopping</ButtonLink>
        <Link href="/account/orders" className="btn-base px-6 py-3 text-espresso/65 hover:text-gold">View All My Orders</Link>
      </div>
    </div>
  );
}
