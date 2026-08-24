import type { Metadata } from "next";
import { getSessionUser } from "@/lib/auth";
import { CheckoutView } from "@/components/checkout/checkout-view";
import { Breadcrumbs } from "@/components/ui";

export const metadata: Metadata = { title: "Checkout" };
export const dynamic = "force-dynamic";

export default async function CheckoutPage() {
  const user = await getSessionUser();

  return (
    <div className="container-talis py-10 md:py-14">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Cart", href: "/cart" }, { label: "Checkout" }]} />
      <h1 className="h-serif mb-10 text-center text-3xl text-ink sm:text-4xl">CHECKOUT</h1>
      <CheckoutView
        defaultName={user?.name}
        defaultEmail={user?.email}
        defaultPhone={user?.phone ?? undefined}
      />
    </div>
  );
}
