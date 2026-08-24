"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/components/providers/cart";
import { createOrder } from "@/actions/shop";
import { Button, Field, Input, Textarea, Divider, Spinner } from "@/components/ui";
import { EmptyState } from "@/components/shop/catalog-ui";
import { CheckIcon, CreditCardIcon, TruckIcon } from "@/components/icons";
import { cn, formatKSh } from "@/lib/utils";

export function CheckoutView({ defaultName, defaultEmail, defaultPhone }: {
  defaultName?: string;
  defaultEmail?: string;
  defaultPhone?: string;
}) {
  const router = useRouter();
  const cart = useCart();
  const [method, setMethod] = useState<"MPESA" | "COD">("MPESA");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const discountOff = cart.discount?.amountOff ?? 0;
  const total = Math.max(0, cart.subtotal - discountOff);

  if (!cart.mounted) {
    return <div className="h-64 animate-pulse rounded bg-white/50" aria-hidden />;
  }

  if (cart.items.length === 0) {
    return (
      <EmptyState
        title="Your Cart Is Waiting"
        line="Something beautiful could be here."
        actionLabel="Explore Gifts"
        actionHref="/shop"
      />
    );
  }

  return (
    <form
      className="grid gap-10 lg:grid-cols-[1fr_380px]"
      onSubmit={async (e) => {
        e.preventDefault();
        if (busy) return;
        setBusy(true);
        setError("");
        const fd = new FormData(e.currentTarget);
        const payload = {
          items: cart.items.map((l) => ({
            type: l.type,
            productId: l.productId,
            giftBoxId: l.giftBoxId,
            qty: l.qty,
            variant: l.variant,
            personalization: l.personalization
          })),
          customer: {
            name: String(fd.get("name") || ""),
            email: String(fd.get("email") || ""),
            phone: String(fd.get("phone") || "")
          },
          delivery: {
            addressLine: String(fd.get("addressLine") || ""),
            city: String(fd.get("city") || ""),
            instructions: String(fd.get("instructions") || "") || undefined
          },
          gift: {
            recipientName: String(fd.get("recipientName") || "") || undefined,
            note: String(fd.get("giftNote") || cart.giftNote) || undefined
          },
          discountCode: cart.discount?.code,
          paymentMethod: method
        };

        const res = await createOrder(payload);
        if (!res.ok) {
          setError(res.error);
          setBusy(false);
          window.scrollTo({ top: 0, behavior: "smooth" });
          return;
        }
        cart.clear();
        router.replace(`/checkout/success?order=${res.orderNumber}`);
      }}
    >
      <input type="hidden" name="giftNote" value={cart.giftNote} />
      <div className="space-y-10">
        {error && (
          <p role="alert" className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>
        )}

        <fieldset>
          <legend className="mb-5 font-serif text-xl text-ink">1 · Your details</legend>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Full name" required>
              <Input name="name" defaultValue={defaultName} required minLength={2} autoComplete="name" />
            </Field>
            <Field label="Phone" required hint="M-PESA number">
              <Input name="phone" type="tel" defaultValue={defaultPhone} required placeholder="07XX XXX XXX" pattern="[+0-9\s]{9,16}" />
            </Field>
            <Field label="Email" required className="sm:col-span-2">
              <Input name="email" type="email" defaultValue={defaultEmail} required autoComplete="email" />
            </Field>
          </div>
        </fieldset>

        <fieldset>
          <legend className="mb-5 flex items-center gap-2 font-serif text-xl text-ink"><TruckIcon width={20} height={20} className="text-gold" /> 2 · Delivery</legend>
          <p className="mb-4 inline-block border border-gold/40 bg-champagne/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-espresso/75">
            Free countrywide delivery
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="City / Town" required>
              <Input name="city" required minLength={2} autoComplete="address-level2" />
            </Field>
            <Field label="Delivery address" required className="sm:col-span-2">
              <Input name="addressLine" required placeholder="Estate / street / building & house number" minLength={4} autoComplete="street-address" />
            </Field>
            <Field label="Recipient name" hint="If the gift is for someone else">
              <Input name="recipientName" placeholder="Same as above if not specified" />
            </Field>
            <Field label="Delivery instructions">
              <Input name="instructions" placeholder="Gate code, landmark, best time…" maxLength={300} />
            </Field>
          </div>
        </fieldset>

        <fieldset>
          <legend className="mb-5 font-serif text-xl text-ink">3 · Gift message</legend>
          <Field label="Message on their card" hint="Handwritten by us · max 300 characters">
            <Textarea name="giftNote" defaultValue={cart.giftNote} rows={3} maxLength={300} onChange={() => {}} placeholder={cart.giftNote || "Write something only you would say…"} />
          </Field>
        </fieldset>

        <fieldset>
          <legend className="mb-5 font-serif text-xl text-ink">4 · Payment</legend>
          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setMethod("MPESA")}
              aria-pressed={method === "MPESA"}
              className={cn(
                "flex items-start gap-3 border p-4 text-left transition-all",
                method === "MPESA" ? "border-gold ring-1 ring-gold/40 bg-champagne/10" : "border-beige bg-white hover:border-gold/60"
              )}
            >
              <span className={cn("mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border", method === "MPESA" ? "border-gold bg-gold text-ink" : "border-beige")}>
                {method === "MPESA" && <CheckIcon width={12} height={12} />}
              </span>
              <span>
                <span className="block font-semibold">M-PESA</span>
                <span className="mt-0.5 block text-xs leading-relaxed text-espresso/55">Receive an STK push and enter your PIN. Your order is confirmed once payment verifies.</span>
              </span>
            </button>
            <button
              type="button"
              onClick={() => setMethod("COD")}
              aria-pressed={method === "COD"}
              className={cn(
                "flex items-start gap-3 border p-4 text-left transition-all",
                method === "COD" ? "border-gold ring-1 ring-gold/40 bg-champagne/10" : "border-beige bg-white hover:border-gold/60"
              )}
            >
              <span className={cn("mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border", method === "COD" ? "border-gold bg-gold text-ink" : "border-beige")}>
                {method === "COD" && <CheckIcon width={12} height={12} />}
              </span>
              <span>
                <span className="block font-semibold">Cash on Delivery</span>
                <span className="mt-0.5 block text-xs leading-relaxed text-espresso/55">Pay our courier in person when your gift arrives.</span>
              </span>
            </button>
            <button type="button" disabled aria-disabled className="flex cursor-not-allowed items-start gap-3 border border-beige bg-white p-4 text-left opacity-45 sm:col-span-2">
              <CreditCardIcon width={20} height={20} className="text-gold" />
              <span>
                <span className="block font-semibold">Card</span>
                <span className="mt-0.5 block text-xs">Coming soon.</span>
              </span>
            </button>
          </div>
          {method === "MPESA" && (
            <p className="mt-3 border border-dashed border-gold/50 bg-white p-3 text-xs leading-relaxed text-espresso/65">
              After placing your order you&apos;ll receive an M-PESA prompt on <strong>{String(defaultPhone ?? "your phone")}</strong>. If it doesn&apos;t arrive within a minute, you can trigger it again or pay manually from the confirmation page.
            </p>
          )}
        </fieldset>
      </div>

      <aside className="lg:sticky lg:top-24 lg:self-start" aria-label="Order summary">
        <div className="border border-beige bg-white p-6">
          <h2 className="font-serif text-xl text-ink">Order Summary</h2>
          <Divider />
          <ul className="max-h-64 space-y-3 overflow-y-auto pr-1">
            {cart.items.map((l) => (
              <li key={l.key} className="flex gap-3 text-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={l.image} alt="" width={44} height={54} loading="lazy" className="h-[54px] w-11 shrink-0 border border-beige object-cover" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate">{l.qty} × {l.name}</span>
                  {(l.variant || (l.personalization && Object.keys(l.personalization).length > 0)) && (
                    <span className="block truncate text-[11px] text-espresso/50">
                      {[l.variant, l.personalization && Object.entries(l.personalization).map(([k, v]) => `${k}: ${v}`).join(" · ")].filter(Boolean).join(" · ")}
                    </span>
                  )}
                </span>
                <span className="shrink-0 tabular-nums">{formatKSh(l.price * l.qty)}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-5 space-y-2.5 border-t border-beige pt-4 text-sm">
            <div className="flex justify-between"><dt className="text-espresso/65">Subtotal</dt><dd>{formatKSh(cart.subtotal)}</dd></div>
            {discountOff > 0 && (
              <div className="flex justify-between text-green-800"><dt>Discount ({cart.discount?.code})</dt><dd>-{formatKSh(discountOff)}</dd></div>
            )}
            <div className="flex justify-between"><dt className="text-espresso/65">Delivery</dt><dd className="font-semibold text-green-800">Free</dd></div>
          </dl>
          <div className="mt-4 flex items-baseline justify-between border-t-2 border-ink pt-4">
            <span className="text-[12px] font-semibold uppercase tracking-[0.18em]">Total</span>
            <span className="font-serif text-2xl font-semibold text-ink">{formatKSh(total)}</span>
          </div>
          <Button type="submit" variant="gold" size="lg" className="mt-6 w-full" disabled={busy}>
            {busy ? (<><Spinner /> Placing order…</>) : `Place Order — ${formatKSh(total)}`}
          </Button>
          <p className="mt-3 text-center text-[11px] leading-relaxed text-espresso/50">
            Final totals are verified server-side. We never charge before confirming stock.
          </p>
        </div>
      </aside>
    </form>
  );
}
