import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { AdminNav, AdminTopBar } from "@/components/admin/nav";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false }
};

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAdmin();

  return (
    <div className="fixed inset-0 z-[500] overflow-y-auto bg-ivory">
      <div className="lg:pl-60">
        <AdminTopBar userName={user.name ?? user.email} />
        <div className="flex min-h-[calc(100vh-53px)] flex-col lg:flex-row">
          <aside className="shrink-0 border-b border-beige bg-white lg:sticky lg:top-[53px] lg:h-[calc(100vh-53px)] lg:w-60 lg:border-b-0 lg:border-r">
            <AdminNav />
            <div className="hidden px-4 pb-6 lg:block">
              <Link href="/gift-boxes" className="block border border-gold/40 bg-champagne/15 p-4 text-center">
                <span className="block font-script text-2xl text-gold">Beyond</span>
                <span className="block text-[11px] uppercase tracking-[0.18em] text-espresso/55">the feeling</span>
              </Link>
            </div>
          </aside>
          <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
