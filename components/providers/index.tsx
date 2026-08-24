"use client";

import type { ReactNode } from "react";
import { CartProvider } from "@/components/providers/cart";
import { WishlistProvider } from "@/components/providers/wishlist";
import { ToastProvider } from "@/components/providers/toast";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <WishlistProvider>
        <CartProvider>{children}</CartProvider>
      </WishlistProvider>
    </ToastProvider>
  );
}
