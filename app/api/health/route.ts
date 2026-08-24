import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const products = await db.product.count({ where: { active: true } });
    return NextResponse.json({
      ok: true,
      service: "talis-gift-shop",
      time: new Date().toISOString(),
      activeProducts: products,
      mpesaConfigured: Boolean(process.env.MPESA_CONSUMER_KEY && process.env.MPESA_PASSKEY)
    });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
