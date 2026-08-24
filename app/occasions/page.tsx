import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";

export const metadata: Metadata = {
  title: "Shop by Occasion",
  description: "Birthday, anniversary, graduation, wedding and more — find the perfect Talis gift for every occasion."
};

export default async function OccasionsIndex() {
  const occasions = await db.occasion.findMany({ orderBy: { name: "asc" }, include: { _count: { select: { products: { where: { active: true } } } } } });

  return (
    <div className="container-talis py-12 md:py-16">
      <header className="mx-auto mb-10 max-w-xl text-center">
        <p className="eyebrow mb-3">Moments matter</p>
        <h1 className="h-serif text-3xl text-ink sm:text-4xl">SHOP BY OCCASION</h1>
        <p className="mt-3 text-sm leading-relaxed text-espresso/65">Whatever the moment, we have a feeling for it.</p>
      </header>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-5 lg:grid-cols-4">
        {occasions.map((o) => (
          <Link
            key={o.slug}
            href={`/occasions/${o.slug}`}
            className="group relative flex min-h-[140px] flex-col justify-between overflow-hidden bg-ink p-5 transition-transform duration-300 hover:-translate-y-1"
          >
            <span aria-hidden className="talis-pattern absolute inset-0 opacity-40 group-hover:opacity-70" />
            <span className="relative font-serif text-xl text-ivory">{o.name}</span>
            <span className="relative mt-2 block text-xs leading-relaxed text-champagne/80">{o.blurb}</span>
            <span className="relative mt-2 text-[10px] uppercase tracking-[0.22em] text-gold/80">{o._count.products} gifts</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
