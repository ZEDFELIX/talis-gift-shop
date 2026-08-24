"use client";

import { useRef, useState } from "react";
import { cn } from "@/lib/utils";

export function ProductGallery({ images, alt }: { images: { url: string; alt: string | null }[]; alt: string }) {
  const [selected, setSelected] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  if (images.length === 0) return null;

  const onMobileScroll = () => {
    const el = trackRef.current;
    if (!el) return;
    const idx = Math.round(el.scrollLeft / el.clientWidth);
    setSelected(idx);
  };

  return (
    <div>
      <div
        className="relative aspect-square overflow-hidden bg-beige/40 md:aspect-[4/5]"
        role="group"
        aria-roledescription="image gallery"
        aria-label={`${alt} images`}
      >
        <div className="hidden h-full md:block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img key={images[selected].url} src={images[selected].url} alt={images[selected].alt ?? alt} className="h-full w-full animate-fadeIn object-cover" />
        </div>
        <div
          ref={trackRef}
          onScroll={onMobileScroll}
          className="no-scrollbar flex h-full snap-x snap-mandatory overflow-x-auto scroll-smooth md:hidden"
        >
          {images.map((img, i) => (
            <div key={i} className="h-full w-full shrink-0 snap-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.url} alt={img.alt ?? alt} loading={i === 0 ? "eager" : "lazy"} className="h-full w-full object-cover" />
            </div>
          ))}
        </div>
        <button
          onClick={() => document.getElementById("main-image")?.requestFullscreen?.()}
          className="absolute right-3 top-3 hidden h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[10px] font-semibold uppercase tracking-wider shadow-card hover:text-gold md:flex"
          aria-label="View image"
          id="main-image"
        >
          Zoom
        </button>
      </div>

      {images.length > 1 && (
        <>
          <div className="mt-3 grid grid-cols-5 gap-2" role="tablist" aria-label="Product thumbnails">
            {images.map((img, i) => (
              <button
                key={i}
                role="tab"
                aria-selected={i === selected}
                aria-label={`Image ${i + 1}`}
                onClick={() => setSelected(i)}
                className={cn(
                  "aspect-square overflow-hidden border transition-all",
                  i === selected ? "border-gold ring-1 ring-gold/40" : "border-beige opacity-70 hover:opacity-100"
                )}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.url} alt="" loading="lazy" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
          <div className="mt-3 flex justify-center gap-1.5 md:hidden" aria-hidden>
            {images.map((_, i) => (
              <span key={i} className={cn("h-1.5 rounded-full transition-all", i === selected ? "w-5 bg-gold" : "w-1.5 bg-beige")} />
            ))}
          </div>
          <p className="sr-only">Swipe to view more photos</p>
        </>
      )}
    </div>
  );
}
