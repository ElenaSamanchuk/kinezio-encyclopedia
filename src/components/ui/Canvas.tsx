"use client";

import { useLayoutEffect, useRef } from "react";

import { SALE_END_MS } from "@/lib/content";

/**
 * Both artboards are fixed-width canvases (1440 desktop / 430 mobile). When the
 * viewport is narrower we zoom the canvas down so the layout stays
 * pixel-proportional to the Figma frame instead of reflowing. `zoom` — rather
 * than `transform: scale` — keeps the document height correct on its own.
 */
export function Canvas({
  width,
  className = "",
  children,
}: {
  width: number;
  className?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const fit = () => {
      const vw = document.documentElement.clientWidth;
      el.style.zoom = vw >= width ? "1" : String(vw / width);
    };

    fit();
    window.addEventListener("resize", fit);

    /*
     * Акция кончилась. Статика собрана до дедлайна, поэтому в разметке лежит
     * акционный вариант; здесь он переключается на обычный. Проверка на
     * клиенте, а не при сборке: страницу открывают когда угодно после.
     */
    // Флаг нужен и на канвасе (правила сжатия карточки завязаны на его
    // data-kin-canvas), и на оболочке артборда — плавающая кнопка лежит рядом
    // с канвасом, а не внутри, иначе зум сломал бы её фиксацию.
    const saleOver = () => {
      const shell = el.parentElement ?? el;
      el.setAttribute("data-kin-sale-over", "");
      shell.setAttribute("data-kin-sale-over", "");
      // Плавающая кнопка — сосед канваса, а не его потомок. В сборке Тильды
      // селекторы scoped-ятся в `.kin-root …`, поэтому флаг на корне до неё
      // не достаёт: ставим его и на саму кнопку.
      shell
        .querySelectorAll<HTMLElement>("[data-kin-sticky-cta]")
        .forEach((node) => node.setAttribute("data-kin-sale-over", ""));
      shell.querySelectorAll<HTMLElement>("[data-kin-after]").forEach((node) => {
        const after = node.getAttribute("data-kin-after");
        if (after) node.textContent = after;
      });
      // Прячем и стилем: скрытие не должно зависеть от того, как сборщик
      // перепишет селекторы.
      shell
        .querySelectorAll<HTMLElement>("[data-kin-sale-only]")
        .forEach((node) => (node.style.display = "none"));
    };

    // Открыли страницу после дедлайна — переключаем сразу. Открыли до и
    // оставили висеть — переключим в момент, когда таймер добежит до нуля,
    // иначе цена так и осталась бы акционной до перезагрузки.
    let saleTimer: number | undefined;
    if (Date.now() > SALE_END_MS) saleOver();
    else saleTimer = window.setTimeout(saleOver, SALE_END_MS - Date.now() + 1000);

    const nodes = el.querySelectorAll("[data-kin-reveal]");
    const reduce =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let io: IntersectionObserver | undefined;
    if (reduce || typeof IntersectionObserver === "undefined") {
      nodes.forEach((node) => node.classList.add("kin-in"));
    } else {
      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("kin-in");
            io?.unobserve(entry.target);
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
      );
      nodes.forEach((node) => io!.observe(node));
    }

    return () => {
      window.removeEventListener("resize", fit);
      io?.disconnect();
      if (saleTimer) clearTimeout(saleTimer);
    };
  }, [width]);

  return (
    <div
      ref={ref}
      data-kin-canvas={width}
      className={`mx-auto origin-top ${className}`}
      style={{ width }}
    >
      {children}
    </div>
  );
}
