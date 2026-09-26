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
    <article className="group relative flex min-w-0 h-full flex-col overflow-hidden border border-beige bg-white shadow-card transition-all duration-300 hover:border-gold hover:shadow-glow">
      <div className="relative overflow-hidden bg-beige/40">
        <Link href={`/products/${product.slug}`} aria-label={product.name} className="block aspect-[4/4.6] sm:aspect-[4/5]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.image}
            alt={product.name}
            loading={priority ? "eager" : "lazy"}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
        </Link>

        <div className="absolute left-1.5 top-1.5 flex max-w-[70%] flex-wrap gap-1 sm:left-3 sm:top-3 sm:gap-1.5">
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
            "absolute right-1.5 top-1.5 flex h-8 w-8 items-center justify-center rounded-full border border-white/60 bg-white/95 shadow-card backdrop-blur transition-all sm:right-3 sm:top-3 sm:h-9 sm:w-9",
            saved && "border-gold bg-gold text-ink"
          )}
        >
          <HeartIcon width={15} height={15} filled={saved} />
        </button>

        <button
          onClick={() => setQuickView(true)}
          className="absolute inset-x-2 bottom-2 hidden translate-y-2 items-center justify-center gap-2 bg-ink/90 py-2.5 text-[11px] font-bold uppercase tracking-[0.18em] text-gold opacity-0 shadow-card backdrop-blur transition-all duration-300 hover:bg-gold hover:text-ink group-hover:translate-y-0 group-hover:opacity-100 sm:inset-x-3 sm:bottom-3 sm:flex"
        >
          <EyeIcon width={15} height={15} /> Quick View
        </button>
      </div>

      <div className="flex min-w-0 flex-1 flex-col p-2.5 sm:p-4">
        <h3 className="min-w-0 font-serif text-[13px] font-semibold leading-tight text-ink sm:text-[15px] sm:leading-snug">
          <Link href={`/products/${product.slug}`} className="line-clamp-2 transition-colors hover:text-gold">{product.name}</Link>
        </h3>
        <p className="mt-1 hidden line-clamp-1 text-xs text-espresso/55 sm:block">{product.shortDesc}</p>
        <div className="mt-1.5 hidden sm:block">{product.rating !== null && <Stars rating={product.rating} size={13} showValue={false} />}</div>

        <div className="mt-auto flex min-w-0 items-center justify-between gap-1.5 pt-2.5 sm:pt-3">
          <div className="min-w-0">
            <span className="block truncate font-serif text-[14px] font-semibold text-espresso sm:text-lg">{formatKSh(product.price)}</span>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <span className="block truncate text-[9px] text-espresso/40 line-through sm:ml-2 sm:inline sm:text-xs">{formatKSh(product.compareAtPrice)}</span>
            )}
          </div>
          <button
            disabled={outOfStock}
            onClick={() => {
              cart.add({ type:"product", productId:product.slug, slug:product.slug, name:product.name, image:product.image, price:product.price, qty:1, stock:Math.max(1, product.stock) });
              toast.push(`${product.name} added to cart`);
            }}
            className={cn(
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-full p-0 sm:h-auto sm:w-auto sm:rounded-none sm:px-4 sm:py-2.5 sm:text-[10px]",
              outOfStock ? "cursor-not-allowed bg-beige/50 text-espresso/40" : "bg-ink text-ivory hover:bg-gold hover:text-ink"
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
        <button onClick={onClose} aria-label="Close" className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-card hover:text-gold">
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
              {product.compareAtPrice && product.compareAtPrice > product.price && <span className="text-sm text-espresso/40 line-through">{formatKSh(product.compareAtPrice)}</span>}
            </div>
            <p className="mt-3 line-clamp-4 text-sm leading-relaxed text-espresso/65">{product.shortDesc}</p>
            <div className="mt-auto pt-4">
              <Button variant="primary" className="w-full" disabled={product.stock <= 0} onClick={() => { cart.add({ type:"product", productId:product.slug, slug:product.slug, name:product.name, image:product.image, price:product.price, qty:1, stock:Math.max(1, product.stock) }); toast.push(`${product.name} added to cart`); onClose(); }}>
                {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
              </Button>
              <Link href={`/products/${product.slug}`} onClick={onClose} className="mt-3 block text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-gold hover:text-espresso">View full details</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
