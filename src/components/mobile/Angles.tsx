import { A } from "@/lib/assets";
import { ANGLES } from "@/lib/content";
import { Chip } from "@/components/ui/Chip";

export function Angles() {
  return (
    <section className="mx-auto mt-[68px] flex w-[406px] flex-col items-start gap-[40px]">
      <div className="relative h-[290px] w-full">
        <h2 className="absolute left-0 top-0 w-[324px] text-[24px] font-semibold leading-[normal] text-[#242424]">
          {ANGLES.title}
        </h2>
        <Chip
          tone="orangeText"
          className="absolute left-0 top-[90px] whitespace-nowrap text-center text-[12px] font-semibold leading-[1.3]"
        >
          {ANGLES.chip}
        </Chip>

        <div className="absolute left-0 top-[148px] flex size-[50px] items-start rounded-[15px] bg-[rgba(255,127,55,0.3)] p-[13px]">
          <img src={A.iconStar} alt="" aria-hidden className="size-[24px]" />
        </div>
        <div className="absolute left-[196px] top-[148px] flex size-[50px] items-start rounded-[15px] bg-[rgba(255,127,55,0.3)] p-[13px]">
          <img src={A.iconStar} alt="" aria-hidden className="size-[24px]" />
        </div>

        <p className="absolute left-0 top-[216px] w-[176px] text-[14px] font-medium leading-[1.3] text-[#242424]">
          {ANGLES.left}
        </p>
        <p className="absolute left-[196px] top-[218px] w-[199px] text-[14px] font-medium leading-[1.3] text-[#242424]">
          {ANGLES.rightMobileLines[0]}
          <br />
          {ANGLES.rightMobileLines[1]}
        </p>
      </div>

      <div className="relative h-[228.375px] w-full shrink-0 overflow-hidden rounded-[15.82px]">
        <img
          src={A.videoThumb}
          alt="Разбор упражнения с нескольких камер"
          className="absolute inset-0 size-full max-w-none object-cover"
        />
        <div className="absolute inset-0 bg-[rgba(0,0,0,0.4)]" />
        <button
          type="button"
          aria-label="Смотреть превью"
          className="absolute left-[182.38px] top-[93.57px] flex size-[41.234px] cursor-pointer items-center justify-center rounded-full bg-[rgba(255,255,255,0.4)] backdrop-blur-[7.159px]"
        >
          <img
            src={A.iconPlay}
            alt=""
            aria-hidden
            className="h-[19.031px] w-[16.652px] pl-[2px]"
          />
        </button>
      </div>
    </section>
  );
}
