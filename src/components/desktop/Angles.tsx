import { A } from "@/lib/assets";
import { ANGLES } from "@/lib/content";
import { Chip } from "@/components/ui/Chip";

export function Angles() {
  return (
    <section className="mx-auto mt-[138px] flex w-[1173px] items-start gap-[52px]">
      <div className="relative h-[288px] w-[512px] shrink-0 overflow-hidden rounded-[20px]">
        <img
          src={A.videoThumb}
          alt="Разбор упражнения с нескольких камер"
          className="absolute inset-0 size-full max-w-none object-cover"
        />
        <div className="absolute inset-0 bg-[rgba(0,0,0,0.4)]" />
        <button
          type="button"
          aria-label="Смотреть превью"
          className="absolute left-[230px] top-[118px] flex size-[52px] cursor-pointer items-center justify-center rounded-full bg-[rgba(255,255,255,0.4)] backdrop-blur-[9.05px] transition-transform hover:scale-105"
        >
          <img src={A.iconPlay} alt="" aria-hidden className="h-[24px] w-[21px] pl-[3px]" />
        </button>
      </div>

      <div className="relative h-[288px] w-[609px] shrink-0">
        <h2 className="absolute left-0 top-0 w-[395px] text-[30px] font-semibold leading-[normal] text-[#242424]">
          {ANGLES.title}
        </h2>
        <Chip
          tone="orangeText"
          className="absolute left-0 top-[102px] whitespace-nowrap text-center text-[12px] font-semibold leading-[1.3]"
        >
          {ANGLES.chip}
        </Chip>

        <div className="absolute left-0 top-[176px] flex size-[50px] items-start rounded-[15px] bg-[rgba(255,127,55,0.3)] p-[13px]">
          <img src={A.iconStarAlt} alt="" aria-hidden className="size-[24px]" />
        </div>
        <div className="absolute left-[300px] top-[176px] flex size-[50px] items-start rounded-[15px] bg-[rgba(255,127,55,0.3)] p-[13px]">
          <img src={A.iconStarAlt} alt="" aria-hidden className="size-[24px]" />
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
