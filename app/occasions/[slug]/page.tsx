import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { toCardData } from "@/lib/catalog";
import { ProductGrid } from "@/components/shop/catalog-ui";
import { Breadcrumbs } from "@/components/ui";

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const occasion = await db.occasion.findUnique({ where: { slug: params.slug } });
  if (!occasion) return { title: "Occasion" };
  return {
    title: `${occasion.name} Gifts`,
    description: occasion.blurb ?? `${occasion.name} gifts from Talis Gift Shop — delivered across Kenya.`
  };
}

export default async function OccasionPage({ params }: Props) {
  const occasion = await db.occasion.findUnique({ where: { slug: params.slug } });
  if (!occasion) notFound();

  const products = await db.product.findMany({
    where: { active: true, occasions: { some: { id: occasion.id } } },
    orderBy: [{ bestSeller: "desc" }, { soldCount: "desc" }],
    include: { images: { orderBy: { sort: "asc" }, take: 1 }, inventory: true, reviews: { where: { approved: true }, select: { rating: true } } }
  });

  return (
    <div>
      <section className="relative overflow-hidden bg-ink py-16 text-center text-ivory md:py-20">
        <div className="talis-pattern absolute inset-0 opacity-50" aria-hidden />
        <div className="relative container-talis">
          <p className="eyebrow">Occasion</p>
          <h1 className="mt-2 font-serif text-4xl tracking-wide sm:text-5xl">{occasion.name.toUpperCase()}</h1>
          {occasion.blurb && <p className="mt-3 font-script text-3xl text-champagne">{occasion.blurb.toLowerCase()}</p>}
        </div>
      </section>

      <div className="container-talis py-10 md:py-14">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Occasions", href: "/occasions" }, { label: occasion.name }]} />
        {products.length === 0 ? (
          <p className="py-20 text-center text-sm text-espresso/60">Gifts for this occasion are being curated.</p>
        ) : (
          <ProductGrid products={products.map(toCardData)} />
        )}
      </div>
    </div>
  );
}
