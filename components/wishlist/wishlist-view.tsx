"use client";

import { useWishlist } from "@/components/providers/wishlist";
import { useCart } from "@/components/providers/cart";
import { useToast } from "@/components/providers/toast";
import { Button, ButtonLink } from "@/components/ui";
import { EmptyState } from "@/components/shop/catalog-ui";
import { BagIcon, HeartIcon } from "@/components/icons";
import { formatKSh } from "@/lib/utils";

export function WishlistView() {
  const wishlist = useWishlist();
  const cart = useCart();
  const toast = useToast();

  if (!wishlist.mounted) {
    return <div className="h-64 animate-pulse bg-white/50" aria-hidden />;
  }

  if (wishlist.entries.length === 0) {
    return (
      <EmptyState
        title="Save Something Special"
        line="Tap the heart on any gift and it will wait for you here."
        actionLabel="Discover Gifts"
        actionHref="/shop"
      />
    );
  }

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <p className="text-xs uppercase tracking-[0.16em] text-espresso/55">{wishlist.entries.length} saved</p>
        <button onClick={() => { wishlist.clear(); toast.push("Wishlist cleared"); }} className="text-[11px] font-semibold uppercase tracking-[0.14em] text-espresso/50 hover:text-red-700">
          Clear all
        </button>
      </div>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {wishlist.entries.map((entry) => (
          <li key={entry.slug} className="group flex gap-4 border border-beige bg-white p-4">
            <a href={`/products/${entry.slug}`} className="block shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={entry.image} alt={entry.name} width={80} height={100} loading="lazy" className="h-[100px] w-20 border border-beige object-cover transition-transform group-hover:scale-[1.02]" />
            </a>
            <div className="flex min-w-0 flex-1 flex-col">
              <a href={`/products/${entry.slug}`} className="font-serif text-[15px] leading-snug text-ink hover:text-gold">{entry.name}</a>
              <span className="mt-1 font-semibold text-sm">{formatKSh(entry.price)}</span>
              {entry.stock <= 0 && <span className="text-xs text-red-700">Out of stock</span>}
              <div className="mt-auto flex items-center gap-2 pt-3">
                <Button
                  size="sm"
                  variant="primary"
                  disabled={entry.stock <= 0}
                  onClick={() => cart.add({ type: "product", productId: entry.slug, slug: entry.slug, name: entry.name, image: entry.image, price: entry.price, qty: 1, stock: Math.max(1, entry.stock) })}
                >
                  <BagIcon width={13} height={13} /> Add to Cart
                </Button>
                <button
                  aria-label={`Remove ${entry.name} from wishlist`}
                  onClick={() => { wishlist.remove(entry.slug); toast.push("Removed from wishlist"); }}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-beige text-gold hover:border-red-300 hover:text-red-700"
                >
                  <HeartIcon width={15} height={15} filled />
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <p className="mt-8 text-center text-xs text-espresso/45">
        Saved on this device. <ButtonLink href="/account" variant="ghost" className="text-[11px] underline underline-offset-4">Log in</ButtonLink> to keep it with your account.
      </p>
    </>
  );
}
