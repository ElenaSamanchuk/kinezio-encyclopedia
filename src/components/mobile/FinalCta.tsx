import { A } from "@/lib/assets";
import { FINAL_CTA } from "@/lib/content";
import { BuyButton } from "@/components/ui/BuyButton";
import { Chip } from "@/components/ui/Chip";
import { Wave } from "@/components/ui/Wave";

export function FinalCta() {
  return (
    <section
      data-kin-cta-stop
      data-kin-reveal
      data-kin-sale-trim-final
      className="relative kin-gap h-[376px] w-[430px] overflow-hidden bg-[#14161a]"
    >
      <Wave src={A.waveDark} inset={[-76.06, -114.87, -134.78, -148.84]} parent={[430, 376]} />
      <Wave src={A.waveDark} inset={[-49.73, -349.29, -161.11, 85.58]} parent={[430, 376]} />

      <p className="kin-h-trim-display font-display absolute left-[calc(50%+0.5px)] top-[40px] -translate-x-1/2 whitespace-nowrap text-center text-[24px] uppercase leading-[1.2] text-white opacity-60">
        {FINAL_CTA.faded}
      </p>
      <h2
        data-kin-after={FINAL_CTA.titleAfter}
        className="font-display absolute left-[calc(50%+0.5px)] top-[85px] w-[301px] -translate-x-1/2 text-center text-[24px] uppercase leading-[1.2] text-white"
      >
        {FINAL_CTA.title}
      </h2>

      <div className="absolute left-1/2 top-[168px] flex -translate-x-1/2 flex-col items-center justify-center gap-[16px]">
        <Chip tone="orangeText" data-kin-sale-only className="whitespace-nowrap text-center text-[10px] font-semibold leading-[1.3]">
          {FINAL_CTA.chipLight}
        </Chip>
        <Chip tone="darkCard" className="whitespace-nowrap text-center text-[10px] font-semibold leading-[1.3]">
          {FINAL_CTA.chipDark}
        </Chip>
      </div>

      <BuyButton
        dark
        data-kin-sale-lift
        className="absolute left-[calc(50%+0.5px)] top-[279px] -translate-x-1/2 h-[51px] px-[40px] text-[14px] font-bold uppercase tracking-[-0.42px]"
      />
    </section>
  );
}
