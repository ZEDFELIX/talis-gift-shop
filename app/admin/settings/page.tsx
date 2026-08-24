import { db } from "@/lib/db";
import { getSettings } from "@/lib/settings";
import { saveSettings, updateDeliveryZoneFee } from "@/app/admin/actions";
import { Field, Input, Textarea } from "@/components/ui";

export const dynamic = "force-dynamic";

const TEXT_FIELDS = [
  ["announcement", "Announcement bar"],
  ["heroTitle", "Homepage hero title"],
  ["heroSub", "Hero script accent"],
  ["heroDesc", "Hero description"],
  ["whatsapp", "WhatsApp number"],
  ["phone", "Phone"],
  ["email", "Email"],
  ["address", "Address"],
  ["hours", "Business hours"],
  ["instagramHandle", "Instagram handle"]
] as const;

export default async function AdminSettingsPage({
  searchParams
}: {
  searchParams: { saved?: string };
}) {
  const [settings, zones] = await Promise.all([getSettings(), db.deliveryZone.findMany({ orderBy: { fee: "asc" } })]);
  const values: Record<string, string> = {
    announcement: settings.announcement,
    heroTitle: settings.heroTitle,
    heroSub: settings.heroSub,
    heroDesc: settings.heroDesc,
    whatsapp: settings.whatsapp,
    phone: settings.phone,
    email: settings.email,
    address: settings.address,
    hours: settings.hours,
    instagramHandle: settings.instagramHandle
  };

  return (
    <div className="max-w-4xl space-y-6">
      <header>
        <p className="eyebrow">Configuration</p>
        <h1 className="mt-1 font-serif text-3xl text-ink">Store settings</h1>
      </header>

      {searchParams.saved && (
        <p className="border border-green-200 bg-green-50 px-4 py-2.5 text-sm text-green-800">Settings saved.</p>
      )}

      <form action={saveSettings} className="space-y-6">
        <section className="border border-beige bg-white p-5 sm:p-6">
          <h2 className="font-serif text-xl text-ink">Storefront copy</h2>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            {TEXT_FIELDS.map(([key, label]) => (
              <Field key={key} label={label}>
                <Input name={key} defaultValue={values[key]} />
              </Field>
            ))}
            <Field label="Free delivery threshold (KSh)" className="sm:col-span-2">
              <Input name="freeDeliveryThreshold" type="number" min={0} defaultValue={settings.freeDeliveryThreshold} />
            </Field>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field label="M-PESA paybill / till" hint="Shown when payments are not yet configured">
              <Input name="mpesaPaybill" defaultValue={settings.mpesaPaybill} placeholder="e.g. 247247" />
            </Field>
            <Field label="Instagram images (JSON array of URLs)" hint="Leave empty to use placeholders">
              <Input name="instagramImages" defaultValue={settings.instagramImages ? JSON.stringify(settings.instagramImages) : ""} />
            </Field>
          </div>
          <Field label="Gift box fees (JSON)" className="mt-4"
            hint='{"baseFee":250,"premiumFee":600,"cardFee":100,"wrapFee":150}'>
            <Textarea name="giftBoxFees" rows={3} className="font-mono text-xs" defaultValue={JSON.stringify(settings.giftBoxFees)} />
          </Field>
        </section>

        <button className="btn-base w-full bg-ink py-3.5 font-semibold uppercase tracking-[0.16em] text-ivory hover:bg-gold hover:text-ink sm:w-auto sm:px-10">
          Save settings
        </button>
      </form>

      <section className="border border-beige bg-white p-5 sm:p-6">
        <h2 className="font-serif text-xl text-ink">Delivery zones</h2>
        <p className="mt-1 text-xs text-espresso/50">Fees apply at checkout per zone.</p>
        <ul className="mt-3 divide-y divide-beige/70">
          {zones.map((z) => (
            <li key={z.id}>
              <form action={updateDeliveryZoneFee} className="flex flex-wrap items-end gap-3 py-3.5">
                <input type="hidden" name="id" value={z.id} />
                <div className="min-w-[140px] flex-1">
                  <p className="text-sm font-semibold">{z.name}</p>
                  {z.etaNote && <p className="text-xs text-espresso/45">{z.etaNote}</p>}
                </div>
                <label className="text-xs text-espresso/55">
                  Fee
                  <Input name="fee" type="number" min={0} defaultValue={z.fee} className="w-28 py-1.5" aria-label={`Fee for ${z.name}`} />
                </label>
                <label className="min-w-[180px] flex-1 text-xs text-espresso/55">
                  ETA note
                  <Input name="etaNote" defaultValue={z.etaNote ?? ""} className="py-1.5" aria-label={`ETA for ${z.name}`} />
                </label>
                <button className="btn-base bg-ink px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-ivory hover:bg-gold hover:text-ink">Save</button>
              </form>
            </li>
          ))}
        </ul>
      </section>

      <section className="border border-beige bg-white p-5 text-sm leading-relaxed text-espresso/65">
        <h2 className="font-serif text-xl text-ink">Payments</h2>
        <p className="mt-2">
          M-PESA live credentials are set via environment variables (<code className="font-mono text-xs">MPESA_CONSUMER_KEY</code>,{" "}
          <code className="font-mono text-xs">MPESA_CONSUMER_SECRET</code>, <code className="font-mono text-xs">MPESA_SHORTCODE</code>,{" "}
          <code className="font-mono text-xs">MPESA_WEBHOOK_SECRET</code>) — never in this panel. While they are empty, checkout shows the paybill number above with manual confirmation in Orders.
        </p>
      </section>
    </div>
  );
}
