type ChipProps = React.ComponentPropsWithoutRef<"span"> & {
  children: React.ReactNode;
  tone?: "white" | "dark" | "darkCard" | "orangeText" | "redSoft";
};

const TONES: Record<NonNullable<ChipProps["tone"]>, string> = {
  white: "bg-white text-[#242424]",
  dark: "bg-[#242424] text-white",
  darkCard: "bg-[#1f2126] text-white",
  orangeText: "bg-white text-[#ff6332]",
  redSoft: "bg-[rgba(229,37,37,0.1)] text-[#e42525]",
};

export function Chip({ children, tone = "white", className = "", ...rest }: ChipProps) {
  const isBadge = tone === "redSoft";
  return (
    <span
      {...rest}
      className={`inline-flex items-center justify-center backdrop-blur-[2px] ${
        isBadge ? "rounded-[1px] px-[12px] py-[4px]" : "rounded-[20px] px-[14px] py-[9px]"
      } ${TONES[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
