import { PRICE, PRICING } from "@/lib/content";
import { BuyButton } from "@/components/ui/BuyButton";
import { Chip } from "@/components/ui/Chip";

export function Pricing() {
  return (
    <section data-kin-reveal id="pricing" className="kin-col mt-[151px] flex flex-col items-start gap-[36px]">
      <h2 className="font-display w-full text-[30px] uppercase leading-[1.5] text-[#242424]">
        {PRICING.title}
      </h2>

      <div className="flex w-full items-center gap-[32px]">
        <article className="shadow-card flex min-w-px flex-1 flex-col justify-between self-stretch overflow-hidden rounded-[20px] bg-white p-[36px]">
          <div className="flex w-full flex-col items-start gap-[12px] text-[16px] text-[#242424]">
            <p className="w-full font-bold leading-[1.3]">{PRICING.main.title}</p>
            <p className="w-full font-medium leading-[1.3]">{PRICING.main.body}</p>
          </div>
          <Foot price={PRICE.now} badge={PRICE.discountLabel} plan="full" />
        </article>

        <article className="shadow-card flex min-w-px flex-1 flex-col items-start gap-[40px] self-stretch overflow-hidden rounded-[20px] bg-white p-[36px]">
          <div className="flex w-full flex-col items-start gap-[12px] text-[#242424]">
            <p className="w-full text-[16px] font-bold leading-[1.3]">{PRICING.club.title}</p>
            <p className="w-full text-[14px] font-medium leading-[1.3]">{PRICING.club.body}</p>
          </div>
          <Foot price={PRICE.kinezio} badge={PRICE.kinezioLabel} plan="club" />
        </article>
      </div>
    </section>
  );
}

function Foot({
  price,
  badge,
  plan,
}: {
  price: string;
  badge: string;
  plan: "full" | "club";
}) {
  return (
    <div className="flex w-full items-end justify-between">
      <div className="flex flex-col items-start gap-[16px]">
        <p className="font-display whitespace-nowrap text-[30px] uppercase leading-[1.2] text-[#e42525]">
          {price}
        </p>
        <div className="flex items-start gap-[12px]">
          <p className="whitespace-nowrap text-[20px] font-semibold uppercase leading-[1.2] text-[#242424] line-through decoration-solid">
            {PRICE.old}
          </p>
          <Chip tone="redSoft" className="whitespace-nowrap text-center text-[12px] font-semibold leading-[1.3]">
            {badge}
          </Chip>
        </div>
      </div>
      <BuyButton plan={plan} className="shrink-0 px-[60px] py-[20px] text-[16px] font-bold tracking-[-0.48px]" />
    </div>
  );
}
