import { A } from "@/lib/assets";
import { Img } from "@/components/ui/Img";
import { CERTIFICATE } from "@/lib/content";

export function Certificate() {
  return (
    <section data-kin-reveal className="relative mt-[68px] h-[623px] w-[430px] overflow-hidden bg-white">
      <h2 className="absolute left-[12px] top-[40px] w-[383px] text-[24px] font-semibold leading-[normal] text-[#242424]">
        {CERTIFICATE.title}
      </h2>

      <Step left={12} width={50} icon={A.iconModules} label="Модули" />
      <Step left={173} width={84} icon={A.iconTeacher} label="Тестирование" />
      <Step left={345} width={73} icon={A.iconCertificate} label="Сертификат" orange />
      <Img
        src={A.lineArrow}
        alt=""
        aria-hidden
        className="absolute left-[98px] top-[157.23px] h-[11.55px] w-[40px] max-w-none"
      />
      <Img
        src={A.lineArrow}
        alt=""
        aria-hidden
        className="absolute left-[276px] top-[157.23px] h-[11.55px] w-[40px] max-w-none"
      />

      <p className="absolute left-[12px] top-[280px] w-[406px] -translate-y-full text-[14px] font-semibold leading-[1.3] text-[#ff6332]">
        {CERTIFICATE.accent}
      </p>
      <p className="absolute left-[12px] top-[328px] w-[402px] -translate-y-full text-[14px] font-medium leading-[1.3] text-[#242424]">
        {CERTIFICATE.body}
      </p>

      <Img
        src={A.certificateM}
        alt="Сертификат KINEZIO FITNESS"
        className="absolute left-0 top-[360px] h-[263px] w-[430px] max-w-none object-cover object-bottom"
      />
      <p className="absolute left-[12px] top-[608px] w-[402px] -translate-y-full text-[14px] font-medium leading-[1.3] text-white">
        {CERTIFICATE.note}
      </p>
    </section>
  );
}

function Step({
  left,
  width,
  icon,
  label,
  orange = false,
}: {
  left: number;
  width: number;
  icon: string;
  label: string;
  orange?: boolean;
}) {
  return (
    <div
      className="absolute top-[138px] flex flex-col items-center gap-[8px]"
      style={{ left, width }}
    >
      <div
        className={`flex size-[50px] items-center justify-center rounded-[15px] p-[13px] ${
          orange ? "bg-[rgba(255,127,55,0.3)]" : "bg-[#f5f5f5]"
        }`}
      >
        <Img src={icon} alt="" aria-hidden className="size-[24px]" />
      </div>
      <span className="w-full text-center text-[12px] font-semibold leading-[1.3] text-[#242424]">
        {label}
      </span>
    </div>
  );
}
