import { Suspense } from "react";
import Link from "next/link";
import { getFacets, listProducts, type CatalogQuery } from "@/lib/catalog";
import { ProductGrid, Pagination, EmptyState } from "@/components/shop/catalog-ui";
import { Filters, SortSelect } from "@/components/shop/filters";
import { Breadcrumbs } from "@/components/ui";

export type CatalogPreset = {
  title: string;
  eyebrow?: string;
  sub?: string;
  script?: string;
  basePath: string;
  overrides?: Partial<CatalogQuery>;
};

export function CatalogPage({ preset, searchParams }: { preset: CatalogPreset; searchParams: Record<string, string | string[] | undefined> }) {
  const get = (k: string) => {
    const v = searchParams[k];
    return Array.isArray(v) ? v[0] : v;
  };

  const query: CatalogQuery = {
    q: get("q"),
    category: preset.overrides?.category ?? get("category"),
    occasion: preset.overrides?.occasion ?? get("occasion"),
    recipient: preset.overrides?.recipient ?? get("recipient"),
    bucket: preset.overrides?.bucket ?? get("bucket"),
    sort: get("sort"),
    page: Number(get("page") ?? 1) || 1,
    pageSize: 12,
    featuredOnly: preset.overrides?.featuredOnly,
    bestSellersOnly: preset.overrides?.bestSellersOnly,
    newOnly: preset.overrides?.newOnly,
    personalizableOnly: preset.overrides?.personalizableOnly
  };
  if (preset.overrides?.category && get("category")) query.category = get("category");
  if (preset.overrides?.occasion && get("occasion")) query.occasion = get("occasion");

  return <CatalogInner preset={preset} query={query} rawParams={searchParams} />;
}

async function CatalogInner({ preset, query, rawParams }: { preset: CatalogPreset; query: CatalogQuery; rawParams: Record<string, string | string[] | undefined> }) {
  const [{ items, total, page, pageCount }, facets] = await Promise.all([listProducts(query), getFacets()]);
  const categories = facets.categories.map((c) => ({ slug: c.slug, name: c.name, count: c._count.products }));
  const occasions = facets.occasions.map((o) => ({ slug: o.slug, name: o.name }));
  const baseParams: Record<string, string | undefined> = {};
  for (const k of ["q", "category", "occasion", "recipient", "bucket", "sort"]) {
    const v = rawParams[k];
    baseParams[k] = Array.isArray(v) ? v[0] : v;
  }
  const searching = Boolean(query.q);

  return (
    <div className="container-talis w-full min-w-0 overflow-x-clip py-6 sm:py-10 md:py-14">
      <div className="hidden sm:block"><Breadcrumbs items={[{ label: "Home", href: "/" }, { label: preset.title }]} /></div>

      <header className="mx-auto mb-5 w-full max-w-2xl text-left sm:mb-8 sm:text-center md:mb-12">
        <p className="eyebrow mb-2 sm:mb-3">{preset.eyebrow ?? (searching ? "Search" : "Shop ZED")}</p>
        {query.q ? (
          <h1 className="h-serif text-2xl text-ink sm:text-3xl md:text-4xl">Results for &ldquo;{query.q}&rdquo;</h1>
        ) : (
          <>
            <h1 className="h-serif text-3xl text-ink sm:text-4xl">{preset.title}</h1>
            {preset.script && <p className="mt-1 font-script text-2xl text-gold sm:mt-2 sm:text-3xl">{preset.script}</p>}
            {preset.sub && <p className="mt-2 text-[13px] leading-relaxed text-espresso/65 sm:mt-3 sm:text-sm">{preset.sub}</p>}
          </>
        )}
      </header>

      <div className="mb-4 w-full sm:mb-6">
        <Suspense fallback={null}><Filters categories={categories} occasions={occasions} resultCount={total} basePath={preset.basePath} /></Suspense>
      </div>

      <div className="grid w-full min-w-0 lg:grid-cols-[260px_minmax(0,1fr)] lg:items-start lg:gap-10">
        <div className="hidden lg:block lg:sticky lg:top-24 lg:self-start">
          <Suspense fallback={<div className="h-[400px] animate-pulse rounded bg-white/60" />}>
            <Filters categories={categories} occasions={occasions} resultCount={total} basePath={preset.basePath} />
          </Suspense>
        </div>

        <div className="min-w-0 w-full">
          <div className="mb-5 hidden items-center justify-between lg:flex">
            <p className="text-xs uppercase tracking-[0.16em] text-espresso/50">{total} gifts</p>
            <Suspense fallback={null}><SortSelect basePath={preset.basePath} /></Suspense>
          </div>

          {items.length === 0 ? (
            <EmptyState title={searching ? "We couldn't find that" : "Nothing here yet"} line={searching ? "Try another feeling, occasion or product." : "New treasures are being curated — check back soon."} actionLabel="Explore All Gifts" actionHref="/shop" />
          ) : (
            <>
              <ProductGrid products={items} />
              <Pagination page={page} pageCount={pageCount} baseParams={baseParams} basePath={preset.basePath} />
            </>
          )}
        </div>
      </div>

      <section className="emerald-gradient relative mt-12 overflow-hidden px-5 py-10 text-center sm:mt-16 sm:px-6 sm:py-12 md:mt-24">
        <div className="talis-pattern absolute inset-0 opacity-50" aria-hidden />
        <div className="relative">
          <p className="font-script text-3xl text-gold">Can&apos;t decide?</p>
          <h2 className="mt-2 font-serif text-xl font-bold text-ivory sm:text-2xl md:text-3xl">Build a gift box as unique as they are</h2>
          <Link href="/build-your-gift" className="btn-base mt-6 bg-gold px-8 py-3.5 text-ink shadow-glow hover:bg-champagne">Build a Gift Box</Link>
        </div>
      </section>
    </div>
  );
}
