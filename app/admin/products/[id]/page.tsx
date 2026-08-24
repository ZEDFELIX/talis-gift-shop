import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { ProductForm } from "@/components/admin/product-form";

export const dynamic = "force-dynamic";

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const product = await db.product.findUnique({
    where: { id: params.id },
    include: {
      images: { orderBy: { sort: "asc" } },
      variants: true,
      inventory: true,
      occasions: { select: { id: true } },
      collections: { select: { id: true } }
    }
  });
  if (!product) notFound();

  const [categories, occasions, collections] = await Promise.all([
    db.category.findMany({ orderBy: { name: "asc" } }),
    db.occasion.findMany({ orderBy: { name: "asc" } }),
    db.collection.findMany({ orderBy: { name: "asc" } })
  ]);

  return (
    <div className="space-y-5">
      <header>
        <p className="eyebrow">Catalog</p>
        <h1 className="mt-1 font-serif text-3xl text-ink">{product.name}</h1>
        <a href={`/products/${product.slug}`} target="_blank" rel="noopener noreferrer" className="text-xs uppercase tracking-[0.14em] text-gold hover:underline">
          View in store →
        </a>
      </header>
      <ProductForm
        product={{
          id: product.id,
          name: product.name,
          slug: product.slug,
          shortDesc: product.shortDesc,
          description: product.description,
          price: product.price,
          compareAtPrice: product.compareAtPrice,
          categoryId: product.categoryId,
          stock: product.inventory?.quantity ?? 0,
          tags: product.tags,
          recipients: product.recipients,
          whatsIncluded: product.whatsIncluded ?? "",
          images: product.images.map((i) => i.url).join("\n"),
          variants: product.variants.map((v) => `${v.name}: ${v.options}`).join("\n"),
          personalizable: product.personalizable,
          personalizationFields: product.personalizationFields ?? "[]",
          featured: product.featured,
          bestSeller: product.bestSeller,
          isNew: product.isNew,
          active: product.active,
          occasionIds: product.occasions.map((o) => o.id),
          collectionIds: product.collections.map((c) => c.id)
        }}
        categories={categories}
        occasions={occasions.map((o) => ({ id: o.id, name: o.name }))}
        collections={collections.map((c) => ({ id: c.id, name: c.name }))}
      />
    </div>
  );
}
