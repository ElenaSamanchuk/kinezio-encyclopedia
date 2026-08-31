import type { ImgHTMLAttributes } from "react";

type ImgProps = ImgHTMLAttributes<HTMLImageElement> & {
  /** Hero / LCP only. Everything else stays lazy. */
  priority?: boolean;
};

export function Img({
  priority = false,
  alt = "",
  loading,
  decoding,
  fetchPriority,
  ...rest
}: ImgProps) {
  return (
    <img
      {...rest}
      alt={alt}
      loading={loading ?? (priority ? "eager" : "lazy")}
      decoding={decoding ?? "async"}
      fetchPriority={fetchPriority ?? (priority ? "high" : undefined)}
    />
  );
}
