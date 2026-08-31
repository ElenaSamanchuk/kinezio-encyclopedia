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
    <section data-kin-reveal className="kin-col mt-[120px] flex flex-col items-start gap-[36px]">
      <h2 className="w-full text-[30px] font-semibold leading-[normal] text-[#242424]">
        {THEORY.titleDesktop}
      </h2>

      <div className="grid w-full grid-cols-4 items-stretch gap-[20px]">
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

        <div className={`${CARD} min-w-0 justify-between`}>
          <p className={CARD_TITLE}>{THEORY.kinesiology.title}</p>
          <p className={CARD_BODY}>{THEORY.kinesiology.body}</p>
        </div>

        <div className="flex min-w-0 flex-col items-start gap-[20px]">
          <div className="relative min-h-px w-full flex-1 overflow-hidden rounded-[16px]">
            <Img
              src={A.anatomyShoulder}
              alt="Анатомия плечевого сустава"
              className="absolute left-0 top-[-133.37%] h-[467.77%] w-full max-w-none"
            />
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

        <div className={`${CARD} min-w-0 justify-between`}>
          <p className={CARD_TITLE}>{THEORY.breathing.title}</p>
          <p className={CARD_BODY}>
            {THEORY.breathing.bodyLines[0]}
            <br />
            {THEORY.breathing.bodyLines[1]}
            <br />
            {THEORY.breathing.bodyLines[2]}
          </p>
        </div>
      </div>
    </section>
  );
}
