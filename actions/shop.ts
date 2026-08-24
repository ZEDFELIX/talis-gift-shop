"use server";

import { z } from "zod";
import { db } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { getSettings } from "@/lib/settings";
import { rateLimit } from "@/lib/rate-limit";
import { confirmOrderPaidByReference, markPaymentFailedByReference } from "@/lib/payment-confirm";
import { orderNumber } from "@/lib/utils";

export type ActionResult<T = undefined> = { ok: true; message?: string } & (T extends undefined ? Record<string, unknown> : T);

const orderItemSchema = z.object({
  type: z.enum(["product", "giftBox"]),
  productId: z.string().optional(),
  giftBoxId: z.string().optional(),
  qty: z.number().int().min(1).max(20),
  variant: z.string().max(120).optional(),
  personalization: z.record(z.string().max(80)).optional()
});

const createOrderSchema = z.object({
  items: z.array(orderItemSchema).min(1).max(30),
  customer: z.object({
    name: z.string().min(2).max(60),
    email: z.string().email().max(80),
    phone: z.string().min(9).max(16)
  }),
  delivery: z.object({
    zoneId: z.string(),
    addressLine: z.string().min(4).max(160),
    city: z.string().min(2).max(40),
    instructions: z.string().max(300).optional()
  }),
  gift: z.object({
    recipientName: z.string().max(60).optional(),
    note: z.string().max(400).optional()
  }).optional(),
  discountCode: z.string().max(24).optional(),
  paymentMethod: z.enum(["MPESA", "COD"])
});

function computeDiscount(subtotal: number, d: {
  type: string; value: number; minSubtotal: number; expiresAt: Date | null; active: boolean; usageLimit: number | null; usedCount?: number;
} | null): number {
  if (!d || !d.active) return 0;
  if (d.expiresAt && d.expiresAt.getTime() < Date.now()) return 0;
  if (d.usageLimit !== null && (d.usedCount ?? 0) >= d.usageLimit) return 0;
  if (subtotal < d.minSubtotal) return 0;
  return d.type === "PERCENT" ? Math.round((subtotal * Math.min(d.value, 100)) / 100) : Math.min(d.value, subtotal);
}

async function resolveGiftBoxPrice(giftBoxId: string, fees: Awaited<ReturnType<typeof getSettings>>["giftBoxFees"]) {
  const box = await db.giftBox.findUnique({ where: { id: giftBoxId }, include: { items: { include: { product: true } } } });
  if (!box) return null;
  const productsTotal = box.items.reduce((sum, i) => sum + i.product.price * i.qty, 0);
  const boxFee = fees[(box.size as keyof typeof fees) as "small" | "medium" | "large" | "premium"] ?? 500;
  const extras = (box.wrapping ? fees.wrapping : 0) + (box.ribbon ? fees.ribbon : 0);
  return { box, total: productsTotal + boxFee + extras };
}

export async function validateDiscountCode(code: string, subtotal: number): Promise<{ ok: boolean; message?: string; code?: string; label?: string; amountOff: number }> {
  if (!code.trim()) return { ok: false, amountOff: 0, message: "Enter a discount code." };
  const discount = await db.discount.findUnique({ where: { code: code.trim().toUpperCase() } });
  if (!discount || !discount.active) return { ok: false, amountOff: 0, message: "That code isn't valid." };
  if (discount.expiresAt && discount.expiresAt.getTime() < Date.now()) return { ok: false, amountOff: 0, message: "That code has expired." };
  if (discount.usageLimit !== null && discount.usedCount >= discount.usageLimit) return { ok: false, amountOff: 0, message: "That code has reached its limit." };
  if (subtotal < discount.minSubtotal) {
    return { ok: false, amountOff: 0, message: `Spend KSh ${discount.minSubtotal.toLocaleString("en-KE")} to use ${discount.code}.` };
  }
  const amountOff = computeDiscount(subtotal, discount);
  if (amountOff <= 0) return { ok: false, amountOff: 0, message: "That code can't be applied to this cart." };
  return {
    ok: true,
    amountOff,
    code: discount.code,
    label: discount.type === "PERCENT" ? `${discount.code} — ${discount.value}% off` : `${discount.code} — KSh ${discount.value.toLocaleString("en-KE")} off`
  };
}

