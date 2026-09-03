"use client";

import { useEffect, useRef, useState } from "react";
import { BuyButton } from "@/components/ui/BuyButton";
import { PRICE, STICKY_CTA } from "@/lib/content";

/**
 * Mobile-only CTA that follows the page. On desktop it would sit beside the
 * chat widget, and that artboard already carries the CTA in the hero, the
 * tariffs and the final block. It hides while a section that already shows its
 * own «Купить» is on screen (hero, тарифы, финальный блок), so the two never
 * stack. Lives outside <Canvas> — the canvas `zoom` would otherwise become the
 * containing block and the bar would scroll away with the page.
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

  /*
   * A full-bleed bar sits under whatever chat widget the page carries, and the
   * widget is a third party we cannot select by name — on the live page it is
   * `#sw-fab-stack`, nested, not a child of body. So: scan the whole document
   * for small fixed boxes hugging the bottom-right corner and lift those. The
   * width guard keeps Tilda's own full-width fixed panels out of it, and the
   * rescans catch widgets whose script loads after us.
   */
  useEffect(() => {
    const bar = ref.current;
    if (!bar) return;
    const moved = new Set<HTMLElement>();

    /** Зазор между низом виджета и верхом полосы. */
    const GAP = 12;

    const apply = () => {
      // Верх полосы в покое: она прижата к низу, анимация появления не должна
      // влиять на расчёт.
      const barTop = window.innerHeight - bar.offsetHeight;
      document.querySelectorAll<HTMLElement>("*").forEach((el) => {
        if (el === bar || el.contains(bar) || bar.contains(el)) return;
        if (el.closest(".kin-root")) return;
        const cs = getComputedStyle(el);
        if (cs.position !== "fixed") return;
        // Меряем без своего сдвига, иначе на повторном проходе виджет
        // «уползал» бы дальше с каждым разом.
        const prev = el.style.transform;
        const prevTransition = el.style.transition;
        el.style.transition = "none";
        el.style.transform = "";
        const r = el.getBoundingClientRect();
        el.style.transform = prev;
        el.style.transition = prevTransition;
        if (r.width < 20 || r.height < 20) return;
        if (r.width > window.innerWidth * 0.6) return;
        if (window.innerHeight - r.bottom > 200) return;
        if (window.innerWidth - r.right > 200) return;
        // Поднимаем ровно на перекрытие плюс зазор, а не на всю высоту полосы:
        // виджет и так может стоять выше края экрана.
        const lift = show ? Math.max(0, Math.round(r.bottom - barTop + GAP)) : 0;
        el.style.transition = "transform 0.25s ease";
        el.style.transform = lift ? `translateY(-${lift}px)` : "";
        moved.add(el);
      });
    };

    apply();
    const timers = [1000, 3000, 6000].map((ms) => window.setTimeout(apply, ms));
    window.addEventListener("resize", apply);
    return () => {
      timers.forEach(clearTimeout);
      window.removeEventListener("resize", apply);
      moved.forEach((el) => (el.style.transform = ""));
    };
  }, [show]);

  // Срок стоит внутри кнопки мелкой строкой над ценой: одна цель нажатия,
  // ничего не выступает за её края.
  return (
    <div
      ref={ref}
      data-kin-sticky-cta
      data-kin-show={show}
      className="fixed inset-x-0 bottom-0 z-50 flex px-[12px]"
    >
      <BuyButton
        className={`w-full flex-col gap-[2px] px-[16px] py-[9px] ${className}`}
      >
        <span data-kin-sale-only className="text-[10px] font-medium leading-[12px] text-white/85">
          {STICKY_CTA.note}
        </span>
        <span
          data-kin-after={`${STICKY_CTA.labelAfter} ${PRICE.old}`}
          className="text-[14px] font-bold uppercase leading-[17px] tracking-[-0.42px]"
        >
          {STICKY_CTA.label} {PRICE.now}
        </span>
      </BuyButton>
    </div>
  );
}
