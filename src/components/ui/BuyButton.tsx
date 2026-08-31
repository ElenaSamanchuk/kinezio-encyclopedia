import { CHECKOUT } from "@/lib/content";

type BuyButtonProps = {
  className?: string;
  dark?: boolean;
  /** Club card is 4 990 ₽; every other CTA is 12 990 ₽. */
  plan?: keyof typeof CHECKOUT;
  /** Overrides the checkout link — the club card points at support instead. */
  href?: string;
  children?: React.ReactNode;
};

export function BuyButton({
  className = "",
  dark = false,
  plan = "full",
  href,
  children = "Купить",
}: BuyButtonProps) {
  return (
    <a
      href={href ?? CHECKOUT[plan]}
      target="_blank"
      rel="noopener noreferrer"
      className={`grad-orange inline-flex items-center justify-center overflow-hidden rounded-[72px] text-center text-white transition-[filter] hover:brightness-[1.04] ${
        dark ? "shadow-cta-dark" : "shadow-cta"
      } ${className}`}
    >
      {children}
    </a>
  );
}
