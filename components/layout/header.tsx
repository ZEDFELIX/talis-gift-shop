"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useCart } from "@/components/providers/cart";
import { useWishlist } from "@/components/providers/wishlist";
import { BagIcon, ChevronDownIcon, HeartIcon, MenuIcon, SearchIcon, UserIcon, XIcon } from "@/components/icons";
import { cn, formatKSh } from "@/lib/utils";
import { Spinner } from "@/components/ui";

type SearchResult = { slug: string; name: string; image: string; price: number };

const SHOP_LINKS = [
  { href: "/shop", label: "All Gifts" },
  { href: "/gift-boxes", label: "Gift Boxes" },
  { href: "/new-arrivals", label: "New Arrivals" },
  { href: "/best-sellers", label: "Best Sellers" },
  { href: "/personalized", label: "Personalized" },
  { href: "/build-your-gift", label: "Build a Gift Box" }
];
const OCCASION_LINKS = [
  ["birthday", "Birthday"], ["anniversary", "Anniversary"], ["wedding", "Wedding"],
  ["graduation", "Graduation"], ["valentines", "Valentine's"], ["christmas", "Christmas"]
].map(([slug, label]) => ({ href: `/occasions/${slug}`, label }));
const COLLECTION_LINKS = [
  ["talis-signature", "Talis Signature"], ["talis-moments", "Talis Moments"],
  ["talis-personal", "Talis Personal"], ["talis-home", "Talis Home"]
].map(([slug, label]) => ({ href: `/collections/${slug}`, label }));

export function Logo({ light }: { light?: boolean }) {
  return (
    <Link href="/" className="group inline-flex flex-col items-center leading-none" aria-label="Talis Gift Shop — home">
      <span className={cn("font-serif text-[26px] font-semibold tracking-[0.32em] transition-colors", light ? "text-ivory" : "text-ink")}>
        TALIS<span className="text-gold">.</span>
      </span>
      <span className={cn("mt-1 text-[8.5px] font-medium uppercase tracking-[0.52em]", light ? "text-ivory/60" : "text-espresso/55")}>
        Gift Shop
      </span>
    </Link>
  );
}

