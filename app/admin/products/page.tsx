import Link from "next/link";
import { db } from "@/lib/db";
import { formatKSh } from "@/lib/utils";
import { deleteProduct } from "@/app/admin/actions";
import { ConfirmSubmit } from "@/components/admin/controls";
import { ButtonLink, Input, Select } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage({
  searchParams
}: {
  searchParams: { q?: string; category?: string; saved?: string; deleted?: string; error?: string };
}) {
  const where = {
    ...(searchParams.q ? { name: { contains: searchParams.q } } : {}),
    ...(searchParams.category ? { categoryId: searchParams.category } : {})
  };
  const [products, categories] = await Promise.all([
    db.product.findMany({ where, orderBy: { createdAt: "desc" }, include: { category: true, inventory: true, images: true } }),
    db.category.findMany({ orderBy: { name: "asc" } })
  ]);

  return (
    <div className="space-y-5">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="eyebrow">Catalog</p>
          <h1 className="mt-1 font-serif text-3xl text-ink">Products <span className="text-lg text-espresso/45">({products.length})</span></h1>
        </div>
        <ButtonLink href="/admin/products/new" variant="primary">+ New product</ButtonLink>
      </header>

      {(searchParams.saved || searchParams.deleted || searchParams.error) && (
        <p className={`border px-4 py-2.5 text-sm ${searchParams.error ? "border-red-200 bg-red-50 text-red-800" : "border-green-200 bg-green-50 text-green-800"}`}>
          {searchParams.error ?? (searchParams.deleted ? "Product deleted." : "Product saved.")}
        </p>
      )}

      <form className="flex flex-wrap gap-2" action="/admin/products">
        <Input name="q" defaultValue={searchParams.q ?? ""} placeholder="Search products…" className="max-w-xs flex-1" aria-label="Search products" />
        <Select name="category" defaultValue={searchParams.category ?? ""} className="w-48" aria-label="Filter by category">
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </Select>
        <button className="btn-base bg-ink px-5 py-2 text-sm font-semibold uppercase tracking-[0.12em] text-ivory hover:bg-gold hover:text-ink">Filter</button>
      </form>

      <section className="border border-beige bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-sm">
            <thead>
              <tr className="border-b border-beige text-left text-[11px] uppercase tracking-[0.14em] text-espresso/45">
                <th className="px-4 py-3 font-semibold">Product</th>
                <th className="px-4 py-3 font-semibold">Category</th>
                <th className="px-4 py-3 font-semibold">Price</th>
                <th className="px-4 py-3 font-semibold">Stock</th>
                <th className="px-4 py-3 font-semibold">Flags</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-beige/60">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-champagne/10">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p.images[0]?.url ?? "/images/box.svg"} alt="" width={40} height={50} loading="lazy" className="h-[50px] w-10 border border-beige object-cover" />
                      <div className="min-w-0">
                        <Link href={`/admin/products/${p.id}`} className="font-medium hover:text-gold">{p.name}</Link>
                        <p className="truncate text-xs text-espresso/45">{p.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-espresso/65">{p.category?.name}</td>
                  <td className="px-4 py-3">
                    <span className="font-semibold">{formatKSh(p.price)}</span>
                    {p.compareAtPrice && <span className="ml-1 text-xs text-espresso/40 line-through">{formatKSh(p.compareAtPrice)}</span>}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                      !p.inventory || p.inventory.quantity === 0
                        ? "bg-red-100 text-red-800"
                        : p.inventory.quantity <= 5
                          ? "bg-champagne text-espresso"
                          : "bg-green-100 text-green-800"
                    }`}>
                      {p.inventory?.quantity ?? 0}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1 text-[9px] font-bold uppercase tracking-wide">
                      {p.featured && <span className="bg-gold/20 px-1.5 py-0.5 text-gold">Feat</span>}
                      {p.bestSeller && <span className="bg-espresso/10 px-1.5 py-0.5">Best</span>}
                      {p.isNew && <span className="bg-champagne px-1.5 py-0.5">New</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1.5 text-xs ${p.active ? "text-green-800" : "text-espresso/40"}`}>
                      <span aria-hidden className={`h-2 w-2 rounded-full ${p.active ? "bg-green-600" : "bg-espresso/30"}`} />
                      {p.active ? "Live" : "Hidden"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex items-center gap-2">
                      <Link href={`/admin/products/${p.id}`} className="btn-base border border-espresso/25 px-3 py-1.5 text-xs hover:border-gold hover:text-gold">Edit</Link>
                      <form action={deleteProduct}>
                        <input type="hidden" name="id" value={p.id} />
                        <ConfirmSubmit message={`Delete "${p.name}" permanently?`} className="btn-base border border-red-200 px-3 py-1.5 text-xs text-red-700 hover:bg-red-50">
                          Delete
                        </ConfirmSubmit>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-10 text-center text-espresso/50">No products match.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
