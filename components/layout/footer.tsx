import Link from "next/link";
import { Logo } from "@/components/layout/header";
import { NewsletterForm } from "@/components/home/newsletter-form";
import { InstagramIcon, FacebookIcon, TiktokIcon, WhatsappIcon } from "@/components/icons";
import type { SiteSettings } from "@/lib/settings";

export function Footer({ settings }: { settings: SiteSettings }) {
  return (
    <footer className="bg-ink text-ivory">
      <div className="container-talis grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-5 lg:gap-8">
        <div className="lg:col-span-2">
          <Logo light />
          <p className="mt-4 max-w-xs font-serif text-lg italic leading-relaxed text-champagne">Beyond the Feeling</p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-ivory/55">
            Thoughtfully chosen. Beautifully given. Remembered forever.
          </p>
          <div className="mt-6 flex gap-3">
            <SocialLink href={`https://instagram.com/${settings.instagramHandle.replace("@", "")}`} label="Instagram"><InstagramIcon width={18} height={18} /></SocialLink>
            <SocialLink href="https://tiktok.com" label="TikTok"><TiktokIcon width={18} height={18} /></SocialLink>
            <SocialLink href="https://facebook.com" label="Facebook"><FacebookIcon width={18} height={18} /></SocialLink>
            <SocialLink href={`https://wa.me/${settings.whatsapp}`} label="WhatsApp"><WhatsappIcon width={18} height={18} /></SocialLink>
          </div>
        </div>

        <FooterCol title="Shop" links={[
          ["/shop", "All Gifts"],
          ["/gift-boxes", "Gift Boxes"],
          ["/new-arrivals", "New Arrivals"],
          ["/best-sellers", "Best Sellers"],
          ["/personalized", "Personalized"],
          ["/build-your-gift", "Build a Gift Box"]
        ]} />
        <FooterCol title="Help" links={[
          ["/contact", "Contact"],
          ["/faq", "FAQ"],
          ["/delivery", "Delivery"],
          ["/returns", "Returns"],
          ["/track-order", "Track Order"]
        ]} />
        <FooterCol title="About" links={[
          ["/about", "Our Story"],
          ["/about", "Our Values"],
          ["/privacy", "Privacy Policy"],
          ["/terms", "Terms of Service"]
        ]} />
      </div>

      <div className="border-t border-white/10">
        <div className="container-talis flex flex-col items-center justify-between gap-6 py-10 md:flex-row">
          <div className="max-w-md text-center md:text-left">
            <h3 className="font-serif text-xl text-champagne">Let&apos;s stay in the know</h3>
            <p className="mt-1 text-sm text-ivory/50">Be the first to discover new gifts and special collections.</p>
          </div>
          <NewsletterForm compact />
        </div>
      </div>

      <div className="border-t border-white/10 py-6 text-center">
        <p className="text-[11px] uppercase tracking-[0.22em] text-ivory/40">
          © {new Date().getFullYear()} Talis Gift Shop · Nairobi, Kenya · M-PESA Accepted
        </p>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <nav aria-label={title}>
      <h4 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.28em] text-gold">{title}</h4>
      <ul className="space-y-2.5">
        {links.map(([href, label], i) => (
          <li key={`${href}-${i}`}>
            <Link href={href} className="text-sm text-ivory/65 transition-colors hover:text-champagne">{label}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function SocialLink({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-ivory/70 transition-all hover:border-gold hover:text-gold"
    >
      {children}
    </a>
  );
}
