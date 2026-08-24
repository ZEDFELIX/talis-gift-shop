"use client";

import { CheckIcon } from "@/components/icons";
import { STATUS_LABELS, TIMELINE_STEPS } from "@/types";
import { cn, formatDateTime } from "@/lib/utils";

export function OrderTimeline({ events, currentStatus }: {
  events: { status: string; note: string | null; createdAt: string }[];
  currentStatus: string;
}) {
  const cancelled = currentStatus === "CANCELLED" || currentStatus === "REFUNDED";
  const doneSet = new Set(events.map((e) => e.status));
  const currentIndex = TIMELINE_STEPS.indexOf(currentStatus as (typeof TIMELINE_STEPS)[number]);

  if (cancelled) {
    const cancelEvent = events.find((e) => e.status === currentStatus) ?? events[events.length - 1];
    return (
      <div className="border border-red-200 bg-red-50/60 p-5">
        <p className="font-serif text-lg text-red-800">{STATUS_LABELS[currentStatus]}</p>
        {cancelEvent && <p className="mt-1 text-sm text-espresso/65">{cancelEvent.note}</p>}
        <p className="mt-1 text-xs text-espresso/45">{formatDateTime(cancelEvent?.createdAt)}</p>
        <ul className="mt-4 space-y-2 border-t border-red-200 pt-4">
          {events.filter((e) => e.status !== "CANCELLED" && e.status !== "REFUNDED").map((e) => (
            <li key={e.status} className="flex justify-between gap-3 text-xs text-espresso/60">
              <span>{STATUS_LABELS[e.status] ?? e.status}</span>
              <span>{formatDateTime(e.createdAt)}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <ol aria-label="Order timeline" className="relative space-y-0">
      {TIMELINE_STEPS.map((status, i) => {
        const event = events.find((e) => e.status === status);
        const reached = doneSet.has(status) || (currentIndex >= 0 && i <= currentIndex);
        const isCurrent = status === currentStatus;
        const isLast = i === TIMELINE_STEPS.length - 1;
        return (
          <li key={status} className="relative flex gap-4 pb-8 last:pb-0">
            {!isLast && (
              <span
                aria-hidden
                className={cn("absolute left-[13px] top-7 h-full w-px", reached ? "bg-gold" : "bg-beige")}
              />
            )}
            <span
              aria-hidden
              className={cn(
                "z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-all",
                reached ? "border-gold bg-gold text-ink" : "border-beige bg-white",
                isCurrent && "ring-4 ring-gold/20"
              )}
            >
              {reached ? <CheckIcon width={14} height={14} /> : <span className="h-1.5 w-1.5 rounded-full bg-beige" />}
            </span>
            <div className="min-w-0 flex-1 pt-0.5">
              <p className={cn("text-sm font-semibold uppercase tracking-[0.12em]", reached ? "text-espresso" : "text-espresso/40")}>
                {STATUS_LABELS[status]}
                {isCurrent && <span className="ml-2 rounded-full bg-gold px-2 py-0.5 text-[9px] tracking-[0.16em] text-ink">Current</span>}
              </p>
              {event?.note && <p className="mt-0.5 text-sm text-espresso/60">{event.note}</p>}
              {event ? (
                <p className="mt-0.5 text-xs text-espresso/40">{formatDateTime(event.createdAt)}</p>
              ) : (
                <p className="mt-0.5 text-xs text-espresso/30">Pending</p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
