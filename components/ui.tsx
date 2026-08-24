import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

export function buttonClasses(variant: "primary" | "gold" | "outline" | "ghost" | "light" = "primary", size: "sm" | "md" | "lg" = "md") {
  return cn(
    "btn-base",
    size === "sm" && "px-4 py-2 text-[11px]",
    size === "md" && "px-6 py-3",
    size === "lg" && "px-8 py-3.5 text-[13px]",
    variant === "primary" && "bg-ink text-ivory hover:bg-espresso hover:shadow-lift",
    variant === "gold" && "bg-gold text-ink hover:bg-champagne hover:shadow-lift",
    variant === "outline" && "border border-gold/70 text-gold hover:bg-gold hover:text-ink",
    variant === "ghost" && "text-espresso hover:text-gold",
    variant === "light" && "bg-white text-ink border border-beige hover:border-gold hover:text-gold"
  );
}

export function Button({ variant, size, className, ...props }: ComponentProps<"button"> & { variant?: "primary" | "gold" | "outline" | "ghost" | "light"; size?: "sm" | "md" | "lg" }) {
  return <button className={cn(buttonClasses(variant, size), className)} {...props} />;
}

export function ButtonLink({ variant, size, className, ...props }: ComponentProps<typeof Link> & { variant?: "primary" | "gold" | "outline" | "ghost" | "light"; size?: "sm" | "md" | "lg" }) {
  return <Link className={cn(buttonClasses(variant, size), className)} {...props} />;
}

export function Input({ className, ...props }: ComponentProps<"input">) {
  return <input className={cn("field-input", className)} {...props} />;
}

export function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return <textarea className={cn("field-input min-h-[96px] resize-y", className)} {...props} />;
}

export function Select({ className, children, ...props }: ComponentProps<"select">) {
  return (
    <select className={cn("field-input appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23241B16%22%20stroke-width%3D%222%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22/%3E%3C/svg%3E')] bg-[right_0.75rem_center] bg-no-repeat pr-9", className)} {...props}>
      {children}
    </select>
  );
}

export function Field({ label, error, hint, required, className, children }: { label: string; error?: string; hint?: string; required?: boolean; className?: string; children: ReactNode }) {
  return (
    <label className={className ? `block ${className}` : "block"}>
      <span className="mb-1.5 block text-[12px] font-semibold uppercase tracking-[0.14em] text-espresso/80">
        {label} {required && <span className="text-gold">*</span>}
      </span>
      {children}
      {hint && !error && <span className="mt-1 block text-xs text-espresso/50">{hint}</span>}
      {error && <span className="mt-1 block text-xs text-red-700">{error}</span>}
    </label>
  );
}

export function Badge({ tone = "black", children }: { tone?: "black" | "gold" | "sale" | "muted"; children: ReactNode }) {
  return (
    <span
      className={cn(
        "inline-block px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em]",
        tone === "black" && "bg-ink text-ivory",
        tone === "gold" && "bg-gold text-ink",
        tone === "sale" && "bg-espresso text-champagne",
        tone === "muted" && "bg-beige/60 text-espresso"
      )}
    >
      {children}
    </span>
  );
}

export function Stars({ rating, size = 14, showValue }: { rating: number | null; size?: number; showValue?: boolean }) {
  if (rating === null) return null;
  return (
    <span className="inline-flex items-center gap-0.5 align-middle" aria-label={`Rated ${rating} out of 5`}>
      {[1, 2, 3, 4, 5].map((i) => {
        const filled = rating >= i - 0.4;
        return (
          <svg key={i} width={size} height={size} viewBox="0 0 24 24" fill={filled ? "#C9A45C" : "none"} stroke="#C9A45C" strokeWidth={1.4} aria-hidden>
            <path d="m12 3 2.7 5.8 6.3.7-4.7 4.3 1.3 6.2L12 16.8 6.4 20l1.3-6.2L3 9.5l6.3-.7L12 3Z" />
          </svg>
        );
      })}
      {showValue && <span className="ml-1 text-xs text-espresso/60">{rating.toFixed(1)}</span>}
    </span>
  );
}

export function SectionHeading({ eyebrow, title, sub, script, center = true, light }: { eyebrow?: string; title: string; sub?: string; script?: string; center?: boolean; light?: boolean }) {
  return (
    <div className={cn("mb-10 max-w-2xl", center && "mx-auto text-center")}>
      {eyebrow && <p className={cn("eyebrow mb-3", light && "text-champagne")}>{eyebrow}</p>}
      <h2 className={cn("h-serif text-3xl sm:text-4xl", light ? "text-ivory" : "text-ink")}>{title}</h2>
      {script && <p className="mt-2 font-script text-2xl text-gold">{script}</p>}
      {sub && <p className={cn("mt-3 text-sm leading-relaxed", light ? "text-ivory/70" : "text-espresso/65")}>{sub}</p>}
    </div>
  );
}

export function Divider() {
  return (
    <div className="flex items-center justify-center gap-3 py-2" aria-hidden>
      <span className="h-px w-16 bg-gradient-to-r from-transparent to-gold/50" />
      <span className="rotate-45 border border-gold/70 p-[3px]" />
      <span className="h-px w-16 bg-gradient-to-l from-transparent to-gold/50" />
    </div>
  );
}

export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-2 text-[12px] uppercase tracking-[0.12em] text-espresso/50">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-2">
          {i > 0 && <span aria-hidden>/</span>}
          {item.href ? (
            <Link href={item.href} className="hover:text-gold transition-colors">{item.label}</Link>
          ) : (
            <span className="text-espresso/80">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

export function Spinner({ className }: { className?: string }) {
  return (
    <svg className={cn("animate-spin", className)} width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
