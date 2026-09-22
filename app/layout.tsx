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
  title: { default:"ZED Gift Shop — Gifts That Say More.", template:"%s | ZED Gift Shop" },
  description:"Thoughtful gifts, beautifully personalized and delivered across Kenya.",
  keywords:["gift shop kenya","gifts nairobi","personalized gifts","gift boxes","M-PESA gifts","ZED Gift Shop"],
  openGraph:{ type:"website", siteName:"ZED Gift Shop", title:"ZED Gift Shop — Gifts That Say More.", description:"Thoughtful gifts for the moments that matter.", images:[{url:"/images/hero.svg",width:1600,height:900}] },
  robots:{index:true,follow:true}
};
export const viewport: Viewport={themeColor:"#063121",width:"device-width",initialScale:1};
export default async function RootLayout({children}:{children:React.ReactNode}){
 const settings=await getSettings();
 return <html lang="en-KE"><head><link rel="preconnect" href="https://fonts.googleapis.com"/><link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/><link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet"/></head><body className="flex min-h-screen flex-col"><Providers><Header announcement={settings.announcement}/><main className="flex-1 pb-[72px] md:pb-0">{children}</main><Footer settings={settings}/><MobileBottomNav/><CartDrawer/><a href={`https://wa.me/${settings.whatsapp}?text=${encodeURIComponent("Hi ZED! I'd love help choosing a gift.")}`} target="_blank" rel="noopener noreferrer" aria-label="Chat with ZED on WhatsApp" className="fixed bottom-[84px] right-4 z-[65] flex h-12 w-12 items-center justify-center rounded-full bg-lime text-ink shadow-lg transition hover:scale-105 md:bottom-6 md:right-6">↗</a></Providers></body></html>;
}