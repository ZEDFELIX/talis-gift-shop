import type { Metadata } from "next";
import { Suspense } from "react";
import { Breadcrumbs } from "@/components/ui";
import { TrackView } from "@/components/track/track-view";

export const metadata: Metadata = {
  title: "Track Your Order",
  description: "Follow your Talis gift from our hands to theirs."
};

export default function TrackOrderPage() {
  return (
    <div className="container-talis py-12 md:py-16">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Track Order" }]} />
      <header className="mx-auto mb-10 max-w-xl text-center">
        <p className="eyebrow mb-3">Where&apos;s my feeling?</p>
        <h1 className="h-serif text-3xl text-ink sm:text-4xl">TRACK YOUR ORDER</h1>
        <p className="mt-3 text-sm leading-relaxed text-espresso/65">
          Enter your order number with the phone number or email you ordered with.
        </p>
      </header>
      <Suspense fallback={<div className="mx-auto h-48 max-w-2xl animate-pulse bg-white/50" />}>
        <TrackView />
      </Suspense>
      <p className="mx-auto mt-8 max-w-md text-center text-xs leading-relaxed text-espresso/50">
        Tip: your order number looks like <strong>TG-A1B2C3</strong> and appears in your confirmation email.
        Try the demo order <strong>TG-DEMO001</strong> with <strong>sarah@example.com</strong>.
      </p>
    </div>
  );
}
