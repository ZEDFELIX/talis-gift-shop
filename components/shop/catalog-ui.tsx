import Link from "next/link";
import { cn } from "@/lib/utils";
import { ProductCard } from "@/components/shop/product-card";
import type { ProductCardData } from "@/types";

export function ProductGrid({ products, className }: { products: ProductCardData[]; className?: string }) {
  return (
    <div className={cn("grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4", className)}>
      {products.map((p, i) => (
        <ProductCard key={p.slug} product={p} priority={i < 4} />
      ))}
    </div>
  );
}

export function Pagination({ page, pageCount, baseParams, basePath = "/shop" }: {
  page: number;
  pageCount: number;
  baseParams: Record<string, string | undefined>;
  basePath?: string;
}) {
  if (pageCount <= 1) return null;
  const href = (p: number) => {
    const qs = new URLSearchParams();
    for (const [k, v] of Object.entries(baseParams)) if (v) qs.set(k, v);
    if (p > 1) qs.set("page", String(p));
    const s = qs.toString();
    return s ? `${basePath}?${s}` : basePath;
  };
  const pages = Array.from({ length: pageCount }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === pageCount || Math.abs(p - page) <= 1
  );

  return (
    <nav aria-label="Pagination" className="mt-12 flex items-center justify-center gap-2">
      {page > 1 && (
        <Link href={href(page - 1)} scroll={false} className="border border-beige bg-white px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] hover:border-gold hover:text-gold">
          Prev
        </Link>
      )}
      {pages.map((p, idx) => (
        <span key={p} className="flex items-center gap-2">
          {idx > 0 && pages[idx - 1] !== p - 1 && <span className="text-espresso/40">…</span>}
          <Link
            href={href(p)}
            scroll={false}
            aria-current={p === page ? "page" : undefined}
            className={cn(
              "flex h-9 w-9 items-center justify-center border text-sm transition-colors",
              p === page ? "border-gold bg-gold text-ink font-semibold" : "border-beige bg-white text-espresso/70 hover:border-gold hover:text-gold"
            )}
          >
            {p}
          </Link>
        </span>
      ))}
      {page < pageCount && (
        <Link href={href(page + 1)} scroll={false} className="border border-beige bg-white px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] hover:border-gold hover:text-gold">
          Next
        </Link>
      )}
    </nav>
  );
}

export function EmptyState({ title, line, actionLabel, actionHref, children }: {
  title: string;
  line: string;
  actionLabel?: string;
  actionHref?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="talis-pattern flex flex-col items-center justify-center gap-3 border border-dashed border-beige px-8 py-20 text-center">
      <span aria-hidden className="font-serif text-5xl text-gold/50">T</span>
      <h3 className="mt-2 font-serif text-2xl text-ink">{title}</h3>
      <p className="max-w-sm text-sm leading-relaxed text-espresso/60">{line}</p>
      {actionHref && actionLabel && (
        <Link href={actionHref} className="btn-base mt-3 bg-ink px-7 py-3 text-ivory hover:bg-gold hover:text-ink">
          {actionLabel}
        </Link>
      )}
      {children}
    </div>
  );
}
