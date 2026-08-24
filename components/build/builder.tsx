"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createGiftBox } from "@/actions/shop";
import { useCart } from "@/components/providers/cart";
import { useToast } from "@/components/providers/toast";
import { Button, ButtonLink, Field, Input, Select, Textarea } from "@/components/ui";
import { CheckIcon, GiftIcon, MinusIcon, PlusIcon, SparkleIcon } from "@/components/icons";
import { cn, formatKSh } from "@/lib/utils";
import type { CartLine } from "@/types";

type BuilderProduct = {
  slug: string; name: string; price: number; image: string; category: string;
  short: string; stock: number;
};

type Fees = {
  small: number; medium: number; large: number; premium: number;
  wrapping: number; ribbon: number; maxItems: Record<string, number>;
};

type Size = { id: string; name: string; desc: string };

const RIBBONS = ["Champagne Satin", "Ivory Silk", "Deep Black", "Blush Rose"];

const STEPS = ["Box Size", "Choose Gifts", "Personalize", "Preview"];

export function GiftBoxBuilder({ products, fees, occasions }: {
  products: BuilderProduct[];
  fees: Fees;
  occasions: { slug: string; name: string }[];
}) {
  const router = useRouter();
  const cart = useCart();
  const toast = useToast();

  const [step, setStep] = useState(0);
  const [size, setSize] = useState<string | null>(null);
  const [picks, setPicks] = useState<Record<string, number>>({});
  const [ribbon, setRibbon] = useState<string | null>(null);
  const [wrapping, setWrapping] = useState(true);
  const [recipientName, setRecipientName] = useState("");
  const [message, setMessage] = useState("");
  const [occasionSlug, setOccasionSlug] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const capacity = size ? (fees.maxItems[size] ?? 6) : 0;
  const chosenCount = Object.values(picks).reduce((a, b) => a + b, 0);

  const productsTotal = useMemo(
    () => products.reduce((sum, p) => sum + p.price * (picks[p.slug] ?? 0), 0),
    [products, picks]
  );
  const boxFee = size ? (fees[size as keyof typeof fees] as number) : 0;
  const extras = (wrapping ? fees.wrapping : 0) + (ribbon ? fees.ribbon : 0);
  const total = productsTotal + boxFee + extras;

  const canNext =
    step === 0 ? Boolean(size) :
    step === 1 ? chosenCount > 0 :
    true;

  const togglePick = (slug: string) => {
    setPicks((s) => {
      const current = s[slug] ?? 0;
      if (current > 0) {
        const next = { ...s };
        delete next[slug];
        return next;
      }
      if (chosenCount >= capacity) {
        toast.push(`A ${size} box holds ${capacity} treasures`, "error");
        return s;
      }
      return { ...s, [slug]: 1 };
    });
  };

  const changeQty = (slug: string, delta: number) => {
    setPicks((s) => {
      const nextQty = (s[slug] ?? 0) + delta;
      if (nextQty <= 0) {
        const next = { ...s };
        delete next[slug];
        return next;
      }
      if (chosenCount + delta > capacity) {
        toast.push(`A ${size} box holds only ${capacity} treasures`, "error");
        return s;
      }
      const product = products.find((p) => p.slug === slug);
      if (product && nextQty > product.stock) {
        toast.push("Not enough stock for that many", "error");
        return s;
      }
      return { ...s, [slug]: nextQty };
    });
  };

  const addBoxToCart = async () => {
    if (!size || chosenCount === 0) return;
    setBusy(true);
    setError("");
    const res = await createGiftBox({
      size,
      items: Object.entries(picks).map(([slug, qty]) => ({ slug, qty })),
      ribbon,
      wrapping,
      recipientName: recipientName || null,
      message: message || null,
      occasionSlug: occasionSlug || null
    });
    setBusy(false);
    if (!res.ok || !res.id) {
      setError(res.error ?? "Something went wrong. Please try again.");
      return;
    }
    const line: Omit<CartLine, "key"> = {
      type: "giftBox",
      giftBoxId: res.id,
      name: `${size!.charAt(0).toUpperCase() + size!.slice(1)} Talis Gift Box`,
      image: "/images/box-open.svg",
      price: res.total ?? total,
      qty: 1,
      stock: 1,
      meta: [
        ...(ribbon ? [`Ribbon: ${ribbon}`] : []),
        ...(wrapping ? ["Gift wrapping"] : []),
        ...(recipientName ? [`To: ${recipientName}`] : []),
        `Contents: ${chosenCount} treasures`
      ]
    };
    cart.add(line);
    toast.push("Your gift box was added to the cart");
    router.push("/cart");
  };

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_340px]">
      <div>
        <ol className="mb-10 flex items-center justify-between gap-2" aria-label="Builder progress">
          {STEPS.map((label, i) => (
            <li key={label} className="flex flex-1 flex-col items-center gap-2 text-center">
              <span className={cn(
                "flex h-9 w-9 items-center justify-center rounded-full border text-sm font-semibold transition-all",
                i === step ? "border-gold bg-gold text-ink" :
                i < step ? "border-gold bg-ink text-gold" : "border-beige bg-white text-espresso/40"
              )}>
                {i < step ? <CheckIcon width={15} height={15} /> : i + 1}
              </span>
              <span className={cn("text-[10px] font-semibold uppercase tracking-[0.14em]", i <= step ? "text-espresso" : "text-espresso/40")}>
                {label}
              </span>
            </li>
          ))}
        </ol>

        {step === 0 && (
          <section aria-label="Choose box size">
            <h2 className="font-serif text-2xl text-ink">How big is the feeling?</h2>
            <p className="mt-2 text-sm text-espresso/60">Every size includes our signature black keepsake box and handwritten card.</p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {(Object.entries({ small: "Small", medium: "Medium", large: "Large", premium: "Premium" }) as [string, string][]).map(([id, name]) => (
                <button
                  key={id}
                  onClick={() => setSize(id)}
                  aria-pressed={size === id}
                  className={cn(
                    "group relative overflow-hidden border bg-white p-6 text-left transition-all",
                    size === id ? "border-gold ring-1 ring-gold/50" : "border-beige hover:border-gold/60"
                  )}
                >
                  <span aria-hidden className="absolute -right-4 -top-4 h-16 w-16 rounded-full bg-champagne/20" />
                  <GiftIcon width={22} height={22} className={cn(size === id ? "text-gold" : "text-espresso/40")} />
                  <h3 className="mt-3 font-serif text-xl text-ink">{name}</h3>
                  <p className="mt-1 text-xs text-espresso/55">Up to {fees.maxItems[id]} treasures</p>
                  <p className="mt-3 font-serif text-lg font-semibold">{formatKSh(fees[id as keyof typeof fees] as number)}</p>
                  {size === id && (
                    <span className="absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full bg-gold text-ink">
                      <CheckIcon width={13} height={13} />
                    </span>
                  )}
                </button>
              ))}
            </div>
          </section>
        )}

        {step === 1 && (
          <section aria-label="Choose gifts">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="font-serif text-2xl text-ink">Hand-pick their treasures</h2>
              <p className={cn("text-sm font-semibold", chosenCount >= capacity ? "text-red-700" : "text-gold")}>
                {chosenCount}/{capacity} chosen
              </p>
            </div>
            <p className="mt-2 text-sm text-espresso/60">Mix and match — every treasure is placed by hand.</p>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {products.map((p) => {
                const qty = picks[p.slug] ?? 0;
                const disabled = !qty && chosenCount >= capacity;
                return (
                  <li key={p.slug}>
                    <div className={cn(
                      "flex gap-3 border bg-white p-3 transition-all",
                      qty > 0 ? "border-gold ring-1 ring-gold/40" : "border-beige",
                      disabled && "opacity-50"
                    )}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p.image} alt={p.name} width={64} height={80} loading="lazy" className="h-20 w-16 shrink-0 border border-beige/60 object-cover" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-serif text-[15px] text-ink">{p.name}</p>
                        <p className="truncate text-xs text-espresso/50">{p.category}</p>
                        <p className="mt-0.5 font-semibold text-sm">{formatKSh(p.price)}</p>
                        {qty === 0 ? (
                          <Button size="sm" variant="light" className="mt-2" disabled={disabled} onClick={() => togglePick(p.slug)}>
                            Add to Box
                          </Button>
                        ) : (
                          <div className="mt-2 inline-flex items-center border border-beige">
                            <button aria-label={`Remove one ${p.name}`} onClick={() => changeQty(p.slug, -1)} className="flex h-8 w-8 items-center justify-center hover:text-gold"><MinusIcon width={12} height={12} /></button>
                            <span className="w-7 text-center text-sm tabular-nums">{qty}</span>
                            <button aria-label={`Add one more ${p.name}`} onClick={() => changeQty(p.slug, 1)} disabled={qty >= p.stock} className="flex h-8 w-8 items-center justify-center hover:text-gold disabled:opacity-30"><PlusIcon width={12} height={12} /></button>
                          </div>
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        {step === 2 && (
          <section aria-label="Personalize" className="max-w-lg space-y-6">
            <div>
              <h2 className="font-serif text-2xl text-ink">Make it unmistakably theirs</h2>
              <p className="mt-2 text-sm text-espresso/60">The finishing touches that turn a box into a moment.</p>
            </div>

            <Field label="Recipient's name" hint="Printed on their card">
              <Input value={recipientName} onChange={(e) => setRecipientName(e.target.value.slice(0, 40))} placeholder="e.g. Wanjiru, Mum, My love…" maxLength={40} />
            </Field>

            <Field label="Occasion">
              <Select value={occasionSlug} onChange={(e) => setOccasionSlug(e.target.value)}>
                <option value="">Choose an occasion (optional)</option>
                {occasions.map((o) => (
                  <option key={o.slug} value={o.slug}>{o.name}</option>
                ))}
              </Select>
            </Field>

            <Field label="Ribbon" hint={`${formatKSh(fees.ribbon)} per ribbon`}>
              <div className="flex flex-wrap gap-2">
                {RIBBONS.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRibbon(ribbon === r ? null : r)}
                    aria-pressed={ribbon === r}
                    className={cn(
                      "rounded-full border px-4 py-2 text-xs transition-colors",
                      ribbon === r ? "border-gold bg-gold font-semibold text-ink" : "border-beige bg-white hover:border-gold hover:text-gold"
                    )}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </Field>

            <label className={cn(
              "flex cursor-pointer items-start gap-3 border p-4 transition-colors",
              wrapping ? "border-gold bg-champagne/10" : "border-beige bg-white"
            )}>
              <input type="checkbox" checked={wrapping} onChange={(e) => setWrapping(e.target.checked)} className="mt-1 h-4 w-4 accent-[#C9A45C]" />
              <span>
                <span className="block text-sm font-semibold">Premium gift wrapping</span>
                <span className="block text-xs text-espresso/55">Ivory tissue, gold wax seal &amp; satin bow — {formatKSh(fees.wrapping)}</span>
              </span>
            </label>

            <Field label="Gift message" hint="Handwritten on a Talis card · max 300 characters">
              <Textarea value={message} onChange={(e) => setMessage(e.target.value.slice(0, 300))} rows={4} placeholder="Write something only you would say…" />
              <span className="mt-1 block text-right text-[11px] text-espresso/40">{message.length}/300</span>
            </Field>
          </section>
        )}

        {step === 3 && (
          <section aria-label="Preview your box">
            <h2 className="font-serif text-2xl text-ink">This is what they&apos;ll feel</h2>
            <div className="relative mt-6 overflow-hidden border border-gold/40 bg-ink p-8 text-ivory sm:p-10">
              <div className="talis-pattern absolute inset-0 opacity-40" aria-hidden />
              <div className="relative">
                <p className="eyebrow">Talis Signature</p>
                <h3 className="mt-2 font-serif text-2xl capitalize sm:text-3xl">{size} Gift Box</h3>
                {recipientName && <p className="mt-1 font-script text-2xl text-champagne">For {recipientName}</p>}
                <ul className="mt-6 divide-y divide-white/10 border-y border-white/10">
                  {Object.entries(picks).map(([slug, qty]) => {
                    const p = products.find((x) => x.slug === slug)!;
                    return (
                      <li key={slug} className="flex items-center justify-between gap-4 py-3">
                        <span className="flex items-center gap-3 text-sm">
                          <span aria-hidden className="h-1.5 w-1.5 rotate-45 bg-gold" />
                          {qty > 1 && <span className="text-champagne">{qty} ×</span>} {p.name}
                        </span>
                        <span className="text-sm text-ivory/70">{formatKSh(p.price * qty)}</span>
                      </li>
                    );
                  })}
                </ul>
                <div className="mt-5 space-y-1.5 text-sm text-ivory/75">
                  <p className="flex justify-between"><span>{(size ?? "medium").charAt(0).toUpperCase() + (size ?? "medium").slice(1)} keepsake box</span><span>{formatKSh(boxFee)}</span></p>
                  {wrapping && <p className="flex justify-between"><span>Premium gift wrapping</span><span>{formatKSh(fees.wrapping)}</span></p>}
                  {ribbon && <p className="flex justify-between"><span>{ribbon} ribbon</span><span>{formatKSh(fees.ribbon)}</span></p>}
                </div>
                {message && (
                  <div className="mt-6 border-t border-white/10 pt-5">
                    <p className="eyebrow mb-1.5">Your message</p>
                    <p className="font-serif text-lg italic leading-relaxed text-champagne">&ldquo;{message}&rdquo;</p>
                  </div>
                )}
              </div>
            </div>
            {error && <p role="alert" className="mt-4 text-sm text-red-700">{error}</p>}
            <Button variant="gold" size="lg" className="mt-7 w-full sm:w-auto" onClick={addBoxToCart} disabled={busy}>
              <SparkleIcon width={16} height={16} /> {busy ? "Adding…" : `Add to Cart — ${formatKSh(total)}`}
            </Button>
          </section>
        )}

        <div className="mt-10 flex items-center justify-between border-t border-beige pt-6">
          <Button variant="ghost" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>
            Back
          </Button>
          {step < STEPS.length - 1 && (
            <Button variant="primary" onClick={() => canNext && setStep((s) => s + 1)} disabled={!canNext}>
              Continue
            </Button>
          )}
        </div>
      </div>

      <aside className="lg:sticky lg:top-24 lg:self-start" aria-label="Order summary">
        <div className="border border-beige bg-white p-6">
          <h3 className="font-serif text-xl text-ink">Your Box</h3>
          <DividerSmall />
          {!size && <p className="py-6 text-center text-sm text-espresso/50">Start by choosing a box size.</p>}
          {size && (
            <>
              <dl className="space-y-2.5 text-sm">
                {Object.entries(picks).length === 0 ? (
                  <p className="pb-2 text-espresso/50">No treasures yet — choose step 2.</p>
                ) : (
                  Object.entries(picks).map(([slug, qty]) => {
                    const p = products.find((x) => x.slug === slug)!;
                    return (
                      <div key={slug} className="flex justify-between gap-3">
                        <dt className="min-w-0 truncate text-espresso/75">{qty} × {p.name}</dt>
                        <dd className="shrink-0 tabular-nums">{formatKSh(p.price * qty)}</dd>
                      </div>
                    );
                  })
                )}
                <div className="flex justify-between border-t border-beige pt-2.5 text-espresso/60">
                  <dt>Keepsake box</dt><dd>{formatKSh(boxFee)}</dd>
                </div>
                {wrapping && (
                  <div className="flex justify-between text-espresso/60"><dt>Wrapping</dt><dd>{formatKSh(fees.wrapping)}</dd></div>
                )}
                {ribbon && (
                  <div className="flex justify-between text-espresso/60"><dt>Ribbon</dt><dd>{formatKSh(fees.ribbon)}</dd></div>
                )}
              </dl>
              <div className="mt-4 flex items-baseline justify-between border-t-2 border-ink pt-4">
                <span className="text-[12px] font-semibold uppercase tracking-[0.18em]">Total</span>
                <span className="font-serif text-2xl font-semibold text-ink">{formatKSh(total)}</span>
              </div>
            </>
          )}
          <ButtonLink href="/gift-boxes" variant="ghost" className="mt-5 w-full text-[11px]">
            Prefer a ready-made box?
          </ButtonLink>
        </div>
        <p className="mt-4 px-2 text-center text-xs leading-relaxed text-espresso/50">
          Beautifully packed in Nairobi. Delivered across Kenya.
        </p>
      </aside>
    </div>
  );
}

function DividerSmall() {
  return <div className="my-4 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" aria-hidden />;
}
