"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/components/providers/cart";
import { useToast } from "@/components/providers/toast";
import { Button, ButtonLink, Divider } from "@/components/ui";
import { EmptyState } from "@/components/shop/catalog-ui";
import { GiftIcon, MinusIcon, PlusIcon, TrashIcon, ArrowRightIcon } from "@/components/icons";
import { formatKSh } from "@/lib/utils";

export function CartView({ freeThreshold }: { freeThreshold: number }) {
  const cart = useCart();
  const toast = useToast();
  const [code, setCode] = useState("");
  const [codeMsg, setCodeMsg] = useState<{ ok: boolean; msg: string } | null>(null);
  const [applying, setApplying] = useState(false);

  if (!cart.mounted) {
    return <div className="h-64 animate-pulse rounded bg-white/50" aria-hidden />;
  }

  if (cart.items.length === 0 && cart.saved.length === 0) {
    return (
      <EmptyState
        title="Your Cart Is Waiting"
        line="Something beautiful could be here."
        actionLabel="Explore Gifts"
        actionHref="/shop"
      />
    );
  }

  const discountOff = cart.discount?.amountOff ?? 0;

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
      <div>
        {cart.items.length === 0 ? (
          <p className="border border-dashed border-beige bg-white/60 p-8 text-center text-sm text-espresso/60">Your cart is empty — saved items are below.</p>
        ) : (
          <ul className="divide-y divide-beige border border-beige bg-white">
            {cart.items.map((line) => (
              <li key={line.key} className="flex gap-4 p-4 sm:p-5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={line.image} alt={line.name} width={88} height={110} className="h-[110px] w-[88px] shrink-0 border border-beige object-cover" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      {line.type === "product" && line.slug ? (
                        <Link href={`/products/${line.slug}`} className="font-serif text-lg text-ink hover:text-gold">{line.name}</Link>
                      ) : (
                        <span className="font-serif text-lg text-ink">{line.name}</span>
                      )}
                      {line.variant && <p className="mt-0.5 text-xs text-espresso/55">{line.variant}</p>}
                      {line.personalization && Object.keys(line.personalization).length > 0 && (
                        <p className="mt-1 text-xs italic text-gold">
                          Personalized — {Object.entries(line.personalization).map(([k, v]) => `${k}: ${v}`).join(" · ")}
                        </p>
                      )}
                      {line.meta && line.meta.length > 0 && (
                        <p className="mt-1 text-xs text-espresso/55">{line.meta.join(" · ")}</p>
                      )}
                    </div>
                    <span className="shrink-0 font-semibold">{formatKSh(line.price * line.qty)}</span>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2">
                    <div className="flex items-center border border-beige">
                      <button onClick={() => cart.setQty(line.key, line.qty - 1)} aria-label="Decrease quantity" disabled={line.qty <= 1} className="flex h-8 w-8 items-center justify-center hover:text-gold disabled:opacity-30"><MinusIcon width={13} height={13} /></button>
                      <span className="w-8 text-center text-sm tabular-nums">{line.qty}</span>
                      <button onClick={() => cart.setQty(line.key, line.qty + 1)} aria-label="Increase quantity" disabled={line.qty >= line.stock} className="flex h-8 w-8 items-center justify-center hover:text-gold disabled:opacity-30"><PlusIcon width={13} height={13} /></button>
                    </div>
                    <button onClick={() => { cart.saveForLater(line.key); toast.push("Saved for later"); }} className="text-xs font-semibold uppercase tracking-[0.12em] text-espresso/60 underline-offset-4 hover:text-gold hover:underline">
                      Save for later
                    </button>
                    <button onClick={() => cart.remove(line.key)} aria-label={`Remove ${line.name}`} className="ml-auto flex h-8 w-8 items-center justify-center text-espresso/40 hover:text-red-700">
                      <TrashIcon width={16} height={16} />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}

        {cart.saved.length > 0 && (
          <section aria-label="Saved for later" className="mt-10">
            <h2 className="font-serif text-xl text-ink">Saved for later</h2>
            <ul className="mt-4 divide-y divide-beige border border-beige bg-white/70">
              {cart.saved.map((line) => (
                <li key={line.key} className="flex items-center gap-4 p-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={line.image} alt={line.name} width={56} height={70} className="h-[70px] w-14 shrink-0 border border-beige object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-serif text-[15px] text-ink">{line.name}</p>
                    <p className="text-sm font-semibold text-gold">{formatKSh(line.price)}</p>
                  </div>
                  <Button size="sm" variant="light" onClick={() => cart.moveToCart(line.key)}>Move to Cart</Button>
                  <button onClick={() => cart.removeSaved(line.key)} aria-label={`Remove ${line.name}`} className="flex h-8 w-8 shrink-0 items-center justify-center text-espresso/40 hover:text-red-700">
                    <TrashIcon width={15} height={15} />
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section aria-label="Recommendations" className="mt-12 rounded-none border border-gold/30 bg-champagne/10 p-6 text-center">
          <GiftIcon width={24} height={24} className="mx-auto text-gold" />
          <h2 className="mt-2 font-serif text-xl text-ink">MAKE IT SPECIAL</h2>
          <p className="mx-auto mt-1 max-w-sm text-sm text-espresso/65">
            Turn any order into a composed gift box with a ribbon and a handwritten card.
          </p>
          <ButtonLink href="/build-your-gift" variant="outline" size="sm" className="mt-4">Build a Gift Box</ButtonLink>
        </section>
      </div>

      <aside className="lg:sticky lg:top-24 lg:self-start" aria-label="Order summary">
        <div className="border border-beige bg-white p-6">
          <h2 className="font-serif text-xl text-ink">Order Summary</h2>
          <Divider />
          <dl className="space-y-2.5 text-sm">
            <div className="flex justify-between"><dt className="text-espresso/65">Subtotal ({cart.count} item{cart.count === 1 ? "" : "s"})</dt><dd>{formatKSh(cart.subtotal)}</dd></div>
            {discountOff > 0 && (
              <div className="flex justify-between text-green-800"><dt>Discount</dt><dd>-{formatKSh(discountOff)}</dd></div>
            )}
            <div className="flex justify-between text-espresso/50"><dt>Delivery</dt><dd>Calculated at checkout</dd></div>
          </dl>

          <div className="mt-5 flex items-baseline justify-between border-t border-beige pt-4">
            <span className="text-[12px] font-semibold uppercase tracking-[0.18em]">Total</span>
            <span className="font-serif text-2xl font-semibold text-ink">{formatKSh(Math.max(0, cart.subtotal - discountOff))}</span>
          </div>

          <form
            className="mt-5"
            onSubmit={async (e) => {
              e.preventDefault();
              setApplying(true);
              const res = await cart.applyDiscount(code);
              setCodeMsg({ ok: res.ok, msg: res.message });
              setApplying(false);
              if (res.ok) setCode("");
            }}
          >
            <label htmlFor="coupon" className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.16em] text-espresso/70">Discount code</label>
            <div className="flex gap-2">
              <input
                id="coupon"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="e.g. WELCOME10"
                className="field-input py-2.5 uppercase placeholder:normal-case"
              />
              <Button type="submit" variant="light" size="sm" disabled={applying}>Apply</Button>
            </div>
            {codeMsg && <p role="status" className={codeMsg.ok ? "mt-2 text-xs text-green-800" : "mt-2 text-xs text-red-700"}>{codeMsg.msg}</p>}
            {cart.discount && (
              <div className="mt-2 flex items-center justify-between text-xs text-green-800">
                <span>{cart.discount.label} applied</span>
                <button type="button" onClick={cart.clearDiscount} className="underline underline-offset-2 hover:text-red-700">Remove</button>
              </div>
            )}
          </form>

          <ButtonLink href="/checkout" variant="gold" size="lg" className="mt-6 w-full" scroll>
            Proceed to Checkout <ArrowRightIcon width={15} height={15} />
          </ButtonLink>

          {cart.subtotal < freeThreshold && (
            <p className="mt-3 text-center text-xs text-espresso/55">
              Add {formatKSh(freeThreshold - cart.subtotal)} more for free Nairobi delivery
            </p>
          )}
          <Link href="/shop" className="mt-4 block text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-espresso/60 hover:text-gold">
            Continue shopping
          </Link>
        </div>
      </aside>
    </div>
  );
}

export function GiftMessageCard() {
  const cart = useCart();
  return (
    <section aria-label="Gift message" className="mt-10 border border-dashed border-gold/50 bg-champagne/10 p-6">
      <label htmlFor="giftNote" className="block font-serif text-lg text-ink">Add a handwritten message</label>
      <p className="mt-1 text-sm text-espresso/60">We&apos;ll write it on a Talis card, by hand.</p>
      <textarea
        id="giftNote"
        rows={3}
        maxLength={300}
        value={cart.giftNote}
        onChange={(e) => cart.setGiftNote(e.target.value.slice(0, 300))}
        placeholder="Write something only you would say…"
        className="field-input mt-3"
      />
      <p className="mt-1 text-right text-[11px] text-espresso/40">{cart.giftNote.length}/300</p>
    </section>
  );
}
