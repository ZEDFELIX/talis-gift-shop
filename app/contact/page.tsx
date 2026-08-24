import type { Metadata } from "next";
import { getSettings } from "@/lib/settings";
import { ContactForm } from "@/components/info/contact-form";
import { Breadcrumbs, Divider } from "@/components/ui";
import { ClockIcon, MailIcon, PhoneIcon, PinIcon, WhatsappIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Talk to Talis — WhatsApp, phone, email or visit us in Westlands, Nairobi."
};

export default async function ContactPage() {
  const settings = await getSettings();

  return (
    <div className="container-talis py-12 md:py-16">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Contact" }]} />
      <header className="mx-auto mb-12 max-w-xl text-center">
        <p className="eyebrow mb-3">We&apos;d love to hear from you</p>
        <h1 className="h-serif text-3xl text-ink sm:text-4xl">CONTACT TALIS</h1>
        <p className="mt-3 text-sm leading-relaxed text-espresso/65">
          Questions about an order? Planning a corporate gift? Or just need help choosing the feeling? We reply fast.
        </p>
      </header>

      <div className="grid gap-10 lg:grid-cols-[380px_1fr] lg:gap-16">
        <aside className="space-y-5">
          <a
            href={`https://wa.me/${settings.whatsapp}?text=${encodeURIComponent("Hi Talis! I'd love help choosing a gift.")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 border border-gold/50 bg-champagne/15 p-5 transition-colors hover:bg-champagne/25"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ink text-gold"><WhatsappIcon width={20} height={20} /></span>
            <span>
              <span className="block font-semibold">Chat on WhatsApp</span>
              <span className="block text-xs text-espresso/60">Fastest replies — usually minutes</span>
            </span>
          </a>

          <InfoRow icon={<PhoneIcon width={18} height={18} />} label="Call us" value={settings.phone} href={`tel:${settings.phone.replace(/\s/g, "")}`} />
          <InfoRow icon={<MailIcon width={18} height={18} />} label="Email" value={settings.email} href={`mailto:${settings.email}`} />
          <InfoRow icon={<PinIcon width={18} height={18} />} label="Visit" value={settings.address} />
          <InfoRow icon={<ClockIcon width={18} height={18} />} label="Hours" value={settings.hours} />

          <div className="border-t border-beige pt-5">
            <p className="eyebrow mb-3">Follow the feeling</p>
            <div className="flex gap-3">
              {[
                [`https://instagram.com/${settings.instagramHandle.replace("@", "")}`, "Instagram"],
                ["https://tiktok.com", "TikTok"],
                ["https://facebook.com", "Facebook"]
              ].map(([href, label]) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="btn-base border border-espresso/25 px-4 py-2 hover:border-gold hover:text-gold">{label}</a>
              ))}
            </div>
          </div>
        </aside>

        <section aria-label="Contact form" className="border border-beige bg-white p-7 sm:p-9">
          <h2 className="font-serif text-2xl text-ink">Send us a message</h2>
          <Divider />
          <ContactForm />
        </section>
      </div>
    </div>
  );
}

function InfoRow({ icon, label, value, href }: { icon: React.ReactNode; label: string; value: string; href?: string }) {
  const content = (
    <>
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-beige bg-white text-gold">{icon}</span>
      <span className="min-w-0">
        <span className="block text-[11px] font-semibold uppercase tracking-[0.16em] text-espresso/50">{label}</span>
        <span className="block text-sm font-medium leading-snug text-espresso/85 break-words">{value}</span>
      </span>
    </>
  );
  return href ? (
    <a href={href} className="flex items-center gap-4 border border-beige bg-white p-4 transition-colors hover:border-gold/60">{content}</a>
  ) : (
    <div className="flex items-center gap-4 border border-beige bg-white p-4">{content}</div>
  );
}
