"use client";

import { useState } from "react";
import { submitReview } from "@/actions/misc";
import { Stars } from "@/components/ui";
import { cn, formatDate } from "@/lib/utils";

type Review = {
  id: string; name: string; rating: number; title: string | null;
  body: string; createdAt: string; verified?: boolean;
};

export function InfoTabs({ description, included, personalizable }: {
  description: string;
  included: string;
  personalizable: boolean;
}) {
  const [open, setOpen] = useState<string>("description");
  const tabs = [
    { id: "description", label: "Description", content: <Paragraphs text={description} /> },
    ...(included
      ? [{ id: "included", label: "What's Included", content: <ListBlock text={included} /> }]
      : []),
    ...(personalizable
      ? [{
          id: "personalization",
          label: "Personalization",
          content: (
            <div className="space-y-2 text-sm leading-relaxed text-espresso/75">
              <p>Add names, dates or a message using the personalization fields above the Add to Cart button.</p>
              <p>Our team reviews every request and confirms details via WhatsApp or email before dispatch. Personalization adds no extra delivery time within Nairobi.</p>
            </div>
          )
        }]
      : []),
    {
      id: "delivery",
      label: "Delivery",
      content: (
        <div className="space-y-3 text-sm leading-relaxed text-espresso/75">
          <p className="font-semibold text-ink">Free delivery, countrywide.</p>
          <p>Nairobi orders confirmed before 12pm qualify for same-day or next-day delivery. Up-country arrives in 2–3 working days via courier — at no extra cost.</p>
        </div>
      )
    },
    {
      id: "returns",
      label: "Returns",
      content: (
        <div className="space-y-2 text-sm leading-relaxed text-espresso/75">
          <p>Perishables (flowers, fresh treats) and personalized items are final sale.</p>
          <p>For everything else, report any issue within 48 hours of delivery and we&apos;ll make it right with a replacement or refund.</p>
          <a href="/returns" className="inline-block font-semibold uppercase tracking-[0.14em] text-gold underline underline-offset-4">Read full policy</a>
        </div>
      )
    }
  ];

  return (
    <section aria-label="Product information" className="mt-14 border-t border-beige pt-8">
      <div role="tablist" aria-label="Product info tabs" className="no-scrollbar flex gap-6 overflow-x-auto border-b border-beige">
        {tabs.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={open === t.id}
            onClick={() => setOpen(t.id)}
            className={cn(
              "-mb-px whitespace-nowrap border-b-2 px-1 pb-3 pt-1 text-[12px] font-semibold uppercase tracking-[0.16em] transition-colors",
              open === t.id ? "border-gold text-gold" : "border-transparent text-espresso/55 hover:text-espresso"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>
      {tabs.map((t) => (
        <div key={t.id} role="tabpanel" hidden={open !== t.id} className="py-7">
          {t.content}
        </div>
      ))}
    </section>
  );
}

function Paragraphs({ text }: { text: string }) {
  return (
    <div className="max-w-3xl space-y-4 text-sm leading-relaxed text-espresso/75">
      {text.split("\n").filter(Boolean).map((p, i) => <p key={i}>{p}</p>)}
    </div>
  );
}

function ListBlock({ text }: { text: string }) {
  return (
    <ul className="grid max-w-xl gap-2 text-sm text-espresso/80 sm:grid-cols-2">
      {text.split("\n").filter(Boolean).map((item, i) => (
        <li key={i} className="flex items-start gap-2.5">
          <span aria-hidden className="mt-[7px] h-1.5 w-1.5 shrink-0 rotate-45 bg-gold" />
          {item}
        </li>
      ))}
    </ul>
  );
}

export function ReviewsSection({ productSlug, reviews, rating }: { productSlug: string; reviews: Review[]; rating: number | null }) {
  const [showForm, setShowForm] = useState(false);
  const [stars, setStars] = useState(5);
  const [state, setState] = useState<{ ok?: boolean; msg?: string }>({});

  const dist = useMemoDist(reviews);

  return (
    <section id="reviews" aria-label="Customer reviews" className="mt-16 scroll-mt-24 border-t border-beige pt-10">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <h2 className="font-serif text-2xl text-ink">Reviews</h2>
          {rating !== null && (
            <div className="mt-2 flex items-center gap-3">
              <span className="font-serif text-4xl font-semibold">{rating.toFixed(1)}</span>
              <div>
                <Stars rating={rating} size={17} />
                <p className="text-xs text-espresso/55">{reviews.length} verified review{reviews.length === 1 ? "" : "s"}</p>
              </div>
            </div>
          )}
        </div>
        {!showForm && (
          <button onClick={() => setShowForm(true)} className="btn-base border border-espresso px-6 py-3 hover:bg-ink hover:text-ivory">
            Write a Review
          </button>
        )}
      </div>

      {reviews.length > 0 && (
        <div className="mt-6 flex max-w-xs gap-1" aria-hidden>
          {[5, 4, 3, 2, 1].map((n) => (
            <div key={n} className="h-1.5 flex-1 rounded-full bg-beige/60">
              <div className="h-full rounded-full bg-gold" style={{ width: `${dist[n] ?? 0}%` }} />
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <form
          className="mt-8 max-w-lg space-y-4 border border-beige bg-white p-6"
          action={async (fd: FormData) => {
            const res = await submitReview(fd);
            setState(res.ok ? { ok: true, msg: res.message } : { ok: false, msg: res.message });
            if (res.ok) setShowForm(false);
          }}
        >
          <input type="hidden" name="productSlug" value={productSlug} />
          <input type="hidden" name="rating" value={stars} />
          <fieldset>
            <legend className="mb-2 text-[12px] font-semibold uppercase tracking-[0.16em]">Your rating</legend>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button key={n} type="button" onClick={() => setStars(n)} aria-label={`${n} star${n > 1 ? "s" : ""}`} className={cn("transition-colors", n <= stars ? "text-gold" : "text-beige")}>
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor"><path d="m12 3 2.7 5.8 6.3.7-4.7 4.3 1.3 6.2L12 16.8 6.4 20l1.3-6.2L3 9.5l6.3-.7L12 3Z" /></svg>
                </button>
              ))}
            </div>
          </fieldset>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-xs font-semibold uppercase tracking-wider">Name</span>
              <input name="name" required maxLength={40} className="field-input" />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-semibold uppercase tracking-wider">Title</span>
              <input name="title" maxLength={60} className="field-input" />
            </label>
          </div>
          <label className="block">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wider">Your review</span>
            <textarea name="body" required maxLength={800} rows={4} className="field-input" />
          </label>
          {state.msg && (
            <p className={cn("text-sm", state.ok ? "text-green-800" : "text-red-700")} role="status">{state.msg}</p>
          )}
          <div className="flex gap-3">
            <button type="submit" className="btn-base bg-ink px-6 py-3 text-ivory hover:bg-gold hover:text-ink">Submit</button>
            <button type="button" onClick={() => setShowForm(false)} className="btn-base px-4 py-3 text-espresso/60 hover:text-espresso">Cancel</button>
          </div>
          <p className="text-xs text-espresso/45">Reviews are published after moderation by our team.</p>
        </form>
      )}

      <ul className="mt-10 grid gap-5 md:grid-cols-2">
        {reviews.map((r) => (
          <li key={r.id} className="border border-beige bg-white p-6">
            <Stars rating={r.rating} size={14} />
            {r.title && <h3 className="mt-2 font-serif text-lg text-ink">{r.title}</h3>}
            <p className="mt-1.5 text-sm leading-relaxed text-espresso/70">{r.body}</p>
            <p className="mt-3 text-xs text-espresso/50">
              {r.name}{r.verified && <span className="ml-2 font-semibold text-gold">Verified Buyer</span>} · {formatDate(r.createdAt)}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}

function useMemoDist(reviews: Review[]) {
  const dist: Record<number, number> = {};
  for (const r of reviews) dist[r.rating] = (dist[r.rating] ?? 0) + 1;
  return dist;
}
