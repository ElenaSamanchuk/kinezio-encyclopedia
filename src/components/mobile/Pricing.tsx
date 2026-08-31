import { PRICE, PRICING } from "@/lib/content";
import { BuyButton } from "@/components/ui/BuyButton";
import { Chip } from "@/components/ui/Chip";

export function Pricing() {
  return (
    <section id="pricing" className="mx-auto mt-[68px] flex w-[406px] flex-col items-start gap-[24px]">
      <h2 className="font-display w-full text-[24px] uppercase leading-[1.5] text-[#242424]">
        {PRICING.title}
      </h2>

      <div className="flex w-full flex-col items-start justify-center gap-[32px]">
        <article className="shadow-card flex w-full flex-col items-start gap-[40px] overflow-hidden rounded-[20px] bg-white p-[24px]">
          <div className="flex w-full flex-col items-start gap-[12px] text-[#242424]">
            <p className="w-full text-[16px] font-bold leading-[1.3]">{PRICING.main.title}</p>
            <p className="w-full text-[14px] font-medium leading-[1.3]">{PRICING.main.body}</p>
          </div>
          <Foot price={PRICE.now} badge={PRICE.discountLabel} buttonText="text-[14px] tracking-[-0.42px]" />
        </article>

        <article className="shadow-card flex w-full flex-col items-start gap-[40px] overflow-hidden rounded-[20px] bg-white p-[24px]">
          <div className="flex w-full flex-col items-start gap-[12px] text-[#242424]">
            <p className="w-full text-[16px] font-bold leading-[1.3]">{PRICING.club.title}</p>
            <p className="w-full text-[14px] font-medium leading-[1.3]">{PRICING.club.body}</p>
          </div>
          <Foot price={PRICE.kinezio} badge={PRICE.kinezioLabel} buttonText="text-[16px] tracking-[-0.48px]" />
        </article>
      </div>
    </section>
  );
}

function Foot({
  price,
  badge,
  buttonText,
}: {
  price: string;
  badge: string;
  buttonText: string;
}) {
  return (
    <div className="flex w-full flex-col items-start gap-[16px]">
      <div className="flex flex-col items-start gap-[16px]">
        <p className="font-display whitespace-nowrap text-[24px] uppercase leading-[1.2] text-[#e42525]">
          {price}
        </p>
        <div className="flex items-start gap-[12px]">
          <p className="whitespace-nowrap text-[16px] font-semibold uppercase leading-[1.2] text-[#242424] line-through decoration-solid">
            {PRICE.old}
          </p>
          <Chip tone="redSoft" className="whitespace-nowrap text-center text-[12px] font-semibold leading-[1.3]">
            {badge}
          </Chip>
        </div>
      </div>
      <BuyButton className={`w-full px-[60px] py-[16px] font-bold ${buttonText}`} />
    </div>
  );
}
