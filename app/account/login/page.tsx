import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { Logo } from "@/components/layout/header";
import { LoginForm } from "@/components/account/auth-forms";

export const metadata: Metadata = { title: "Sign In" };

export default async function LoginPage({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
  const user = await getSessionUser();
  if (user) redirect("/account");
  const nextParam = Array.isArray(searchParams.next) ? searchParams.next[0] : searchParams.next;

  return (
    <div className="container-talis flex max-w-lg flex-col items-center py-16 md:py-20">
      <Logo />
      <h1 className="mt-6 font-serif text-3xl text-ink">Welcome back</h1>
      <p className="mt-1 mb-8 text-sm text-espresso/60">Your feelings have been waiting for you.</p>
      <div className="w-full border border-beige bg-white p-7 shadow-card">
        <LoginForm next={nextParam} />
      </div>
      <p className="mt-6 rounded-sm border border-dashed border-beige px-4 py-2.5 text-center text-xs leading-relaxed text-espresso/50">
        Demo customer: <strong>sarah@example.com</strong> / <strong>Password123!</strong><br />
        Demo admin: <strong>admin@talisgiftshop.co.ke</strong> / <strong>TalisAdmin123!</strong>
      </p>
    </div>
  );
}
