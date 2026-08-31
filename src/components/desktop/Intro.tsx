import { A } from "@/lib/assets";
import { INTRO } from "@/lib/content";
import { MaskedPhoto } from "@/components/ui/MaskedPhoto";
import { Wave } from "@/components/ui/Wave";

export function Intro() {
  return (
    <section className="relative h-[401px] w-full overflow-hidden bg-white">
      <Wave src={A.waveLight} inset={[-80.3, 30.77, -111.17, -39.38]} parent={[1440, 401]} />

      <p className="absolute left-[140px] top-[80px] w-[489px] text-[16px] font-semibold leading-[normal] text-[#242424]">
        {INTRO.captionLeft}
      </p>
      <p className="absolute left-[732px] top-[80px] w-[275px] text-[16px] font-semibold leading-[normal] text-[#242424]">
        {INTRO.captionRight}
      </p>

      {/* left card — «Анатомию движения» прошли более тысячи человек */}
      <div className="absolute left-[140px] top-[128px] h-[193px] w-[568px] overflow-hidden rounded-[20px] bg-[#f5f5f5]">
        <p className="absolute left-[24px] top-[23px] w-[305px] text-[20px] font-bold leading-[normal] text-[#242424]">
          {INTRO.leftTitle}
        </p>
        <p className="absolute left-[24px] top-[89px] w-[356px] text-[14px] font-semibold leading-[1.3] text-[#8a8e96]">
          {INTRO.leftBody[0]}
          <br />
          {INTRO.leftBody[1]}
          <br />
          {INTRO.leftBody[2]}
        </p>
        <MaskedPhoto
          mask={A.maskPhoto1D}
          maskSize="260.482px 273px"
          src={A.photoTrainerA}
          className="left-[403.66px] top-[-40px] h-[347.229px] w-[260.482px]"
        />
        <MaskedPhoto
          mask={A.maskPhoto2D}
          maskSize="232.918px 241.236px"
          maskPosition="0px -1.069px"
          src={A.photoTrainerB}
          className="left-[335px] top-[-27.84px] h-[311.071px] w-[232.918px]"
        />
      </div>

      {/* right card — Знать упражнения мало */}
      <div className="absolute left-[732px] top-[128px] h-[193px] w-[568px] overflow-hidden rounded-[20px]">
        <div
          className="absolute left-0 top-0 h-[219px] w-[636px] rounded-[20px]"
          style={{
            backgroundImage:
              "linear-gradient(81.77deg, rgb(255, 126, 85) 1.02%, rgb(255, 97, 47) 92.9%)",
          }}
        />
        <img
          src={A.cardArm}
          alt=""
          aria-hidden
          className="pointer-events-none absolute left-[439px] top-0 h-[232px] w-[129px] max-w-none object-cover"
        />
        <p className="absolute left-[24px] top-[23px] w-[305px] text-[20px] font-bold leading-[normal] text-white">
          {INTRO.rightTitle}
        </p>
        <div className="absolute left-[24px] top-[62px] w-[356px] text-[14px] font-semibold text-white">
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
