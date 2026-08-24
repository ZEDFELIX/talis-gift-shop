import Link from "next/link";
import type { ProductCardData } from "@/types";
import { FEELINGS } from "@/types";
import { ButtonLink, Divider, SectionHeading } from "@/components/ui";
import { ProductGrid } from "@/components/shop/catalog-ui";
import { NewsletterForm } from "@/components/home/newsletter-form";
import { ArrowRightIcon, GiftIcon, InstagramIcon, SparkleIcon } from "@/components/icons";
import type { SiteSettings } from "@/lib/settings";

export function Hero({ settings }: { settings: SiteSettings }) {
  return (
    <section className="relative overflow-hidden bg-ink text-ivory">
      <div className="talis-pattern absolute inset-0 opacity-60" aria-hidden />
      <div className="container-talis relative grid items-center gap-10 py-16 md:grid-cols-2 md:py-24 lg:py-28">
        <div className="animate-fadeUp text-center md:text-left">
          <p className="eyebrow mb-4">Nairobi · Kenya</p>
          <h1 className="font-serif text-[42px] font-medium leading-[1.05] tracking-tight sm:text-6xl lg:text-[64px]">
            BEYOND THE
            <br />
            <span className="italic text-champagne">FEELING</span>
          </h1>
          <p className="mx-auto mt-5 max-w-md font-serif text-xl italic text-gold md:mx-0">{settings.heroSub}</p>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-ivory/65 md:mx-0">{settings.heroDesc}</p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center md:justify-start">
            <ButtonLink href="/shop" variant="gold" size="lg" className="w-full sm:w-auto">Shop Gifts</ButtonLink>
            <ButtonLink href="/build-your-gift" variant="outline" size="lg" className="w-full sm:w-auto">Build a Gift Box</ButtonLink>
          </div>
          <p className="mt-6 font-script text-2xl text-champagne/90">More than a gift. A feeling.</p>
        </div>

        <div className="relative animate-fadeIn">
          <div className="absolute -inset-6 rounded-full bg-gold/10 blur-3xl" aria-hidden />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/hero.svg" alt="A premium Talis gift box wrapped with champagne satin ribbon" className="relative aspect-[4/3] w-full border border-white/10 object-cover shadow-lift" fetchPriority="high" />
          <div className="absolute -bottom-5 left-1/2 w-max -translate-x-1/2 border border-gold/40 bg-ink px-6 py-3 shadow-lift">
            <p className="text-[11px] uppercase tracking-[0.28em] text-champagne">Beautifully chosen. Thoughtfully given.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function ShopByFeeling() {
  return (
    <section className="container-talis py-16 md:py-20">
      <SectionHeading eyebrow="Shop by Feeling" title="What do you want them to feel?" script="start with the feeling" />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5">
        {FEELINGS.map((f, i) => (
          <Link
            key={f.slug}
            href={`/shop?q=${encodeURIComponent(f.tag)}`}
            className="group relative flex min-h-[150px] flex-col justify-between overflow-hidden bg-ink p-5 text-left transition-transform duration-300 hover:-translate-y-1 md:min-h-[190px] md:p-7"
          >
            <span aria-hidden className="talis-pattern absolute inset-0 opacity-40 transition-opacity group-hover:opacity-70" />
            <span aria-hidden className="absolute right-4 top-4 font-serif text-5xl text-white/[0.05]">{String(i + 1).padStart(2, "0")}</span>
            <span className="relative font-script text-[26px] leading-none text-champagne md:text-3xl">{f.title}</span>
            <span className="relative mt-3 block max-w-[220px] text-xs leading-relaxed text-ivory/60 md:text-sm">{f.line}</span>
            <span className="relative mt-3 inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-gold opacity-80 transition-all group-hover:gap-3 group-hover:opacity-100">
              Discover <ArrowRightIcon width={13} height={13} />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function FeaturedCollections({ collections }: {
  collections: { slug: string; name: string; tagline: string | null; image: string | null }[];
}) {
  return (
    <section className="bg-white py-16 md:py-20">
      <div className="container-talis">
        <SectionHeading eyebrow="Curated for you" title="Featured Collections" sub="Four worlds of gifting, each crafted around a different kind of feeling." />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {collections.map((c) => (
            <Link key={c.slug} href={`/collections/${c.slug}`} className="group block">
              <div className="relative aspect-[3/4] overflow-hidden bg-beige/40">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={c.image ?? "/images/box.svg"} alt={c.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.06]" />
                <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-ink/85 to-transparent" aria-hidden />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <h3 className="font-serif text-xl tracking-wide text-ivory">TALIS {c.name.replace("Talis ", "").toUpperCase()}</h3>
                  <p className="mt-1 line-clamp-2 text-xs text-ivory/75">{c.tagline}</p>
                  <span className="mt-2.5 inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-champagne transition-all group-hover:gap-3">
                    Explore <ArrowRightIcon width={12} height={12} />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export function BestSellers({ products }: { products: ProductCardData[] }) {
  return (
    <section className="container-talis py-16 md:py-20">
      <SectionHeading eyebrow="Loved across Nairobi" title="Best Sellers" sub="The gifts our customers keep coming back for." />
      <ProductGrid products={products.slice(0, 4)} />
      <div className="mt-10 text-center">
        <ButtonLink href="/best-sellers" variant="primary">View All Best Sellers</ButtonLink>
      </div>
    </section>
  );
}

export function GiftBoxPromo() {
  return (
    <section className="relative overflow-hidden bg-ink py-20 text-center text-ivory md:py-24">
      <div className="talis-pattern absolute inset-0 opacity-50" aria-hidden />
      <div className="relative container-talis">
        <GiftIcon width={40} height={40} className="mx-auto text-gold" />
        <p className="eyebrow mt-4">The Talis Experience</p>
        <h2 className="mx-auto mt-3 max-w-2xl font-serif text-3xl leading-tight sm:text-4xl">Their gift, composed by you</h2>
        <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-ivory/65">
          Choose the box, hand-pick every treasure, add a ribbon and a handwritten message. We pack it beautifully and deliver it with care.
        </p>
        <Divider />
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <ButtonLink href="/build-your-gift" variant="gold" size="lg">Build a Gift Box</ButtonLink>
          <ButtonLink href="/gift-boxes" variant="outline" size="lg">Browse Curated Boxes</ButtonLink>
        </div>
      </div>
    </section>
  );
}

export function NewArrivals({ products }: { products: ProductCardData[] }) {
  return (
    <section className="bg-white py-16 md:py-20">
      <div className="container-talis">
        <SectionHeading eyebrow="Just landed" title="New Arrivals" sub="Fresh gifts, beautifully chosen." />
        <ProductGrid products={products.slice(0, 4)} />
        <div className="mt-10 text-center">
          <ButtonLink href="/new-arrivals" variant="primary">View All</ButtonLink>
        </div>
      </div>
    </section>
  );
}

export function PersonalizationBand() {
  return (
    <section className="container-talis py-16 md:py-20">
      <div className="grid items-center gap-10 border border-beige bg-white p-8 md:grid-cols-2 md:p-14">
        <div>
          <SparkleIcon width={34} height={34} className="text-gold" />
          <h2 className="mt-4 font-serif text-3xl leading-tight text-ink">MAKE IT PERSONAL</h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-espresso/70">
            A name engraved in gold. A date etched forever. A message written by hand. The smallest details turn a beautiful gift into their favourite thing they own.
          </p>
          <ul className="mt-5 space-y-2 text-sm text-espresso/75">
            {["Names, dates & messages on select gifts", "Complimentary handwritten card with every order", "Personalization confirmed before we dispatch"].map((t) => (
              <li key={t} className="flex items-start gap-2.5"><span aria-hidden className="mt-[7px] h-1.5 w-1.5 shrink-0 rotate-45 bg-gold" />{t}</li>
            ))}
          </ul>
          <ButtonLink href="/personalized" variant="primary" className="mt-7">Make It Personal</ButtonLink>
        </div>
        <div className="relative hidden md:block">
          <div className="talis-pattern absolute -inset-4 opacity-70" aria-hidden />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/frame.svg" alt="A personalized photo frame with gold engraving" loading="lazy" className="relative aspect-square w-full border border-beige object-cover shadow-lift" />
        </div>
      </div>
    </section>
  );
}

export function Testimonials({ testimonials }: { testimonials: SiteSettings["testimonials"] }) {
  if (!testimonials.length) return null;
  return (
    <section className="bg-ivory py-16 md:py-20">
      <div className="container-talis">
        <SectionHeading eyebrow="From our customers" title="Feelings, delivered" />
        <div className="grid gap-5 md:grid-cols-3">
          {testimonials.slice(0, 3).map((t, i) => (
            <figure key={i} className="border border-beige bg-white p-7 text-center shadow-card">
              <p aria-hidden className="font-serif text-4xl leading-none text-gold">&ldquo;</p>
              <blockquote className="mt-2 text-sm italic leading-relaxed text-espresso/75">{t.quote}</blockquote>
              <figcaption className="mt-4 text-[11px] uppercase tracking-[0.18em] text-espresso/55">
                {t.name} — {t.location}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

export function InstagramSection({ settings }: { settings: SiteSettings }) {
  return (
    <section className="container-talis py-16 md:py-20">
      <SectionHeading eyebrow="Instagram" title="Follow the Feeling" sub={`Tag ${settings.instagramHandle} to be featured.`} />
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {settings.instagramImages.slice(0, 6).map((src, i) => (
          <a
            key={i}
            href={`https://instagram.com/${settings.instagramHandle.replace("@", "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative aspect-square overflow-hidden bg-beige/40"
            aria-label={`Talis on Instagram, post ${i + 1}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
            <span className="absolute inset-0 flex items-center justify-center bg-ink/0 text-ivory opacity-0 transition-all group-hover:bg-ink/40 group-hover:opacity-100">
              <InstagramIcon width={26} height={26} />
            </span>
          </a>
        ))}
      </div>
      <div className="mt-8 text-center">
        <a
          href={`https://instagram.com/${settings.instagramHandle.replace("@", "")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-base border border-espresso px-7 py-3 hover:bg-ink hover:text-ivory"
        >
          Follow {settings.instagramHandle}
        </a>
      </div>
    </section>
  );
}

export function NewsletterSection() {
  return (
    <section className="bg-ink py-16 text-center text-ivory md:py-20">
      <div className="container-talis">
        <p className="eyebrow">Never miss a moment</p>
        <h2 className="mt-3 font-serif text-3xl sm:text-4xl">LET&apos;S STAY IN THE KNOW</h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-ivory/60">
          Be the first to discover new gifts, special collections and beautiful moments.
        </p>
        <div className="mt-7">
          <NewsletterForm compact />
        </div>
      </div>
    </section>
  );
}
