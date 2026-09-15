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
    <section className="emerald-gradient relative overflow-hidden text-ivory">
      <div className="talis-pattern absolute inset-0 opacity-50" aria-hidden />
      <div aria-hidden className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-gold/15 blur-3xl" />
      <div aria-hidden className="absolute -left-32 bottom-0 h-80 w-80 rounded-full bg-moss/25 blur-3xl" />
      <div className="container-talis relative grid items-center gap-12 py-16 md:grid-cols-2 md:py-24 lg:py-28">
        <div className="animate-fadeUp text-center md:text-left">
          <p className="mb-4 inline-flex items-center gap-2 border border-gold/40 bg-gold/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.3em] text-gold">
            <SparkleIcon width={12} height={12} /> Nairobi · Kenya
          </p>
          <h1 className="font-serif text-[44px] font-bold leading-[1.02] tracking-tight sm:text-6xl lg:text-[66px]">
            BEYOND THE
            <br />
            <span className="gold-text italic">FEELING</span>
          </h1>
          <p className="mx-auto mt-5 max-w-md font-serif text-xl font-semibold italic text-gold md:mx-0">{settings.heroSub}</p>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-ivory/70 md:mx-0">{settings.heroDesc}</p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center md:justify-start">
            <ButtonLink href="/shop" variant="gold" size="lg" className="w-full shadow-glow sm:w-auto">Shop Gifts</ButtonLink>
            <ButtonLink href="/build-your-gift" variant="outline-light" size="lg" className="w-full sm:w-auto">Build a Gift Box</ButtonLink>
          </div>
          <p className="mt-6 font-script text-3xl text-gold/90">More than a gift. A feeling.</p>
        </div>

        <div className="relative animate-fadeIn">
          <div className="absolute -inset-8 rounded-full bg-gold/20 blur-3xl" aria-hidden />
          <div className="relative overflow-hidden border-2 border-gold/60 shadow-glow">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/hero.svg" alt="A premium Talis gift box wrapped with champagne satin ribbon" className="aspect-[4/3] w-full object-cover" fetchPriority="high" />
          </div>
          <div className="absolute -bottom-6 left-1/2 flex w-max -translate-x-1/2 items-center gap-2 border border-gold bg-ink px-6 py-3 shadow-glow">
            <GiftIcon width={16} height={16} className="text-gold" />
            <p className="text-[11px] font-bold uppercase tracking-[0.26em] text-gold">Beautifully chosen. Thoughtfully given.</p>
          </div>
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent" aria-hidden />
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
            className="group relative flex min-h-[150px] flex-col justify-between overflow-hidden border border-leaf/40 bg-ink p-5 text-left transition-all duration-300 hover:-translate-y-1 hover:border-gold/70 hover:shadow-glow md:min-h-[190px] md:p-7"
          >
            <span aria-hidden className="talis-pattern absolute inset-0 opacity-40 transition-opacity group-hover:opacity-70" />
            <span aria-hidden className="absolute -right-1 top-2 font-serif text-6xl font-bold text-gold/[0.12]">{String(i + 1).padStart(2, "0")}</span>
            <span aria-hidden className="absolute inset-x-4 top-0 h-[3px] origin-left scale-x-0 bg-gradient-to-r from-gold to-champagne transition-transform duration-300 group-hover:scale-x-100" />
            <span className="relative font-script text-[26px] leading-none text-gold md:text-3xl">{f.title}</span>
            <span className="relative mt-3 block max-w-[220px] text-xs leading-relaxed text-ivory/65 md:text-sm">{f.line}</span>
            <span className="relative mt-3 inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-gold opacity-90 transition-all group-hover:gap-3">
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
              <div className="relative aspect-[3/4] overflow-hidden border border-beige bg-beige/40 transition-colors duration-300 group-hover:border-gold">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={c.image ?? "/images/box.svg"} alt={c.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.06]" />
                <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-ink/90 via-ink/40 to-transparent" aria-hidden />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-gold">The Talis Collection</p>
                  <h3 className="mt-1 font-serif text-xl font-bold tracking-wide text-ivory">{c.name.replace("Talis ", "").toUpperCase()}</h3>
                  <p className="mt-1 line-clamp-2 text-xs text-ivory/75">{c.tagline}</p>
                  <span className="mt-2.5 inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-gold transition-all group-hover:gap-3">
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
  if (products.length === 0) return null;
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
    <section className="emerald-gradient relative overflow-hidden py-20 text-center text-ivory md:py-24">
      <div className="talis-pattern absolute inset-0 opacity-60" aria-hidden />
      <div aria-hidden className="absolute left-1/2 top-0 h-px w-2/3 max-w-2xl -translate-x-1/2 bg-gradient-to-r from-transparent via-gold to-transparent" />
      <div className="relative container-talis">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-gold bg-ink shadow-glow">
          <GiftIcon width={30} height={30} className="text-gold" />
        </span>
        <p className="eyebrow mt-5">The Talis Experience</p>
        <h2 className="mx-auto mt-3 max-w-2xl font-serif text-3xl font-bold leading-tight sm:text-4xl">Their gift, composed by you</h2>
        <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-ivory/70">
          Choose the box, hand-pick every treasure, add a ribbon and a handwritten message. We pack it beautifully and deliver it with care.
        </p>
        <Divider />
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <ButtonLink href="/build-your-gift" variant="gold" size="lg">Build a Gift Box</ButtonLink>
          <ButtonLink href="/gift-boxes" variant="outline-light" size="lg">Browse Curated Boxes</ButtonLink>
        </div>
      </div>
    </section>
  );
}

