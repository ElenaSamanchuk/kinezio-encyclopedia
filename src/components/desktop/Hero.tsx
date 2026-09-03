import { A } from "@/lib/assets";
import { HERO, HERO_CHIPS, PRICE } from "@/lib/content";
import { BuyButton } from "@/components/ui/BuyButton";
import { Chip } from "@/components/ui/Chip";
import { Countdown } from "@/components/ui/Countdown";
import { Img } from "@/components/ui/Img";

export function Hero() {
  return (
    <section data-kin-cta-stop id="top" className="kin-bleed relative h-[717px] w-full bg-[#f5f5f5]">
      <div className="kin-bleed kin-bleed-white absolute inset-0 w-full bg-white" />

      <div className="absolute left-[23px] top-[23px] h-[694px] w-[1394px] overflow-hidden rounded-[28px]">
        <div className="grad-hero-d absolute inset-0 rounded-[28px]" />

        <Img
          priority
          src={A.heroTrainer}
          alt="Тренер"
          className="pointer-events-none absolute left-[887px] top-0 h-[768px] w-[507px] max-w-none object-cover object-bottom"
        />

        <div className="absolute left-[97px] top-[80px] flex w-[584px] flex-col items-start gap-[20px]">
          <p className="font-display w-full text-[20px] uppercase leading-[1.2] text-[#8a8e96]">
            {HERO.eyebrowLead}
            <span className="text-[#ff6332]">{HERO.eyebrowAccent}</span>
          </p>
          <h1 className="font-display w-full text-[45px] uppercase leading-[1.2] text-[#242424]">
            {HERO.title}
          </h1>
          <p className="w-[641px] text-[16px] font-semibold leading-[1.3] text-[#242424]">
            {HERO.leadLine1}
            <br />
            {HERO.leadLine2}
          </p>
        </div>

        <div className="absolute left-[97px] top-[360px] flex w-[657px] flex-wrap content-start items-start gap-[15px]">
          {HERO_CHIPS.map((chip) => (
            <Chip
              key={chip.label}
              tone={chip.dark ? "dark" : "white"}
              className="whitespace-nowrap text-center text-[12px] font-medium leading-[1.3]"
            >
              {chip.label}
            </Chip>
          ))}
        </div>

        <div
          data-kin-sale-shrink
          className="shadow-hero-card absolute left-[97px] top-[467px] h-[167px] w-[587px] rounded-[16px] bg-white"
        />

        <div className="absolute left-[121px] top-[491px] flex w-[242px] flex-col items-start gap-[24px]">
          <div className="flex w-full items-center gap-[12px] whitespace-nowrap uppercase leading-[1.2]">
            <span data-kin-after={PRICE.old} className="font-display text-[30px] text-[#e42525]">
              {PRICE.now}
            </span>
            <span
              data-kin-sale-only
              className="text-[20px] font-semibold text-[#242424] line-through decoration-solid"
            >
              {PRICE.old}
            </span>
          </div>
          <BuyButton className="w-[291px] py-[20px] text-[16px] font-bold uppercase tracking-[-0.48px]" />
        </div>

        <div
          data-kin-sale-only
          className="absolute left-[463px] top-[475px] flex h-[151px] w-[214px] flex-col items-center gap-[27px] rounded-[12px] border border-solid border-[#ebebeb] bg-white p-[16px]"
        >
          <Chip tone="redSoft" className="whitespace-nowrap text-center text-[12px] font-semibold leading-[1.3]">
            {PRICE.discountLabel}
          </Chip>
          <div className="flex w-[180px] flex-col items-center gap-[8px] text-center leading-[1.3]">
            <p className="w-full text-[12px] font-semibold uppercase text-[#242424]">
              до конца акции
            </p>
            <Countdown />
          </div>
        </div>
      </div>
    </section>
  );
}
