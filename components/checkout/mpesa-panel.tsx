"use client";

import { useState } from "react";
import { initiateMpesaPayment } from "@/actions/shop";
import { Button } from "@/components/ui";

export function MpesaPanel({ orderNumber, total }: { orderNumber: string; total: number }) {
  const [state, setState] = useState<{ msg: string; ok: boolean } | null>(null);
  const [busy, setBusy] = useState(false);

  const trigger = async () => {
    setBusy(true);
    const res = await initiateMpesaPayment(orderNumber);
    setState({ msg: res.message, ok: res.ok });
    setBusy(false);
  };

  return (
    <div className="mt-6 border border-gold/50 bg-champagne/10 p-5">
      <p className="font-serif text-lg text-ink">Complete payment via M-PESA</p>
      <p className="mt-1 text-sm leading-relaxed text-espresso/70">
        Your order is reserved. Pay <strong>KSh {total.toLocaleString("en-KE")}</strong> to start packing — we dispatch as soon as payment verifies.
      </p>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button variant="gold" onClick={trigger} disabled={busy}>
          {busy ? "Sending…" : "Send M-PESA Prompt"}
        </Button>
        <span className="text-xs text-espresso/55">Or pay manually using the details shown after tapping.</span>
      </div>
      {state && (
        <p role="status" className="mt-3 border border-gold/40 bg-white p-3 text-sm leading-relaxed text-espresso/80">{state.msg}</p>
      )}
    </div>
  );
}
