import { HERO, HERO_CHIPS, PRICE } from "@/lib/content";
import { BuyButton } from "@/components/ui/BuyButton";
import { Chip } from "@/components/ui/Chip";
import { Countdown } from "@/components/ui/Countdown";

export function Hero() {
  return (
    <section data-kin-cta-stop id="top" data-kin-sale-trim className="relative h-[755px] w-[430px] bg-white">
      <div className="grad-hero-m absolute left-[10px] top-[54px] h-[701px] w-[410px] rounded-[24px]" />

      <div className="absolute left-[30px] top-[94px] flex w-[370px] flex-col items-center gap-[20px] text-center">
        <p className="font-display w-full text-[16px] uppercase leading-[1.2] text-[#8a8e96]">
          {HERO.eyebrowLead}
          <span className="text-[#ff6332]">{HERO.eyebrowAccent}</span>
        </p>
        <h1 className="font-display w-full text-[30px] uppercase leading-[1.2] text-[#242424]">
          {HERO.title}
        </h1>
        <p className="w-full text-[14px] font-semibold leading-[1.3] text-[#242424]">
          {HERO.leadMobileLine1}
          <br />
          {HERO.leadMobileLine2}
        </p>
      </div>

      <div className="absolute left-[48px] top-[316px] flex h-[109px] w-[335px] flex-wrap content-start items-start justify-center gap-[8px]">
        {HERO_CHIPS.map((chip) => (
          <Chip
            key={chip.label}
            tone={chip.dark ? "dark" : "white"}
            className="whitespace-nowrap text-center text-[10px] font-medium leading-[1.3]"
          >
            {chip.label}
          </Chip>
        ))}
      </div>

      <div
        data-kin-sale-shrink
        className="shadow-hero-card absolute left-[30px] top-[461px] flex h-[267px] w-[370px] flex-col items-center gap-[20px] rounded-[16px] bg-white py-[20px]"
      >
        <Chip
          tone="redSoft"
          data-kin-sale-only
          className="whitespace-nowrap text-center text-[12px] font-semibold leading-[1.3]"
        >
          {PRICE.discountLabel}
        </Chip>
        <div className="flex h-[24px] items-center gap-[12px] uppercase leading-[1.2]">
          <span data-kin-after={PRICE.old} className="font-display text-[20px] text-[#e42525]">
            {PRICE.now}
          </span>
          <span
            data-kin-sale-only
            className="text-[16px] font-semibold text-[#242424] line-through decoration-solid"
          >
            {PRICE.old}
          </span>
        </div>
        <BuyButton className="h-[51px] w-[330px] text-[16px] font-semibold uppercase tracking-[-0.48px]" />
        <div
          data-kin-sale-only
          className="flex w-[180px] flex-col items-center gap-[8px] text-center leading-[1.3]"
        >
          <p className="w-full text-[12px] font-semibold uppercase text-[#242424]">
            до конца акции
          </p>
          <Countdown />
        </div>
      </div>
    </section>
  );
}
