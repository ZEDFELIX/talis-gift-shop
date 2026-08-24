import { db } from "@/lib/db";
import { ProductForm } from "@/components/admin/product-form";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const [categories, occasions, collections] = await Promise.all([
    db.category.findMany({ orderBy: { name: "asc" } }),
    db.occasion.findMany({ orderBy: { name: "asc" } }),
    db.collection.findMany({ orderBy: { name: "asc" } })
  ]);

  return (
    <div className="space-y-5">
      <header>
        <p className="eyebrow">Catalog</p>
        <h1 className="mt-1 font-serif text-3xl text-ink">New product</h1>
      </header>
      <ProductForm
        categories={categories}
        occasions={occasions.map((o) => ({ id: o.id, name: o.name }))}
        collections={collections.map((c) => ({ id: c.id, name: c.name }))}
      />
    </div>
  );
}