export async function createGiftBox(input: {
  size: string;
  items: { slug: string; qty: number }[];
  ribbon?: string | null;
  wrapping?: boolean;
  recipientName?: string | null;
  message?: string | null;
  occasionSlug?: string | null;
}): Promise<{ ok: boolean; id?: string; total?: number; error?: string }> {
  const settings = await getSettings();
  const fees = settings.giftBoxFees;
  const size = ["small", "medium", "large", "premium"].includes(input.size) ? input.size : null;
  if (!size) return { ok: false, error: "Choose a valid box size." };
  if (!input.items.length) return { ok: false, error: "Add at least one treasure to the box." };

  const maxItems = fees.maxItems[size] ?? 6;
  if (input.items.reduce((a, i) => a + i.qty, 0) > maxItems) {
    return { ok: false, error: `A ${size} box holds up to ${maxItems} treasures.` };
  }

  const slugs = [...new Set(input.items.map((i) => i.slug))];
  const products = await db.product.findMany({ where: { slug: { in: slugs }, active: true }, include: { inventory: true } });
  const byslug = new Map(products.map((p) => [p.slug, p]));

  for (const item of input.items) {
    const p = byslug.get(item.slug);
    if (!p) return { ok: false, error: "One of your selections is no longer available." };
    const available = p.inventory ? p.inventory.quantity - p.inventory.reserved : 0;
    if (item.qty > available) return { ok: false, error: `${p.name} only has ${available} left in stock.` };
  }

  const productsTotal = input.items.reduce((sum, i) => sum + (byslug.get(i.slug)?.price ?? 0) * i.qty, 0);
  const boxFee = fees[size as keyof typeof fees] as number;
  const extras = (input.wrapping ? fees.wrapping : 0) + (input.ribbon ? fees.ribbon : 0);

  const user = await getSessionUser();
  const box = await db.giftBox.create({
    data: {
      userId: user?.id,
      size,
      ribbon: input.ribbon || null,
      wrapping: Boolean(input.wrapping),
      recipientName: input.recipientName?.slice(0, 60) || null,
      message: input.message?.slice(0, 300) || null,
      occasionSlug: input.occasionSlug || null,
      totalPrice: productsTotal + boxFee + extras,
      items: {
        create: input.items.map((i) => ({
          productId: byslug.get(i.slug)!.id,
          qty: Math.min(i.qty, 10)
        }))
      }
    }
  });

  return { ok: true, id: box.id, total: box.totalPrice };
}

export type CreateOrderResult =
  | { ok: true; orderNumber: string; total: number }
  | { ok: false; error: string; fieldErrors?: string[] };

