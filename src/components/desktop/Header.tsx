import { A } from "@/lib/assets";
import { NAV_LINKS } from "@/lib/content";
import { Logo } from "@/components/ui/Logo";

export function Header() {
  return (
    <header className="absolute left-0 top-[20px] z-20 h-[37px] w-full">
      <div className="absolute left-[23px] top-0 h-[37px] w-[487px] rounded-[70px] bg-white" />
      <Logo className="absolute left-[40px] top-[8px]" />
      <nav className="absolute left-[111px] top-[11px] flex h-[14px] items-start gap-[20px] whitespace-nowrap text-[11px] font-semibold leading-[1.3] text-[#242424]">
        {NAV_LINKS.map((link) => (
          <a key={link.href} href={link.href} className="transition-opacity hover:opacity-60">
            {link.label}
          </a>
        ))}
      </nav>
      <a
        href="#top"
        className="absolute left-[1256px] top-0 flex h-[36px] w-[161px] items-center justify-center gap-[5px] overflow-hidden rounded-[58px] bg-[#242424] px-[20px] py-[10px] transition-opacity hover:opacity-90"
      >
        <img src={A.iconUser} alt="" aria-hidden className="size-[12px] shrink-0" />
        <span className="whitespace-nowrap text-[13px] font-semibold leading-[1.2] text-white">
          Личный кабинет
        </span>
      </a>
    </header>
  );
}
