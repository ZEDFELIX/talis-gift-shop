import { db } from "@/lib/db";
import { formatDate, formatKSh } from "@/lib/utils";
import { createDiscount, toggleDiscount, deleteDiscount } from "@/app/admin/actions";
import { ConfirmSubmit } from "@/components/admin/controls";
import { Field, Input, Select } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function AdminDiscountsPage({
  searchParams
}: {
  searchParams: { saved?: string; error?: string };
}) {
  const discounts = await db.discount.findMany({ orderBy: { code: "asc" } });

  return (
    <div className="max-w-4xl space-y-5">
      <header>
        <p className="eyebrow">Promotions</p>
        <h1 className="mt-1 font-serif text-3xl text-ink">Discount codes</h1>
      </header>

      {(searchParams.saved || searchParams.error) && (
        <p className={`border px-4 py-2.5 text-sm ${searchParams.error ? "border-red-200 bg-red-50 text-red-800" : "border-green-200 bg-green-50 text-green-800"}`}>
          {searchParams.error ?? "Code created."}
        </p>
      )}

      <section className="border border-beige bg-white p-5">
        <h2 className="font-serif text-xl text-ink">New code</h2>
        <form action={createDiscount} className="mt-3 grid gap-3 sm:grid-cols-3 lg:grid-cols-6 lg:items-end">
          <Field label="Code"><Input name="code" required placeholder="SUMMER20" /></Field>
          <Field label="Type">
            <Select name="type" defaultValue="PERCENT">
              <option value="PERCENT">% off</option>
              <option value="FIXED">KSh off</option>
            </Select>
          </Field>
          <Field label="Value"><Input name="value" type="number" min={1} required defaultValue={10} /></Field>
          <Field label="Min spend (KSh)"><Input name="minSubtotal" type="number" min={0} defaultValue={0} /></Field>
          <Field label="Usage limit" hint="0 = ∞"><Input name="usageLimit" type="number" min={0} defaultValue={0} /></Field>
          <Field label="Expires"><Input name="expiresAt" type="date" /></Field>
          <div className="sm:col-span-3 lg:col-span-6">
            <button className="btn-base bg-ink px-6 py-2.5 text-sm font-semibold uppercase tracking-[0.12em] text-ivory hover:bg-gold hover:text-ink">Create code</button>
          </div>
        </form>
      </section>

      <section className="border border-beige bg-white">
        <table className="w-full min-w-[760px] text-sm">
          <thead>
            <tr className="border-b border-beige text-left text-[11px] uppercase tracking-[0.14em] text-espresso/45">
              <th className="px-4 py-3 font-semibold">Code</th>
              <th className="px-4 py-3 font-semibold">Reward</th>
              <th className="px-4 py-3 font-semibold">Min spend</th>
              <th className="px-4 py-3 font-semibold">Used</th>
              <th className="px-4 py-3 font-semibold">Limit</th>
              <th className="px-4 py-3 font-semibold">Expires</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-beige/60">
            {discounts.map((d) => (
              <tr key={d.id} className="hover:bg-champagne/10">
                <td className="px-4 py-3 font-mono font-semibold">{d.code}</td>
                <td className="px-4 py-3">{d.type === "PERCENT" ? `${d.value}%` : formatKSh(d.value)}</td>
                <td className="px-4 py-3 text-espresso/65">{formatKSh(d.minSubtotal)}</td>
                <td className="px-4 py-3">{d.usedCount}</td>
                <td className="px-4 py-3 text-espresso/65">{d.usageLimit ?? "∞"}</td>
                <td className="px-4 py-3 text-xs text-espresso/55">{d.expiresAt ? formatDate(d.expiresAt) : "Never"}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center gap-1.5 ${d.active ? "text-green-800" : "text-espresso/40"}`}>
                    <span aria-hidden className={`h-2 w-2 rounded-full ${d.active ? "bg-green-600" : "bg-espresso/30"}`} />
                    {d.active ? "Active" : "Off"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <form action={toggleDiscount}>
                      <input type="hidden" name="id" value={d.id} />
                      <button className="btn-base border border-espresso/25 px-3 py-1.5 text-xs hover:border-gold hover:text-gold">
                        {d.active ? "Disable" : "Enable"}
                      </button>
                    </form>
                    <form action={deleteDiscount}>
                      <input type="hidden" name="id" value={d.id} />
                      <ConfirmSubmit message={`Delete code ${d.code}?`} className="btn-base border border-espresso/25 px-3 py-1.5 text-xs text-red-700 hover:border-red-300">
                        Delete
                      </ConfirmSubmit>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {discounts.length === 0 && (
              <tr><td colSpan={8} className="px-4 py-10 text-center text-espresso/50">No discount codes yet.</td></tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}
