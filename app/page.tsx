import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "ZED Gift Shop — Gifts Made for Moments" };

const categories = [
  ["Gifts for Her","/images/jewelry.svg","/shop?q=her"],["Gifts for Him","/images/box.svg","/shop?q=him"],
  ["Personalized Gifts","/images/engraved.svg","/personalized"],["Gift Hampers","/images/hamper.svg","/gift-boxes"],
  ["Drinkware","/images/tumbler.svg","/shop?q=drinkware"],["Corporate Gifts","/images/home.svg","/shop?q=corporate"]
];
const products = [
  ["Personalized Gift Box","KSh 3,499","/images/box-open.svg"],["Premium Self-Care Set","KSh 2,999","/images/selfcare.svg"],
  ["Engraved Keepsake","KSh 2,499","/images/engraved.svg"],["Signature Tumbler","KSh 2,499","/images/tumbler.svg"],
  ["Bamboo Desk Organizer","KSh 4,299","/images/home.svg"],["Maasai-Inspired Gift","KSh 3,499","/images/packaging.svg"]
];

export default function HomePage() {
  return <div className="bg-[#fbfaf7] text-[#171713]">
    <section className="zed-hero"><div className="container-talis relative grid min-h-[560px] items-center gap-10 py-14 md:grid-cols-[1.05fr_.95fr] md:py-20">
      <div className="relative z-10 max-w-xl"><span className="zed-pill">Gift beautifully · Nairobi & Kenya</span>
        <h1 className="mt-6 font-serif text-5xl font-semibold leading-[.98] tracking-[-.05em] text-white sm:text-6xl lg:text-7xl">Give them a reason<br/><em className="text-[#c7df39]">to remember.</em></h1>
        <p className="mt-6 max-w-lg text-base leading-7 text-white/75 sm:text-lg">Thoughtful gifts, personalized keepsakes and beautiful gift boxes for birthdays, anniversaries, celebrations and the people who matter.</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row"><Link href="/shop" className="zed-btn zed-btn-lime">Shop gifts</Link><Link href="/build-your-gift" className="zed-btn zed-btn-light">Build a gift box</Link></div>
        <div className="mt-9 flex flex-wrap gap-x-6 gap-y-2 text-xs font-semibold text-white/65"><span>✓ Same-day Nairobi delivery</span><span>✓ M-PESA accepted</span><span>✓ Personalization available</span></div>
      </div>
      <div className="relative z-10"><div className="hero-art"><img src="/images/hero.svg" alt="ZED Gift Shop gift box"/></div><div className="hero-note"><strong>Make it personal.</strong><br/>Add a name, message or special detail.</div></div>
    </div></section>
    <section className="border-b border-black/10 bg-white"><div className="container-talis grid grid-cols-2 md:grid-cols-4">{[["Same-day","Nairobi delivery"],["Personalized","Made for them"],["Secure","M-PESA & cards"],["Support","We're here to help"]].map(([a,b])=><div key={a} className="border-r border-black/10 px-4 py-6 text-center last:border-0 md:py-7"><p className="font-serif text-lg font-semibold">{a}</p><p className="mt-1 text-xs text-black/55">{b}</p></div>)}</div></section>
    <section className="container-talis py-16 md:py-20"><div className="mb-8 flex items-end justify-between gap-5"><div><p className="eyebrow">Find the right gift</p><h2 className="mt-2 font-serif text-3xl font-semibold sm:text-4xl">Shop by category</h2></div><Link href="/shop" className="hidden text-xs font-bold uppercase tracking-[.16em] underline underline-offset-4 sm:block">View all gifts</Link></div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-5">{categories.map(([title,image,href])=><Link key={title} href={href} className="category-card"><img src={image} alt=""/><div><h3>{title}</h3><span>Shop now →</span></div></Link>)}</div>
    </section>
    <section className="bg-white py-16 md:py-20"><div className="container-talis"><div className="mb-8 flex items-end justify-between gap-5"><div><p className="eyebrow">Popular right now</p><h2 className="mt-2 font-serif text-3xl font-semibold sm:text-4xl">Gifts people love</h2></div><Link href="/best-sellers" className="hidden text-xs font-bold uppercase tracking-[.16em] underline underline-offset-4 sm:block">See best sellers</Link></div>
      <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-3 lg:grid-cols-6 lg:gap-5">{products.map(([name,price,image])=><Link key={name} href="/shop" className="product-card"><div className="product-image"><img src={image} alt=""/></div><p className="mt-4 text-sm font-semibold leading-5">{name}</p><p className="mt-1 text-sm font-bold text-[#0b5a3e]">{price}</p><span className="mt-3 inline-block text-[10px] font-bold uppercase tracking-[.16em]">Add to cart</span></Link>)}</div>
    </div></section>
    <section className="container-talis py-16 md:py-20"><div className="grid overflow-hidden rounded-[32px] bg-[#063121] md:grid-cols-2"><div className="p-8 sm:p-12 md:p-14"><p className="eyebrow text-[#c7df39]">Corporate & bulk gifting</p><h2 className="mt-3 font-serif text-3xl font-semibold text-white sm:text-4xl">Make your brand part of the moment.</h2><p className="mt-4 max-w-md text-sm leading-6 text-white/65">Branded notebooks, drinkware, desk sets, hampers and custom gift kits for teams, clients and events.</p><Link href="/contact" className="zed-btn zed-btn-lime mt-7">Talk to ZED</Link></div><div className="relative min-h-[280px] bg-[#0e5a3d] p-8"><img src="/images/packaging.svg" alt="" className="absolute inset-10 h-[calc(100%-80px)] w-[calc(100%-80px)] object-contain opacity-90"/></div></div></section>
    <section className="bg-[#f1f6d6] py-16 md:py-20"><div className="container-talis"><div className="text-center"><p className="eyebrow">Why ZED</p><h2 className="mt-2 font-serif text-3xl font-semibold">Not just a gift. A whole experience.</h2></div><div className="mt-10 grid gap-5 md:grid-cols-3">{[["Choose","Browse by person, occasion, feeling or budget."],["Personalize","Add names, messages and meaningful details."],["Deliver","We wrap it beautifully and get it to them with care."]].map(([a,b],i)=><div key={a} className="rounded-2xl bg-white p-7"><span className="text-xs font-bold text-[#0b5a3e]">0{i+1}</span><h3 className="mt-4 font-serif text-2xl font-semibold">{a}</h3><p className="mt-2 text-sm leading-6 text-black/55">{b}</p></div>)}</div></div></section>
    <section className="container-talis py-16 text-center md:py-20"><p className="eyebrow">Real moments</p><h2 className="mt-2 font-serif text-3xl font-semibold">Made to be remembered.</h2><p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-black/55">From a simple thank-you to a once-in-a-lifetime celebration, ZED helps you put meaning into what you give.</p><div className="mt-8 flex flex-wrap justify-center gap-3"><Link href="/shop" className="zed-btn zed-btn-dark">Explore gifts</Link><Link href="/personalized" className="zed-btn zed-btn-outline">Personalize a gift</Link></div></section>
  </div>;
}