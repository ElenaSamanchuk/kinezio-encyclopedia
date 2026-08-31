import { A } from "@/lib/assets";
import { AUTHORS } from "@/lib/content";
import { MaskedPhoto } from "@/components/ui/MaskedPhoto";

export function Authors() {
  return (
    <section id="authors" className="relative mt-[68px] h-[819px] w-[430px]">
      <h2 className="font-display absolute left-1/2 top-0 w-[350px] -translate-x-1/2 text-center text-[24px] uppercase leading-[1.2] text-[#242424]">
        {AUTHORS.title}
      </h2>
      <p className="absolute left-1/2 top-[82.375px] w-[406px] -translate-x-1/2 text-center text-[14px] font-medium leading-[1.3] text-[#363636]">
        {AUTHORS.leadMobile}
      </p>

      <div className="absolute left-[12px] top-[231px] h-[267px] w-[260px] overflow-hidden">
        <MaskedPhoto
          mask={A.maskAuthor}
          maskSize="290px 302px"
          maskPosition="10px 27.021px"
          src={A.authorAlexeyM}
          className="left-[-25px] top-[-27.02px] h-[343.021px] w-[285px]"
          imgClassName="absolute left-0 top-[-3.31%] h-[110.71%] w-full max-w-none"
        />
      </div>
      <AuthorCard
        left={158}
        top={422}
        name={AUTHORS.alexey.name}
        roleLines={AUTHORS.alexey.roleLinesMobile}
      />

      <div className="absolute left-[158px] top-[552px] h-[267px] w-[260px] overflow-hidden">
        <MaskedPhoto
          mask={A.maskAuthor}
          maskSize="290px 302px"
          maskPosition="-15px 0px"
          src={A.authorYuri}
          className="left-0 top-0 h-[322px] w-[271px]"
          imgClassName="absolute left-0 top-[-2.17%] h-[112.14%] w-full max-w-none"
        />
      </div>
      <AuthorCard
        left={12}
        top={729}
        name={AUTHORS.yuri.name}
        roleLines={AUTHORS.yuri.roleLinesMobile}
      />
    </section>
  );
}

function AuthorCard({
  left,
  top,
  name,
  roleLines,
}: {
  left: number;
  top: number;
  name: string;
  roleLines: readonly string[];
}) {
  return (
    <>
      <div
        className="shadow-card absolute h-[90px] w-[260px] rounded-[20px] bg-white"
        style={{ left, top }}
      />
      <div
        className="absolute flex size-[39px] items-center justify-center rounded-[11.7px] bg-[rgba(255,127,55,0.3)]"
        style={{ left: left + 8, top: top + 25 }}
      >
        <img src={A.iconStarAlt} alt="" aria-hidden className="size-[18.72px]" />
      </div>
      <div
        className="absolute flex h-[90px] w-[199px] flex-col justify-center text-[12px] font-medium text-[#363636]"
        style={{ left: left + 61, top }}
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
