import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui";
import { CartView, GiftMessageCard } from "@/components/cart/cart-view";
import { getSettings } from "@/lib/settings";

export const metadata: Metadata = { title: "Your Cart" };

export default async function CartPage() {
  const settings = await getSettings();
  return (
    <div className="container-talis py-10 md:py-14">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Cart" }]} />
      <h1 className="h-serif mb-10 text-center text-3xl text-ink sm:text-4xl">YOUR CART</h1>
      <CartView freeThreshold={settings.freeDeliveryThreshold} />
      <GiftMessageCard />
    </div>
  );
}
