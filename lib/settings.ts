import { db } from "@/lib/db";
import { parseJson } from "@/lib/utils";

export type SiteSettings = {
  announcement: string;
  heroTitle: string;
  heroSub: string;
  heroDesc: string;
  whatsapp: string;
  phone: string;
  email: string;
  address: string;
  hours: string;
  instagramHandle: string;
  instagramImages: string[];
  freeDeliveryThreshold: number;
  mpesaPaybill: string;
  giftBoxFees: {
    small: number; medium: number; large: number; premium: number;
    wrapping: number; ribbon: number;
    maxItems: Record<string, number>;
  };
  faqs: { q: string; a: string }[];
  testimonials: { quote: string; name: string; location: string }[];
};

export const DEFAULT_SETTINGS: SiteSettings = {
  announcement: "Free Nairobi delivery on orders over KSh 10,000",
  heroTitle: "Beyond the Feeling",
  heroSub: "Thoughtful gifts for the moments that matter.",
  heroDesc: "Discover beautifully curated gifts designed to make every moment unforgettable.",
  whatsapp: "254712345678",
  phone: "+254 712 345 678",
  email: "hello@talisgiftshop.co.ke",
  address: "The Alchemist, Westlands, Nairobi, Kenya",
  hours: "Mon – Sat: 9:00am – 7:00pm",
  instagramHandle: "@talisgiftshop",
  instagramImages: [
    "/images/box.svg", "/images/flowers.svg", "/images/candle.svg",
    "/images/jewelry.svg", "/images/selfcare.svg", "/images/mug.svg"
  ],
  freeDeliveryThreshold: 10000,
  mpesaPaybill: "Till 123456",
  giftBoxFees: {
    small: 300, medium: 500, large: 800, premium: 1200,
    wrapping: 250, ribbon: 150,
    maxItems: { small: 2, medium: 3, large: 4, premium: 6 }
  },
  faqs: [
    { q: "How do I order?", a: "Browse the shop or build a custom gift box, add your favourites to cart and check out. It takes less than two minutes." },
    { q: "How long does delivery take?", a: "Nairobi orders placed before 12pm are delivered within 24 hours. Up-country orders arrive within 2–3 working days." },
    { q: "Do you offer same-day delivery?", a: "Yes, within Nairobi for orders confirmed before 12pm. A same-day fee may apply depending on your zone." },
    { q: "Can I personalize a gift?", a: "Absolutely. Many products can be engraved, printed or embroidered with a name, date or message. Look for the 'Personalizable' mark." },
    { q: "Can I add a message?", a: "Every order includes a complimentary handwritten Talis card. Add your message at cart or checkout." },
    { q: "What payment methods do you accept?", a: "M-PESA is our primary method. Card payments are coming soon. All payments are verified before dispatch." },
    { q: "Do you deliver outside Nairobi?", a: "Yes, countrywide via our courier partners. Delivery fees are shown at checkout by zone." },
    { q: "Can I cancel my order?", a: "Orders can be cancelled while still awaiting payment or before packaging begins. Contact us on WhatsApp and we'll help." },
    { q: "What happens if an item is unavailable?", a: "We'll reach out immediately and offer an equally beautiful substitute, or a full refund — your choice." }
  ],
  testimonials: [
    { quote: "The box arrived wrapped like poetry. My sister cried before she even opened it.", name: "Wanjiru K.", location: "Nairobi" },
    { quote: "Ordered at 10am, delivered by lunchtime. The handwritten card made it unforgettable.", name: "Brian O.", location: "Kilimani" },
    { quote: "Talis turned a simple thank you into something she'll remember forever.", name: "Amina S.", location: "Karen" }
  ]
};

export async function getSettings(): Promise<SiteSettings> {
  const rows = await db.setting.findMany();
  const map = Object.fromEntries(rows.map((r) => [r.key, r.value]));
  return {
    ...DEFAULT_SETTINGS,
    ...map,
    freeDeliveryThreshold: Number(map.freeDeliveryThreshold ?? DEFAULT_SETTINGS.freeDeliveryThreshold),
    instagramImages: parseJson(map.instagramImages, DEFAULT_SETTINGS.instagramImages),
    giftBoxFees: parseJson(map.giftBoxFees, DEFAULT_SETTINGS.giftBoxFees),
    faqs: parseJson(map.faqs, DEFAULT_SETTINGS.faqs),
    testimonials: parseJson(map.testimonials, DEFAULT_SETTINGS.testimonials)
  } as SiteSettings;
}
