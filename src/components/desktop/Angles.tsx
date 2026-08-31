import { A } from "@/lib/assets";
import { Img } from "@/components/ui/Img";
import { VideoPlayer } from "@/components/ui/VideoPlayer";
import { ANGLES } from "@/lib/content";
import { Chip } from "@/components/ui/Chip";

export function Angles() {
  return (
    <section data-kin-reveal className="kin-col kin-gap flex items-start gap-[52px]">
      <VideoPlayer
        src={A.anglesVideo}
        poster={A.anglesPoster}
        label="Смотреть разбор упражнения"
        className="h-[288px] w-[512px] shrink-0 rounded-[20px]"
        playClassName="size-[52px] backdrop-blur-[9.05px]"
        iconClassName="h-[24px] w-[21px] pl-[3px]"
      />

      <div className="relative h-[288px] min-w-0 flex-1">
        <h2 className="kin-h-trim absolute left-0 top-0 w-[395px] text-[30px] font-semibold leading-[normal] text-[#242424]">
          {ANGLES.title}
        </h2>
        <Chip
          tone="orangeText"
          className="absolute left-0 top-[102px] whitespace-nowrap text-center text-[12px] font-semibold leading-[1.3]"
        >
          {ANGLES.chip}
        </Chip>

        <div className="absolute left-0 top-[176px] flex size-[50px] items-start rounded-[15px] bg-[rgba(255,127,55,0.3)] p-[13px]">
          <Img src={A.iconStarAlt} alt="" aria-hidden className="size-[24px]" />
        </div>
        <div className="absolute left-[300px] top-[176px] flex size-[50px] items-start rounded-[15px] bg-[rgba(255,127,55,0.3)] p-[13px]">
          <Img src={A.iconStarAlt} alt="" aria-hidden className="size-[24px]" />
        </div>

        <p className="absolute left-0 top-[244px] w-[268px] text-[14px] font-medium leading-[1.3] text-[#242424]">
          {ANGLES.left}
        </p>
        <p className="absolute left-[300px] top-[244px] w-[309px] text-[14px] font-medium leading-[1.3] text-[#242424]">
          {ANGLES.right}
        </p>
      </div>
    </section>
  );
}
