import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { toCardData } from "@/lib/catalog";
import { ProductGrid } from "@/components/shop/catalog-ui";
import { Breadcrumbs } from "@/components/ui";
import Link from "next/link";

type Props = { params: { slug: string }; searchParams: Record<string, string | string[] | undefined> };

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const collection = await db.collection.findUnique({ where: { slug: params.slug } });
  if (!collection) return { title: "Collection" };
  return {
    title: `${collection.name} — Collection`,
    description: collection.tagline ?? `Explore the ${collection.name} collection at Talis Gift Shop.`
  };
}

export default async function CollectionPage({ params }: Props) {
  const collection = await db.collection.findUnique({ where: { slug: params.slug } });
  if (!collection) notFound();

  const products = await db.product.findMany({
    where: { active: true, collections: { some: { id: collection.id } } },
    orderBy: [{ bestSeller: "desc" }, { createdAt: "desc" }],
    include: { images: { orderBy: { sort: "asc" }, take: 1 }, inventory: true, reviews: { where: { approved: true }, select: { rating: true } } }
  });

  return (
    <div>
      <section className="relative overflow-hidden bg-ink py-16 text-center text-ivory md:py-20">
        <div className="talis-pattern absolute inset-0 opacity-50" aria-hidden />
        <div className="relative container-talis">
          <p className="eyebrow">Collection</p>
          <h1 className="mt-2 font-serif text-4xl tracking-[0.08em] sm:text-5xl">{collection.name.toUpperCase()}</h1>
          {collection.tagline && (
            <>
              <p className="mt-3 font-script text-3xl text-champagne">{collection.tagline.toLowerCase()}</p>
              {collection.description && (
                <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-ivory/65">{collection.description}</p>
              )}
            </>
          )}
        </div>
      </section>

      <div className="container-talis py-10 md:py-14">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Collections", href: "/shop" }, { label: collection.name }]} />
        {products.length === 0 ? (
          <p className="py-20 text-center text-sm text-espresso/60">This collection is being curated. <Link href="/shop" className="text-gold underline underline-offset-4">Browse all gifts</Link></p>
        ) : (
          <ProductGrid products={products.map(toCardData)} />
        )}
      </div>
    </div>
  );
}
