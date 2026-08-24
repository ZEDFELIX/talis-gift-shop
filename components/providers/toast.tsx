"use client";

import { createContext, useCallback, useContext, useState } from "react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { CheckIcon, XIcon } from "@/components/icons";

type Toast = { id: number; message: string; tone: "success" | "error" };

const ToastContext = createContext<{ push: (message: string, tone?: "success" | "error") => void } | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const push = useCallback((message: string, tone: "success" | "error" = "success") => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t.slice(-2), { id, message, tone }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  }, []);

  return (
    <ToastContext.Provider value={{ push }}>
      {children}
      <div aria-live="polite" className="pointer-events-none fixed bottom-24 left-1/2 z-[90] flex w-[min(92vw,26rem)] -translate-x-1/2 flex-col gap-2 md:bottom-8">
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className={cn(
              "animate-fadeUp pointer-events-auto flex items-center gap-3 rounded-sm px-4 py-3 text-sm shadow-lift",
              t.tone === "success" ? "bg-ink text-ivory" : "bg-espresso text-champagne border border-gold/40"
            )}
          >
            <span className={cn("shrink-0", t.tone === "success" ? "text-gold" : "text-champagne")}>
              {t.tone === "success" ? <CheckIcon width={16} height={16} /> : <XIcon width={16} height={16} />}
            </span>
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) return { push: () => {} };
  return ctx;
}
