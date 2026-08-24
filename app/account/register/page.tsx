import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { Logo } from "@/components/layout/header";
import { RegisterForm } from "@/components/account/auth-forms";

export const metadata: Metadata = { title: "Create Account" };

export default async function RegisterPage({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
  const user = await getSessionUser();
  if (user) redirect("/account");
  const nextParam = Array.isArray(searchParams.next) ? searchParams.next[0] : searchParams.next;

  return (
    <div className="container-talis flex max-w-lg flex-col items-center py-16 md:py-20">
      <Logo />
      <h1 className="mt-6 font-serif text-3xl text-ink">Join Talis</h1>
      <p className="mt-1 mb-8 text-sm text-espresso/60">Save your wishlist, track orders and reorder favourites.</p>
      <div className="w-full border border-beige bg-white p-7 shadow-card">
        <RegisterForm next={nextParam} />
      </div>
    </div>
  );
}