export async function createOrder(payload: unknown): Promise<CreateOrderResult> {
  if (!rateLimit("order-create", 15, 60_000)) {
    return { ok: false, error: "Too many attempts. Please wait a moment." };
  }

  const parsed = createOrderSchema.safeParse(payload);
  if (!parsed.success) {
    return { ok: false, error: "Please check your details and try again.", fieldErrors: parsed.error.issues.slice(0, 5).map((i) => i.message) };
  }
  const data = parsed.data;

  const settings = await getSettings();
  const zone = await db.deliveryZone.findFirst({ where: { id: data.delivery.zoneId, active: true } });
  if (!zone) return { ok: false, error: "Please choose a delivery zone." };

  let subtotal = 0;
  type ResolvedLine = {
    name: string; imageUrl: string; unitPrice: number; qty: number;
    productId?: string; giftBoxId?: string;
    variantJson?: string; personalizationJson?: string;
    inventoryKey?: string;
    meta?: string[];
  };
  const lines: ResolvedLine[] = [];

  for (const item of data.items) {
    if (item.type === "product") {
      if (!item.productId) return { ok: false, error: "Invalid cart item." };
      const product = await db.product.findUnique({ where: { slug: item.productId }, include: { inventory: true, images: { take: 1, orderBy: { sort: "asc" } } } });
      if (!product || !product.active) return { ok: false, error: "An item in your cart is no longer available." };
      const available = product.inventory ? product.inventory.quantity - product.inventory.reserved : 0;
      if (item.qty > available) return { ok: false, error: `${product.name} only has ${available} left in stock.` };
      subtotal += product.price * item.qty;
      lines.push({
        name: product.name,
        imageUrl: product.images[0]?.url,
        unitPrice: product.price,
        qty: item.qty,
        productId: product.id,
        variantJson: item.variant || undefined,
        personalizationJson: item.personalization ? JSON.stringify(item.personalization) : undefined
      });
    } else {
      if (!item.giftBoxId) return { ok: false, error: "Invalid gift box in cart." };
      const resolved = await resolveGiftBoxPrice(item.giftBoxId, settings.giftBoxFees);
      if (!resolved) return { ok: false, error: "A gift box in your cart could not be found." };
      subtotal += resolved.total * item.qty;
      lines.push({
        name: `${sizeLabel(resolved.box.size)} Gift Box`,
        imageUrl: "/images/box-open.svg",
        unitPrice: resolved.total,
        qty: item.qty,
        giftBoxId: resolved.box.id,
        personalizationJson: JSON.stringify({
          ...(resolved.box.recipientName ? { To: resolved.box.recipientName } : {}),
          ...(resolved.box.message ? { Message: resolved.box.message } : {}),
          ...(resolved.box.ribbon ? { Ribbon: resolved.box.ribbon } : {}),
          Contents: resolved.box.items.map((i) => i.product.name).join(", ")
        })
      });
    }
  }

  let discountTotal = 0;
  let discountCode: string | undefined;
  if (data.discountCode) {
    const discount = await db.discount.findUnique({ where: { code: data.discountCode.toUpperCase() } });
    discountTotal = computeDiscount(subtotal, discount);
    if (discount && discountTotal > 0) {
      discountCode = discount.code;
      await db.discount.update({ where: { id: discount.id }, data: { usedCount: { increment: 1 } } });
    }
  }

  const deliveryFee = zone.fee;
  const total = Math.max(0, subtotal - discountTotal) + deliveryFee;

  const user = await getSessionUser();
  const num = orderNumber();

  try {
    await db.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          orderNumber: num,
          userId: user?.id,
          email: data.customer.email.toLowerCase(),
          phone: data.customer.phone,
          deliveryName: data.gift?.recipientName?.trim() || data.customer.name,
          addressLine: data.delivery.addressLine,
          city: data.delivery.city,
          zoneId: zone.id,
          zoneName: zone.name,
          instructions: data.delivery.instructions || null,
          recipientName: data.gift?.recipientName || null,
          giftNote: data.gift?.note || null,
          subtotal,
          discountTotal,
          discountCode,
          deliveryFee,
          total,
          status: data.paymentMethod === "COD" ? "PAID" : "PAYMENT_PENDING",
          estimatedDelivery: new Date(Date.now() + (zone.name.startsWith("Nairobi") ? 86400000 : 3 * 86400000)),
          items: { create: lines },
          events: {
            create: [
              { status: "PENDING", note: "We received your order." },
              ...(data.paymentMethod === "COD"
                ? [{ status: "PAID", note: "Cash on delivery — pay when it arrives." }]
                : [{ status: "PAYMENT_PENDING", note: "Complete payment via M-PESA to begin packing." }])
            ]
          },
          payment: {
            create: {
              provider: data.paymentMethod === "COD" ? "cod" : "mpesa",
              method: data.paymentMethod,
              status: data.paymentMethod === "COD" ? "PENDING" : "PENDING",
              amount: total
            }
          }
        }
      });

      for (const line of lines) {
        if (line.productId) {
          await tx.inventory.updateMany({ where: { productId: line.productId }, data: { reserved: { increment: line.qty } } });
        }
      }
      void order;
    });
  } catch {
    return { ok: false, error: "Something went wrong creating your order. Please try again." };
  }

  return { ok: true, orderNumber: num, total };
}

function sizeLabel(size: string) {
  return size.charAt(0).toUpperCase() + size.slice(1);
}

export async function trackOrder(query: { orderNumber: string; contact: string }) {
  const num = query.orderNumber.trim().toUpperCase();
  const contact = query.contact.trim().toLowerCase();
  if (!num || !contact) return { ok: false as const, error: "Enter both your order number and phone or email." };

  const order = await db.order.findFirst({
    where: {
      orderNumber: num,
      OR: [{ email: contact }, { phone: { contains: contact.replace(/\s/g, "") } }]
    },
    include: { events: { orderBy: { createdAt: "asc" } }, items: true, payment: true }
  });

  if (!order) return { ok: false as const, error: "We couldn't find that order. Check the number and the phone/email you ordered with." };

  return {
    ok: true as const,
    order: {
      orderNumber: order.orderNumber,
      status: order.status,
      createdAt: order.createdAt.toISOString(),
      estimatedDelivery: order.estimatedDelivery?.toISOString() ?? null,
      total: order.total,
      deliveryFee: order.deliveryFee,
      subtotal: order.subtotal,
      discountTotal: order.discountTotal,
      zoneName: order.zoneName,
      addressLine: order.addressLine,
      city: order.city,
      items: order.items.map((i) => ({ name: i.name, imageUrl: i.imageUrl, unitPrice: i.unitPrice, qty: i.qty })),
      events: order.events.map((e) => ({ status: e.status, note: e.note, createdAt: e.createdAt.toISOString() }))
    }
  };
}

