"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutUser } from "@/actions/auth";

const links = [
  { href: "/admin", label: "Dashboard", exact: true },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/collections", label: "Collections" },
  { href: "/admin/discounts", label: "Discounts" },
  { href: "/admin/reviews", label: "Reviews" },
  { href: "/admin/customers", label: "Customers" },
  { href: "/admin/settings", label: "Settings" }
];

export function AdminNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Admin">
      <ul className="flex gap-1 overflow-x-auto px-4 py-2 lg:flex-col lg:gap-0.5 lg:p-4">
        {links.map((l) => {
          const active = l.exact ? pathname === l.href : pathname.startsWith(l.href);
          return (
            <li key={l.href}>
              <Link
                href={l.href}
                className={`block whitespace-nowrap px-3.5 py-2 text-sm transition-colors ${
                  active
                    ? "bg-ink font-semibold text-gold"
                    : "text-espresso/70 hover:bg-champagne/25 hover:text-ink"
                }`}
              >
                {l.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export function AdminTopBar({ userName }: { userName: string }) {
  return (
    <div className="sticky top-0 z-20 flex items-center justify-between border-b border-beige bg-white/90 px-4 py-3 backdrop-blur lg:px-8">
      <p className="font-serif tracking-[0.18em] text-ink">TALIS <span className="text-gold">/</span> ADMIN</p>
      <div className="flex items-center gap-3 text-sm">
        <span className="hidden text-espresso/55 sm:block">{userName}</span>
        <Link href="/" className="btn-base border border-espresso/25 px-3 py-1.5 hover:border-gold hover:text-gold">View store</Link>
        <form action={logoutUser}>
          <button className="btn-base bg-ink px-3 py-1.5 text-ivory hover:bg-gold hover:text-ink">Sign out</button>
        </form>
      </div>
    </div>
  );
}
