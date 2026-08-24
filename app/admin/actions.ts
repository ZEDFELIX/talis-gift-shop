"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { slugify } from "@/lib/utils";

const productSchema = z.object({
  name: z.string().min(2).max(80),
  slug: z.string().optional(),
  shortDesc: z.string().min(4).max(160),
  description: z.string().min(10),
  price: z.coerce.number().int().min(1).max(1_000_000),
  compareAtPrice: z.coerce.number().int().min(0).max(1_000_000).optional().or(z.literal("").transform(() => undefined)),
  categoryId: z.string(),
  stock: z.coerce.number().int().min(0).max(9999),
  tags: z.string().max(200).default(""),
  recipients: z.string().max(120).default(""),
  whatsIncluded: z.string().max(600).default(""),
  images: z.string().default(""),
  variants: z.string().max(400).default(""),
  personalizable: z.coerce.boolean().default(false),
  personalizationFields: z.string().max(500).default(""),
  occasionIds: z.array(z.string()).default([]),
  collectionIds: z.array(z.string()).default([]),
  featured: z.coerce.boolean().default(false),
  bestSeller: z.coerce.boolean().default(false),
  isNew: z.coerce.boolean().default(false),
  active: z.coerce.boolean().default(true)
});

function parseProductForm(formData: FormData) {
  return productSchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug") || undefined,
    shortDesc: formData.get("shortDesc"),
    description: formData.get("description"),
    price: formData.get("price"),
    compareAtPrice: formData.get("compareAtPrice") || undefined,
    categoryId: formData.get("categoryId"),
    stock: formData.get("stock"),
    tags: formData.get("tags") ?? "",
    recipients: String(formData.get("recipients") ?? "").toLowerCase(),
    whatsIncluded: formData.get("whatsIncluded") ?? "",
    images: formData.get("images") ?? "",
    variants: formData.get("variants") ?? "",
    personalizable: formData.get("personalizable") === "on",
    personalizationFields: formData.get("personalizationFields") ?? "",
    occasionIds: formData.getAll("occasionIds").map(String),
    collectionIds: formData.getAll("collectionIds").map(String),
    featured: formData.get("featured") === "on",
    bestSeller: formData.get("bestSeller") === "on",
    isNew: formData.get("isNew") === "on",
    active: formData.get("active") === "on"
  });
}

export async function saveProduct(formData: FormData): Promise<void> {
  await requireAdmin();
  const parsed = parseProductForm(formData);
  if (!parsed.success) redirect("/admin/products?error=Invalid+product+data");
  const d = parsed.data;
  const id = String(formData.get("id") ?? "");
  const slug = slugify(d.slug || d.name);

  const imageUrls = d.images.split("\n").map((s) => s.trim()).filter(Boolean);
  const variantRows = d.variants.split("\n").map((line) => {
    const [name, options] = line.split(":").map((s) => s?.trim());
    return name && options ? { name, options: options.split("|").map((o) => o.trim()).filter(Boolean) } : null;
  }).filter(Boolean) as { name: string; options: string[] }[];

  let pFields: unknown = [];
  try {
    pFields = d.personalizationFields ? JSON.parse(d.personalizationFields) : [];
  } catch {
    pFields = [];
  }

  const data = {
    name: d.name,
    slug,
    shortDesc: d.shortDesc,
    description: d.description,
    price: d.price,
    compareAtPrice: d.compareAtPrice && d.compareAtPrice > 0 ? d.compareAtPrice : null,
    categoryId: d.categoryId,
    tags: d.tags,
    recipients: d.recipients,
    whatsIncluded: d.whatsIncluded,
    personalizable: d.personalizable,
    personalizationFields: JSON.stringify(pFields),
    featured: d.featured,
    bestSeller: d.bestSeller,
    isNew: d.isNew,
    active: d.active,
    occasions: { connect: d.occasionIds.map((id) => ({ id })) },
    collections: { connect: d.collectionIds.map((id) => ({ id })) }
  };

  const product = id
    ? await db.product.update({ where: { id }, data })
    : await db.product.create({ data });

  await db.inventory.upsert({
    where: { productId: product.id },
    update: { quantity: d.stock },
    create: { productId: product.id, quantity: d.stock }
  });

  await db.productImage.deleteMany({ where: { productId: product.id } });
  if (imageUrls.length) {
    await db.productImage.createMany({
      data: imageUrls.map((url, i) => ({ productId: product.id, url, sort: i, alt: d.name }))
    });
  }

  await db.productVariant.deleteMany({ where: { productId: product.id } });
  if (variantRows.length) {
    await db.productVariant.createMany({
      data: variantRows.map((v) => ({ productId: product.id, name: v.name, options: v.options.join("|") }))
    });
  }

  revalidatePath("/admin/products");
  revalidatePath("/shop");
  revalidatePath(`/products/${slug}`);
  redirect("/admin/products?saved=1");
}

