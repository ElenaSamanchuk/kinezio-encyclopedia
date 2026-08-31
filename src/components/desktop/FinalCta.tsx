import { A } from "@/lib/assets";
import { FINAL_CTA } from "@/lib/content";
import { BuyButton } from "@/components/ui/BuyButton";
import { Chip } from "@/components/ui/Chip";
import { Wave } from "@/components/ui/Wave";

export function FinalCta() {
  return (
    <section className="relative mt-[124px] h-[425px] w-full overflow-hidden bg-[#14161a]">
      <Wave src={A.waveDark} inset={[-117.18, 13.82, -57.83, -22.43]} parent={[1440, 425]} />
      <Wave src={A.waveDark} inset={[-44, -63.68, -131.01, 55.07]} parent={[1440, 425]} />

      <p className="font-display absolute left-1/2 top-[80px] w-[604px] -translate-x-1/2 text-center text-[30px] uppercase leading-[1.2] text-white opacity-60">
        {FINAL_CTA.faded}
      </p>
      <h2 className="font-display absolute left-1/2 top-[128px] w-[604px] -translate-x-1/2 text-center text-[30px] uppercase leading-[1.2] text-white">
        {FINAL_CTA.title}
      </h2>

      <div className="absolute left-[calc(50%+0.5px)] top-[208px] flex -translate-x-1/2 items-center gap-[16px]">
        <Chip tone="orangeText" className="whitespace-nowrap text-center text-[12px] font-semibold leading-[1.3]">
          {FINAL_CTA.chipLight}
        </Chip>
        <Chip tone="darkCard" className="whitespace-nowrap text-center text-[12px] font-semibold leading-[1.3]">
          {FINAL_CTA.chipDark}
        </Chip>
      </div>

      <BuyButton
        dark
        className="absolute left-[calc(50%+0.5px)] top-[286px] -translate-x-1/2 px-[60px] py-[20px] text-[16px] font-bold uppercase tracking-[-0.48px]"
      />
    </section>
  );
}
