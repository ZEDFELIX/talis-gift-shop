import type { Metadata } from "next";
import { getSettings } from "@/lib/settings";
import { Breadcrumbs } from "@/components/ui";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description: "Ordering, delivery, personalization, payments and more — answers about gifting with Talis."
};

export default async function FaqPage() {
  const settings = await getSettings();

  return (
    <div className="container-talis max-w-3xl py-12 md:py-16">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "FAQ" }]} />
      <header className="mb-12 text-center">
        <p className="eyebrow mb-3">Good questions, honest answers</p>
        <h1 className="h-serif text-3xl text-ink sm:text-4xl">HOW CAN WE HELP?</h1>
      </header>

      <div className="space-y-3">
        {settings.faqs.map((faq, i) => (
          <details key={i} className="group border border-beige bg-white open:border-gold/50" open={i === 0}>
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 font-serif text-lg text-ink [&::-webkit-details-marker]:hidden">
              {faq.q}
              <span aria-hidden className="shrink-0 text-gold transition-transform duration-300 group-open:rotate-45">+</span>
            </summary>
            <p className="border-t border-beige/70 px-5 py-4 text-sm leading-relaxed text-espresso/75">{faq.a}</p>
          </details>
        ))}
      </div>

      <div className="mt-14 border border-gold/40 bg-champagne/10 p-8 text-center">
        <p className="font-script text-3xl text-gold">Still curious?</p>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-espresso/70">
          Our team replies fast on WhatsApp — usually within minutes during business hours.
        </p>
        <a
          href={`https://wa.me/${settings.whatsapp}?text=${encodeURIComponent("Hi Talis! I have a question.")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-base mt-5 bg-ink px-7 py-3 text-ivory hover:bg-gold hover:text-ink"
        >
          Chat With Us
        </a>
      </div>
    </div>
  );
}