export async function deleteProduct(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (id) await db.product.delete({ where: { id } }).catch(() => null);
  revalidatePath("/admin/products");
  redirect("/admin/products?deleted=1");
}

const ORDER_FLOW = ["PENDING", "PAYMENT_PENDING", "PAID", "PROCESSING", "PACKAGING", "OUT_FOR_DELIVERY", "DELIVERED"];

export async function updateOrderStatus(formData: FormData): Promise<void> {
  await requireAdmin();
  const orderId = String(formData.get("orderId") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!orderId || !ORDER_FLOW.includes(status)) redirect("/admin/orders");

  await db.$transaction(async (tx) => {
    const order = await tx.order.findUnique({ where: { id: orderId }, include: { items: true } });
    if (!order) return;

    const wasCancelled = order.status === "CANCELLED" || order.status === "REFUNDED";

    await tx.order.update({
      where: { id: orderId },
      data: {
        status,
        events: { create: { status, note: `Updated by Talis team.` } },
        ...(status === "CANCELLED" && !wasCancelled ? {} : {})
      }
    });

    if ((status === "PAID" || status === "PROCESSING") && (order.status === "PAID" || ORDER_FLOW.indexOf(status) >= 3)) {
      for (const item of order.items) {
        if (item.productId && !wasCancelled && order.status !== "PAID" && order.status !== "PROCESSING") {
          await tx.inventory.updateMany({
            where: { productId: item.productId },
            data: { reserved: { decrement: item.qty }, quantity: { decrement: item.qty } }
          });
          await tx.product.update({ where: { id: item.productId }, data: { soldCount: { increment: item.qty } } });
        }
      }
      await tx.payment.updateMany({ where: { orderId, status: { not: "PAID" } }, data: { status: "PAID" } });
    }

    if ((status === "CANCELLED" || status === "REFUNDED") && !wasCancelled && ORDER_FLOW.indexOf(order.status) < 3) {
      for (const item of order.items) {
        if (item.productId) {
          await tx.inventory.updateMany({ where: { productId: item.productId }, data: { reserved: { decrement: item.qty } } });
        }
      }
    }

    if (status === "REFUNDED") {
      await tx.payment.updateMany({ where: { orderId }, data: { status: "REFUNDED" } });
    }
  });

  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderId}`);
}

export async function confirmPaymentManually(formData: FormData): Promise<void> {
  await requireAdmin();
  const orderId = String(formData.get("orderId") ?? "");
  const reference = String(formData.get("reference") ?? "").trim();
  const order = await db.order.findUnique({ where: { id: orderId } });
  if (!order || order.status === "PAID" || ORDER_FLOW.indexOf(order.status) >= 2) {
    redirect("/admin/orders");
  }
  await db.$transaction(async (tx) => {
    await tx.payment.updateMany({ where: { orderId }, data: { status: "PAID", provider: "mpesa", rawRef: reference || "MANUAL-CONFIRM" } });
    await tx.order.update({
      where: { id: orderId },
      data: { status: "PAID", events: { create: { status: "PAID", note: `Payment confirmed manually${reference ? ` (M-PESA ref ${reference})` : ""}.` } } }
    });
    const items = await tx.orderItem.findMany({ where: { orderId } });
    for (const item of items) {
      if (item.productId) {
        await tx.inventory.updateMany({
          where: { productId: item.productId },
          data: { reserved: { decrement: item.qty }, quantity: { decrement: item.qty } }
        });
        await tx.product.update({ where: { id: item.productId }, data: { soldCount: { increment: item.qty } } });
      }
    }
  });
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderId}`);
}

