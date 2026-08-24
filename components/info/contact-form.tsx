"use client";

import { useState } from "react";
import { submitContactMessage } from "@/actions/misc";
import { Button, Field, Input, Textarea } from "@/components/ui";

export function ContactForm() {
  const [state, setState] = useState<{ ok: boolean; message: string } | null>(null);
  const [busy, setBusy] = useState(false);

  if (state?.ok) {
    return (
      <div className="flex flex-col items-center gap-3 py-10 text-center animate-fadeUp">
        <span aria-hidden className="font-script text-4xl text-gold">Asante sana</span>
        <p className="max-w-sm text-sm leading-relaxed text-espresso/70">{state.message}</p>
        <button onClick={() => setState(null)} className="btn-base mt-2 border border-espresso px-6 py-3 hover:bg-ink hover:text-ivory">
          Send another
        </button>
      </div>
    );
  }

  return (
    <form
      className="grid gap-4 sm:grid-cols-2"
      onSubmit={async (e) => {
        e.preventDefault();
        setBusy(true);
        const res = await submitContactMessage(null, new FormData(e.currentTarget));
        setState(res);
        setBusy(false);
      }}
    >
      {state && !state.ok && <p role="alert" className="border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 sm:col-span-2">{state.message}</p>}
      <Field label="Your name" required>
        <Input name="name" required minLength={2} autoComplete="name" />
      </Field>
      <Field label="Email" required>
        <Input name="email" type="email" required autoComplete="email" />
      </Field>
      <Field label="Phone">
        <Input name="phone" type="tel" placeholder="07XX XXX XXX" />
      </Field>
      <Field label="Subject">
        <Input name="subject" placeholder="Order help, corporate gifts…" />
      </Field>
      <Field label="Message" required className="sm:col-span-2">
        <Textarea name="message" required minLength={10} maxLength={1200} rows={5} placeholder="Tell us everything — we read every word." />
      </Field>
      <div className="sm:col-span-2">
        <Button type="submit" variant="primary" size="lg" disabled={busy} className="w-full sm:w-auto">
          {busy ? "Sending…" : "Send Message"}
        </Button>
        <p className="mt-3 text-xs text-espresso/45">We reply within one business day — usually much faster on WhatsApp.</p>
      </div>
    </form>
  );
}
