"use client";

import { useLayoutEffect, useRef } from "react";

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
