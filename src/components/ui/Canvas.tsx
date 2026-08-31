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
    return () => window.removeEventListener("resize", fit);
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
