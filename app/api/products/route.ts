import { NextRequest, NextResponse } from "next/server";
import { searchProducts } from "@/lib/catalog";
import { rateLimit } from "@/lib/rate-limit";

export async function GET(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "local";
  if (!rateLimit(`search:${ip}`, 40, 60_000)) {
    return NextResponse.json({ products: [] }, { status: 429 });
  }
  const q = req.nextUrl.searchParams.get("q")?.trim() ?? "";
  const limit = Math.min(Number(req.nextUrl.searchParams.get("limit") ?? 6) || 6, 12);
  if (q.length < 2) return NextResponse.json({ products: [] });
  const products = await searchProducts(q, limit);
  return NextResponse.json(
    { products },
    { headers: { "Cache-Control": "public, max-age=30, stale-while-revalidate=60" } }
  );
}
