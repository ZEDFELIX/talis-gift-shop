import type { MetadataRoute } from "next";
import { db } from "@/lib/db";

const BASE = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = [
    "", "/shop", "/gift-boxes", "/personalized", "/new-arrivals", "/best-sellers",
    "/build-your-gift", "/cart", "/wishlist", "/track-order", "/about", "/contact",
    "/faq", "/delivery", "/returns", "/privacy", "/terms"
  ].map((path) => ({ url: `${BASE}${path}`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: path === "" ? 1 : 0.7 }));

  const [products, collections, occasions] = await Promise.all([
    db.product.findMany({ where: { active: true }, select: { slug: true, createdAt: true } }),
    db.collection.findMany({ select: { slug: true } }),
    db.occasion.findMany({ select: { slug: true } })
  ]);

  return [
    ...staticRoutes,
    ...products.map((p) => ({ url: `${BASE}/products/${p.slug}`, lastModified: p.createdAt, changeFrequency: "weekly" as const, priority: 0.9 })),
    ...collections.map((c) => ({ url: `${BASE}/collections/${c.slug}`, changeFrequency: "weekly" as const, priority: 0.6 })),
    ...occasions.map((o) => ({ url: `${BASE}/occasions/${o.slug}`, changeFrequency: "weekly" as const, priority: 0.6 }))
  ];
}
