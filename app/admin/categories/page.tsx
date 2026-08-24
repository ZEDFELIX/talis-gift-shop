import Link from "next/link";
import { db } from "@/lib/db";
import { saveCategory, deleteCategory } from "@/app/admin/actions";
import { ConfirmSubmit } from "@/components/admin/controls";
import { Input } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage({
  searchParams
}: {
  searchParams: { error?: string };
}) {
  const categories = await db.category.findMany({ orderBy: { name: "asc" }, include: { _count: { select: { products: true } } } });

  return (
    <div className="max-w-3xl space-y-5">
      <header>
        <p className="eyebrow">Catalog structure</p>
        <h1 className="mt-1 font-serif text-3xl text-ink">Categories</h1>
      </header>

      {searchParams.error && (
        <p className="border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-800">{searchParams.error}</p>
      )}

      <form action={saveCategory} className="flex gap-2 border border-beige bg-white p-4">
        <Input name="name" required minLength={2} maxLength={40} placeholder="New category name…" aria-label="Category name" />
        <button className="btn-base shrink-0 bg-ink px-5 py-2.5 text-sm font-semibold uppercase tracking-[0.12em] text-ivory hover:bg-gold hover:text-ink">Add</button>
      </form>

      <ul className="divide-y divide-beige border border-beige bg-white">
        {categories.map((c) => (
          <li key={c.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
            <div>
              <Link href={`/shop?category=${c.slug}`} target="_blank" className="font-medium hover:text-gold">{c.name}</Link>
              <p className="text-xs text-espresso/45">/{c.slug} · {c._count.products} product{c._count.products === 1 ? "" : "s"}</p>
            </div>
            <form action={deleteCategory}>
              <input type="hidden" name="id" value={c.id} />
              <ConfirmSubmit
                message={`Delete category "${c.name}"?`}
                className="btn-base border border-espresso/20 px-3 py-1.5 text-xs text-red-700 hover:border-red-300"
              >
                Delete
              </ConfirmSubmit>
            </form>
          </li>
        ))}
        {categories.length === 0 && (
          <li className="px-4 py-8 text-center text-sm text-espresso/50">No categories yet.</li>
        )}
      </ul>
      <p className="text-xs text-espresso/45">Categories with products cannot be deleted — move their products first.</p>
    </div>
  );
}