const discountSchema = z.object({
  code: z.string().min(2).max(24),
  type: z.enum(["PERCENT", "FIXED"]),
  value: z.coerce.number().int().min(1).max(100000),
  minSubtotal: z.coerce.number().int().min(0).max(1000000).default(0),
  usageLimit: z.coerce.number().int().min(0).max(100000).optional().or(z.literal("").transform(() => undefined)),
  expiresAt: z.string().optional()
});

export async function createDiscount(formData: FormData): Promise<void> {
  await requireAdmin();
  const parsed = discountSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/admin/discounts?error=Check+the+discount+fields");
  const d = parsed.data;
  try {
    await db.discount.create({
      data: {
        code: d.code.toUpperCase().replace(/\s/g, ""),
        type: d.type,
        value: d.value,
        minSubtotal: d.minSubtotal,
        usageLimit: d.usageLimit ?? null,
        expiresAt: d.expiresAt ? new Date(d.expiresAt) : null
      }
    });
  } catch {
    redirect("/admin/discounts?error=That+code+already+exists");
  }
  revalidatePath("/admin/discounts");
  redirect("/admin/discounts?saved=1");
}

export async function toggleDiscount(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const discount = await db.discount.findUnique({ where: { id } });
  if (discount) await db.discount.update({ where: { id }, data: { active: !discount.active } });
  revalidatePath("/admin/discounts");
}

export async function deleteDiscount(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (id) await db.discount.delete({ where: { id } }).catch(() => null);
  revalidatePath("/admin/discounts");
}

export async function moderateReview(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const action = String(formData.get("action") ?? "");
  if (!id) return;
  if (action === "delete") await db.review.delete({ where: { id } }).catch(() => null);
  else if (action === "approve") await db.review.update({ where: { id }, data: { approved: true } });
  else if (action === "reject") await db.review.update({ where: { id }, data: { approved: false } });
  revalidatePath("/admin/reviews");
  revalidatePath("/shop");
}

export async function saveCategory(formData: FormData): Promise<void> {
  await requireAdmin();
  const name = String(formData.get("name") ?? "").trim();
  if (name.length >= 2) await db.category.create({ data: { name, slug: slugify(name) } }).catch(() => null);
  revalidatePath("/admin/categories");
}

export async function deleteCategory(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const count = await db.product.count({ where: { categoryId: id } });
  if (count === 0 && id) await db.category.delete({ where: { id } }).catch(() => null);
  revalidatePath("/admin/categories");
  redirect("/admin/categories" + (count > 0 ? "?error=Category+still+has+products" : ""));
}

export async function saveCollection(formData: FormData): Promise<void> {
  await requireAdmin();
  const name = String(formData.get("name") ?? "").trim();
  const tagline = String(formData.get("tagline") ?? "").trim();
  if (name.length >= 2) {
    await db.collection.create({
      data: { name, tagline: tagline || null, slug: slugify(name), image: "/images/col-signature.svg" }
    }).catch(() => null);
  }
  revalidatePath("/admin/collections");
}

export async function deleteCollection(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (id) await db.collection.delete({ where: { id } }).catch(() => null);
  revalidatePath("/admin/collections");
}

const SETTINGS_KEYS = [
  "announcement", "heroTitle", "heroSub", "heroDesc", "whatsapp", "phone", "email",
  "address", "hours", "instagramHandle", "instagramImages",
  "mpesaPaybill", "giftBoxFees"
] as const;

export async function saveSettings(formData: FormData): Promise<void> {
  await requireAdmin();
  for (const key of SETTINGS_KEYS) {
    const value = formData.get(key);
    if (value === null) continue;
    await db.setting.upsert({ where: { key }, update: { value: String(value) }, create: { key, value: String(value) } });
  }
  revalidatePath("/", "layout");
  redirect("/admin/settings?saved=1");
}

export async function updateDeliveryZoneFee(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const fee = Number(formData.get("fee"));
  const etaNote = String(formData.get("etaNote") ?? "").trim();
  if (id && fee >= 0) {
    await db.deliveryZone.update({ where: { id }, data: { fee, etaNote: etaNote || null } });
  }
  revalidatePath("/admin/settings");
  revalidatePath("/delivery");
}
