import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Talis Gift Shop collects, uses and protects your personal data under the Kenya Data Protection Act."
};

const sections = [
  {
    title: "What we collect",
    body: ["Name, phone number, email address and delivery address when you order.", "Order history and gift messages you choose to write.", "Wishlist items saved on your device or account.", "Anonymous usage analytics to improve the shop."]
  },
  {
    title: "How we use it",
    body: ["To process, pack and deliver your orders.", "To confirm payments with M-PESA and prevent fraud.", "To send order updates by SMS, WhatsApp or email.", "To share occasional beautiful things — only if you join the newsletter, and you can leave anytime."]
  },
  {
    title: "What we never do",
    body: ["We never sell your personal data.", "We never store M-PESA PINs — payments are handled entirely by Safaricom's secure systems.", "We never share recipient details beyond what couriers need to deliver."]
  },
  {
    title: "Your rights",
    body: ["Ask us for a copy of the data we hold about you.", "Ask us to correct or delete it — write to hello@talisgiftshop.co.ke.", "Unsubscribe from marketing at any time via any email footer."]
  },
  {
    title: "Data protection",
    body: ["This policy is written in line with the Kenya Data Protection Act, 2019.", "Data is stored securely with access limited to the Talis team.", "Payment card details (when card support launches) are processed by certified PCI-DSS providers and never touch our servers."]
  }
];

export default function PrivacyPage() {
  return (
    <div className="container-talis max-w-3xl py-12 md:py-16">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Privacy Policy" }]} />
      <header className="mb-10">
        <p className="eyebrow mb-3">Your data, respected</p>
        <h1 className="h-serif text-3xl text-ink sm:text-4xl">PRIVACY POLICY</h1>
        <p className="mt-2 text-xs text-espresso/45">Last updated: January 2026</p>
      </header>
      <div className="space-y-8 text-sm leading-relaxed text-espresso/75">
        {sections.map((s) => (
          <section key={s.title}>
            <h2 className="mb-2 font-serif text-xl text-ink">{s.title}</h2>
            <ul className="space-y-2">
              {s.body.map((t) => (
                <li key={t} className="flex items-start gap-2.5"><span aria-hidden className="mt-[7px] h-1.5 w-1.5 shrink-0 rotate-45 bg-gold" />{t}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