export async function initiateMpesaPayment(orderNumber: string): Promise<{ ok: boolean; message: string; configured: boolean }> {
  const order = await db.order.findUnique({ where: { orderNumber }, include: { payment: true } });
  if (!order || !order.payment) return { ok: false, configured: false, message: "Order not found." };
  if (order.payment.status === "PAID") return { ok: true, configured: true, message: "This order is already paid. Thank you!" };

  const { getPaymentProvider } = await import("@/lib/payments");
  const provider = getPaymentProvider();

  if (!provider.isConfigured()) {
    const settings = await getSettings();
    return {
      ok: false,
      configured: false,
      message: `Pay manually via M-PESA: Go to Lipa na M-PESA → Buy Goods → Enter ${settings.mpesaPaybill} → Amount KSh ${order.total.toLocaleString("en-KE")} → Reference ${order.orderNumber}. We confirm payments quickly during business hours.`
    };
  }

  const result = await provider.initializePayment({
    phone: order.phone,
    amount: order.total,
    reference: order.orderNumber,
    description: `Talis order ${order.orderNumber}`
  });

  if (result.ok && result.providerRef) {
    await db.payment.update({ where: { orderId: order.id }, data: { reference: result.providerRef, provider: "mpesa" } });
  }

  return { ok: result.ok, configured: true, message: result.message };
}

export async function pollMpesaPayment(orderNumber: string): Promise<{ status: "PENDING" | "PAID" | "FAILED"; message?: string }> {
  const order = await db.order.findUnique({ where: { orderNumber }, include: { payment: true } });
  if (!order?.payment) return { status: "PENDING" };
  if (order.payment.status === "PAID") return { status: "PAID", message: "Payment received! Your order is confirmed." };
  if (order.status === "CANCELLED" || order.status === "REFUNDED") return { status: "FAILED", message: "This order is no longer payable." };

  const reference = order.payment.reference;
  if (!reference || !reference.startsWith("ws")) return { status: "PENDING" };

  const { getPaymentProvider } = await import("@/lib/payments");
  const provider = getPaymentProvider();
  const st = await provider.checkPaymentStatus(reference);

  if (st.status === "PAID") {
    await confirmOrderPaidByReference(reference);
    return { status: "PAID", message: "Payment received! Your order is confirmed." };
  }
  if (st.status === "FAILED") {
    await markPaymentFailedByReference(reference);
    return { status: "FAILED", message: "The M-PESA request failed or was cancelled. Tap below to try again." };
  }
  return { status: "PENDING" };
}

export async function getOrderForReorder(orderNumber: string) {
  const user = await getSessionUser();
  if (!user) return { ok: false as const, error: "Log in to reorder." };
  const order = await db.order.findFirst({
    where: { orderNumber, userId: user.id },
    include: { items: { where: { productId: { not: null } }, select: { productId: true, qty: true, unitPrice: true } } }
  });
  if (!order) return { ok: false as const, error: "Order not found." };
  const ids = order.items.map((i) => i.productId!).filter(Boolean);
  const products = await db.product.findMany({
    where: { id: { in: ids }, active: true },
    include: { images: { take: 1, orderBy: { sort: "asc" } }, inventory: true }
  });
  const items = order.items
    .map((i) => {
      const p = products.find((x) => x.id === i.productId);
      if (!p) return null;
      return {
        slug: p.slug, name: p.name, image: p.images[0]?.url ?? "/images/box.svg",
        price: p.price, qty: i.qty,
        stock: p.inventory ? Math.max(1, p.inventory.quantity - p.inventory.reserved) : 1
      };
    })
    .filter((x): x is NonNullable<typeof x> => x !== null);
  return { ok: true as const, items };
}
