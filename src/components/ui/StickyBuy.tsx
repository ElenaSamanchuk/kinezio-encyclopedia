"use client";

import { useEffect, useRef, useState } from "react";
import { BuyButton } from "@/components/ui/BuyButton";
import { STICKY_CTA } from "@/lib/content";

/**
 * CTA that follows the page on both artboards. It hides while a section that
 * already shows its own «Купить» is on screen (hero, тарифы, финальный блок),
 * so the two never stack. Lives outside <Canvas> — the canvas `zoom` would
 * otherwise become the containing block and the bar would scroll away with the
 * page. The hidden artboard's stops never intersect, so each artboard's bar
 * answers only to the sections the visitor can actually see.
 */
export function StickyBuy({ className = "" }: { className?: string }) {
  const [show, setShow] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Both artboards render a bar; each answers only to the stops in its own
    // shell, so the hidden one can never speak for the visible one.
    const scope = ref.current?.parentElement ?? document;
    const stops = Array.from(scope.querySelectorAll("[data-kin-cta-stop]"));
    if (!stops.length) return;

    const visible = new Set<Element>();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) visible.add(entry.target);
          else visible.delete(entry.target);
        });
        setShow(visible.size === 0);
      },
      { rootMargin: "-15% 0px -15% 0px" }
    );
    stops.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} data-kin-sticky-cta data-kin-show={show} className="fixed bottom-0 left-0 z-50 flex pl-[16px]">
      <BuyButton className={`font-bold ${className}`}>
        {STICKY_CTA}
      </BuyButton>
    </div>
  );
}
