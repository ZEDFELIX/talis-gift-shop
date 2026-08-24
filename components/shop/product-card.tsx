"use client";

import Link from "next/link";
import { useState } from "react";
import { Badge, Button, Stars } from "@/components/ui";
import { BagIcon, EyeIcon, HeartIcon } from "@/components/icons";
import { useCart } from "@/components/providers/cart";
import { useWishlist } from "@/components/providers/wishlist";
import { useToast } from "@/components/providers/toast";
import { cn, discountPercent, formatKSh } from "@/lib/utils";
import type { ProductCardData } from "@/types";

export function ProductCard({ product, priority }: { product: ProductCardData; priority?: boolean }) {
  const cart = useCart();
  const wishlist = useWishlist();
  const toast = useToast();
  const [quickView, setQuickView] = useState(false);
  const saved = wishlist.has(product.slug);
  const off = discountPercent(product.price, product.compareAtPrice);
  const outOfStock = product.stock <= 0;

  return (
    <article className="group relative flex flex-col bg-white shadow-card transition-shadow duration-300 hover:shadow-lift">
      <div className="relative overflow-hidden bg-beige/40">
        <Link href={`/products/${product.slug}`} aria-label={product.name} className="block aspect-[4/5]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.image}
            alt={product.name}
            loading={priority ? "eager" : "lazy"}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
          />
        </Link>

        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {off > 0 && <Badge tone="sale">-{off}%</Badge>}
          {!outOfStock && product.isNew && off === 0 && <Badge tone="gold">New</Badge>}
          {product.isBestSeller && <Badge tone="black">Best Seller</Badge>}
          {outOfStock && <Badge tone="muted">Out of Stock</Badge>}
        </div>

        <button
          aria-label={saved ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
          onClick={() => {
            wishlist.toggle({ slug: product.slug, name: product.name, image: product.image, price: product.price, stock: product.stock });
            toast.push(saved ? "Removed from wishlist" : "Saved to your wishlist");
          }}
          className={cn(
            "absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-card backdrop-blur transition-all hover:bg-white hover:text-gold",
            saved && "text-gold"
          )}
        >
          <HeartIcon width={17} height={17} filled={saved} />
        </button>

        <button
          onClick={() => setQuickView(true)}
          className="absolute inset-x-3 bottom-3 hidden translate-y-2 items-center justify-center gap-2 bg-white/95 py-2.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-espresso opacity-0 shadow-card backdrop-blur transition-all duration-300 hover:text-gold group-hover:translate-y-0 group-hover:opacity-100 sm:flex"
        >
          <EyeIcon width={15} height={15} /> Quick View
        </button>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-serif text-[15px] leading-snug text-ink">
            <Link href={`/products/${product.slug}`} className="transition-colors hover:text-gold">{product.name}</Link>
          </h3>
        </div>
        <p className="mt-1 line-clamp-1 text-xs text-espresso/55">{product.shortDesc}</p>
        <div className="mt-2">{product.rating !== null && <Stars rating={product.rating} size={13} showValue={false} />}</div>
        <div className="mt-auto flex items-end justify-between gap-2 pt-3">
          <div>
            <span className="font-serif text-lg font-semibold text-espresso">{formatKSh(product.price)}</span>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <span className="ml-2 text-xs text-espresso/40 line-through">{formatKSh(product.compareAtPrice)}</span>
            )}
          </div>
          <button
            disabled={outOfStock}
            onClick={() =>
              cart.add({
                type: "product",
                productId: product.slug,
                slug: product.slug,
                name: product.name,
                image: product.image,
                price: product.price,
                qty: 1,
                stock: Math.max(1, product.stock)
              })
            }
            className={cn(
              "btn-base px-4 py-2.5 text-[10px]",
              outOfStock
                ? "cursor-not-allowed bg-beige/50 text-espresso/40"
                : "bg-ink text-ivory hover:bg-gold hover:text-ink"
            )}
            aria-label={`Add ${product.name} to cart`}
          >
            <BagIcon width={14} height={14} />
            <span className="hidden sm:inline">Add</span>
          </button>
        </div>
      </div>

      {quickView && <QuickView product={product} onClose={() => setQuickView(false)} />}
    </article>
  );
}

function QuickView({ product, onClose }: { product: ProductCardData; onClose: () => void }) {
  const cart = useCart();
  const toast = useToast();
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label={`Quick view — ${product.name}`}>
      <button aria-label="Close quick view" onClick={onClose} className="absolute inset-0 bg-ink/60 backdrop-blur-sm animate-fadeIn" />
      <div className="relative w-full max-w-lg animate-fadeUp border border-beige bg-ivory shadow-lift">
        <button onClick={onClose} aria-label="Close" className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center bg-white/90 rounded-full shadow-card hover:text-gold">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M6 6l12 12M18 6 6 18" /></svg>
        </button>
        <div className="grid sm:grid-cols-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={product.image} alt={product.name} className="aspect-square h-full w-full object-cover" />
          <div className="flex flex-col p-5">
            {product.rating !== null && <Stars rating={product.rating} size={14} showValue />}
            <h3 className="mt-2 font-serif text-xl leading-tight text-ink">{product.name}</h3>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="font-serif text-xl font-semibold text-espresso">{formatKSh(product.price)}</span>
              {product.compareAtPrice && product.compareAtPrice > product.price && (
                <span className="text-sm text-espresso/40 line-through">{formatKSh(product.compareAtPrice)}</span>
              )}
            </div>
            <p className="mt-3 line-clamp-4 text-sm leading-relaxed text-espresso/65">{product.shortDesc}</p>
            <div className="mt-auto pt-4">
              <Button
                variant="primary"
                className="w-full"
                disabled={product.stock <= 0}
                onClick={() => {
                  cart.add({ type: "product", productId: product.slug, slug: product.slug, name: product.name, image: product.image, price: product.price, qty: 1, stock: Math.max(1, product.stock) });
                  toast.push(`${product.name} added to cart`);
                  onClose();
                }}
              >
                {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
              </Button>
              <Link href={`/products/${product.slug}`} onClick={onClose} className="mt-3 block text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-gold hover:text-espresso">
                View full details
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
