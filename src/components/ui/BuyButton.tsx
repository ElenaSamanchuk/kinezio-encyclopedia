type BuyButtonProps = {
  className?: string;
  dark?: boolean;
  children?: React.ReactNode;
};

export function BuyButton({
  className = "",
  dark = false,
  children = "Купить",
}: BuyButtonProps) {
  return (
    <a
      href="#pricing"
      className={`grad-orange inline-flex items-center justify-center overflow-hidden rounded-[72px] text-center text-white transition-[filter] hover:brightness-[1.04] ${
        dark ? "shadow-cta-dark" : "shadow-cta"
      } ${className}`}
    >
      {children}
    </a>
  );
}
