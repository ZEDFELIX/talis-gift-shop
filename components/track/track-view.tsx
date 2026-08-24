"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { trackOrder } from "@/actions/shop";
import { Button, Field, Input } from "@/components/ui";
import { OrderTimeline } from "@/components/account/order-timeline";
import { STATUS_LABELS } from "@/types";
import { formatDate, formatKSh } from "@/lib/utils";

type TrackedOrder = {
  orderNumber: string; status: string; createdAt: string; estimatedDelivery: string | null;
  total: number; subtotal: number; discountTotal: number; deliveryFee: number;
  zoneName: string | null; addressLine: string; city: string;
  items: { name: string; imageUrl: string | null; unitPrice: number; qty: number }[];
  events: { status: string; note: string | null; createdAt: string }[];
};

export function TrackView({ initialOrder }: { initialOrder?: string }) {
  const params = useSearchParams();
  const [orderNumber, setOrderNumber] = useState(initialOrder ?? params.get("order") ?? "");
  const [contact, setContact] = useState(params.get("contact") ?? "");
  const [result, setResult] = useState<TrackedOrder | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (busy) return;
    if (initialOrder && !contact && result) return;
    setBusy(true);
    setError("");
    const res = await trackOrder({ orderNumber, contact });
    setBusy(false);
    if (!res.ok) { setResult(null); setError(res.error); return; }
    setResult(res.order);
  };

  return (
    <div className="mx-auto max-w-2xl">
      <form onSubmit={submit} className="border border-beige bg-white p-6 sm:p-8">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Order number" required hint="e.g. TG-XXXXXXX">
            <Input value={orderNumber} onChange={(e) => setOrderNumber(e.target.value.toUpperCase())} required placeholder="TG-…" />
          </Field>
          <Field label="Phone or email used to order" required>
            <Input value={contact} onChange={(e) => setContact(e.target.value)} required placeholder="07… or you@email.com" />
          </Field>
        </div>
        {error && <p role="alert" className="mt-4 text-sm text-red-700">{error}</p>}
        <Button type="submit" variant="primary" size="lg" className="mt-6 w-full" disabled={busy}>
          {busy ? "Looking…" : "Track Order"}
        </Button>
      </form>

      {result && (
        <article className="mt-8 border border-beige bg-white p-6 sm:p-8 animate-fadeUp">
          <header className="flex flex-wrap items-baseline justify-between gap-3 border-b border-beige pb-4">
            <div>
              <p className="eyebrow mb-1">{STATUS_LABELS[result.status]}</p>
              <h2 className="font-serif text-2xl text-ink">{result.orderNumber}</h2>
              <p className="mt-0.5 text-xs text-espresso/50">Placed {formatDate(result.createdAt)}</p>
            </div>
            <div className="text-right text-sm">
              <p className="text-espresso/55">Estimated delivery</p>
              <p className="font-semibold">{formatDate(result.estimatedDelivery)}</p>
            </div>
          </header>

          <ul className="divide-y divide-beige/70 py-2">
            {result.items.map((item, i) => (
              <li key={i} className="flex items-center gap-3 py-3 text-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.imageUrl ?? "/images/box.svg"} alt="" width={44} height={54} loading="lazy" className="h-[54px] w-11 border border-beige object-cover" />
                <span className="flex-1">{item.qty} × {item.name}</span>
                <span className="tabular-nums">{formatKSh(item.unitPrice * item.qty)}</span>
              </li>
            ))}
          </ul>

          <dl className="space-y-1.5 border-t border-beige pt-3 text-sm">
            <div className="flex justify-between"><dt className="text-espresso/60">Subtotal</dt><dd>{formatKSh(result.subtotal)}</dd></div>
            {result.discountTotal > 0 && <div className="flex justify-between text-green-800"><dt>Discount</dt><dd>-{formatKSh(result.discountTotal)}</dd></div>}
            <div className="flex justify-between"><dt className="text-espresso/60">Delivery — {result.zoneName ?? result.city}</dt><dd>{result.deliveryFee === 0 ? "Free" : formatKSh(result.deliveryFee)}</dd></div>
            <div className="flex justify-between border-t border-beige pt-2 font-semibold"><dt>Total</dt><dd>{formatKSh(result.total)}</dd></div>
          </dl>

          <p className="mt-3 text-sm text-espresso/65">Delivering to: {result.addressLine}, {result.city}</p>

          <div className="mt-7 border-t border-beige pt-6">
            <h3 className="mb-4 font-serif text-lg text-ink">Journey of your gift</h3>
            <OrderTimeline events={result.events} currentStatus={result.status} />
          </div>
        </article>
      )}
    </div>
  );
}
