"use server";

import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { hashPassword, verifyPassword, setSessionCookie, clearSessionCookie, getSessionUser } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";

export type AuthResult = { ok: boolean; message?: string };

export async function registerUser(_prev: unknown, formData: FormData): Promise<AuthResult> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const phone = String(formData.get("phone") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/account");

  if (!name || name.length < 2) return { ok: false, message: "Please enter your full name." };
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return { ok: false, message: "Please enter a valid email address." };
  if (password.length < 8) return { ok: false, message: "Password must be at least 8 characters." };

  const existing = await db.user.findUnique({ where: { email } });
  if (existing) return { ok: false, message: "An account with this email already exists." };

  let user;
  try {
    user = await db.user.create({
      data: { name, email, phone: phone || null, passwordHash: hashPassword(password) }
    });
  } catch (e) {
    if ((e as { code?: string }).code === "P2002") {
      return { ok: false, message: "An account with this email already exists." };
    }
    throw e;
  }
  await setSessionCookie(user.id);
  redirect(next);
}

export async function loginUser(_prev: unknown, formData: FormData): Promise<AuthResult> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/account");
  void next;

  if (!rateLimit(`login:${email}`, 5, 60_000)) {
    return { ok: false, message: "Too many attempts. Please wait a minute and try again." };
  }

  const user = await db.user.findUnique({ where: { email } });
  if (!user || !verifyPassword(password, user.passwordHash)) {
    return { ok: false, message: "Incorrect email or password." };
  }

  await setSessionCookie(user.id);

  const redirectTo = String(formData.get("next") || "/account");
  redirect(redirectTo.startsWith("/") ? redirectTo : "/account");
}

export async function logoutUser() {
  await clearSessionCookie();
  redirect("/");
}

export async function updateProfile(formData: FormData): Promise<void> {
  const user = await getSessionUser();
  if (!user) redirect("/account/login");
  const name = String(formData.get("name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  if (name.length >= 2) {
    await db.user.update({ where: { id: user.id }, data: { name, phone: phone || null } });
  }
  redirect("/account?saved=1");
}

export async function addAddress(formData: FormData): Promise<void> {
  const user = await getSessionUser();
  if (!user) redirect("/account/login");
  const data = {
    label: String(formData.get("label") ?? "Home").trim() || "Home",
    name: String(formData.get("name") ?? user.name).trim(),
    phone: String(formData.get("phone") ?? "").trim(),
    city: String(formData.get("city") ?? "Nairobi").trim(),
    area: String(formData.get("area") ?? "").trim(),
    addressLine: String(formData.get("addressLine") ?? "").trim(),
    instructions: String(formData.get("instructions") ?? "").trim() || null
  };
  if (!data.addressLine || !data.phone) redirect("/account?addrError=1");
  const count = await db.address.count({ where: { userId: user.id } });
  await db.address.create({ data: { ...data, userId: user.id, isDefault: count === 0 } });
  redirect("/account?addrSaved=1");
}

export async function deleteAddress(formData: FormData): Promise<void> {
  const user = await getSessionUser();
  if (!user) redirect("/account/login");
  const id = String(formData.get("addressId") ?? "");
  if (id) await db.address.deleteMany({ where: { id, userId: user.id } });
  redirect("/account?addrDeleted=1");
}

export async function changePassword(formData: FormData): Promise<void> {
  const sessionUser = await getSessionUser();
  if (!sessionUser) redirect("/account/login");
  const current = String(formData.get("current") ?? "");
  const next = String(formData.get("next") ?? "");
  const user = await db.user.findUnique({ where: { id: sessionUser.id } });
  if (!user || !verifyPassword(current, user.passwordHash) || next.length < 8) {
    redirect("/account?pwError=1");
  }
  await db.user.update({ where: { id: user.id }, data: { passwordHash: hashPassword(next) } });
  redirect("/account?pwSaved=1");
}
