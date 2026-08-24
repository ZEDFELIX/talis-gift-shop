import Link from "next/link";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { AccountShell } from "@/components/account/account-shell";
import { ButtonLink, Divider } from "@/components/ui";
import { STATUS_LABELS } from "@/types";
import { formatDate, formatKSh, statusTone } from "@/lib/utils";
import { addAddress, changePassword, deleteAddress, updateProfile } from "@/actions/auth";

export const metadata = { title: "My Account" };
export const dynamic = "force-dynamic";

export default async function AccountPage({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
  const user = await requireUser();
  const [orders, addresses] = await Promise.all([
    db.order.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" }, take: 4, include: { _count: { select: { items: true } } } }),
    db.address.findMany({ where: { userId: user.id }, orderBy: { isDefault: "desc" } })
  ]);
  const totalOrders = await db.order.count({ where: { userId: user.id } });
  const flag = (k: string) => Boolean(searchParams[k]);

  return (
    <AccountShell active="dashboard" title="Overview">
      <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Orders" value={String(totalOrders)} />
        <Stat label="Member since" value={formatDate(user.createdAt)} />
        <Stat label="Saved addresses" value={String(addresses.length)} />
        <Stat label="Wishlist" value="View" href="/wishlist" />
      </div>

      {(flag("saved") || flag("addrSaved") || flag("pwSaved")) && (
        <p className="mb-6 border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-900">Your changes have been saved.</p>
      )}
      {(flag("pwError") || flag("addrError")) && (
        <p className="mb-6 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {flag("pwError") ? "Password not changed — check your current password and that the new one is at least 8 characters." : "Address needs a phone number and street address."}
        </p>
      )}

      <section aria-label="Recent orders" className="border border-beige bg-white p-6">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-xl text-ink">Recent Orders</h3>
          {totalOrders > 0 && <Link href="/account/orders" className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gold hover:text-espresso">View all</Link>}
        </div>
        <Divider />
        {orders.length === 0 ? (
          <p className="py-6 text-center text-sm text-espresso/55">
            No orders yet. Your first feeling awaits.{" "}
            <Link href="/shop" className="text-gold underline underline-offset-4">Explore gifts</Link>
          </p>
        ) : (
          <ul className="divide-y divide-beige/70">
            {orders.map((o) => (
              <li key={o.id} className="flex flex-wrap items-center gap-3 py-3.5">
                <div className="min-w-0 flex-1">
                  <p className="font-semibold tracking-wide">{o.orderNumber}</p>
                  <p className="text-xs text-espresso/50">{formatDate(o.createdAt)} · {o._count.items} item{o._count.items === 1 ? "" : "s"} · {formatKSh(o.total)}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${statusTone(o.status)}`}>{STATUS_LABELS[o.status]}</span>
                <ButtonLink href={`/account/orders/${o.orderNumber}`} variant="light" size="sm">Details</ButtonLink>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section id="details" aria-label="Account details" className="mt-8 grid gap-6 lg:grid-cols-2">
        <form action={updateProfile} className="border border-beige bg-white p-6">
          <h3 className="font-serif text-xl text-ink">Profile</h3>
          <Divider />
          <div className="space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-[12px] font-semibold uppercase tracking-[0.14em] text-espresso/80">Full name</span>
              <input name="name" defaultValue={user.name} required minLength={2} className="field-input" />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-[12px] font-semibold uppercase tracking-[0.14em] text-espresso/80">Phone</span>
              <input name="phone" type="tel" defaultValue={user.phone ?? ""} placeholder="07XX XXX XXX" className="field-input" />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-[12px] font-semibold uppercase tracking-[0.14em] text-espresso/80">Email</span>
              <input defaultValue={user.email} disabled className="field-input bg-beige/20 opacity-70" />
            </label>
            <button type="submit" className="btn-base w-full bg-ink py-3 text-ivory hover:bg-gold hover:text-ink">Save Changes</button>
          </div>
        </form>

        <form action={changePassword} className="border border-beige bg-white p-6">
          <h3 className="font-serif text-xl text-ink">Password</h3>
          <Divider />
          <div className="space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-[12px] font-semibold uppercase tracking-[0.14em] text-espresso/80">Current password</span>
              <input name="current" type="password" required autoComplete="current-password" className="field-input" />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-[12px] font-semibold uppercase tracking-[0.14em] text-espresso/80">New password</span>
              <input name="next" type="password" required minLength={8} autoComplete="new-password" className="field-input" />
            </label>
            <button type="submit" className="btn-base w-full border border-espresso py-3 hover:bg-ink hover:text-ivory">Update Password</button>
          </div>
        </form>
      </section>

      <AddressesSection addresses={addresses.map(a => ({ id: a.id, label: a.label, name: a.name, phone: a.phone, city: a.city, area: a.area, addressLine: a.addressLine }))} userName={user.name} />
    </AccountShell>
  );
}

function Stat({ label, value, href }: { label: string; value: string; href?: string }) {
  const inner = (
    <>
      <span className="font-serif text-2xl font-semibold text-ink">{value}</span>
      <span className="mt-0.5 block text-[11px] uppercase tracking-[0.16em] text-espresso/50">{label}</span>
    </>
  );
  return href ? (
    <Link href={href} className="border border-beige bg-white p-5 transition-colors hover:border-gold">{inner}</Link>
  ) : (
    <div className="border border-beige bg-white p-5">{inner}</div>
  );
}

function AddressesSection({ addresses, userName }: {
  addresses: { id: string; label: string; name: string; phone: string; city: string; area: string; addressLine: string }[];
  userName: string;
}) {
  return (
    <section aria-label="Saved addresses" className="mt-8 border border-beige bg-white p-6">
      <h3 className="font-serif text-xl text-ink">Saved Addresses</h3>
      <Divider />
      <div className="grid gap-4 md:grid-cols-2">
        {addresses.map((a) => (
          <div key={a.id} className="relative border border-beige/80 p-4 pr-10">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gold">{a.label}</p>
            <p className="mt-1.5 text-sm leading-relaxed text-espresso/75">{a.name}<br />{a.addressLine}, {a.area},<br />{a.city} · {a.phone}</p>
            <form action={deleteAddress} className="absolute right-2 top-2">
              <input type="hidden" name="addressId" value={a.id} />
              <button type="submit" aria-label={`Delete ${a.label} address`} className="flex h-7 w-7 items-center justify-center text-espresso/35 hover:text-red-700">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M6 6l12 12M18 6 6 18" /></svg>
              </button>
            </form>
          </div>
        ))}

        <details className="border border-dashed border-beige p-4">
          <summary className="cursor-pointer list-none text-center text-[11px] font-semibold uppercase tracking-[0.16em] text-gold [&::-webkit-details-marker]:hidden">
            + Add new address
          </summary>
          <form action={addAddress} className="mt-4 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <input name="label" placeholder="Label (Home, Office…)" defaultValue="Home" className="field-input" />
              <input name="name" placeholder="Recipient name" defaultValue={userName} className="field-input" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input name="phone" placeholder="Phone *" required className="field-input" />
              <input name="city" placeholder="City" defaultValue="Nairobi" className="field-input" />
            </div>
            <input name="area" placeholder="Area / estate" className="field-input" />
            <input name="addressLine" placeholder="Street / building / house *" required className="field-input" />
            <button type="submit" className="btn-base w-full border border-espresso py-2.5 hover:bg-ink hover:text-ivory">Save Address</button>
          </form>
        </details>
      </div>
    </section>
  );
}
