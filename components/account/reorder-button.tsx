"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/providers/cart";
import { useToast } from "@/components/providers/toast";
import { getOrderForReorder } from "@/actions/shop";
import { Button, Spinner } from "@/components/ui";

export function ReorderButton({ orderNumber }: { orderNumber: string }) {
  const cart = useCart();
  const toast = useToast();
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  return (
    <Button
      variant="gold"
      disabled={busy}
      onClick={async () => {
        setBusy(true);
        const res = await getOrderForReorder(orderNumber);
        setBusy(false);
        if (!res.ok) {
          toast.push(res.error, "error");
          return;
        }
        let added = 0;
        for (const item of res.items) {
          cart.add({
            type: "product",
            productId: item.slug,
            slug: item.slug,
            name: item.name,
            image: item.image,
            price: item.price,
            qty: item.qty,
            stock: item.stock
          });
          added += 1;
        }
        if (added > 0) {
          cart.setDrawerOpen(false);
          router.push("/cart");
        } else {
          toast.push("Those gifts are no longer available", "error");
        }
      }}
    >
      {busy ? <><Spinner /> Adding…</> : "Reorder"}
    </Button>
  );
}
