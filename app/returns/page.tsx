import type { Metadata } from "next";
import { getSettings } from "@/lib/settings";
import { Breadcrumbs, Divider } from "@/components/ui";
import { ButtonLink } from "@/components/ui";

export const metadata: Metadata = {
  title: "Returns & Exchanges",
  description: "Talis returns and exchange policy — we make it right when a feeling falls short."
};

export default async function ReturnsPage() {
  const settings = await getSettings();

  return (
    <div className="container-talis max-w-3xl py-12 md:py-16">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Returns" }]} />
      <header className="mb-10 text-center">
        <p className="eyebrow mb-3">We stand behind every gift</p>
        <h1 className="h-serif text-3xl text-ink sm:text-4xl">RETURNS &amp; EXCHANGES</h1>
        <p className="mx-auto mt-3 max-w-lg font-script text-2xl text-gold">if the feeling isn&apos;t right, we&apos;ll fix it</p>
      </header>

      <div className="space-y-8 text-sm leading-relaxed text-espresso/75">
        <section className="border border-beige bg-white p-6">
          <h2 className="font-serif text-xl text-ink">48-hour promise</h2>
          <Divider />
          <p>
            If something arrives damaged, incorrect or simply not as described, tell us within <strong>48 hours</strong> of delivery with a photo — via WhatsApp or email — and we&apos;ll arrange a replacement or full refund. No lengthy forms.
          </p>
        </section>

        <section className="grid gap-6 sm:grid-cols-2">
          <div className="border border-beige bg-white p-6">
            <h3 className="font-serif text-lg text-ink">Can be returned</h3>
            <ul className="mt-3 space-y-2">
              {["Unused candles & home pieces", "Unworn jewelry in original packaging", "Gift boxes with seals intact", "Items damaged in transit"].map((t) => (
                <li key={t} className="flex items-start gap-2"><span aria-hidden className="mt-[7px] h-1.5 w-1.5 shrink-0 rotate-45 bg-gold" />{t}</li>
              ))}
            </ul>
          </div>
          <div className="border border-beige bg-white p-6">
            <h3 className="font-serif text-lg text-ink">Final sale</h3>
            <ul className="mt-3 space-y-2">
              {["Fresh flowers", "Food & confectionery (once delivered)", "Personalized or engraved items*", "Opened self-care products"].map((t) => (
                <li key={t} className="flex items-start gap-2"><span aria-hidden className="mt-[7px] h-1.5 w-1.5 shrink-0 rotate-45 bg-espresso/50" />{t}</li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-espresso/45">*Unless faulty or produced incorrectly by us.</p>
          </div>
        </section>

        <section>
          <h2 className="font-serif text-xl text-ink">How to start a return</h2>
          <ol className="mt-3 space-y-3">
            {[
              `Message us on WhatsApp (${settings.phone}) with your order number and photos.`,
              "We confirm within hours and share a courier pickup point or arrange collection.",
              "Once received and inspected, replacements ship same-day or refunds process to M-PESA within 24 hours."
            ].map((t, i) => (
              <li key={i} className="flex items-start gap-4">
                <span aria-hidden className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gold/15 font-serif text-sm font-semibold text-gold">{i + 1}</span>
                <span className="pt-1">{t}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="text-center">
          <ButtonLink href="/contact" variant="primary">Contact Support</ButtonLink>
        </section>
      </div>
    </div>
  );
}
