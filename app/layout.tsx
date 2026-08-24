import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MobileBottomNav } from "@/components/layout/mobile-nav";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { getSettings } from "@/lib/settings";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: "Talis Gift Shop — Beyond the Feeling | Premium Gifts Nairobi",
    template: "%s | Talis Gift Shop"
  },
  description: "Thoughtful gifts for the moments that matter. Curated gift boxes, personalized treasures and beautiful flowers — delivered across Nairobi and Kenya.",
  keywords: ["gifts nairobi", "gift shop kenya", "gift boxes", "personalized gifts", "mpesa gifts", "talis gift shop"],
  openGraph: {
    type: "website",
    siteName: "Talis Gift Shop",
    title: "Talis Gift Shop — Beyond the Feeling",
    description: "More than a gift. A feeling. Premium curated gifts delivered across Kenya.",
    images: [{ url: "/images/hero.svg", width: 1600, height: 900 }]
  },
  twitter: {
    card: "summary_large_image",
    title: "Talis Gift Shop — Beyond the Feeling",
    description: "Thoughtful gifts for the moments that matter."
  },
  robots: { index: true, follow: true }
};

export const viewport: Viewport = {
  themeColor: "#0B0B0B",
  width: "device-width",
  initialScale: 1
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Talis Gift Shop",
  slogan: "Beyond the Feeling",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  address: { "@type": "PostalAddress", addressLocality: "Nairobi", addressCountry: "KE" },
  sameAs: ["https://instagram.com/talisgiftshop"]
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();

  return (
    <html lang="en-KE">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,500&family=Montserrat:wght@400;500;600;700&family=Great+Vibes&display=swap"
          rel="stylesheet"
        />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
      </head>
      <body className="flex min-h-screen flex-col">
        <Providers>
          <Header announcement={settings.announcement} />
          <main className="flex-1 pb-[72px] md:pb-0">{children}</main>
          <Footer settings={settings} />
          <MobileBottomNav />
          <CartDrawer />
          <a
            href={`https://wa.me/${settings.whatsapp}?text=${encodeURIComponent("Hi Talis! I'd love help choosing a gift.")}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat with Talis on WhatsApp"
            className="fixed bottom-[84px] right-4 z-[65] flex h-12 w-12 items-center justify-center rounded-full bg-ink text-gold shadow-lift transition-transform hover:scale-105 md:bottom-6 md:right-6"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4.5 19.5 5.8 16A7.5 7.5 0 1 1 9 18.6l-4.5.9Z" /></svg>
          </a>
        </Providers>
      </body>
    </html>
  );
}
