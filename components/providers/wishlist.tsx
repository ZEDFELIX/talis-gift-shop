"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { WishlistEntry } from "@/types";

type WishlistContextValue = {
  mounted: boolean;
  entries: WishlistEntry[];
  slugs: string[];
  has: (slug: string) => boolean;
  toggle: (entry: WishlistEntry) => boolean;
  remove: (slug: string) => void;
  clear: () => void;
};

const WishlistContext = createContext<WishlistContextValue | null>(null);
const STORAGE_KEY = "talis_wishlist_v1";

function load(): WishlistEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<WishlistEntry[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setEntries(load());
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }, [entries, mounted]);

  const toggle = useCallback((entry: WishlistEntry) => {
    let added = false;
    setEntries((list) => {
      if (list.some((e) => e.slug === entry.slug)) return list.filter((e) => e.slug !== entry.slug);
      added = true;
      return [...list, entry];
    });
    return !load().some((e) => e.slug === entry.slug) || added;
  }, []);

  const remove = useCallback((slug: string) => {
    setEntries((list) => list.filter((e) => e.slug !== slug));
  }, []);

  const value = useMemo<WishlistContextValue>(
    () => ({
      mounted,
      entries,
      slugs: entries.map((e) => e.slug),
      has: (slug: string) => entries.some((e) => e.slug === slug),
      toggle,
      remove,
      clear: () => setEntries([])
    }),
    [mounted, entries, toggle, remove]
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}
