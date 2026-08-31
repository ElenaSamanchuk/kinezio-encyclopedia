/** Reproduces Figma's alpha-mask groups (mask-image + mask-size + position). */
type MaskedPhotoProps = {
  mask: string;
  maskSize: string;
  maskPosition?: string;
  src: string;
  imgClassName?: string;
  className?: string;
  style?: React.CSSProperties;
};

export function MaskedPhoto({
  mask,
  maskSize,
  maskPosition = "0px 0px",
  src,
  imgClassName = "absolute inset-0 size-full max-w-none object-cover",
  className = "",
  style,
}: MaskedPhotoProps) {
  const maskStyle: React.CSSProperties = {
    WebkitMaskImage: `url("${mask}")`,
    maskImage: `url("${mask}")`,
    WebkitMaskRepeat: "no-repeat",
    maskRepeat: "no-repeat",
    WebkitMaskSize: maskSize,
    maskSize,
    WebkitMaskPosition: maskPosition,
    maskPosition,
    maskMode: "alpha",
  };

  return (
    <div className={`absolute overflow-hidden ${className}`} style={{ ...maskStyle, ...style }}>
      <img src={src} alt="" className={imgClassName} />
    </div>
  );
}
