import { db } from "@/lib/db";
import { saveCollection, deleteCollection } from "@/app/admin/actions";
import { ConfirmSubmit } from "@/components/admin/controls";
import { Input } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function AdminCollectionsPage() {
  const collections = await db.collection.findMany({ orderBy: { name: "asc" }, include: { _count: { select: { products: true } } } });

  return (
    <div className="max-w-3xl space-y-5">
      <header>
        <p className="eyebrow">Catalog structure</p>
        <h1 className="mt-1 font-serif text-3xl text-ink">Collections</h1>
      </header>

      <form action={saveCollection} className="flex flex-wrap gap-2 border border-beige bg-white p-4 sm:flex-nowrap">
        <Input name="name" required minLength={2} maxLength={50} placeholder="Collection name" aria-label="Collection name" className="flex-1" />
        <Input name="tagline" maxLength={80} placeholder="Tagline (optional)" aria-label="Tagline" className="flex-1" />
        <button className="btn-base shrink-0 bg-ink px-5 py-2.5 text-sm font-semibold uppercase tracking-[0.12em] text-ivory hover:bg-gold hover:text-ink">Add</button>
      </form>

      <ul className="divide-y divide-beige border border-beige bg-white">
        {collections.map((c) => (
          <li key={c.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
            <div>
              <a href={`/collections/${c.slug}`} target="_blank" rel="noopener noreferrer" className="font-medium hover:text-gold">{c.name}</a>
              <p className="text-xs text-espresso/45">/{c.slug} · {c._count.products} product{c._count.products === 1 ? "" : "s"}{c.tagline ? ` · ${c.tagline}` : ""}</p>
            </div>
            <form action={deleteCollection}>
              <input type="hidden" name="id" value={c.id} />
              <ConfirmSubmit message={`Delete collection "${c.name}"?`} className="btn-base border border-espresso/20 px-3 py-1.5 text-xs text-red-700 hover:border-red-300">
                Delete
              </ConfirmSubmit>
            </form>
          </li>
        ))}
        {collections.length === 0 && (
          <li className="px-4 py-8 text-center text-sm text-espresso/50">No collections yet.</li>
        )}
      </ul>
    </div>
  );
}
