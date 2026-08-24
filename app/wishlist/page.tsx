import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui";
import { WishlistView } from "@/components/wishlist/wishlist-view";

export const metadata: Metadata = { title: "Your Wishlist" };

export default function WishlistPage() {
  return (
    <div className="container-talis py-12 md:py-16">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Wishlist" }]} />
      <header className="mx-auto mb-10 max-w-xl text-center">
        <p className="eyebrow mb-3">For future moments</p>
        <h1 className="h-serif text-3xl text-ink sm:text-4xl">YOUR WISHLIST</h1>
      </header>
      <WishlistView />
    </div>
  );
}