export function Header({ announcement }: { announcement: string }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
      <div className="bg-ink px-4 py-2 text-center">
        <p className="text-[11px] uppercase tracking-[0.22em] text-champagne">{announcement}</p>
      </div>
      <header className={cn("sticky top-0 z-50 border-b transition-all duration-300", scrolled ? "border-beige/70 bg-ivory/95 shadow-soft backdrop-blur" : "border-transparent bg-ivory")}>
        <div className="container-talis flex h-[68px] items-center justify-between gap-4">
          <button
            className="flex h-10 w-10 items-center justify-center lg:hidden"
            aria-label="Open menu"
            onClick={() => setMenuOpen(true)}
          >
            <MenuIcon width={22} height={22} />
          </button>

          <nav className="hidden items-center gap-7 lg:flex" aria-label="Main">
            {[
              { href: "/shop", label: "Shop" },
              { href: "/occasions", label: "Occasions", dropdown: OCCASION_LINKS },
              { href: "/collections/talis-signature", label: "Collections", dropdown: COLLECTION_LINKS },
              { href: "/build-your-gift", label: "Build a Gift Box" }
            ].map((item) => {
              const active = item.href === "/shop" ? pathname.startsWith("/shop") : pathname.startsWith(item.href);
              return (
              <div key={item.label} className="group relative">
                <Link
                  href={item.href}
                  className={cn(
                    "link-underline flex items-center gap-1 py-2 text-[12px] font-semibold uppercase tracking-[0.16em] transition-colors hover:text-gold",
                    active && "text-gold"
                  )}
                >
                  {item.label}
                  {item.dropdown && <ChevronDownIcon width={13} height={13} className="transition-transform group-hover:rotate-180" />}
                </Link>
                {item.dropdown && (
                  <div className="invisible absolute left-1/2 top-full z-50 w-60 -translate-x-1/2 pt-3 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                    <div className="border border-beige bg-white p-2 shadow-lift">
                      {item.dropdown.map((sub) => (
                        <Link key={sub.href} href={sub.href} className="block px-4 py-2.5 text-[12px] uppercase tracking-[0.14em] text-espresso/75 transition-colors hover:bg-ivory hover:text-gold">
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              );
            })}
          </nav>

          <Logo />

          <div className="flex items-center gap-1 sm:gap-2">
            <HeaderIconBtn label="Search" onClick={() => setSearchOpen(true)}>
              <SearchIcon width={20} height={20} />
            </HeaderIconBtn>
            <HeaderIconBtn label="Wishlist" href="/wishlist" badge={<WishlistBadge />}>
              <HeartIcon width={20} height={20} />
            </HeaderIconBtn>
            <HeaderIconBtn label="Account" href="/account" className="hidden sm:flex">
              <UserIcon width={20} height={20} />
            </HeaderIconBtn>
            <HeaderIconBtn label="Cart" href="/cart" badge={<CartBadge />}>
              <BagIcon width={20} height={20} />
            </HeaderIconBtn>
          </div>
        </div>
      </header>

      {menuOpen && <MobileMenu onClose={() => setMenuOpen(false)} />}
      {searchOpen && <SearchOverlay onClose={() => setSearchOpen(false)} />}
    </>
  );
}

function HeaderIconBtn({ children, label, href, onClick, badge, className }: {
  children: React.ReactNode;
  label: string;
  href?: string;
  onClick?: () => void;
  badge?: React.ReactNode;
  className?: string;
}) {
  const inner = (
    <span className="relative flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:text-gold">
      {children}
      {badge}
    </span>
  );
  if (href) return <Link href={href} aria-label={label} className={cn("hidden sm:flex", className)}>{inner}</Link>;
  return (
    <button type="button" aria-label={label} onClick={onClick} className={cn("flex sm:hidden", !onClick && "sm:flex", className)}>
      {inner}
    </button>
  );
}

function CartBadge() {
  const { count, mounted } = useCart();
  if (!mounted || count === 0) return null;
  return (
    <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-gold px-1 text-[10px] font-bold text-ink">
      {count > 9 ? "9+" : count}
    </span>
  );
}

function WishlistBadge() {
  const { entries, mounted } = useWishlist();
  if (!mounted || entries.length === 0) return null;
  return (
    <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-gold px-1 text-[10px] font-bold text-ink">
      {entries.length > 9 ? "9+" : entries.length}
    </span>
  );
}

function MobileMenu({ onClose }: { onClose: () => void }) {
  const groups = [
    { title: "Shop", links: SHOP_LINKS },
    { title: "Occasions", links: OCCASION_LINKS },
    { title: "Collections", links: COLLECTION_LINKS },
    {
      title: "Help",
      links: [
        { href: "/track-order", label: "Track Order" },
        { href: "/delivery", label: "Delivery" },
        { href: "/faq", label: "FAQ" },
        { href: "/contact", label: "Contact" }
      ]
    }
  ];
  return (
    <div className="fixed inset-0 z-[80] lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
      <button aria-label="Close menu" onClick={onClose} className="absolute inset-0 bg-ink/50 backdrop-blur-sm animate-fadeIn" />
      <div className="absolute inset-y-0 left-0 flex w-[86vw] max-w-sm flex-col bg-ivory shadow-lift" style={{ animation: "slideIn .35s cubic-bezier(.22,.8,.36,1) both", transform: "none", direction: "ltr" }}>
        <style>{`@keyframes talisSlideRight{from{transform:translateX(-100%)}to{transform:none}}`}</style>
        <div className="flex h-[68px] items-center justify-between border-b border-beige px-5">
          <Logo />
          <button aria-label="Close menu" onClick={onClose} className="flex h-10 w-10 items-center justify-center"><XIcon width={22} height={22} /></button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-6" style={{ animation: "talisSlideRight .35s cubic-bezier(.22,.8,.36,1) both" }}>
          <p className="eyebrow mb-3">What do you want them to feel?</p>
          <Link href="/build-your-gift" onClick={onClose} className="mb-6 block border border-gold/60 bg-white px-5 py-4 text-center text-[12px] font-semibold uppercase tracking-[0.18em] text-gold">
            Build a Gift Box
          </Link>
          {groups.map((g) => (
            <details key={g.title} className="group border-b border-beige/70 py-1" open={g.title === "Shop"}>
              <summary className="flex cursor-pointer list-none items-center justify-between py-3 font-serif text-lg text-ink [&::-webkit-details-marker]:hidden">
                {g.title}
                <ChevronDownIcon width={16} height={16} className="transition-transform group-open:rotate-180" />
              </summary>
              <div className="pb-3">
                {g.links.map((l) => (
                  <Link key={l.href} href={l.href} onClick={onClose} className="block py-2 pl-3 text-sm text-espresso/75 hover:text-gold">
                    {l.label}
                  </Link>
                ))}
              </div>
            </details>
          ))}
        </div>
        <div className="border-t border-beige p-5">
          <Link href="/account" onClick={onClose} className="flex items-center gap-3 text-[12px] font-semibold uppercase tracking-[0.16em] hover:text-gold">
            <UserIcon width={18} height={18} /> Account & Orders
          </Link>
        </div>
      </div>
    </div>
  );
}

function SearchOverlay({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [term, setTerm] = useState("");
  const [results, setResults] = useState<SearchResult[] | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    const q = term.trim();
    if (q.length < 2) { setResults(null); setLoading(false); return; }
    setLoading(true);
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/products?q=${encodeURIComponent(q)}&limit=6`);
        const data = await res.json();
        setResults(data.products ?? []);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 250);
    return () => clearTimeout(t);
  }, [term]);

  const suggestions = ["birthday", "gift for mum", "anniversary", "self care", "candle", "graduation"];

  return (
    <div className="fixed inset-0 z-[85]" role="dialog" aria-modal="true" aria-label="Search">
      <button aria-label="Close search" onClick={onClose} className="absolute inset-0 bg-ink/60 backdrop-blur-sm animate-fadeIn" />
      <div className="relative mx-auto mt-[10vh] w-[92vw] max-w-xl animate-fadeUp border border-beige bg-ivory p-5 shadow-lift sm:p-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (term.trim()) router.push(`/shop?q=${encodeURIComponent(term.trim())}`);
            onClose();
          }}
          role="search"
        >
          <div className="flex items-center gap-3 border-b border-espresso/25 pb-3">
            <SearchIcon width={20} height={20} className="shrink-0 text-gold" />
            <input
              ref={inputRef}
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              placeholder="Search gifts, occasions, feelings…"
              className="w-full bg-transparent text-base placeholder:text-espresso/40 focus:outline-none"
              aria-label="Search products"
            />
            {loading && <Spinner className="shrink-0 text-gold" />}
            <button type="button" onClick={onClose} aria-label="Close" className="shrink-0 text-espresso/50 hover:text-gold"><XIcon width={18} height={18} /></button>
          </div>
        </form>

        {results === null && (
          <div className="pt-4">
            <p className="eyebrow mb-3">Try a feeling</p>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => setTerm(s)}
                  className="rounded-full border border-beige bg-white px-3.5 py-1.5 text-xs capitalize text-espresso/70 transition-colors hover:border-gold hover:text-gold"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {results !== null && results.length > 0 && (
          <ul className="max-h-[46vh] divide-y divide-beige/60 overflow-y-auto pt-2">
            {results.map((r) => (
              <li key={r.slug}>
                <Link href={`/products/${r.slug}`} onClick={onClose} className="flex items-center gap-4 px-1 py-3 transition-colors hover:bg-white">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={r.image} alt="" width={48} height={48} className="h-12 w-12 shrink-0 border border-beige object-cover" />
                  <span className="min-w-0 flex-1 truncate text-sm text-espresso">{r.name}</span>
                  <span className="shrink-0 text-sm font-semibold text-gold">{formatKSh(r.price)}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}

        {results !== null && results.length === 0 && term.trim().length >= 2 && (
          <div className="py-8 text-center">
            <p className="font-serif text-lg text-ink">We couldn&apos;t find that</p>
            <p className="mt-1 text-sm text-espresso/60">Try another feeling, occasion or product.</p>
            <button
              onClick={() => { router.push(`/shop?q=${encodeURIComponent(term.trim())}`); onClose(); }}
              className="mt-4 text-[12px] font-semibold uppercase tracking-[0.16em] text-gold underline underline-offset-4"
            >
              Browse all gifts
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
