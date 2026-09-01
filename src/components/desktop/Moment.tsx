import { A } from "@/lib/assets";
import { MOMENT } from "@/lib/content";
import { Wave } from "@/components/ui/Wave";

export function Moment() {
  return (
    <section data-kin-reveal className="kin-bleed kin-bleed-dark relative kin-gap h-[363px] w-full bg-[#14161a]">
      <div className="absolute inset-0 overflow-hidden">
      <div className="absolute left-[-80px] top-[-34px] h-[620px] w-[1566px] border border-solid border-[rgba(255,255,255,0.2)] bg-[#14161a]" />
      <Wave src={A.waveDark} inset={[-85.9, -5.55, -136.08, -3.06]} parent={[1440, 363]} />

      <p className="kin-h-trim absolute left-[120px] top-[80px] w-[372px] text-[16px] font-bold leading-[normal] text-white">
        {MOMENT.kicker}
      </p>
      <h2 className="font-display absolute left-[120px] top-[211px] w-[483px] text-[30px] uppercase leading-[1.2] text-white">
        {MOMENT.titleLine1}
        <br />
        {MOMENT.titleLine2}
      </h2>

      <div className="absolute left-[630px] top-[80px] flex w-[690px] flex-wrap content-center items-center gap-[18px]">
        {MOMENT.items.map((item) => (
          <div
            key={item.n}
            className="flex w-[336px] items-center gap-[20px] rounded-[16px] bg-[#1f2126] p-[20px]"
          >
            <span className="flex size-[24px] shrink-0 items-center justify-center rounded-[20px] bg-white text-center text-[12px] font-bold leading-[1.3] text-[#ff6332] backdrop-blur-[2px]">
              {item.n}
            </span>
            <p className="min-w-px flex-1 text-[16px] font-semibold leading-[1.3] text-white">
              {item.text}
            </p>
          </div>
        ))}
      </div>
      </div>
    </section>
  );
}
