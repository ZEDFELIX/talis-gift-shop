import type { Metadata } from "next";
import { ButtonLink, Divider, SectionHeading } from "@/components/ui";

export const metadata: Metadata = {
  title: "Our Story",
  description: "Talis was created around a simple belief: the most meaningful gifts are the ones that carry a feeling."
};

const values = [
  { title: "Curated with intention", body: "Every product earns its place. We choose fewer, better things — pieces that feel as meaningful as they look." },
  { title: "Personal, always", body: "Names engraved, messages handwritten, ribbons chosen by you. No two Talis moments are alike." },
  { title: "Beautifully packaged", body: "Ivory tissue, gold wax seals, satin bows. Your gift arrives ready — no wrapping paper required." },
  { title: "Delivered with care", body: "Same-day in Nairobi, countrywide within days. Every parcel tracked, every delivery confirmed." }
];

export default function AboutPage() {
  return (
    <div>
      <section className="relative overflow-hidden bg-ink py-20 text-center text-ivory md:py-28">
        <div className="talis-pattern absolute inset-0 opacity-50" aria-hidden />
        <div className="relative container-talis animate-fadeUp">
          <p className="eyebrow">The Talis Story</p>
          <h1 className="mx-auto mt-4 max-w-3xl font-serif text-4xl leading-tight sm:text-5xl md:text-6xl">
            MORE THAN A GIFT<span className="text-gold">.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl font-script text-3xl text-champagne">a feeling worth giving</p>
        </div>
      </section>

      <section className="container-talis grid gap-12 py-16 md:grid-cols-[1fr_360px] md:py-24 lg:gap-20">
        <article className="max-w-2xl space-y-5 leading-relaxed text-espresso/80">
          <p className="font-serif text-xl italic leading-relaxed text-ink">
            &ldquo;Talis was created around a simple belief: the most meaningful gifts are the ones that carry a feeling.&rdquo;
          </p>
          <Divider />
          <p>
            It started in Nairobi with a question we kept hearing: <em>&ldquo;What do I give someone who has everything?&rdquo;</em> The answer was never another object. It was the moment the box is opened. The pause before they read your card. The way a room smells when a good candle is lit.
          </p>
          <p>
            That is why Talis exists — to design the <strong>feeling</strong>, and build the gift around it. We curate premium treasures from Kenya and beyond, compose them into boxes that feel like poetry, and deliver them across the country with genuine care.
          </p>
          <p>
            Our signature black keepsake boxes are packed by hand. Our cards are written by hand. And every personalization request — a name, a date, a message only you would write — is confirmed by real people before it ships.
          </p>
          <p>
            Whether you&apos;re celebrating love, saying thank you, or simply thinking of someone, we believe the gift should say what words can&apos;t quite manage.
          </p>
          <p className="pt-4 font-script text-3xl text-gold">Beyond the Feeling</p>
        </article>

        <aside className="space-y-4 self-start border border-beige bg-white p-7 md:sticky md:top-24">
          <h2 className="eyebrow">By the numbers</h2>
          <ul className="mt-3 space-y-4">
            {[["Hand-packed", "Every box, in Nairobi"], ["Same-day", "Nairobi orders before 12pm"], ["100%", "Payments verified via M-PESA"], ["Countrywide", "Delivery across Kenya"]].map(([big, small]) => (
              <li key={big} className="border-b border-beige/60 pb-3 last:border-none last:pb-0">
                <p className="font-serif text-2xl font-semibold text-ink">{big}</p>
                <p className="text-xs text-espresso/55">{small}</p>
              </li>
            ))}
          </ul>
        </aside>
      </section>

      <section className="bg-white py-16 md:py-20">
        <div className="container-talis">
          <SectionHeading eyebrow="What we stand for" title="Our Values" />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => (
              <div key={v.title} className="border border-beige bg-ivory p-7">
                <span aria-hidden className="font-serif text-3xl text-gold/40">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-3 font-serif text-lg leading-snug text-ink">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-espresso/65">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-talis py-16 text-center md:py-20">
        <p className="font-serif text-3xl tracking-[0.14em] text-ink">TALIS</p>
        <p className="mt-1 font-script text-2xl text-gold">Beyond the Feeling</p>
        <ButtonLink href="/shop" variant="primary" size="lg" className="mt-8">Shop Gifts</ButtonLink>
      </section>
    </div>
  );
}
