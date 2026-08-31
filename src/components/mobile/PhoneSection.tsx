import { A } from "@/lib/assets";
import { Img } from "@/components/ui/Img";
import { PHONE } from "@/lib/content";
import { Chip } from "@/components/ui/Chip";

export function PhoneSection() {
  return (
    <section data-kin-reveal className="relative mx-auto mt-[68px] h-[794px] w-[406px] overflow-hidden rounded-[24px] bg-[#14161a]">
      <Img
        src={A.phoneGlow}
        alt=""
        aria-hidden
        className="pointer-events-none absolute left-[629px] top-[-115px] size-[442px] max-w-none mix-blend-overlay"
      />

      <h2 className="font-display absolute left-1/2 top-[40px] w-[352px] -translate-x-1/2 text-center text-[24px] uppercase leading-[1.2] text-white">
        {PHONE.title}
      </h2>

      <Chip
        tone="orangeText"
        className="absolute left-1/2 top-[122px] -translate-x-1/2 whitespace-nowrap text-center text-[10px] font-semibold leading-[1.3]"
      >
        {PHONE.chipMobile}
      </Chip>

      <p className="absolute left-[calc(50%+0.5px)] top-[213px] w-[341px] -translate-x-1/2 -translate-y-full text-center text-[14px] font-medium leading-[1.3] text-white">
        {PHONE.lead}
      </p>

      <div className="absolute left-[24px] top-[237px] flex w-[358px] flex-col items-center gap-[12px] whitespace-nowrap text-center">
        {PHONE.cards.map((card) => (
          <div
            key={card.title}
            className="flex w-full flex-col items-center gap-[8px] rounded-[16px] bg-[#1f2126] p-[12px]"
          >
            <p className="font-display text-[16px] uppercase leading-[1.3] text-[#ff6332]">
              {card.title}
            </p>
            <p className="text-[12px] font-medium leading-[1.3] text-white">{card.body}</p>
          </div>
        ))}
      </div>

      <div className="absolute left-[30.15px] top-[387px] h-[564px] w-[345.339px]">
        <div className="absolute inset-0 overflow-hidden">
          <Img
            src={A.phoneFrame}
            alt=""
            aria-hidden
            className="absolute left-[-35.51%] top-[-0.07%] h-[107.63%] w-[175.47%] max-w-none"
          />
        </div>
        <Img
          src={A.phoneScreen}
          alt="Мобильная версия платформы"
          className="absolute left-[66.16px] top-[45.99px] h-[484.12px] w-[224.309px] max-w-none rounded-[37.258px] object-cover"
        />
        <div className="absolute left-[146.04px] top-[52.45px] h-[18.558px] w-[65.356px] rounded-[14.707px] bg-black" />
      </div>
    </section>
  );
}
