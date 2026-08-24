import type { Metadata } from "next";
import { CatalogPage } from "@/components/shop/catalog";
import { ButtonLink } from "@/components/ui";
import { GiftIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Curated Gift Boxes",
  description: "Premium curated gift boxes from Talis — signature boxes for every occasion, packed by hand in Nairobi."
};

export default function GiftBoxesPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-ink py-16 text-center text-ivory">
        <div className="talis-pattern absolute inset-0 opacity-50" aria-hidden />
        <div className="relative container-talis">
          <GiftIcon width={36} height={36} className="mx-auto text-gold" />
          <p className="eyebrow mt-3">Talis Signature</p>
          <h1 className="mt-2 font-serif text-4xl sm:text-5xl">GIFT BOXES</h1>
          <p className="mx-auto mt-3 max-w-lg font-script text-2xl text-champagne">beautifully chosen. thoughtfully given.</p>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-ivory/65">
            Hand-packed in Nairobi with premium treasures, wrapped in ivory tissue and tied with a satin bow.
            Or compose your own — every box is one of a kind.
          </p>
          <ButtonLink href="/build-your-gift" variant="gold" size="lg" className="mt-6">Build Your Own</ButtonLink>
        </div>
      </section>
      <CatalogPage
        searchParams={{}}
        preset={{
          basePath: "/gift-boxes",
          overrides: { category: "gift-boxes" },
          title: "CURATED BOXES",
          sub: "Our most-loved ready-made boxes."
        }}
      />
    </>
  );
}
