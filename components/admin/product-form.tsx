import Link from "next/link";
import { saveProduct } from "@/app/admin/actions";
import { Field, Input, Textarea, Select, Divider } from "@/components/ui";

export type ProductFormData = {
  id?: string;
  name: string;
  slug: string;
  shortDesc: string;
  description: string;
  price: number;
  compareAtPrice: number | null;
  categoryId: string;
  stock: number;
  tags: string;
  recipients: string;
  whatsIncluded: string;
  images: string;
  variants: string;
  personalizable: boolean;
  personalizationFields: string;
  featured: boolean;
  bestSeller: boolean;
  isNew: boolean;
  active: boolean;
  occasionIds: string[];
  collectionIds: string[];
};

export function ProductForm({
  product,
  categories,
  occasions,
  collections
}: {
  product?: ProductFormData;
  categories: { id: string; name: string }[];
  occasions: { id: string; name: string }[];
  collections: { id: string; name: string }[];
}) {
  return (
    <form action={saveProduct} className="space-y-6">
      {product?.id && <input type="hidden" name="id" value={product.id} />}

      <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <section className="border border-beige bg-white p-5 sm:p-6">
            <h2 className="font-serif text-xl text-ink">Basics</h2>
            <Divider />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Name" required className="sm:col-span-2">
                <Input name="name" required defaultValue={product?.name} maxLength={80} />
              </Field>
              <Field label="Slug" hint="Leave blank to auto-generate">
                <Input name="slug" defaultValue={product?.slug} placeholder="silk-rose-candle" />
              </Field>
              <Field label="Category" required>
                <Select name="categoryId" required defaultValue={product?.categoryId}>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </Select>
              </Field>
              <Field label="Short description" required hint="Shown on cards & quick view" className="sm:col-span-2">
                <Input name="shortDesc" required defaultValue={product?.shortDesc} maxLength={160} />
              </Field>
              <Field label="Full description" required className="sm:col-span-2">
                <Textarea name="description" required rows={5} defaultValue={product?.description} />
              </Field>
              <Field label="What's inside" hint="One item per line">
                <Textarea name="whatsIncluded" rows={4} defaultValue={product?.whatsIncluded} />
              </Field>
              <Field label="Tags" hint="Comma separated">
                <Input name="tags" defaultValue={product?.tags} placeholder="candle, self-care, cozy" />
              </Field>
              <Field label="Recipients" hint="Comma separated, lowercase" className="sm:col-span-2">
                <Input name="recipients" defaultValue={product?.recipients} placeholder="her, him, mom, friend" />
              </Field>
            </div>
          </section>

          <section className="border border-beige bg-white p-5 sm:p-6">
            <h2 className="font-serif text-xl text-ink">Media</h2>
            <Divider />
            <Field label="Image URLs" hint="One per line — first is the cover">
              <Textarea name="images" rows={4} defaultValue={product?.images} placeholder={"/images/candle.svg\n/images/box-open.svg"} />
            </Field>
            <Field label="Variants" hint='One per line as "Name: Option|Option"' className="mt-4">
              <Textarea name="variants" rows={3} defaultValue={product?.variants} placeholder={"Scent: Vanilla|Rose|Sandalwood"} />
            </Field>
          </section>

          <section className="border border-beige bg-white p-5 sm:p-6">
            <h2 className="font-serif text-xl text-ink">Personalization</h2>
            <Divider />
            <label className="flex items-center gap-3 text-sm">
              <input type="checkbox" name="personalizable" defaultChecked={product?.personalizable} className="h-4 w-4 accent-gold" />
              This gift can be personalized (engraving, message card…)
            </label>
            <Field label="Personalization fields (JSON)" className="mt-4"
              hint='e.g. [{"name":"message","label":"Message on card","type":"text","maxLength":200,"required":true}]'>
              <Textarea name="personalizationFields" rows={3} defaultValue={product?.personalizationFields ?? "[]"} className="font-mono text-xs" />
            </Field>
          </section>
        </div>

        <div className="space-y-6">
          <section className="border border-beige bg-white p-5 sm:p-6">
            <h2 className="font-serif text-xl text-ink">Pricing &amp; stock</h2>
            <Divider />
            <div className="grid grid-cols-2 gap-4">
              <Field label="Price (KSh)" required>
                <Input name="price" type="number" min={1} max={1000000} required defaultValue={product?.price} />
              </Field>
              <Field label="Compare-at" hint="0 = none">
                <Input name="compareAtPrice" type="number" min={0} max={1000000} defaultValue={product?.compareAtPrice ?? 0} />
              </Field>
              <Field label="Stock qty" className="col-span-2">
                <Input name="stock" type="number" min={0} max={9999} required defaultValue={product?.stock ?? 20} />
              </Field>
            </div>
          </section>

          <section className="border border-beige bg-white p-5 sm:p-6">
            <h2 className="font-serif text-xl text-ink">Visibility</h2>
            <Divider />
            <div className="space-y-2.5 text-sm">
              <label className="flex items-center gap-3"><input type="checkbox" name="active" defaultChecked={product?.active ?? true} className="h-4 w-4 accent-gold" /> Active (visible in store)</label>
              <label className="flex items-center gap-3"><input type="checkbox" name="featured" defaultChecked={product?.featured} className="h-4 w-4 accent-gold" /> Featured on homepage</label>
              <label className="flex items-center gap-3"><input type="checkbox" name="bestSeller" defaultChecked={product?.bestSeller} className="h-4 w-4 accent-gold" /> Best seller badge</label>
              <label className="flex items-center gap-3"><input type="checkbox" name="isNew" defaultChecked={product?.isNew} className="h-4 w-4 accent-gold" /> New arrival</label>
            </div>
          </section>

          <section className="border border-beige bg-white p-5 sm:p-6">
            <h2 className="font-serif text-xl text-ink">Occasions</h2>
            <Divider />
            <div className="grid max-h-44 grid-cols-2 gap-1.5 overflow-y-auto pr-1 text-sm">
              {occasions.map((o) => (
                <label key={o.id} className="flex items-center gap-2 capitalize">
                  <input type="checkbox" name="occasionIds" value={o.id} defaultChecked={product?.occasionIds.includes(o.id)} className="h-4 w-4 accent-gold" />
                  {o.name}
                </label>
              ))}
            </div>
          </section>

          <section className="border border-beige bg-white p-5 sm:p-6">
            <h2 className="font-serif text-xl text-ink">Collections</h2>
            <Divider />
            <div className="grid gap-1.5 text-sm">
              {collections.map((c) => (
                <label key={c.id} className="flex items-center gap-2">
                  <input type="checkbox" name="collectionIds" value={c.id} defaultChecked={product?.collectionIds.includes(c.id)} className="h-4 w-4 accent-gold" />
                  {c.name}
                </label>
              ))}
            </div>
          </section>

          <button className="btn-base w-full bg-ink py-3.5 font-semibold uppercase tracking-[0.16em] text-ivory hover:bg-gold hover:text-ink">
            {product ? "Save changes" : "Create product"}
          </button>
          <Link href="/admin/products" className="block text-center text-xs uppercase tracking-[0.14em] text-espresso/50 hover:text-gold">Cancel</Link>
        </div>
      </div>
    </form>
  );
}
