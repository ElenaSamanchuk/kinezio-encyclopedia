import { A } from "@/lib/assets";
import { Img } from "@/components/ui/Img";
import { THEORY } from "@/lib/content";

const CARD = "flex flex-col items-start rounded-[16px] bg-white p-[20px]";
const CARD_TITLE = "w-full text-[16px] font-bold leading-[1.3] text-[#ff6332]";
const CARD_BODY = "w-full text-[14px] font-medium leading-[1.3] text-[#242424]";
// Figma fills this slot with the portrait shot stretched to the box (the node
// carries no cover/contain scale mode), which is what keeps both heads and the
// hand on the shoulder in frame. object-cover here would crop away the hands.
const THEORY_PHOTO =
  "absolute inset-0 !h-full !w-full max-w-none object-fill";

export function Theory() {
  return (
    <section data-kin-reveal className="kin-col kin-gap flex flex-col items-start gap-[36px]">
      <h2 className="kin-h-trim w-full text-[30px] font-semibold leading-[normal] text-[#242424]">
        {THEORY.titleDesktop}
      </h2>

      <div className="grid w-full grid-cols-3 items-stretch gap-[20px]">
        <div className="flex min-w-0 flex-col items-start gap-[20px]">
          <div className={`${CARD} w-full gap-[28px]`}>
            <p className={CARD_TITLE}>{THEORY.clear.title}</p>
            <p className={CARD_BODY}>{THEORY.clear.body}</p>
          </div>
          <div className="relative aspect-[275/140] w-full overflow-hidden rounded-[16px]">
            <Img src={A.theoryA} alt="" aria-hidden className={THEORY_PHOTO} />
            <Img src={A.theoryB} alt="Юрий и Алексей на съёмке" className={THEORY_PHOTO} />
          </div>
        </div>

        <div className="flex min-w-0 flex-col items-start justify-between gap-[20px]">
          <div className={`${CARD} w-full gap-[28px]`}>
            <p className={CARD_TITLE}>{THEORY.breathing.title}</p>
            <p className={CARD_BODY}>
              {THEORY.breathing.bodyLines[0]}
              <br />
              {THEORY.breathing.bodyLines[1]}
              <br />
              {THEORY.breathing.bodyLines[2]}
            </p>
          </div>
          <div className={`${CARD} w-full gap-[28px]`}>
            <p className={CARD_TITLE}>{THEORY.anatomy.title}</p>
            <p className={CARD_BODY}>
              {THEORY.anatomy.bodyLines[0]}
              <br />
              {THEORY.anatomy.bodyLines[1]}
              <br />
              {THEORY.anatomy.bodyLines[2]}
            </p>
          </div>
        </div>

        {/* Portrait shot in a landscape box: cover, framed on the lit shoulder. */}
        <div className="relative min-w-0 overflow-hidden rounded-[16px]">
          <Img
            src={A.anatomyShoulder}
            alt="Анатомия плечевого сустава"
            className="absolute inset-0 size-full max-w-none object-cover object-[center_16%]"
          />
        </div>
      </div>
    </section>
  );
}
