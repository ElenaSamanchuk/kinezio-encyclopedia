import { A } from "@/lib/assets";
import { Img } from "@/components/ui/Img";
import { CERTIFICATE } from "@/lib/content";

const STEP_ICON = [A.iconModules, A.iconTeacher, A.iconCertificate];

export function Certificate() {
  return (
    <section data-kin-reveal className="kin-bleed kin-bleed-white relative kin-gap h-[419px] w-full bg-white">
      <div className="absolute inset-0 overflow-hidden">
      <h2 className="kin-h-trim absolute left-[120px] top-[60px] w-[537px] text-[30px] font-semibold leading-[normal] text-[#242424]">
        {CERTIFICATE.title}
      </h2>

      <div className="absolute left-[120px] top-[141px] h-[74px] w-[328px]">
        <Step left={0} width={50} icon={STEP_ICON[0]} label="Модули" />
        <Step left={116} width={84} icon={STEP_ICON[1]} label="Тестирование" />
        <Step left={255} width={73} icon={STEP_ICON[2]} label="Сертификат" orange />
        <Img
          src={A.lineArrow}
          alt=""
          aria-hidden
          className="absolute left-[71px] top-[19.23px] h-[11.55px] w-[40px] max-w-none"
        />
        <Img
          src={A.lineArrow}
          alt=""
          aria-hidden
          className="absolute left-[205px] top-[19.23px] h-[11.55px] w-[40px] max-w-none"
        />
      </div>

      <p className="absolute left-[120px] top-[297px] w-[560px] -translate-y-full text-[16px] font-semibold leading-[1.3] text-[#ff6332]">
        {CERTIFICATE.accentLines[0]}
        <br />
        {CERTIFICATE.accentLines[1]}
      </p>
      <p className="absolute left-[120px] top-[359px] w-[546px] -translate-y-full text-[16px] font-medium leading-[1.3] text-[#242424]">
        {CERTIFICATE.body}
      </p>

      <Img
        src={A.certificateD}
        alt="Сертификат KINEZIO FITNESS"
        className="absolute left-[821px] top-[60px] h-[299px] w-[499px] rounded-[20px] object-cover object-bottom"
      />
      <p className="absolute left-[841px] top-[339px] w-[402px] -translate-y-full text-[14px] font-medium leading-[1.3] text-white">
        {CERTIFICATE.note}
      </p>
      </div>
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
      className="absolute top-0 flex flex-col items-center gap-[8px]"
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
