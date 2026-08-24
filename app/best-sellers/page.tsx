import type { Metadata } from "next";
import { CatalogPage } from "@/components/shop/catalog";

export const metadata: Metadata = {
  title: "Best Sellers",
  description: "The gifts Nairobi loves most — Talis best sellers, loved for their feeling as much as their beauty."
};

export default function BestSellersPage({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
  void searchParams;
  return (
    <CatalogPage
      searchParams={{}}
      preset={{
        basePath: "/best-sellers",
        overrides: { bestSellersOnly: true },
        eyebrow: "Loved across Kenya",
        title: "BEST SELLERS",
        sub: "The gifts our customers keep coming back for."
      }}
    />
  );
}
