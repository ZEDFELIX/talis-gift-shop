"use client";

import Link from "next/link";
import { useState } from "react";
import { loginUser, registerUser } from "@/actions/auth";
import { Button, Field, Input } from "@/components/ui";
import { Spinner } from "@/components/ui";

export function LoginForm({ next }: { next?: string }) {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  return (
    <form
      className="space-y-4"
      onSubmit={async (e) => {
        e.preventDefault();
        if (busy) return;
        setBusy(true);
        setError("");
        const fd = new FormData(e.currentTarget);
        fd.set("next", next ?? "/account");
        const res = await loginUser(null, fd);
        setBusy(false);
        if (res && !res.ok) setError(res.message ?? "Could not sign you in.");
      }}
    >
      {error && <p role="alert" className="border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">{error}</p>}
      <Field label="Email" required>
        <Input name="email" type="email" required autoComplete="email" />
      </Field>
      <Field label="Password" required>
        <Input name="password" type="password" required autoComplete="current-password" />
      </Field>
      <Button type="submit" variant="primary" size="lg" className="w-full" disabled={busy}>
        {busy ? <><Spinner /> Signing in…</> : "Sign In"}
      </Button>
      <p className="text-center text-sm text-espresso/60">
        New to Talis?{" "}
        <Link href={next ? `/account/register?next=${encodeURIComponent(next)}` : "/account/register"} className="font-semibold text-gold underline underline-offset-4">
          Create an account
        </Link>
      </p>
    </form>
  );
}

export function RegisterForm({ next }: { next?: string }) {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  return (
    <form
      className="space-y-4"
      onSubmit={async (e) => {
        e.preventDefault();
        if (busy) return;
        setBusy(true);
        setError("");
        const fd = new FormData(e.currentTarget);
        fd.set("next", next ?? "/account");
        const res = await registerUser(null, fd);
        setBusy(false);
        if (res && !res.ok) setError(res.message ?? "Could not create your account.");
      }}
    >
      {error && <p role="alert" className="border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">{error}</p>}
      <Field label="Full name" required>
        <Input name="name" required minLength={2} autoComplete="name" />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Email" required>
          <Input name="email" type="email" required autoComplete="email" />
        </Field>
        <Field label="Phone">
          <Input name="phone" type="tel" placeholder="07XX XXX XXX" autoComplete="tel" />
        </Field>
      </div>
      <Field label="Password" required hint="At least 8 characters">
        <Input name="password" type="password" required minLength={8} autoComplete="new-password" />
      </Field>
      <Button type="submit" variant="primary" size="lg" className="w-full" disabled={busy}>
        {busy ? <><Spinner /> Creating account…</> : "Create Account"}
      </Button>
      <p className="text-center text-sm text-espresso/60">
        Already have an account?{" "}
        <Link href={next ? `/account/login?next=${encodeURIComponent(next)}` : "/account/login"} className="font-semibold text-gold underline underline-offset-4">
          Sign in
        </Link>
      </p>
    </form>
  );
}
