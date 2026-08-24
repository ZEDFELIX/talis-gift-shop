import type { Metadata } from "next";
import { db } from "@/lib/db";
import { getSettings } from "@/lib/settings";
import { GiftBoxBuilder } from "@/components/build/builder";
import { Breadcrumbs } from "@/components/ui";

export const metadata: Metadata = {
  title: "Build Your Gift Box",
  description: "Compose a one-of-a-kind Talis gift box — choose the size, hand-pick every treasure, add a ribbon and a handwritten message."
};

export default async function BuildYourGiftPage() {
  const [products, settings, occasions] = await Promise.all([
    db.product.findMany({
      where: { active: true },
      orderBy: [{ bestSeller: "desc" }],
      take: 24,
      include: { category: true, images: { orderBy: { sort: "asc" }, take: 1 }, inventory: true }
    }),
    getSettings(),
    db.occasion.findMany({ orderBy: { name: "asc" } })
  ]);

  return (
    <div className="container-talis py-10 md:py-14">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Build a Gift Box" }]} />
      <header className="mx-auto mb-12 max-w-xl text-center">
        <p className="eyebrow mb-3">The Talis Experience</p>
        <h1 className="h-serif text-3xl text-ink sm:text-4xl">BUILD YOUR GIFT BOX</h1>
        <p className="mt-2 font-script text-3xl text-gold">composed by you, packed by us</p>
        <p className="mt-3 text-sm leading-relaxed text-espresso/65">
          Four steps to a gift that could only come from you.
        </p>
      </header>

      <GiftBoxBuilder
        fees={settings.giftBoxFees}
        products={products.map((p) => ({
          slug: p.slug,
          name: p.name,
          price: p.price,
          image: p.images[0]?.url ?? "/images/box.svg",
          category: p.category.name,
          short: p.shortDesc,
          stock: p.inventory ? Math.max(0, p.inventory.quantity - p.inventory.reserved) : 0
        }))}
        occasions={occasions.map((o) => ({ slug: o.slug, name: o.name }))}
      />
    </div>
  );
}
