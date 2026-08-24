"use client";

import Link from "next/link";
import { useRef, useState } from "react";
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

async function fileToDataUrl(file: File): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const max = 1200;
  const scale = Math.min(1, max / Math.max(bitmap.width, bitmap.height));
  const w = Math.round(bitmap.width * scale);
  const h = Math.round(bitmap.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas unavailable");
  ctx.drawImage(bitmap, 0, 0, w, h);
  return canvas.toDataURL("image/jpeg", 0.82);
}

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
  const fileRef = useRef<HTMLInputElement>(null);
  const [imagesText, setImagesText] = useState(product?.images ?? "");
  const previews = imagesText.split("\n").map((s) => s.trim()).filter(Boolean);
  const [uploading, setUploading] = useState(false);

  const onPickFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const added: string[] = [];
      for (const file of Array.from(files)) {
        if (!file.type.startsWith("image/")) continue;
        added.push(await fileToDataUrl(file));
      }
      if (added.length > 0) {
        setImagesText((prev) => (prev.trimEnd() ? `${prev.trimEnd()}\n${added.join("\n")}` : added.join("\n")));
      }
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

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
            <h2 className="font-serif text-xl text-ink">Photos</h2>
            <Divider />
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="btn-base border border-gold bg-champagne/20 px-4 py-2 text-sm font-semibold text-ink hover:bg-gold/30 disabled:opacity-50"
              >
                {uploading ? "Processing…" : "+ Upload photos from device"}
              </button>
              <span className="text-xs text-espresso/50">JPG/PNG · first photo becomes the cover · auto-resized for the web</span>
              <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={(e) => void onPickFiles(e.target.files)} />
            </div>
            {previews.length > 0 && (
              <ul className="mt-4 flex flex-wrap gap-3">
                {previews.map((src, i) => (
                  <li key={`${i}-${src.slice(-12)}`} className="relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt="" className="h-20 w-20 border border-beige object-cover" />
                    {i === 0 && (
                      <span className="absolute left-0 top-0 bg-gold px-1 text-[10px] font-bold uppercase text-ink">Cover</span>
                    )}
                  </li>
                ))}
              </ul>
            )}
            <Field label="Image list" hint="Uploaded photos appear here automatically — one per line. You can also paste URLs." className="mt-4">
              <Textarea name="images" rows={4} value={imagesText} onChange={(e) => setImagesText(e.target.value)}
                placeholder={"Upload above, or paste a link like https://…"} className="font-mono text-[11px]" />
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
