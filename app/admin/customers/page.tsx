import { db } from "@/lib/db";
import { formatDate, formatKSh } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminCustomersPage() {
  const [users, agg] = await Promise.all([
    db.user.findMany({ where: { role: "CUSTOMER" }, orderBy: { createdAt: "desc" } }),
    db.order.groupBy({ by: ["userId"], _count: true, _sum: { total: true }, where: { userId: { not: null } } })
  ]);

  const rows = users
    .map((u) => {
      const a = agg.find((x) => x.userId === u.id);
      return { ...u, orders: a?._count ?? 0, spent: a?._sum.total ?? 0 };
    })
    .sort((a, b) => b.spent - a.spent);

  return (
    <div className="space-y-5">
      <header>
        <p className="eyebrow">People</p>
        <h1 className="mt-1 font-serif text-3xl text-ink">Customers <span className="text-lg text-espresso/45">({users.length})</span></h1>
      </header>

      <section className="border border-beige bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="border-b border-beige text-left text-[11px] uppercase tracking-[0.14em] text-espresso/45">
                <th className="px-4 py-3 font-semibold">Customer</th>
                <th className="px-4 py-3 font-semibold">Phone</th>
                <th className="px-4 py-3 font-semibold">Orders</th>
                <th className="px-4 py-3 font-semibold">Total spent</th>
                <th className="px-4 py-3 font-semibold">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-beige/60">
              {rows.map((u) => (
                <tr key={u.id} className="hover:bg-champagne/10">
                  <td className="px-4 py-3">
                    <p className="font-medium">{u.name ?? "—"}</p>
                    <p className="text-xs text-espresso/45">{u.email}</p>
                  </td>
                  <td className="px-4 py-3 text-espresso/65">{u.phone ?? "—"}</td>
                  <td className="px-4 py-3">
                    {u.orders > 0 ? (
                      <span className="rounded-full bg-champagne px-2.5 py-1 text-xs font-semibold">{u.orders}</span>
                    ) : (
                      <span className="text-xs text-espresso/40">No orders yet</span>
                    )}
                  </td>
                  <td className="px-4 py-3 font-semibold">{u.spent > 0 ? formatKSh(u.spent) : "—"}</td>
                  <td className="px-4 py-3 text-xs text-espresso/55">{formatDate(u.createdAt)}</td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-10 text-center text-espresso/50">No customers registered yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
