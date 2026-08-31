import { A } from "@/lib/assets";
import { Img } from "@/components/ui/Img";
import { THEORY } from "@/lib/content";

const CARD = "flex w-full flex-col items-start gap-[16px] rounded-[16px] bg-white p-[20px]";
const CARD_TITLE = "w-full text-[16px] font-bold leading-[1.3] text-[#ff6332]";
const CARD_BODY = "w-full text-[14px] font-medium leading-[1.3] text-[#242424]";
// Figma fills this slot with the portrait shot stretched to the box (the node
// carries no cover/contain scale mode), which is what keeps both heads and the
// hand on the shoulder in frame. object-cover here would crop away the hands.
const THEORY_PHOTO =
  "absolute inset-0 !h-full !w-full max-w-none object-fill";

export function Theory() {
  return (
    <section data-kin-reveal className="mx-auto kin-gap flex w-[406px] flex-col items-start gap-[24px]">
      <h2 className="kin-h-trim w-[258px] text-[24px] font-semibold leading-[normal] text-[#242424]">
        {THEORY.titleMobile}
      </h2>

      {/* card → photo → card → photo → card: the stack alternates all the way down. */}
      <div className="flex w-full flex-col items-start gap-[20px]">
        <div className={CARD}>
          <p className={CARD_TITLE}>{THEORY.clear.title}</p>
          <p className={CARD_BODY}>
            {THEORY.clear.bodyMobile[0]}
            <br />
            {THEORY.clear.bodyMobile[1]}
          </p>
        </div>

        <div className="relative aspect-[406/200] w-full overflow-hidden rounded-[16px]">
          <Img src={A.theoryA} alt="" aria-hidden className={THEORY_PHOTO} />
          <Img src={A.theoryB} alt="Юрий и Алексей на съёмке" className={THEORY_PHOTO} />
        </div>

        <div className={CARD}>
          <p className={CARD_TITLE}>{THEORY.anatomy.title}</p>
          <p className={CARD_BODY}>{THEORY.anatomy.body}</p>
        </div>

        <div className="relative h-[165px] w-full overflow-hidden rounded-[16px]">
          <Img
            src={A.anatomyShoulder}
            alt="Анатомия плечевого сустава"
            className="absolute left-[0.01%] top-[-100.21%] h-[399.56%] w-[99.97%] max-w-none"
          />
        </div>

        <div className={`${CARD} gap-[15px]`}>
          <p className={CARD_TITLE}>{THEORY.breathing.title}</p>
          <p className={CARD_BODY}>{THEORY.breathing.body}</p>
        </div>
      </div>
    </section>
  );
}
