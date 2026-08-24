import Link from "next/link";
import type { Metadata } from "next";
import { getSettings } from "@/lib/settings";
import { db } from "@/lib/db";
import { toCardData } from "@/lib/catalog";
import {
  Hero, ShopByFeeling, FeaturedCollections, BestSellers,
  GiftBoxPromo, NewArrivals, PersonalizationBand, Testimonials,
  InstagramSection, NewsletterSection
} from "@/components/home/sections";

export const metadata: Metadata = {
  title: "Talis Gift Shop — Beyond the Feeling"
};

export default async function HomePage() {
  const [settings, bestSellers, newArrivals, collections] = await Promise.all([
    getSettings(),
    db.product.findMany({
      where: { active: true, bestSeller: true },
      orderBy: [{ soldCount: "desc" }],
      take: 4,
      include: { images: { orderBy: { sort: "asc" }, take: 1 }, inventory: true, reviews: { where: { approved: true }, select: { rating: true } } }
    }),
    db.product.findMany({
      where: { active: true },
      orderBy: [{ createdAt: "desc" }],
      take: 4,
      include: { images: { orderBy: { sort: "asc" }, take: 1 }, inventory: true, reviews: { where: { approved: true }, select: { rating: true } } }
    }),
    db.collection.findMany({ where: { featured: true }, orderBy: { name: "asc" } })
  ]);

  return (
    <>
      <Hero settings={settings} />
      <ShopByFeeling />
      <FeaturedCollections collections={collections.map((c) => ({ slug: c.slug, name: c.name, tagline: c.tagline, image: c.image }))} />
      <BestSellers products={bestSellers.map(toCardData)} />
      <GiftBoxPromo />
      <NewArrivals products={newArrivals.map(toCardData)} />
      <PersonalizationBand />
      <Testimonials testimonials={settings.testimonials} />
      <InstagramSection settings={settings} />
      <NewsletterSection />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "Talis Gift Shop",
            potentialAction: {
              "@type": "SearchAction",
              target: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/shop?q={search_term_string}`,
              "query-input": "required name=search_term_string"
            }
          })
        }}
      />
      <div className="sr-only">
        <Link href="/shop">Shop all gifts</Link>
      </div>
    </>
  );
}
