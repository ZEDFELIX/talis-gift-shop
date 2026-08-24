"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { validateDiscountCode } from "@/actions/shop";
import type { CartLine, SavedLine } from "@/types";

type DiscountPreview = { code: string; label: string; amountOff: number };

type CartState = {
  items: CartLine[];
  saved: SavedLine[];
  giftNote: string;
  discountCode: string;
  discount: DiscountPreview | null;
};

type CartContextValue = CartState & {
  mounted: boolean;
  drawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
  count: number;
  subtotal: number;
  add: (line: Omit<CartLine, "key"> & { key?: string }) => void;
  remove: (key: string) => void;
  setQty: (key: string, qty: number) => void;
  saveForLater: (key: string) => void;
  moveToCart: (key: string) => void;
  removeSaved: (key: string) => void;
  setGiftNote: (note: string) => void;
  applyDiscount: (code: string) => Promise<{ ok: boolean; message: string }>;
  clearDiscount: () => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "talis_cart_v1";

function load(): CartState {
  if (typeof window === "undefined") return { items: [], saved: [], giftNote: "", discountCode: "", discount: null };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) throw new Error("empty");
    const parsed = JSON.parse(raw) as Partial<CartState>;
    return {
      items: Array.isArray(parsed.items) ? parsed.items : [],
      saved: Array.isArray(parsed.saved) ? parsed.saved : [],
      giftNote: typeof parsed.giftNote === "string" ? parsed.giftNote : "",
      discountCode: typeof parsed.discountCode === "string" ? parsed.discountCode : "",
      discount: null
    };
  } catch {
    return { items: [], saved: [], giftNote: "", discountCode: "", discount: null };
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CartState>({ items: [], saved: [], giftNote: "", discountCode: "", discount: null });
  const [mounted, setMounted] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    setState(load());
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state, mounted]);

  const refreshDiscount = useCallback(async (code: string, subtotal: number) => {
    if (!code) return null;
    const res = await validateDiscountCode(code, subtotal);
    if (res.ok && res.amountOff > 0) return { code: res.code!, label: res.label!, amountOff: res.amountOff };
    return null;
  }, []);

  const subtotal = useMemo(() => state.items.reduce((sum, l) => sum + l.price * l.qty, 0), [state.items]);
  const count = useMemo(() => state.items.reduce((sum, l) => sum + l.qty, 0), [state.items]);

  useEffect(() => {
    if (!mounted || !state.discountCode || subtotal <= 0) return;
    let cancelled = false;
    refreshDiscount(state.discountCode, subtotal).then((d) => {
      if (!cancelled && d !== null) setState((s) => ({ ...s, discount: d }));
    });
    return () => { cancelled = true; };
  }, [mounted, state.discountCode, subtotal, refreshDiscount]);

  const add: CartContextValue["add"] = useCallback((line) => {
    const key = line.key ?? `${line.type}-${line.productId ?? line.giftBoxId}-${JSON.stringify(line.variant ?? "")}-${JSON.stringify(line.personalization ?? {})}`;
    setState((s) => {
      const existing = s.items.find((l) => l.key === key);
      if (existing) {
        return {
          ...s,
          items: s.items.map((l) =>
            l.key === key ? { ...l, qty: Math.min(l.qty + line.qty, Math.max(1, line.stock)) } : l
          )
        };
      }
      return { ...s, items: [...s.items, { ...line, key }] };
    });
    setDrawerOpen(true);
  }, []);

  const remove = useCallback((key: string) => {
    setState((s) => ({ ...s, items: s.items.filter((l) => l.key !== key) }));
  }, []);

  const setQty = useCallback((key: string, qty: number) => {
    setState((s) => ({
      ...s,
      items: s.items.map((l) => (l.key === key ? { ...l, qty: Math.max(1, Math.min(qty, Math.max(1, l.stock))) } : l))
    }));
  }, []);

  const saveForLater = useCallback((key: string) => {
    setState((s) => {
      const line = s.items.find((l) => l.key === key);
      if (!line) return s;
      return {
        ...s,
        items: s.items.filter((l) => l.key !== key),
        saved: [...s.saved.filter((l) => l.key !== key), { ...line, savedAt: Date.now() }]
      };
    });
  }, []);

  const moveToCart = useCallback((key: string) => {
    setState((s) => {
      const line = s.saved.find((l) => l.key === key);
      if (!line) return s;
      const { savedAt: _savedAt, ...rest } = line;
      return { ...s, saved: s.saved.filter((l) => l.key !== key), items: [...s.items, rest] };
    });
  }, []);

  const removeSaved = useCallback((key: string) => {
    setState((s) => ({ ...s, saved: s.saved.filter((l) => l.key !== key) }));
  }, []);

  const setGiftNote = useCallback((giftNote: string) => setState((s) => ({ ...s, giftNote })), []);

  const applyDiscount = useCallback(
    async (code: string) => {
      if (!code.trim()) return { ok: false, message: "Enter a discount code." };
      const res = await validateDiscountCode(code.trim(), subtotal);
      if (!res.ok) return { ok: false, message: res.message! };
      setState((s) => ({ ...s, discountCode: code.trim().toUpperCase(), discount: { code: res.code!, label: res.label!, amountOff: res.amountOff } }));
      return { ok: true, message: res.label! };
    },
    [subtotal]
  );

  const clearDiscount = useCallback(() => {
    setState((s) => ({ ...s, discountCode: "", discount: null }));
  }, []);

  const clear = useCallback(() => {
    setState({ items: [], saved: [], giftNote: "", discountCode: "", discount: null });
  }, []);

  const value: CartContextValue = {
    ...state,
    mounted,
    drawerOpen,
    setDrawerOpen,
    count,
    subtotal,
    add,
    remove,
    setQty,
    saveForLater,
    moveToCart,
    removeSaved,
    setGiftNote,
    applyDiscount,
    clearDiscount,
    clear
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
