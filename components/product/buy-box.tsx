"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useCart } from "@/components/providers/cart";
import { useWishlist } from "@/components/providers/wishlist";
import { useToast } from "@/components/providers/toast";
import { Button, Badge, Stars } from "@/components/ui";
import { BagIcon, HeartIcon, MinusIcon, PlusIcon, SparkleIcon } from "@/components/icons";
import { cn, discountPercent, formatKSh } from "@/lib/utils";

type Variant = { id: string; name: string; options: string[] };
type PField = { label: string; max: number };

export function BuyBox({
  product
}: {
  product: {
    slug: string; name: string; image: string; price: number; compareAtPrice: number | null;
    shortDesc: string; rating: number | null; reviewCount: number;
    stock: number;
    variants: Variant[];
    personalizable: boolean;
    personalizationFields: PField[];
  };
}) {
  const router = useRouter();
  const cart = useCart();
  const wishlist = useWishlist();
  const toast = useToast();

  const [variant, setVariant] = useState<Record<string, string>>(() =>
    Object.fromEntries(product.variants.map((v) => [v.name, v.options[0]]))
  );
  const [personalization, setPersonalization] = useState<Record<string, string>>({});
  const [qty, setQtyLocal] = useState(1);
  const [adding, setAdding] = useState(false);

  const saved = wishlist.has(product.slug);
  const off = discountPercent(product.price, product.compareAtPrice);
  const outOfStock = product.stock <= 0;

  const variantLabel = useMemo(
    () => Object.entries(variant).filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`).join(" · ") || undefined,
    [variant]
  );

  const pValid = product.personalizationFields.every((f) => (personalization[f.label] ?? "").trim().length <= f.max);

  const buildLine = () => ({
    type: "product" as const,
    productId: product.slug,
    slug: product.slug,
    name: product.name,
    image: product.image,
    price: product.price,
    qty,
    stock: Math.max(1, product.stock),
    variant: variantLabel,
    personalization: product.personalizable && Object.keys(personalization).length ? Object.fromEntries(Object.entries(personalization).filter(([, v]) => v.trim())) : undefined
  });

  const addToCart = async (goCheckout = false) => {
    if (outOfStock || !pValid) return;
    setAdding(true);
    cart.add(buildLine());
    toast.push(`${product.name} added to your cart`);
    setAdding(false);
    if (goCheckout) router.push("/checkout");
  };

  return (
    <div className="flex flex-col">
      <div className="flex flex-wrap items-center gap-2">
        {off > 0 && <Badge tone="sale">-{off}% Today</Badge>}
        {outOfStock ? <Badge tone="muted">Out of Stock</Badge> : product.stock <= 3 ? <Badge tone="gold">Only {product.stock} left</Badge> : <span className="text-xs uppercase tracking-[0.14em] text-green-800">In Stock</span>}
        {product.personalizable && (
          <span className="inline-flex items-center gap-1 text-[11px] uppercase tracking-[0.16em] text-gold"><SparkleIcon width={13} height={13} /> Personalizable</span>
        )}
      </div>

      <h1 className="mt-4 font-serif text-3xl leading-tight text-ink sm:text-4xl">{product.name}</h1>

      <div className="mt-2 flex items-center gap-2 text-sm text-espresso/60">
        {product.rating !== null ? (
          <>
            <Stars rating={product.rating} size={15} />
            <a href="#reviews" className="link-underline">{product.reviewCount} reviews</a>
          </>
        ) : (
          <a href="#reviews" className="link-underline">Be the first to review</a>
        )}
      </div>

      <div className="mt-5 flex items-baseline gap-3">
        <span className="font-serif text-3xl font-semibold text-espresso">{formatKSh(product.price)}</span>
        {product.compareAtPrice && product.compareAtPrice > product.price && (
          <>
            <span className="text-lg text-espresso/40 line-through">{formatKSh(product.compareAtPrice)}</span>
            <span className="text-sm font-semibold text-gold">Save {formatKSh(product.compareAtPrice - product.price)}</span>
          </>
        )}
      </div>

      <p className="mt-4 leading-relaxed text-espresso/70">{product.shortDesc}</p>

      {product.variants.map((v) => (
        <div key={v.id} className="mt-6">
          <h3 className="mb-2 text-[12px] font-semibold uppercase tracking-[0.16em] text-espresso/80">{v.name}</h3>
          <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={v.name}>
            {v.options.map((opt) => {
              const active = variant[v.name] === opt;
              return (
                <button
                  key={opt}
                  role="radio"
                  aria-checked={active}
                  onClick={() => setVariant((s) => ({ ...s, [v.name]: opt }))}
                  className={cn(
                    "min-w-[52px] border px-4 py-2.5 text-sm transition-all",
                    active ? "border-gold bg-gold/10 font-semibold text-espresso ring-1 ring-gold/50" : "border-beige bg-white text-espresso/70 hover:border-gold hover:text-gold"
                  )}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {product.personalizable && product.personalizationFields.length > 0 && (
        <fieldset className="mt-6 border border-dashed border-gold/50 bg-champagne/10 p-4">
          <legend className="flex items-center gap-1.5 px-2 text-[12px] font-semibold uppercase tracking-[0.16em] text-gold">
            <SparkleIcon width={14} height={14} /> Make it personal
          </legend>
          <div className="grid gap-3 sm:grid-cols-2">
            {product.personalizationFields.map((f) => (
              <label key={f.label} className="block">
                <span className="mb-1 block text-xs font-medium text-espresso/75">{f.label}</span>
                <input
                  value={personalization[f.label] ?? ""}
                  maxLength={f.max + 8}
                  onChange={(e) => setPersonalization((s) => ({ ...s, [f.label]: e.target.value.slice(0, f.max) }))}
                  className="field-input py-2 text-sm"
                  placeholder={`Max ${f.max} characters`}
                />
                <span className={cn("mt-0.5 block text-right text-[10px]", (personalization[f.label]?.length ?? 0) > f.max - 6 ? "text-red-700" : "text-espresso/40")}>
                  {(personalization[f.label]?.length ?? 0)}/{f.max}
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      )}

      <div className="mt-7 flex items-center gap-4">
        <div className="flex items-center border border-beige bg-white">
          <button onClick={() => setQtyLocal((q) => Math.max(1, q - 1))} aria-label="Decrease quantity" className="flex h-11 w-11 items-center justify-center hover:text-gold disabled:opacity-30" disabled={qty <= 1}>
            <MinusIcon width={14} height={14} />
          </button>
          <span aria-live="polite" className="w-9 text-center font-semibold tabular-nums">{qty}</span>
          <button onClick={() => setQtyLocal((q) => Math.min(Math.max(1, product.stock), q + 1))} aria-label="Increase quantity" className="flex h-11 w-11 items-center justify-center hover:text-gold disabled:opacity-30" disabled={qty >= product.stock || outOfStock}>
            <PlusIcon width={14} height={14} />
          </button>
        </div>
        {!outOfStock && <p className="text-xs text-espresso/55">Order soon — gifts this loved sell out.</p>}
      </div>

      <div className="mt-5 grid grid-cols-[1fr_auto] gap-3 sm:grid-cols-2">
        <Button variant="primary" size="lg" disabled={outOfStock || adding || !pValid} onClick={() => addToCart(false)} className="col-span-2 sm:col-span-1">
          <BagIcon width={16} height={16} /> {outOfStock ? "Out of Stock" : "Add to Cart"}
        </Button>
        <button
          onClick={() => {
            wishlist.toggle({ slug: product.slug, name: product.name, image: product.image, price: product.price, stock: product.stock });
            toast.push(saved ? "Removed from wishlist" : "Saved to your wishlist");
          }}
          aria-label={saved ? "Remove from wishlist" : "Add to wishlist"}
          className={cn(
            "flex h-full min-h-[48px] items-center justify-center border transition-colors sm:col-span-2",
            saved ? "border-gold bg-gold/10 text-gold" : "border-espresso/25 bg-white text-espresso/70 hover:border-gold hover:text-gold"
          )}
        >
          <HeartIcon width={18} height={18} filled={saved} />
          <span className="ml-2 text-[11px] font-semibold uppercase tracking-[0.16em]">{saved ? "Saved" : "Add to Wishlist"}</span>
        </button>
      </div>
      <Button variant="gold" size="lg" disabled={outOfStock || !pValid} onClick={() => addToCart(true)} className="mt-3 w-full">
        Buy Now — Gift in Days
      </Button>

      <div className="sticky bottom-[68px] z-40 mt-4 md:hidden md:static">
        <div className="flex items-stretch gap-3 border-t border-beige bg-white/95 p-3 shadow-lift backdrop-blur">
          <span className="flex items-center font-serif text-lg font-semibold">{formatKSh(product.price * qty)}</span>
          <Button variant="primary" disabled={outOfStock || !pValid} onClick={() => addToCart(false)} className="flex-1">
            {outOfStock ? "Out of Stock" : `Add ${qty > 1 ? qty : ""} to Cart`}
          </Button>
        </div>
      </div>
    </div>
  );
}
