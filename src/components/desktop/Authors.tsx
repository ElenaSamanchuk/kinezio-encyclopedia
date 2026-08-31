import { A } from "@/lib/assets";
import { Img } from "@/components/ui/Img";
import { AUTHORS } from "@/lib/content";
import { MaskedPhoto } from "@/components/ui/MaskedPhoto";

export function Authors() {
  return (
    <section data-kin-reveal id="authors" className="relative mt-[120px] h-[267px] w-full">
      <h2 className="font-display absolute left-1/2 top-0 w-[319px] -translate-x-1/2 text-center text-[20px] uppercase leading-[1.2] text-[#242424]">
        {AUTHORS.title}
      </h2>
      <p className="absolute left-[calc(50%+2px)] top-[75px] w-[564px] -translate-x-1/2 text-center text-[14px] font-medium leading-[1.3] text-[#363636]">
        {AUTHORS.lead1}
        <span className="font-bold">{AUTHORS.lead2}</span>
        {AUTHORS.lead3}
      </p>

      {/* Figma keeps a masked cut-out under the right photo card — the group clips it. */}
      <div className="absolute left-[1060px] top-0 h-[267px] w-[260px] overflow-hidden">
        <MaskedPhoto
          mask={A.maskAuthor}
          maskSize="290px 302px"
          maskPosition="-15px 0px"
          src={A.authorYuri}
          className="left-0 top-0 h-[322px] w-[271px]"
          imgClassName="absolute left-0 top-[-2.17%] h-[112.14%] w-full max-w-none"
        />
      </div>

      <Img
        src={A.authorCardLeft}
        alt="Алексей Одинцов"
        className="absolute left-[120px] top-[1px] h-[266px] w-[260px] rounded-[20px] object-cover"
      />
      <div className="absolute left-[1060px] top-0 h-[267px] w-[260px] overflow-hidden rounded-[20px]">
        <Img
          src={A.authorCardRight}
          alt="Юрий Емельянов"
          className="absolute left-0 top-[-0.11%] h-[115.7%] w-full max-w-none"
        />
      </div>

      <AuthorCard
        left={420}
        name={AUTHORS.alexey.name}
        roleLines={AUTHORS.alexey.roleLines}
      />
      <AuthorCard left={760} name={AUTHORS.yuri.name} roleLines={AUTHORS.yuri.roleLines} />
    </section>
  );
}

function AuthorCard({
  left,
  name,
  roleLines,
}: {
  left: number;
  name: string;
  roleLines: readonly string[];
}) {
  return (
    <>
      <div
        className="shadow-card absolute top-[177px] h-[90px] w-[260px] rounded-[20px] bg-white"
        style={{ left }}
      />
      <div
        className="absolute top-[202px] flex size-[39px] items-center justify-center rounded-[11.7px] bg-[rgba(255,127,55,0.3)]"
        style={{ left: left + 8 }}
      >
        <Img src={A.iconStar} alt="" aria-hidden className="size-[18.72px]" />
      </div>
      <div
        className="absolute top-[177px] flex h-[90px] w-[203px] flex-col justify-center text-[12px] font-medium text-[#363636]"
        style={{ left: left + 61 }}
      >
        <p className="font-bold leading-[1.3]">{name}</p>
        <p className="leading-[1.3]">
          {roleLines.map((line, i) => (
            <span key={line}>
              {i > 0 && <br />}
              {line}
            </span>
          ))}
        </p>
      </div>
    </>
  );
}
