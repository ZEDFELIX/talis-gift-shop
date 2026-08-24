"use server";

import { z } from "zod";
import { db } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";

export async function subscribeNewsletter(email: string): Promise<{ ok: boolean; msg: string }> {
  const clean = email.trim().toLowerCase();
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(clean)) return { ok: false, msg: "Please enter a valid email address." };
  try {
    await db.newsletterSubscriber.upsert({ where: { email: clean }, update: {}, create: { email: clean } });
    return { ok: true, msg: "Welcome to Talis. Beautiful things are coming your way." };
  } catch {
    return { ok: false, msg: "Something went wrong. Please try again." };
  }
}

const contactSchema = z.object({
  name: z.string().min(2).max(60),
  email: z.string().email(),
  phone: z.string().max(16).optional().or(z.literal("")),
  subject: z.string().max(80).optional().or(z.literal("")),
  message: z.string().min(10).max(1200)
});

export async function submitContactMessage(_prev: unknown, formData: FormData) {
  const parsed = contactSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, message: "Please fill in all required fields correctly." };
  const d = parsed.data;
  await db.contactMessage.create({
    data: { name: d.name, email: d.email, phone: d.phone || null, subject: d.subject || null, message: d.message }
  });
  return { ok: true, message: "Thank you for reaching out. We reply within one business day — usually much faster." };
}

const reviewSchema = z.object({
  productSlug: z.string(),
  name: z.string().min(2).max(40),
  title: z.string().max(60).optional().or(z.literal("")),
  body: z.string().min(10).max(800),
  rating: z.coerce.number().int().min(1).max(5)
});

export async function submitReview(formData: FormData): Promise<{ ok: boolean; message: string }> {
  const user = await getSessionUser();
  const parsed = reviewSchema.safeParse({
    productSlug: formData.get("productSlug"),
    name: formData.get("name"),
    title: formData.get("title") ?? "",
    body: formData.get("body"),
    rating: formData.get("rating")
  });
  if (!parsed.success) return { ok: false, message: "Please add a rating and a few words about the gift." };

  const product = await db.product.findUnique({ where: { slug: parsed.data.productSlug } });
  if (!product) return { ok: false, message: "Product not found." };

  const purchased = user
    ? Boolean(await db.orderItem.findFirst({ where: { productId: product.id, order: { userId: user.id } } }))
    : false;

  try {
    await db.review.create({
      data: {
        productId: product.id,
        userId: user?.id,
        name: parsed.data.name,
        title: parsed.data.title || null,
        body: parsed.data.body,
        rating: parsed.data.rating
      }
    });
    return { ok: true, message: "Thank you! Your review will appear once our team approves it." };
  } catch {
    void purchased;
    return { ok: false, message: "Something went wrong. Please try again." };
  }
}

export async function syncWishlist(items: { slug: string }[]): Promise<{ ok: boolean }> {
  const user = await getSessionUser();
  if (!user) return { ok: true };
  for (const item of items.slice(0, 100)) {
    const product = await db.product.findUnique({ where: { slug: item.slug }, select: { id: true } });
    if (product) {
      await db.wishlistItem.upsert({
        where: { userId_productId: { userId: user.id, productId: product.id } },
        update: {},
        create: { userId: user.id, productId: product.id }
      });
    }
  }
  return { ok: true };
}

export async function getServerWishlist(): Promise<string[]> {
  const user = await getSessionUser();
  if (!user) return [];
  const rows = await db.wishlistItem.findMany({ where: { userId: user.id }, include: { product: { select: { slug: true } } } });
  return rows.map((r) => r.product.slug);
}
