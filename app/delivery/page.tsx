import type { Metadata } from "next";
import Link from "next/link";
import { getSettings } from "@/lib/settings";
import { Breadcrumbs, Divider } from "@/components/ui";

export const metadata: Metadata = {
  title: "Delivery Information",
  description: "Free same-day delivery in Nairobi and free 2–3 day countrywide delivery. Verified M-PESA payments."
};

export default async function DeliveryPage() {
  const settings = await getSettings();

  return (
    <div className="container-talis max-w-3xl py-12 md:py-16">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Delivery" }]} />
      <header className="mb-12 text-center">
        <p className="eyebrow mb-3">From our hands to theirs</p>
        <h1 className="h-serif text-3xl text-ink sm:text-4xl">DELIVERY</h1>
        <p className="mt-3 text-sm leading-relaxed text-espresso/65">
          Every Talis parcel travels wrapped, ribboned and ready to be given.
        </p>
      </header>

      <section aria-label="Delivery promise" className="border border-gold/50 bg-champagne/10 p-6 text-center">
        <p className="eyebrow">Our promise</p>
        <p className="mt-2 font-serif text-2xl text-ink sm:text-3xl">Free delivery, countrywide</p>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-espresso/70">
          No zones, no fees, no surprises. Every order ships free anywhere in Kenya.
        </p>
      </section>

      <section className="mt-10 grid gap-6 sm:grid-cols-2">
        <div className="border border-beige bg-white p-6">
          <h2 className="font-serif text-lg text-ink">Same-day (Nairobi)</h2>
          <Divider />
          <p className="text-sm leading-relaxed text-espresso/70">
            Orders confirmed before <strong>12:00pm</strong> can arrive the same day in most Nairobi areas. After noon, expect next-day delivery.
          </p>
        </div>
        <div className="border border-beige bg-white p-6">
          <h2 className="font-serif text-lg text-ink">Up-country</h2>
          <Divider />
          <p className="text-sm leading-relaxed text-espresso/70">
            Countrywide delivery via trusted courier partners in <strong>2–3 working days</strong>. You&apos;ll receive tracking updates at every step.
          </p>
        </div>
      </section>

      <section className="mt-10 space-y-3 text-sm leading-relaxed text-espresso/75">
        <h2 className="font-serif text-xl text-ink">Good to know</h2>
        <ul className="space-y-2">
          {[
            "All orders are dispatched only after payment is verified — we never dispatch on unconfirmed promises.",
            "Fresh flowers are sourced each morning; for same-day bouquets, order before 11am.",
            "You'll receive an SMS/WhatsApp update when your gift is out for delivery.",
            "Our courier will call the recipient before arriving — include their number at checkout if different.",
            `Questions? WhatsApp us on ${settings.phone}.`
          ].map((t) => (
            <li key={t} className="flex items-start gap-2.5">
              <span aria-hidden className="mt-[7px] h-1.5 w-1.5 shrink-0 rotate-45 bg-gold" />
              {t}
            </li>
          ))}
        </ul>
        <Link href="/returns" className="inline-block pt-2 font-semibold uppercase tracking-[0.14em] text-gold underline underline-offset-4">
          Read our returns policy
        </Link>
      </section>
    </div>
  );
}
