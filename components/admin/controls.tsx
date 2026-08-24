"use client";

import type { ReactNode } from "react";

export function ConfirmSubmit({
  children,
  className,
  message = "Are you sure?"
}: {
  children: ReactNode;
  className?: string;
  message?: string;
}) {
  return (
    <button
      type="submit"
      className={className}
      onClick={(e) => {
        if (!window.confirm(message)) e.preventDefault();
      }}
    >
      {children}
    </button>
  );
}

export function StatusSelectForm({
  action,
  orderId,
  current,
  statuses
}: {
  action: (formData: FormData) => void;
  orderId: string;
  current: string;
  statuses: readonly string[];
}) {
  return (
    <form action={action} className="flex gap-2">
      <input type="hidden" name="orderId" value={orderId} />
      <select
        name="status"
        defaultValue={current}
        className="input-base flex-1 py-2 text-sm"
        aria-label="Order status"
      >
        {statuses.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>
      <button className="btn-base bg-ink px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-ivory hover:bg-gold hover:text-ink">
        Update
      </button>
    </form>
  );
}
