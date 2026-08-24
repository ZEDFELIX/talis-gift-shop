import Link from "next/link";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { AccountShell } from "@/components/account/account-shell";
import { ButtonLink, Divider } from "@/components/ui";
import { STATUS_LABELS } from "@/types";
import { formatDate, formatKSh, statusTone } from "@/lib/utils";

export const metadata = { title: "My Orders" };
export const dynamic = "force-dynamic";

export default async function AccountOrdersPage() {
  const user = await requireUser("/account/orders");
  const orders = await db.order.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { items: true } }, payment: true }
  });

  return (
    <AccountShell active="orders" title="My Orders">
      {orders.length === 0 ? (
        <div className="talis-pattern flex flex-col items-center gap-3 border border-dashed border-beige px-8 py-16 text-center">
          <p className="font-serif text-2xl text-ink">No orders yet</p>
          <p className="text-sm text-espresso/60">Your first feeling awaits.</p>
          <ButtonLink href="/shop" variant="primary" className="mt-2">Explore Gifts</ButtonLink>
        </div>
      ) : (
        <ul className="divide-y divide-beige border border-beige bg-white">
          {orders.map((o) => (
            <li key={o.id} className="flex flex-wrap items-center gap-4 p-5">
              <div className="min-w-0 flex-1">
                <p className="font-serif text-lg text-ink">{o.orderNumber}</p>
                <p className="mt-0.5 text-xs text-espresso/50">
                  {formatDate(o.createdAt)} · {o._count.items} item{o._count.items === 1 ? "" : "s"} · {o.payment?.method ?? "—"}
                </p>
              </div>
              <span className={`rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${statusTone(o.status)}`}>
                {STATUS_LABELS[o.status]}
              </span>
              <span className="font-semibold">{formatKSh(o.total)}</span>
              <ButtonLink href={`/account/orders/${o.orderNumber}`} variant="light" size="sm">Details</ButtonLink>
            </li>
          ))}
        </ul>
      )}
    </AccountShell>
  );
}
