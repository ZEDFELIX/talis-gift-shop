import Link from "next/link";

export default function NotFound() {
  return (
    <div className="talis-pattern flex min-h-[60vh] flex-col items-center justify-center px-6 py-24 text-center">
      <p className="font-serif text-7xl text-gold">404</p>
      <h1 className="mt-4 font-serif text-3xl text-ink">This feeling has moved</h1>
      <p className="mt-3 max-w-sm text-sm leading-relaxed text-espresso/60">
        The page you&apos;re looking for doesn&apos;t exist — but there are plenty of beautiful gifts waiting.
      </p>
      <Link href="/shop" className="btn-base mt-8 bg-ink px-8 py-3.5 text-ivory hover:bg-gold hover:text-ink">
        Explore Gifts
      </Link>
    </div>
  );
}
