import { db } from "@/lib/db";
import { PRICE_BUCKETS, RECIPIENTS } from "@/types";
import type { ProductCardData } from "@/types";

export type CatalogQuery = {
  q?: string;
  category?: string;
  occasion?: string;
  recipient?: string;
  bucket?: string;
  sort?: string;
  page?: number;
  pageSize?: number;
  featuredOnly?: boolean;
  bestSellersOnly?: boolean;
  newOnly?: boolean;
  personalizableOnly?: boolean;
};

function buildWhere(query: CatalogQuery) {
  const where: Record<string, unknown> = { active: true };
  if (query.category) where.category = { slug: query.category };
  if (query.occasion) where.occasions = { some: { slug: query.occasion } };
  if (query.recipient) {
    const rec = RECIPIENTS.find((r) => r.slug === query.recipient);
    where.recipients = { contains: rec ? rec.slug : String(query.recipient) };
  }
  const bucket = PRICE_BUCKETS.find((b) => b.key === query.bucket);
  if (bucket) where.price = { gte: bucket.min, lte: bucket.max };
  if (query.featuredOnly) where.featured = true;
  if (query.bestSellersOnly) where.bestSeller = true;
  if (query.newOnly) where.isNew = true;
  if (query.personalizableOnly) where.personalizable = true;

  if (query.q) {
    const term = query.q.trim();
    where.OR = [
      { name: { contains: term } },
      { shortDesc: { contains: term } },
      { description: { contains: term } },
      { tags: { contains: term } },
      { recipients: { contains: term } },
      { category: { is: { name: { contains: term } } } },
      { occasions: { some: { name: { contains: term } } } }
    ];
  }
  return where;
}

function buildOrderBy(sort?: string) {
  switch (sort) {
    case "price-asc": return [{ price: "asc" as const }];
    case "price-desc": return [{ price: "desc" as const }];
    case "rating": return [{ reviews: { _count: "desc" as const } }];
    case "popular": return [{ soldCount: "desc" as const }, { bestSeller: "desc" as const }];
    default: return [{ createdAt: "desc" as const }];
  }
}

export async function listProducts(query: CatalogQuery) {
  const pageSize = query.pageSize ?? 12;
  const page = Math.max(1, query.page ?? 1);
  const where = buildWhere(query);
  const [items, total] = await Promise.all([
    db.product.findMany({
      where,
      orderBy: buildOrderBy(query.sort),
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        images: { orderBy: { sort: "asc" }, take: 1 },
        inventory: true,
        reviews: { where: { approved: true }, select: { rating: true } }
      }
    }),
    db.product.count({ where })
  ]);
  return {
    items: items.map(toCardData),
    total,
    page,
    pageSize,
    pageCount: Math.max(1, Math.ceil(total / pageSize))
  };
}

type ProductWithExtras = {
  slug: string; name: string; shortDesc: string; price: number; compareAtPrice: number | null;
  isNew: boolean; bestSeller: boolean; personalizable: boolean; createdAt: Date;
  images: { url: string; alt: string | null }[];
  inventory: { quantity: number; reserved: number } | null;
  reviews: { rating: number }[];
};

export function toCardData(p: ProductWithExtras): ProductCardData & { createdAt: Date } {
  const ratings = p.reviews.map((r) => r.rating);
  const avg = ratings.length ? ratings.reduce((a, b) => a + b, 0) / ratings.length : null;
  return {
    slug: p.slug,
    name: p.name,
    shortDesc: p.shortDesc,
    image: p.images[0]?.url ?? "/images/box.svg",
    price: p.price,
    compareAtPrice: p.compareAtPrice ?? null,
    isNew: p.isNew,
    isBestSeller: p.bestSeller,
    personalizable: p.personalizable,
    rating: avg !== null ? Math.round(avg * 10) / 10 : null,
    reviewCount: ratings.length,
    stock: p.inventory ? Math.max(0, p.inventory.quantity - p.inventory.reserved) : 0,
    createdAt: p.createdAt
  };
}

export async function getProductBySlug(slug: string) {
  return db.product.findUnique({
    where: { slug },
    include: {
      category: true,
      occasions: true,
      collections: true,
      images: { orderBy: { sort: "asc" } },
      variants: true,
      inventory: true,
      reviews: { where: { approved: true }, orderBy: { createdAt: "desc" }, include: { user: { select: { name: true } } } }
    }
  });
}

export async function getRelatedProducts(categoryId: string, excludeId: string, take = 4) {
  const items = await db.product.findMany({
    where: { active: true, categoryId, id: { not: excludeId } },
    take,
    orderBy: [{ bestSeller: "desc" }, { soldCount: "desc" }],
    include: { images: { orderBy: { sort: "asc" }, take: 1 }, inventory: true, reviews: { where: { approved: true }, select: { rating: true } } }
  });
  return items.map(toCardData);
}

export async function getFacets() {
  const [categories, occasions] = await Promise.all([
    db.category.findMany({ orderBy: { name: "asc" }, include: { _count: { select: { products: { where: { active: true } } } } } }),
    db.occasion.findMany({ orderBy: { name: "asc" } })
  ]);
  return { categories, occasions };
}

export async function searchProducts(term: string, limit = 6) {
  const rows = await db.product.findMany({
    where: {
      active: true,
      OR: [
        { name: { contains: term } },
        { shortDesc: { contains: term } },
        { tags: { contains: term } },
        { recipients: { contains: term } },
        { category: { is: { name: { contains: term } } } },
        { occasions: { some: { name: { contains: term } } } }
      ]
    },
    take: limit,
    orderBy: [{ bestSeller: "desc" }],
    include: { images: { orderBy: { sort: "asc" }, take: 1 }, inventory: true }
  });
  return rows.map((p) => ({
    slug: p.slug,
    name: p.name,
    image: p.images[0]?.url ?? "/images/box.svg",
    price: p.price
  }));
}
