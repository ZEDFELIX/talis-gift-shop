import Link from "next/link";
import { db } from "@/lib/db";
import { formatDateTime, formatKSh, statusTone } from "@/lib/utils";
import { ORDER_STATUSES, STATUS_LABELS } from "@/types";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage({
  searchParams
}: {
  searchParams: { status?: string; q?: string };
}) {
  const active = searchParams.status && ORDER_STATUSES.includes(searchParams.status as never) ? searchParams.status : undefined;
  const q = searchParams.q?.trim();

  const orders = await db.order.findMany({
    where: {
      ...(active ? { status: active } : {}),
      ...(q ? { OR: [{ orderNumber: { contains: q } }, { email: { contains: q } }, { deliveryName: { contains: q } }] } : {})
    },
    orderBy: { createdAt: "desc" },
    include: { user: true, payment: true },
    take: 100
  });

  const counts = await db.order.groupBy({ by: ["status"], _count: true });
  const countFor = (s: string) => counts.find((c) => c.status === s)?._count ?? 0;

  return (
    <div className="space-y-5">
      <header>
        <p className="eyebrow">Fulfillment</p>
        <h1 className="mt-1 font-serif text-3xl text-ink">Orders</h1>
      </header>

      <div className="flex gap-2 overflow-x-auto pb-1">
        <Link
          href="/admin/orders"
          className={`whitespace-nowrap border px-3.5 py-2 text-xs font-semibold uppercase tracking-[0.12em] ${!active ? "border-ink bg-ink text-gold" : "border-beige bg-white text-espresso/60 hover:border-gold"}`}
        >
          All ({counts.reduce((s, c) => s + c._count, 0)})
        </Link>
        {ORDER_STATUSES.filter((s) => s !== "REFUNDED").map((s) => (
          <Link
            key={s}
            href={`/admin/orders?status=${s}`}
            className={`whitespace-nowrap border px-3.5 py-2 text-xs font-semibold uppercase tracking-[0.12em] ${active === s ? "border-ink bg-ink text-gold" : "border-beige bg-white text-espresso/60 hover:border-gold"}`}
          >
            {STATUS_LABELS[s]} ({countFor(s)})
          </Link>
        ))}
      </div>

      <form action="/admin/orders" className="flex max-w-md gap-2">
        <input name="q" defaultValue={q} placeholder="Search order #, email or name…" className="input-base flex-1" aria-label="Search orders" />
        {active && <input type="hidden" name="status" value={active} />}
        <button className="btn-base bg-ink px-5 py-2 text-sm font-semibold uppercase tracking-[0.12em] text-ivory hover:bg-gold hover:text-ink">Search</button>
      </form>

      <section className="border border-beige bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[780px] text-sm">
            <thead>
              <tr className="border-b border-beige text-left text-[11px] uppercase tracking-[0.14em] text-espresso/45">
                <th className="px-4 py-3 font-semibold">Order</th>
                <th className="px-4 py-3 font-semibold">Customer</th>
                <th className="px-4 py-3 font-semibold">Payment</th>
                <th className="px-4 py-3 font-semibold">Total</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Placed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-beige/60">
              {orders.map((o) => (
                <tr key={o.id} className="hover:bg-champagne/10">
                  <td className="px-4 py-3">
                    <Link href={`/admin/orders/${o.id}`} className="font-medium hover:text-gold">{o.orderNumber}</Link>
                  </td>
                  <td className="px-4 py-3">
                    {o.user?.name ?? o.deliveryName}
                    <p className="text-xs text-espresso/45">{o.user?.email ?? o.email}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-medium">{o.payment?.method ?? "—"}</span>
                    <p className={`text-xs ${o.payment?.status === "PAID" ? "text-green-800" : "text-espresso/45"}`}>{o.payment?.status.toLowerCase() ?? "—"}</p>
                  </td>
                  <td className="px-4 py-3 font-semibold">{formatKSh(o.total)}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${statusTone(o.status)}`}>
                      {STATUS_LABELS[o.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-espresso/55">{formatDateTime(o.createdAt)}</td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-10 text-center text-espresso/50">No orders found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
