import { A } from "@/lib/assets";
import { Img } from "@/components/ui/Img";
import { INTRO } from "@/lib/content";
import { MaskedPhoto } from "@/components/ui/MaskedPhoto";
import { Wave } from "@/components/ui/Wave";

export function Intro() {
  return (
    <section data-kin-reveal className="relative h-[555px] w-[430px] overflow-hidden bg-white">
      <Wave src={A.waveLight} inset={[-51.35, -147.89, -59.24, -115.81]} parent={[430, 555]} />

      <p className="absolute left-[12px] top-[40px] w-[235px] text-[14px] font-semibold leading-[normal] text-[#242424]">
        {INTRO.captionLeft}
      </p>

      <div className="absolute left-[12px] top-[94px] h-[176px] w-[406px] overflow-hidden rounded-[20px] bg-[#f5f5f5]">
        <p className="absolute left-[20px] top-[20px] w-[245px] text-[16px] font-bold leading-[normal] text-[#242424]">
          {INTRO.leftTitle}
        </p>
        <p className="absolute left-[20px] top-[76px] w-[252px] text-[12px] font-semibold leading-[1.3] text-[#8a8e96]">
          {INTRO.leftBodyMobile[0]}
          <br />
          {INTRO.leftBodyMobile[1]}
          <br />
          {INTRO.leftBodyMobile[2]}
        </p>
        <MaskedPhoto
          mask={A.maskPhoto1M}
          maskSize="184.15px 193px"
          src={A.photoTrainerA}
          className="left-[282.25px] top-0 h-[245.477px] w-[184.15px]"
        />
        <MaskedPhoto
          mask={A.maskPhoto2M}
          maskSize="164.664px 170.544px"
          maskPosition="0px -0.756px"
          src={A.photoTrainerB}
          className="left-[233.71px] top-[8.6px] h-[219.915px] w-[164.664px]"
        />
      </div>

      <p className="absolute left-[12px] top-[310px] w-[235px] text-[14px] font-semibold leading-[normal] text-[#242424]">
        {INTRO.captionRight}
      </p>

      <div
        className="absolute left-[12px] top-[345px] h-[170px] w-[406px] overflow-hidden rounded-[20px]"
        style={{
          backgroundImage:
            "linear-gradient(83.22deg, rgb(255, 126, 85) 1.02%, rgb(255, 97, 47) 92.9%)",
        }}
      >
        <Img
          src={A.cardArm}
          alt=""
          aria-hidden
          className="pointer-events-none absolute left-[307px] top-[-6px] h-[176px] w-[99px] max-w-none object-cover"
        />
        <p className="absolute left-[20px] top-[20px] w-[245px] text-[16px] font-bold leading-[normal] text-white">
          {INTRO.rightTitle}
        </p>
        <div className="absolute left-[20px] top-[54px] w-[274px] text-[12px] font-semibold text-white">
          <p className="leading-[1.3]">
            {INTRO.rightBody1a}
            <br />
            {INTRO.rightBody1b}
          </p>
          <p className="leading-[1.3]">&#8203;</p>
          <p className="leading-[1.3]">{INTRO.rightBody2}</p>
        </div>
      </div>
    </section>
  );
}
