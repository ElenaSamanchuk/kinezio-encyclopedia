import { A } from "@/lib/assets";
import { MOMENT } from "@/lib/content";
import { Wave } from "@/components/ui/Wave";

export function Moment() {
  return (
    <section data-kin-reveal className="relative kin-gap h-[531px] w-[430px] overflow-hidden">
      <div className="absolute left-[-80px] top-[-34px] h-[620px] w-[1566px] border border-solid border-[rgba(255,255,255,0.2)] bg-[#14161a]" />
      <Wave src={A.waveDark} inset={[-27.31, -118.49, -29.41, -40.47]} parent={[430, 531]} />

      <h2 className="kin-h-trim-display font-display absolute left-[12px] top-[40px] whitespace-pre text-[24px] uppercase leading-[1.2] text-white">
        {MOMENT.titleLine1}
        <br />
        {MOMENT.titleLine2}
      </h2>
      <p className="absolute left-[12px] top-[128px] w-[393px] text-[14px] font-bold leading-[normal] text-white">
        {MOMENT.kicker}
      </p>

      <div className="absolute left-[12px] top-[167px] flex w-[406px] flex-col items-start justify-center gap-[12px]">
        {MOMENT.items.map((item) => (
          <div
            key={item.n}
            className="flex w-full items-center gap-[20px] rounded-[16px] bg-[#1f2126] p-[20px]"
          >
            <span className="flex size-[20px] shrink-0 items-center justify-center rounded-[20px] bg-white text-center text-[10px] font-bold leading-[1.3] text-[#ff6332] backdrop-blur-[2px]">
              {item.n}
            </span>
            <p className="min-w-px flex-1 text-[14px] font-semibold leading-[1.3] text-white">
              {item.lines.map((line, i) => (
                <span key={line}>
                  {i > 0 && <br />}
                  {line}
                </span>
              ))}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
