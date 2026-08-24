"use client";

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  void error;
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <h1 className="font-serif text-3xl text-ink">Something went wrong.</h1>
      <p className="mt-3 max-w-sm text-sm leading-relaxed text-espresso/60">
        Please try again — your cart and details are safe.
      </p>
      <button onClick={reset} className="btn-base mt-8 bg-gold px-8 py-3.5 text-ink hover:bg-champagne">
        Try Again
      </button>
    </div>
  );
}
