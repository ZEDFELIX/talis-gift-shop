import type { Metadata } from "next";
import { CatalogPage } from "@/components/shop/catalog";

export const metadata: Metadata = {
  title: "New Arrivals",
  description: "Fresh gifts, beautifully chosen — the newest additions to the Talis collection."
};

export default function NewArrivalsPage({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
  void searchParams;
  return (
    <CatalogPage
      searchParams={{}}
      preset={{
        basePath: "/new-arrivals",
        overrides: { newOnly: true },
        eyebrow: "Just landed",
        title: "NEW ARRIVALS",
        sub: "Fresh gifts, beautifully chosen."
      }}
    />
  );
}
