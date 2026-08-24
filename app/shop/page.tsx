import type { Metadata } from "next";
import { CatalogPage } from "@/components/shop/catalog";

export const metadata: Metadata = {
  title: "Shop All Gifts",
  description: "Browse the full Talis collection — curated gift boxes, candles, flowers, jewelry and personalized treasures. Delivered across Nairobi & Kenya."
};

export default function ShopPage({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
  return (
    <CatalogPage
      searchParams={searchParams}
      preset={{
        basePath: "/shop",
        eyebrow: "The Collection",
        title: "SHOP GIFTS",
        script: "find the feeling",
        sub: "Every piece is chosen to carry a feeling — love, gratitude, celebration or simply 'thinking of you'."
      }}
    />
  );
}
