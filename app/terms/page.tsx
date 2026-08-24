import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of service for shopping with Talis Gift Shop."
};

const sections = [
  { title: "Orders", body: "All orders are subject to acceptance and availability. We reserve stock when your order is placed; where an item becomes unavailable after ordering, we'll contact you promptly with an equally beautiful substitute or a full refund." },
  { title: "Pricing & payment", body: "Prices are shown in Kenyan Shillings (KSh) and include applicable taxes. Order totals are calculated server-side and confirmed before payment. We accept M-PESA (primary) and cash on delivery within Nairobi. An order is dispatched only after payment is verified." },
  { title: "Delivery", body: "Estimated delivery windows are provided at checkout and on each zone. While we work with reliable courier partners, timings may vary during high-demand seasons. Risk passes to the recipient on delivery." },
  { title: "Personalization", body: "Personalized items are produced exactly as specified at checkout. Please double-check spellings and dates — personalized goods cannot be returned unless faulty." },
  { title: "Cancellation", body: "Orders may be cancelled while awaiting payment or before packaging begins. Once an order is out for delivery it can no longer be cancelled, though we'll always try to help — contact us as early as possible." },
  { title: "Discount codes", body: "One discount code applies per order. Codes cannot be exchanged for cash and may carry minimum spend, expiry dates or usage limits shown alongside each promotion." },
  { title: "Intellectual property", body: "The Talis name, logo, photography and site design belong to Talis Gift Shop. You may share and link freely — please don't reuse our content commercially without permission." },
  { title: "Governing law", body: "These terms are governed by the laws of Kenya. Disputes will first be addressed through good-faith conversation — reach us at hello@talisgiftshop.co.ke." }
];

export default function TermsPage() {
  return (
    <div className="container-talis max-w-3xl py-12 md:py-16">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Terms of Service" }]} />
      <header className="mb-10">
        <p className="eyebrow mb-3">The fine print, kept human</p>
        <h1 className="h-serif text-3xl text-ink sm:text-4xl">TERMS OF SERVICE</h1>
        <p className="mt-2 text-xs text-espresso/45">Last updated: January 2026</p>
      </header>
      <div className="space-y-8 text-sm leading-relaxed text-espresso/75">
        {sections.map((s) => (
          <section key={s.title}>
            <h2 className="mb-2 font-serif text-xl text-ink">{s.title}</h2>
            <p>{s.body}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
