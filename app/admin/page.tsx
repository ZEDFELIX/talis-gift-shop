import Link from "next/link";
import { db } from "@/lib/db";
import { formatKSh, statusTone } from "@/lib/utils";
import { STATUS_LABELS } from "@/types";
import { SalesChart } from "@/components/admin/chart";

export const dynamic = "force-dynamic";

const PAID_STATUSES = ["PAID", "PROCESSING", "PACKAGING", "OUT_FOR_DELIVERY", "DELIVERED"];

export default async function AdminDashboardPage() {
  const since = new Date(Date.now() - 13 * 86400000);
  since.setHours(0, 0, 0, 0);

  const [revenue, orderCount, pendingCount, customerCount, lowStock, recentOrders, recentPaid] =
    await Promise.all([
      db.order.aggregate({ _sum: { total: true }, where: { status: { in: PAID_STATUSES } } }),
      db.order.count(),
      db.order.count({ where: { status: { in: ["PENDING", "PAYMENT_PENDING"] } } }),
      db.user.count({ where: { role: "CUSTOMER" } }),
      db.inventory.findMany({ where: { quantity: { lte: 5 } }, include: { product: true }, orderBy: { quantity: "asc" }, take: 6 }),
      db.order.findMany({ orderBy: { createdAt: "desc" }, take: 7, include: { user: true, _count: { select: { items: true } } } }),
      db.order.findMany({ where: { createdAt: { gte: since }, status: { in: PAID_STATUSES } }, select: { createdAt: true, total: true } })
    ]);

  const days = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(since.getTime() + i * 86400000);
    const key = d.toISOString().slice(0, 10);
    return {
      label: d.toLocaleDateString("en-KE", { day: "numeric", month: "short" }),
      value: recentPaid.filter((o) => o.createdAt.toISOString().slice(0, 10) === key).reduce((s, o) => s + o.total, 0)
    };
  });

  const stats = [
    { label: "Revenue (paid)", value: formatKSh(revenue._sum.total ?? 0) },
    { label: "Total orders", value: String(orderCount) },
    { label: "Awaiting action", value: String(pendingCount), accent: pendingCount > 0 },
    { label: "Customers", value: String(customerCount) }
  ];

  return (
    <div className="space-y-6">
      <header>
        <p className="eyebrow">Overview</p>
        <h1 className="mt-1 font-serif text-3xl text-ink">Good day, Talis team</h1>
      </header>

      <section aria-label="Key stats" className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className={`border bg-white p-5 ${s.accent ? "border-gold" : "border-beige"}`}>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-espresso/50">{s.label}</p>
            <p className={`mt-2 font-serif text-2xl sm:text-3xl ${s.accent ? "text-gold" : "text-ink"}`}>{s.value}</p>
          </div>
        ))}
      </section>

      <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
        <section aria-label="Revenue chart" className="border border-beige bg-white p-5">
          <h2 className="mb-1 font-serif text-lg text-ink">Last 14 days</h2>
          <p className="mb-4 text-xs text-espresso/50">Confirmed revenue per day</p>
          <SalesChart data={days} />
        </section>

        <section aria-label="Low stock" className="border border-beige bg-white p-5">
          <h2 className="mb-3 font-serif text-lg text-ink">Low stock</h2>
          {lowStock.length === 0 ? (
            <p className="text-sm text-espresso/55">Everything is well stocked.</p>
          ) : (
            <ul className="divide-y divide-beige/70">
              {lowStock.map((inv) => (
                <li key={inv.id} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                  <Link href={`/admin/products/${inv.productId}`} className="min-w-0 truncate hover:text-gold">{inv.product.name}</Link>
                  <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ${inv.quantity === 0 ? "bg-red-100 text-red-800" : "bg-champagne text-espresso"}`}>
                    {inv.quantity} left
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <section aria-label="Recent orders" className="border border-beige bg-white">
        <div className="flex items-center justify-between border-b border-beige p-5">
          <h2 className="font-serif text-lg text-ink">Recent orders</h2>
          <Link href="/admin/orders" className="text-xs font-semibold uppercase tracking-[0.14em] text-gold hover:underline">View all</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-beige text-left text-[11px] uppercase tracking-[0.14em] text-espresso/45">
                <th className="px-5 py-3 font-semibold">Order</th>
                <th className="px-5 py-3 font-semibold">Customer</th>
                <th className="px-5 py-3 font-semibold">Items</th>
                <th className="px-5 py-3 font-semibold">Total</th>
                <th className="px-5 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-beige/60">
              {recentOrders.map((o) => (
                <tr key={o.id} className="hover:bg-champagne/10">
                  <td className="px-5 py-3">
                    <Link href={`/admin/orders/${o.id}`} className="font-medium hover:text-gold">{o.orderNumber}</Link>
                    <p className="text-xs text-espresso/45">{o.createdAt.toLocaleDateString("en-KE", { day: "numeric", month: "short" })}</p>
                  </td>
                  <td className="px-5 py-3">{o.user?.name ?? o.deliveryName}<p className="text-xs text-espresso/45">{o.user?.email ?? o.email}</p></td>
                  <td className="px-5 py-3 text-espresso/65">{o._count.items}</td>
                  <td className="px-5 py-3 font-semibold">{formatKSh(o.total)}</td>
                  <td className="px-5 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${statusTone(o.status)}`}>
                      {STATUS_LABELS[o.status]}
                    </span>
                  </td>
                </tr>
              ))}
              {recentOrders.length === 0 && (
                <tr><td colSpan={5} className="px-5 py-8 text-center text-espresso/50">No orders yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
