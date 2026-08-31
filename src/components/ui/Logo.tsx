export function Logo({ className = "" }: { className?: string }) {
  return (
    <a
      href="#top"
      className={`font-logo block whitespace-pre font-black uppercase leading-none opacity-90 ${className}`}
      aria-label="KINEZIO FITNESS"
    >
      <span className="block text-[10px] leading-[1.2] text-[#242424]">
        {"   kinezio"}
      </span>
      <span className="logo-fitness block text-[10px] leading-[0.9]">fitness</span>
    </a>
  );
}
