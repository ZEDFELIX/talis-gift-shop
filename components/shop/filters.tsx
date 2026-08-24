"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { FilterIcon, XIcon } from "@/components/icons";
import { cn, formatKSh } from "@/lib/utils";
import { PRICE_BUCKETS, RECIPIENTS } from "@/types";

type Facet = { slug: string; name: string; count?: number };

export function Filters({ categories, occasions, resultCount, basePath = "/shop" }: { categories: Facet[]; occasions: Facet[]; resultCount: number; basePath?: string }) {
  return (
    <>
      <div className="hidden lg:block">
        <FilterPanel categories={categories} occasions={occasions} resultCount={resultCount} basePath={basePath} />
      </div>
      <MobileFilters categories={categories} occasions={occasions} resultCount={resultCount} basePath={basePath} />
    </>
  );
}

function useFilterNav(basePath = "/shop") {
  const router = useRouter();
  const params = useSearchParams();

  const update = (key: string, value?: string) => {
    const qs = new URLSearchParams(params.toString());
    if (!value || qs.get(key) === value) qs.delete(key);
    else qs.set(key, value);
    qs.delete("page");
    const s = qs.toString();
    router.push(s ? `${basePath}?${s}` : basePath, { scroll: false });
  };

  const activeCount = ["category", "occasion", "recipient", "bucket"].filter((k) => params.get(k)).length;
  return { update, params, activeCount };
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <details className="border-b border-beige/70 py-1" open>
      <summary className="flex cursor-pointer list-none items-center justify-between py-3 text-[12px] font-semibold uppercase tracking-[0.18em] text-ink [&::-webkit-details-marker]:hidden">
        {title}
        <span className="text-gold">+</span>
      </summary>
      <div className="pb-4">{children}</div>
    </details>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "flex w-full items-center justify-between px-3 py-2 text-left text-[13px] transition-colors",
        active ? "bg-ink text-ivory" : "text-espresso/70 hover:bg-ivory hover:text-espresso"
      )}
    >
      <span>{children}</span>
      {active && <XIcon width={13} height={13} />}
    </button>
  );
}

function FilterPanel({ categories, occasions, resultCount, basePath }: { categories: Facet[]; occasions: Facet[]; resultCount: number; basePath?: string }) {
  const { update, params, activeCount } = useFilterNav(basePath);
  return (
    <aside aria-label="Product filters" className="border border-beige bg-white p-5">
      <div className="flex items-center justify-between border-b border-beige pb-4">
        <h2 className="font-serif text-lg text-ink">Filters</h2>
        <span className="text-xs text-espresso/50">{resultCount} gifts</span>
      </div>

      <Group title="Category">
        <div className="-mx-3 flex flex-col gap-0.5">
          {categories.map((c) => (
            <Chip key={c.slug} active={params.get("category") === c.slug} onClick={() => update("category", c.slug)}>
              <span className="flex items-center justify-between gap-2">
                <span>{c.name}</span>
                {typeof c.count === "number" && <span className="text-xs opacity-50">{c.count}</span>}
              </span>
            </Chip>
          ))}
        </div>
      </Group>

      <Group title="Occasion">
        <div className="flex flex-wrap gap-1.5">
          {occasions.map((o) => {
            const active = params.get("occasion") === o.slug;
            return (
              <button
                key={o.slug}
                onClick={() => update("occasion", o.slug)}
                aria-pressed={active}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-xs transition-colors",
                  active ? "border-gold bg-gold text-ink font-semibold" : "border-beige text-espresso/65 hover:border-gold hover:text-gold"
                )}
              >
                {o.name}
              </button>
            );
          })}
        </div>
      </Group>

      <Group title="Recipient">
        <div className="flex flex-wrap gap-1.5">
          {RECIPIENTS.map((r) => {
            const active = params.get("recipient") === r.slug;
            return (
              <button
                key={r.slug}
                onClick={() => update("recipient", r.slug)}
                aria-pressed={active}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-xs transition-colors",
                  active ? "border-gold bg-gold text-ink font-semibold" : "border-beige text-espresso/65 hover:border-gold hover:text-gold"
                )}
              >
                {r.name}
              </button>
            );
          })}
        </div>
      </Group>

      <Group title="Price">
        <div className="-mx-3 flex flex-col gap-0.5">
          {PRICE_BUCKETS.map((b) => (
            <Chip key={b.key} active={params.get("bucket") === b.key} onClick={() => update("bucket", b.key)}>
              {b.label}
            </Chip>
          ))}
        </div>
      </Group>

      {activeCount > 0 && (
        <a href={clearHref()} className="mt-4 block w-full border border-espresso py-2.5 text-center text-[11px] font-semibold uppercase tracking-[0.18em] transition-colors hover:bg-ink hover:text-ivory">
          Clear all filters ({activeCount})
        </a>
      )}
    </aside>
  );

  function clearHref() {
    const qs = new URLSearchParams();
    const q = params.get("q");
    const sort = params.get("sort");
    if (q) qs.set("q", q);
    if (sort) qs.set("sort", sort);
    const s = qs.toString();
    return s ? `/shop?${s}` : "/shop";
  }
}

function MobileFilters({ categories, occasions, resultCount, basePath }: { categories: Facet[]; occasions: Facet[]; resultCount: number; basePath?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="lg:hidden">
      <button
        onClick={() => setOpen(true)}
        className="btn-base w-full border border-espresso bg-white py-3"
      >
        <FilterIcon width={16} height={16} /> Filters & Sort · {resultCount} gifts
      </button>
      {open && (
        <div className="fixed inset-0 z-[80]" role="dialog" aria-modal="true" aria-label="Filters">
          <button aria-label="Close filters" onClick={() => setOpen(false)} className="absolute inset-0 bg-ink/50 backdrop-blur-sm animate-fadeIn" />
          <div className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-xl bg-ivory shadow-lift animate-fadeUp">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-beige bg-ivory px-5 py-4">
              <h2 className="font-serif text-lg text-ink">Filters</h2>
              <button onClick={() => setOpen(false)} aria-label="Close" className="flex h-9 w-9 items-center justify-center"><XIcon width={20} height={20} /></button>
            </div>
            <div className="p-5 pt-0">
              <SortSelect />
            </div>
            <div className="px-5 pb-8">
              <FilterPanel categories={categories} occasions={occasions} resultCount={resultCount} basePath={basePath} />
              <button onClick={() => setOpen(false)} className="btn-base mt-5 w-full bg-ink py-3.5 text-ivory">
                Show {resultCount} gifts
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function SortSelect({ basePath = "/shop" }: { basePath?: string }) {
  const { update, params } = useFilterNav(basePath);
  return (
    <label className="flex items-center justify-between gap-3 text-[12px] uppercase tracking-[0.14em] text-espresso/60">
      <span>Sort</span>
      <select
        value={params.get("sort") ?? "newest"}
        onChange={(e) => update("sort", e.target.value === "newest" ? undefined : e.target.value)}
        className="field-input w-auto py-2 pr-8 text-xs normal-case tracking-normal"
        aria-label="Sort products"
      >
        <option value="newest">Newest</option>
        <option value="popular">Most Loved</option>
        <option value="price-asc">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
        <option value="rating">Top Rated</option>
      </select>
    </label>
  );
}
