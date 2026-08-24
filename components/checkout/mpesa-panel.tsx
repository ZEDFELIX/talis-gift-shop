"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { initiateMpesaPayment, pollMpesaPayment } from "@/actions/shop";
import { Button } from "@/components/ui";

export function MpesaPanel({ orderNumber, total }: { orderNumber: string; total: number }) {
  const [state, setState] = useState<{ msg: string; ok: boolean } | null>(null);
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopPolling = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => stopPolling, []);

  const startPolling = useCallback(() => {
    stopPolling();
    let elapsed = 0;
    timerRef.current = setInterval(async () => {
      elapsed += 3;
      try {
        const res = await pollMpesaPayment(orderNumber);
        if (res.status === "PAID") {
          stopPolling();
          setState({ msg: res.message ?? "Payment received! Your order is confirmed.", ok: true });
          router.refresh();
        } else if (res.status === "FAILED") {
          stopPolling();
          setState({ msg: res.message ?? "Payment failed. Tap below to try again.", ok: false });
        } else if (elapsed >= 90) {
          stopPolling();
          setState({ msg: "We haven't received a confirmation yet. If you entered your PIN, the payment will appear on your order shortly — you can also refresh this page.", ok: true });
        }
      } catch {
        if (elapsed >= 90) {
          stopPolling();
          setState({ msg: "Confirmation is taking longer than expected. Please refresh this page in a moment.", ok: true });
        }
      }
    }, 3000);
  }, [orderNumber, router]);

  const trigger = async () => {
    setBusy(true);
    setState(null);
    const res = await initiateMpesaPayment(orderNumber);
    setState({ msg: res.message, ok: res.ok });
    setBusy(false);
    if (res.ok) startPolling();
  };

  return (
    <div className="mt-6 border border-gold/50 bg-champagne/10 p-5">
      <p className="font-serif text-lg text-ink">Complete payment via M-PESA</p>
      <p className="mt-1 text-sm leading-relaxed text-espresso/70">
        Your order is reserved. Pay <strong>KSh {total.toLocaleString("en-KE")}</strong> to start packing — we dispatch as soon as payment verifies.
      </p>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button variant="gold" onClick={trigger} disabled={busy}>
          {busy ? "Sending…" : state?.ok ? "Resend M-PESA Prompt" : "Send M-PESA Prompt"}
        </Button>
        <span className="text-xs text-espresso/55">You&apos;ll receive a prompt on your phone — enter your M-PESA PIN.</span>
      </div>
      {state?.ok && !busy && (
        <p role="status" aria-live="polite" className="mt-3 border border-gold/40 bg-white p-3 text-sm leading-relaxed text-espresso/80">
          <span className="mr-2 inline-block h-2 w-2 animate-pulse rounded-full bg-gold align-middle" aria-hidden="true"></span>
          {state.msg}
        </p>
      )}
      {state && !state.ok && (
        <p role="alert" className="mt-3 border border-red-300 bg-red-50 p-3 text-sm leading-relaxed text-red-800">{state.msg}</p>
      )}
    </div>
  );
}
