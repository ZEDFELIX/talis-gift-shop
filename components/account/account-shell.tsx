import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { logoutUser } from "@/actions/auth";

export async function AccountShell({
  active,
  children,
  title
}: {
  active: "dashboard" | "orders" | "wishlist" | "details";
  title: string;
  children: React.ReactNode;
}) {
  const user = await requireUser();

  const nav = [
    { id: "dashboard", href: "/account", label: "Overview" },
    { id: "orders", href: "/account/orders", label: "My Orders" },
    { id: "wishlist", href: "/wishlist", label: "Wishlist" },
    { id: "details", href: "/account#details", label: "Account Details" }
  ] as const;

  return (
    <div className="container-talis py-10 md:py-14">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-beige pb-6">
        <div>
          <p className="eyebrow mb-1.5">Welcome back,</p>
          <h1 className="font-serif text-3xl text-ink sm:text-4xl">{user.name.split(" ")[0]}</h1>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <Link href="/track-order" className="text-espresso/60 hover:text-gold">Track an order</Link>
          <span className="text-beige">·</span>
          <form action={logoutUser}>
            <button type="submit" className="flex items-center gap-1.5 text-espresso/60 hover:text-gold">
              Sign out
            </button>
          </form>
        </div>
      </header>

      <nav aria-label="Account navigation" className="no-scrollbar mb-8 flex gap-2 overflow-x-auto">
        {nav.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className={`whitespace-nowrap rounded-full border px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] transition-colors ${
              item.id === active ? "border-gold bg-gold text-ink" : "border-beige bg-white text-espresso/65 hover:border-gold hover:text-gold"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <h2 className="sr-only">{title}</h2>
      {children}
    </div>
  );
}
