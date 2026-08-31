import { Img } from "@/components/ui/Img";

/**
 * The diagonal light-sweep decoration. In Figma it is a -23.07deg rotated
 * vector sheet laid inside an oversized box; the box is given as inset
 * percentages of its section, and the sheet's own size follows a fixed ratio
 * of that box (the hypot() expressions in the exported code).
 */
type WaveProps = {
  src: string;
  /** [top, right, bottom, left] inset, in percent of the parent section. */
  inset: [number, number, number, number];
  /** Parent section size in px, used to resolve the percentages. */
  parent: [number, number];
  className?: string;
};

export function Wave({ src, inset, parent, className = "" }: WaveProps) {
  const [pw, ph] = parent;
  const [t, r, b, l] = inset;

  const left = (l / 100) * pw;
  const top = (t / 100) * ph;
  const width = pw - (l / 100) * pw - (r / 100) * pw;
  const height = ph - (t / 100) * ph - (b / 100) * ph;

  const sheetW = Math.hypot(0.832794 * width, 0.474695 * height);
  const sheetH = Math.hypot(0.167206 * width, 0.525305 * height);

  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute flex items-center justify-center ${className}`}
      style={{ left, top, width, height }}
    >
      <Img
        src={src}
        alt=""
        className="block max-w-none shrink-0"
        style={{
          width: sheetW,
          height: sheetH,
          transform: "rotate(-23.07deg)",
        }}
      />
    </div>
  );
}
