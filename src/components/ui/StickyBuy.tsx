"use client";

import { useEffect, useRef, useState } from "react";
import { BuyButton } from "@/components/ui/BuyButton";
import { PRICE, STICKY_CTA } from "@/lib/content";

/**
 * CTA that follows the page. It hides while a section that already shows its
 * own «Купить» is on screen (hero, тарифы, финальный блок), so the two never
 * stack. Lives outside <Canvas> — the canvas `zoom` would otherwise become the
 * containing block and the bar would scroll away with the page.
 */
export function StickyBuy({
  className = "",
  full = false,
}: {
  className?: string;
  /** Full-bleed bar with the note and the countdown above the label. */
  full?: boolean;
}) {
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

  /*
   * A full-bleed bar sits under whatever chat widget the page carries, and the
   * widget is a third party we cannot select by name. Instead: anything fixed
   * in the bottom-right corner that is not ours gets lifted by the bar height
   * while the bar is up, and put back when it hides.
   */
  useEffect(() => {
    const bar = ref.current;
    if (!full || !bar) return;
    const lift = show ? Math.round(bar.getBoundingClientRect().height) : 0;
    const moved: HTMLElement[] = [];
    Array.from(document.body.children).forEach((node) => {
      const el = node as HTMLElement;
      if (el === bar || el.contains(bar)) return;
      const cs = getComputedStyle(el);
      if (cs.position !== "fixed") return;
      const r = el.getBoundingClientRect();
      if (!r.width || !r.height) return;
      if (window.innerHeight - r.bottom > 140) return;
      if (window.innerWidth - r.right > 140) return;
      el.style.transition = "transform 0.25s ease";
      el.style.transform = lift ? `translateY(-${lift}px)` : "";
      moved.push(el);
    });
    return () => moved.forEach((el) => (el.style.transform = ""));
  }, [show, full]);

  // Срок стоит внутри кнопки мелкой строкой над ценой: одна цель нажатия,
  // ничего не выступает за её края.
  return (
    <div
      ref={ref}
      data-kin-sticky-cta
      data-kin-show={show}
      className={
        full
          ? "fixed inset-x-0 bottom-0 z-50 flex px-[12px]"
          : "fixed bottom-0 left-0 z-50 flex pl-[24px]"
      }
    >
      <BuyButton
        className={`flex-col gap-[2px] py-[9px] ${full ? "w-full px-[16px]" : "px-[32px]"} ${className}`}
      >
        <span className="text-[10px] font-medium leading-[12px] text-white/85">
          {STICKY_CTA.note}
        </span>
        <span className="text-[14px] font-bold uppercase leading-[17px] tracking-[-0.42px]">
          {STICKY_CTA.label} {PRICE.now}
        </span>
      </BuyButton>
    </div>
  );
}
