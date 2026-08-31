import { A } from "@/lib/assets";
import { PHONE } from "@/lib/content";
import { Chip } from "@/components/ui/Chip";

export function PhoneSection() {
  return (
    <section className="relative mx-auto mt-[120px] h-[515px] w-[1400px] overflow-hidden rounded-[28px] bg-[#14161a]">
      <img
        src={A.phoneGlow}
        alt=""
        aria-hidden
        className="pointer-events-none absolute left-[1083px] top-[-115px] size-[442px] max-w-none mix-blend-overlay"
      />

      {/* phone mock-up */}
      <div className="absolute left-[100.357px] top-0 h-[685.35px] w-[419.642px]">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={A.phoneFrame}
            alt=""
            aria-hidden
            className="absolute left-[-35.51%] top-[-0.07%] h-[107.63%] w-[175.47%] max-w-none"
          />
        </div>
        <img
          src={A.phoneScreen}
          alt="Мобильная версия платформы"
          className="absolute left-[80.394px] top-[55.883px] h-[588.283px] w-[272.571px] max-w-none rounded-[37.258px] object-cover"
        />
        <div className="absolute left-[177.455px] top-[63.736px] h-[22.551px] w-[79.418px] rounded-[14.707px] bg-black" />
      </div>

      <h2 className="font-display absolute left-[554px] top-[80px] w-[483px] text-[30px] uppercase leading-[1.2] text-white">
        {PHONE.title}
      </h2>

      <Chip
        tone="orangeText"
        className="absolute left-[554px] top-[172px] whitespace-nowrap text-center text-[12px] font-semibold leading-[1.3]"
      >
        {PHONE.chipDesktop}
      </Chip>

      <p className="absolute left-[554px] top-[247px] w-[671px] -translate-y-full text-[16px] font-normal leading-[1.3] text-white">
        {PHONE.lead}
      </p>

      <div className="absolute left-[554px] top-[327px] flex w-[670px] items-center gap-[24px]">
        {PHONE.cards.map((card) => (
          <div
            key={card.title}
            className="flex min-w-px flex-1 flex-col items-start gap-[24px] rounded-[16px] bg-[#1f2126] p-[20px]"
          >
            <p className="font-display whitespace-nowrap text-[20px] uppercase leading-[1.3] text-[#ff6332]">
              {card.title}
            </p>
            <p className="text-[14px] font-normal leading-[1.3] text-white">{card.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
