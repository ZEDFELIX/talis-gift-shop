import Link from "next/link";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import { moderateReview } from "@/app/admin/actions";
import { Stars } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function AdminReviewsPage() {
  const reviews = await db.review.findMany({
    orderBy: [{ approved: "asc" }, { createdAt: "desc" }],
    include: { product: true, user: true }
  });
  const pending = reviews.filter((r) => !r.approved).length;

  return (
    <div className="max-w-3xl space-y-5">
      <header>
        <p className="eyebrow">Moderation</p>
        <h1 className="mt-1 font-serif text-3xl text-ink">Reviews {pending > 0 && <span className="text-lg text-gold">({pending} pending)</span>}</h1>
      </header>

      <ul className="space-y-3">
        {reviews.map((r) => (
          <li key={r.id} className={`border bg-white p-5 ${r.approved ? "border-beige" : "border-gold"}`}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <Stars rating={r.rating} size={14} />
                {r.title && <p className="mt-1 font-serif font-semibold text-ink">&ldquo;{r.title}&rdquo;</p>}
              </div>
              <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${r.approved ? "bg-green-100 text-green-800" : "bg-champagne text-espresso"}`}>
                {r.approved ? "Live" : "Pending"}
              </span>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-espresso/75">{r.body}</p>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-beige/70 pt-3 text-xs text-espresso/50">
              <p>{r.user?.name ?? "Customer"} · {formatDate(r.createdAt)} · on{" "}
                <Link href={`/products/${r.product.slug}`} target="_blank" className="font-medium text-gold hover:underline">{r.product.name}</Link>
              </p>
              <div className="flex gap-2">
                {!r.approved && (
                  <form action={moderateReview}>
                    <input type="hidden" name="id" value={r.id} />
                    <input type="hidden" name="action" value="approve" />
                    <button className="btn-base bg-green-700 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-white hover:bg-green-800">Approve</button>
                  </form>
                )}
                {r.approved && (
                  <form action={moderateReview}>
                    <input type="hidden" name="id" value={r.id} />
                    <input type="hidden" name="action" value="reject" />
                    <button className="btn-base border border-espresso/25 px-3.5 py-1.5 text-xs hover:border-gold hover:text-gold">Unpublish</button>
                  </form>
                )}
                <form action={moderateReview}>
                  <input type="hidden" name="id" value={r.id} />
                  <input type="hidden" name="action" value="delete" />
                  <button className="btn-base border border-red-200 px-3.5 py-1.5 text-xs text-red-700 hover:bg-red-50">Delete</button>
                </form>
              </div>
            </div>
          </li>
        ))}
        {reviews.length === 0 && (
          <li className="border border-dashed border-beige px-6 py-12 text-center text-sm text-espresso/50">No reviews yet.</li>
        )}
      </ul>
    </div>
  );
}
