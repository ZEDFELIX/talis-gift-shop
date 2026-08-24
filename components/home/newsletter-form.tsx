"use client";

import { useState } from "react";
import { subscribeNewsletter } from "@/actions/misc";
import { cn } from "@/lib/utils";
import { ArrowRightIcon } from "@/components/icons";

export function NewsletterForm({ compact }: { compact?: boolean }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<{ ok: boolean; msg: string } | null>(null);
  const [busy, setBusy] = useState(false);

  return (
    <form
      className={cn("w-full", compact ? "max-w-md" : "mx-auto max-w-lg")}
      onSubmit={async (e) => {
        e.preventDefault();
        setBusy(true);
        const res = await subscribeNewsletter(email);
        setState(res);
        setBusy(false);
        if (res.ok) setEmail("");
      }}
    >
      <div className="flex gap-0">
        <label htmlFor={compact ? "nl-compact" : "nl-full"} className="sr-only">Email address</label>
        <input
          id={compact ? "nl-compact" : "nl-full"}
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email address"
          className="w-full border border-white/20 bg-white/10 px-4 py-3 text-sm text-ivory placeholder:text-ivory/40 focus:border-gold focus:outline-none"
        />
        <button
          type="submit"
          disabled={busy}
          className="btn-base shrink-0 bg-gold px-5 text-ink hover:bg-champagne disabled:opacity-50"
        >
          Join Talis <ArrowRightIcon width={15} height={15} />
        </button>
      </div>
      {state && (
        <p role="status" className={cn("mt-2 text-sm", state.ok ? "text-champagne" : "text-red-300")}>{state.msg}</p>
      )}
    </form>
  );
}
