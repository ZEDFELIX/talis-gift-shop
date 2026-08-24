import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { getProductBySlug, getRelatedProducts, toCardData } from "@/lib/catalog";
import { getSettings } from "@/lib/settings";
import { ProductGallery } from "@/components/product/gallery";
import { BuyBox } from "@/components/product/buy-box";
import { InfoTabs, ReviewsSection } from "@/components/product/tabs-reviews";
import { ProductGrid } from "@/components/shop/catalog-ui";
import { Breadcrumbs, SectionHeading } from "@/components/ui";

type Props = { params: { slug: string } };

const BASE = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);
  if (!product) return { title: "Product" };
  return {
    title: `${product.name} — ${product.shortDesc}`,
    description: product.shortDesc,
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: {
      title: `${product.name} | Talis Gift Shop`,
      description: product.shortDesc,
      images: [{ url: product.images[0]?.url ?? "/images/box.svg" }]
    }
  };
}

export default async function ProductPage({ params }: Props) {
  const product = await getProductBySlug(params.slug);
  if (!product || !product.active) notFound();

  const [related, settings] = await Promise.all([getRelatedProducts(product.categoryId, product.id), getSettings()]);
  const zones = await db.deliveryZone.findMany({ where: { active: true } });

  const available = product.inventory ? Math.max(0, product.inventory.quantity - product.inventory.reserved) : 0;
  const ratings = product.reviews.map((r) => r.rating);
  const avg = ratings.length ? Math.round((ratings.reduce((a, b) => a + b, 0) / ratings.length) * 10) / 10 : null;

  let pFields: { label: string; max: number }[] = [];
  try {
    if (product.personalizationFields) pFields = JSON.parse(product.personalizationFields);
  } catch {}

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDesc,
    image: product.images.map((i) => i.url),
    sku: product.slug.toUpperCase(),
    brand: { "@type": "Brand", name: "Talis Gift Shop" },
    offers: {
      "@type": "Offer",
      url: `${BASE}/products/${product.slug}`,
      priceCurrency: "KES",
      price: product.price,
      availability: available > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
    },
    ...(avg !== null && ratings.length > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: avg,
            reviewCount: ratings.length
          }
        }
      : {})
  };

  return (
    <div className="container-talis py-8 md:py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Shop", href: "/shop" },
          { label: product.category.name, href: `/shop?category=${product.category.slug}` },
          { label: product.name }
        ]}
      />

      <div className="grid gap-10 md:gap-14 lg:grid-cols-2">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <ProductGallery images={product.images.map((i) => ({ url: i.url, alt: i.alt }))} alt={product.name} />
        </div>
        <BuyBox
          product={{
            slug: product.slug,
            name: product.name,
            image: product.images[0]?.url ?? "/images/box.svg",
            price: product.price,
            compareAtPrice: product.compareAtPrice,
            shortDesc: product.shortDesc,
            rating: avg,
            reviewCount: ratings.length,
            stock: available,
            variants: product.variants.map((v) => ({ id: v.id, name: v.name, options: v.options.split("|") })),
            personalizable: product.personalizable,
            personalizationFields: pFields
          }}
        />
      </div>

      <InfoTabs description={product.description} included={product.whatsIncluded} personalizable={product.personalizable} zones={zones} />
      <ReviewsSection
        productSlug={product.slug}
        rating={avg}
        reviews={product.reviews.map((r) => ({
          id: r.id,
          name: r.name,
          rating: r.rating,
          title: r.title,
          body: r.body,
          createdAt: r.createdAt.toISOString(),
          verified: Boolean(r.userId)
        }))}
      />
      <p className="sr-only">Delivery across Kenya. Free Nairobi delivery over KSh {settings.freeDeliveryThreshold.toLocaleString("en-KE")}.</p>

      {related.length > 0 && (
        <section className="mt-20 border-t border-beige pt-14">
          <SectionHeading eyebrow="You may also love" title="Complete the feeling" />
          <ProductGrid products={related} />
        </section>
      )}
    </div>
  );
}
