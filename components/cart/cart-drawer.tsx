"use client";

import Link from "next/link";
import { useCart } from "@/components/providers/cart";
import { Button, ButtonLink, Divider } from "@/components/ui";
import { GiftIcon, MinusIcon, PlusIcon, TrashIcon, XIcon } from "@/components/icons";
import { formatKSh } from "@/lib/utils";

export function CartDrawer() {
  const cart = useCart();
  const open = cart.drawerOpen;

  if (!open) return null;
  const freeThreshold = 10000;
  const remaining = Math.max(0, freeThreshold - cart.subtotal);
  const progress = Math.min(100, Math.round((cart.subtotal / freeThreshold) * 100));

  return (
    <div className="fixed inset-0 z-[75]" role="dialog" aria-modal="true" aria-label="Cart">
      <button aria-label="Close cart" onClick={() => cart.setDrawerOpen(false)} className="absolute inset-0 bg-ink/50 backdrop-blur-sm animate-fadeIn" />
      <aside className="absolute inset-y-0 right-0 flex w-[92vw] max-w-md flex-col bg-ivory shadow-lift animate-slideIn">
        <div className="flex h-[68px] shrink-0 items-center justify-between border-b border-beige px-5">
          <h2 className="font-serif text-xl text-ink">Your Cart</h2>
          <button onClick={() => cart.setDrawerOpen(false)} aria-label="Close" className="flex h-10 w-10 items-center justify-center hover:text-gold"><XIcon width={20} height={20} /></button>
        </div>

        {cart.items.length === 0 ? (
          <div className="talis-pattern flex flex-1 flex-col items-center justify-center gap-3 px-8 text-center">
            <GiftIcon width={40} height={40} className="text-gold" />
            <p className="font-serif text-2xl text-ink">Your cart is waiting</p>
            <p className="text-sm text-espresso/60">Something beautiful could be here.</p>
            <ButtonLink href="/shop" variant="primary" size="sm" className="mt-2" onClick={() => cart.setDrawerOpen(false)}>
              Explore Gifts
            </ButtonLink>
          </div>
        ) : (
          <>
            <div className="border-b border-beige/70 bg-white px-5 py-3">
              <p className="mb-2 text-xs text-espresso/70">
                {remaining > 0 ? (
                  <>You&apos;re <strong className="text-gold">{formatKSh(remaining)}</strong> away from free Nairobi delivery</>
                ) : (
                  <span className="font-semibold uppercase tracking-[0.14em] text-gold">Free Nairobi delivery unlocked</span>
                )}
              </p>
              <div className="h-1 w-full overflow-hidden rounded-full bg-beige/50">
                <div className="h-full rounded-full bg-gold transition-all duration-500" style={{ width: `${progress}%` }} />
              </div>
            </div>

            <ul className="flex-1 divide-y divide-beige/60 overflow-y-auto px-5">
              {cart.items.map((line) => (
                <li key={line.key} className="flex gap-4 py-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={line.image} alt={line.name} width={72} height={90} className="h-[90px] w-[72px] shrink-0 border border-beige object-cover" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      {line.type === "product" && line.slug ? (
                        <Link href={`/products/${line.slug}`} onClick={() => cart.setDrawerOpen(false)} className="truncate font-serif text-[15px] text-ink hover:text-gold">
                          {line.name}
                        </Link>
                      ) : (
                        <span className="truncate font-serif text-[15px] text-ink">{line.name}</span>
                      )}
                      <button onClick={() => cart.remove(line.key)} aria-label={`Remove ${line.name}`} className="shrink-0 text-espresso/40 hover:text-red-700">
                        <TrashIcon width={16} height={16} />
                      </button>
                    </div>
                    {line.variant && <p className="mt-0.5 truncate text-xs text-espresso/55">{line.variant}</p>}
                    {line.personalization && Object.keys(line.personalization).length > 0 && (
                      <p className="mt-0.5 truncate text-xs italic text-gold">
                        Personalized: {Object.entries(line.personalization).map(([k, v]) => `${k}: ${v}`).join(" · ")}
                      </p>
                    )}
                    {line.meta && line.meta.length > 0 && (
                      <p className="mt-0.5 truncate text-xs text-espresso/55">{line.meta.join(" · ")}</p>
                    )}
                    <div className="mt-2.5 flex items-center justify-between">
                      <div className="flex items-center border border-beige bg-white">
                        <button onClick={() => cart.setQty(line.key, line.qty - 1)} aria-label="Decrease quantity" className="flex h-7 w-7 items-center justify-center hover:text-gold disabled:opacity-30" disabled={line.qty <= 1}>
                          <MinusIcon width={13} height={13} />
                        </button>
                        <span className="w-7 text-center text-sm tabular-nums">{line.qty}</span>
                        <button onClick={() => cart.setQty(line.key, line.qty + 1)} aria-label="Increase quantity" className="flex h-7 w-7 items-center justify-center hover:text-gold disabled:opacity-30" disabled={line.qty >= line.stock}>
                          <PlusIcon width={13} height={13} />
                        </button>
                      </div>
                      <span className="text-sm font-semibold text-espresso">{formatKSh(line.price * line.qty)}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="shrink-0 space-y-3 border-t border-beige bg-white p-5">
              <div className="flex items-center justify-between text-sm">
                <span className="uppercase tracking-[0.14em] text-espresso/60">Subtotal</span>
                <span className="font-serif text-lg font-semibold text-ink">{formatKSh(cart.subtotal)}</span>
              </div>
              {cart.discount && (
                <div className="flex items-center justify-between text-sm text-green-800">
                  <span>{cart.discount.label}</span>
                  <span>-{formatKSh(cart.discount.amountOff)}</span>
                </div>
              )}
              <p className="text-xs text-espresso/50">Delivery calculated at checkout.</p>
              <Divider />
              <div className="grid grid-cols-2 gap-3">
                <Button variant="light" onClick={() => { cart.setDrawerOpen(false); window.location.href = "/cart"; }}>View Cart</Button>
                <Button variant="gold" onClick={() => { cart.setDrawerOpen(false); window.location.href = "/checkout"; }}>Checkout</Button>
              </div>
              <button
                onClick={() => { cart.setDrawerOpen(false); window.location.href = "/build-your-gift"; }}
                className="w-full pt-1 text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-gold hover:text-espresso"
              >
                Make it special — build a gift box
              </button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
