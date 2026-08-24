import type { Metadata } from "next";
import { CatalogPage } from "@/components/shop/catalog";

export const metadata: Metadata = {
  title: "Personalized Gifts",
  description: "Names engraved, dates etched, messages printed — personalized gifts made in Nairobi and delivered across Kenya."
};

export default function PersonalizedPage() {
  return (
    <CatalogPage
      searchParams={{}}
      preset={{
        basePath: "/personalized",
        overrides: { personalizableOnly: true },
        eyebrow: "Talis Personal",
        title: "PERSONALIZED GIFTS",
        script: "make it personal"
      }}
    />
  );
}
