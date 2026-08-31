"use client";

import { useEffect, useState } from "react";
import { BuyButton } from "@/components/ui/BuyButton";
import { STICKY_CTA } from "@/lib/content";

/**
 * Mobile-only CTA that follows the page. It hides while a section that already
 * shows its own «Купить» is on screen (hero, тарифы, финальный блок), so the
 * two never stack. Lives outside <Canvas> — the canvas `zoom` would otherwise
 * become the containing block and the bar would scroll away with the page.
 */
export function StickyBuy() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const stops = Array.from(document.querySelectorAll("[data-kin-cta-stop]"));
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
    <div data-kin-sticky-cta data-kin-show={show} className="fixed bottom-0 left-0 z-50 flex pl-[16px]">
      <BuyButton className="px-[28px] py-[14px] text-[15px] font-bold leading-[18px] tracking-[-0.45px]">
        {STICKY_CTA}
      </BuyButton>
    </div>
  );
}
