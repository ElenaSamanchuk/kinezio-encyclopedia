import { PRICE, PRICING, SUPPORT_TG } from "@/lib/content";
import { BuyButton } from "@/components/ui/BuyButton";
import { Chip } from "@/components/ui/Chip";

export function Pricing() {
  return (
    <section data-kin-cta-stop data-kin-reveal id="pricing" className="kin-col kin-gap flex flex-col items-start gap-[36px]">
      <h2 className="kin-h-trim-display font-display w-full text-[30px] uppercase leading-[1.5] text-[#242424]">
        {PRICING.title}
      </h2>

      <div className="flex w-full items-center gap-[32px]">
        <article className="shadow-card flex min-w-px flex-1 flex-col justify-between self-stretch overflow-hidden rounded-[20px] bg-white p-[36px]">
          <div className="flex w-full flex-col items-start gap-[12px] text-[16px] text-[#242424]">
            <p className="w-full font-bold leading-[1.3]">{PRICING.main.title}</p>
            <p className="w-full font-medium leading-[1.3]">{PRICING.main.body}</p>
          </div>
          <Foot price={PRICE.now} after={PRICE.old} badge={PRICE.discountLabel} plan="full" />
        </article>

        <article className="shadow-card flex min-w-px flex-1 flex-col items-start gap-[40px] self-stretch overflow-hidden rounded-[20px] bg-white p-[36px]">
          <div className="flex w-full flex-col items-start gap-[12px] text-[#242424]">
            <p className="w-full text-[16px] font-bold leading-[1.3]">{PRICING.club.title}</p>
            <p className="w-full text-[14px] font-medium leading-[1.3]">{PRICING.club.body}</p>
          </div>
          <Foot price={PRICE.kinezio} after={PRICE.kinezioAfter} badge={PRICE.kinezioLabel} plan="club" href={SUPPORT_TG} cta={PRICING.club.cta} />
        </article>
      </div>
    </section>
  );
}

function Foot({
  price,
  after,
  badge,
  plan,
  href,
  cta,
}: {
  price: string;
  after: string;
  badge: string;
  plan: "full" | "club";
  href?: string;
  cta?: string;
}) {
  return (
    <div className="flex w-full items-end justify-between gap-[16px]">
      <div className="flex flex-col items-start gap-[16px]">
        <p
          data-kin-after={after}
          className="font-display whitespace-nowrap text-[30px] uppercase leading-[1.2] text-[#e42525]"
        >
          {price}
        </p>
        <div data-kin-sale-only={plan === "full" ? "" : undefined} className="flex items-start gap-[12px]">
          <p className="whitespace-nowrap text-[20px] font-semibold uppercase leading-[1.2] text-[#242424] line-through decoration-solid">
            {PRICE.old}
          </p>
          <Chip tone="redSoft" className="whitespace-nowrap text-center text-[12px] font-semibold leading-[1.3]">
            {badge}
          </Chip>
        </div>
      </div>
      <BuyButton
        plan={plan}
        href={href}
        className={`h-[59px] shrink-0 font-bold ${
          cta ? "px-[16px] text-[14px] tracking-[-0.42px]" : "px-[60px] text-[16px] tracking-[-0.48px]"
        }`}
      >
        {cta}
      </BuyButton>
    </div>
  );
}
