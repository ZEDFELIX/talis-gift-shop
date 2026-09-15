"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/components/providers/cart";
import { useWishlist } from "@/components/providers/wishlist";
import { BagIcon, HeartIcon, HomeIcon, UserIcon, SearchIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

export function MobileBottomNav() {
  const pathname = usePathname();
  const cart = useCart();
  const wishlist = useWishlist();

  if (pathname.startsWith("/admin")) return null;

  const items = [
    { href: "/", label: "Home", icon: HomeIcon },
    { href: "/shop", label: "Shop", icon: SearchIcon },
    { href: "/wishlist", label: "Saved", icon: HeartIcon, badge: wishlist.mounted ? wishlist.entries.length : 0 },
    { href: "/cart", label: "Cart", icon: BagIcon, badge: cart.mounted ? cart.count : 0 },
    { href: "/account", label: "Account", icon: UserIcon }
  ];

  return (
    <nav
      aria-label="Mobile navigation"
      className="fixed inset-x-0 bottom-0 z-[60] border-t border-gold/40 bg-ivory/97 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
      style={{ backgroundColor: "rgba(251,246,234,0.96)" }}
    >
      <ul className="grid grid-cols-5">
        {items.map((item) => {
          const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          return (
            <li key={item.href}>
              <Link href={item.href} className={cn("relative flex flex-col items-center gap-1 py-2.5 text-[10px] font-bold uppercase tracking-[0.12em] transition-colors", active ? "text-gold" : "text-espresso/55 hover:text-espresso")}>
                <span className={cn("relative flex h-8 w-12 items-center justify-center rounded-full", active && "bg-champagne/60")}>
                  <item.icon width={21} height={21} />
                  {Boolean(item.badge) && item.badge! > 0 && (
                    <span className="absolute -right-1.5 -top-1 flex h-[16px] min-w-[16px] items-center justify-center rounded-full bg-gold px-0.5 text-[9px] font-bold text-ink">
                      {item.badge! > 9 ? "9+" : item.badge}
                    </span>
                  )}
                </span>
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