export function NewArrivals({ products }: { products: ProductCardData[] }) {
  if (products.length === 0) return null;
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
      <div className="emerald-gradient relative grid items-center gap-10 overflow-hidden p-8 md:grid-cols-2 md:p-14">
        <div className="talis-pattern absolute inset-0 opacity-40" aria-hidden />
        <div className="relative">
          <span className="flex h-12 w-12 items-center justify-center rounded-full border border-gold bg-ink">
            <SparkleIcon width={22} height={22} className="text-gold" />
          </span>
          <h2 className="mt-5 font-serif text-3xl font-bold leading-tight text-ivory sm:text-4xl">MAKE IT <span className="gold-text italic">PERSONAL</span></h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-ivory/70">
            A name engraved in gold. A date etched forever. A message written by hand. The smallest details turn a beautiful gift into their favourite thing they own.
          </p>
          <ul className="mt-5 space-y-2 text-sm text-ivory/80">
            {["Names, dates & messages on select gifts", "Complimentary handwritten card with every order", "Personalization confirmed before we dispatch"].map((t) => (
              <li key={t} className="flex items-start gap-2.5"><span aria-hidden className="mt-[7px] h-1.5 w-1.5 shrink-0 rotate-45 bg-gold" />{t}</li>
            ))}
          </ul>
          <ButtonLink href="/personalized" variant="gold" className="mt-7">Make It Personal</ButtonLink>
        </div>
        <div className="relative hidden md:block">
          <div className="absolute -inset-4 rounded-full bg-gold/15 blur-2xl" aria-hidden />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/frame.svg" alt="A personalized photo frame with gold engraving" loading="lazy" className="relative aspect-square w-full border-2 border-gold/50 object-cover shadow-glow" />
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
            <figure key={i} className="group relative border border-gold/30 bg-white p-7 text-center shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-glow">
              <span aria-hidden className="absolute inset-x-6 top-0 h-[3px] origin-left scale-x-0 bg-gradient-to-r from-gold to-champagne transition-transform duration-300 group-hover:scale-x-100" />
              <p aria-hidden className="font-serif text-5xl font-bold leading-none text-gold">&ldquo;</p>
              <blockquote className="mt-2 text-sm italic leading-relaxed text-espresso/75">{t.quote}</blockquote>
              <figcaption className="mt-4 text-[11px] font-bold uppercase tracking-[0.18em] text-gold">
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
            className="group relative aspect-square overflow-hidden border border-gold/20 bg-beige/40 transition-colors hover:border-gold"
            aria-label={`Talis on Instagram, post ${i + 1}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
            <span className="absolute inset-0 flex items-center justify-center bg-ink/0 text-gold opacity-0 transition-all group-hover:bg-ink/50 group-hover:opacity-100">
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
    <section className="emerald-gradient relative overflow-hidden py-16 text-center text-ivory md:py-20">
      <div className="talis-pattern absolute inset-0 opacity-50" aria-hidden />
      <div className="relative container-talis">
        <p className="eyebrow">Never miss a moment</p>
        <h2 className="mt-3 font-serif text-3xl font-bold sm:text-4xl">LET&apos;S STAY IN THE KNOW</h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-ivory/65">
          Be the first to discover new gifts, special collections and beautiful moments.
        </p>
        <div className="mt-7">
          <NewsletterForm compact />
        </div>
      </div>
    </section>
  );
}