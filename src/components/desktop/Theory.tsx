import { A } from "@/lib/assets";
import { THEORY } from "@/lib/content";

const CARD = "flex flex-col items-start rounded-[16px] bg-white p-[20px]";
const CARD_TITLE = "w-full text-[16px] font-bold leading-[1.3] text-[#ff6332]";
const CARD_BODY = "w-full text-[14px] font-medium leading-[1.3] text-[#242424]";

export function Theory() {
  return (
    <section className="mx-auto mt-[120px] flex w-[1160px] flex-col items-start gap-[36px]">
      <h2 className="w-full text-[30px] font-semibold leading-[normal] text-[#242424]">
        {THEORY.titleDesktop}
      </h2>

      <div className="flex w-full items-start gap-[20px]">
        <div className="flex w-[275px] flex-col items-start gap-[20px]">
          <div className={`${CARD} w-full gap-[28px]`}>
            <p className={CARD_TITLE}>{THEORY.clear.title}</p>
            <p className={CARD_BODY}>{THEORY.clear.body}</p>
          </div>
          <div className="relative h-[140px] w-full overflow-hidden rounded-[16px]">
            <img
              src={A.theoryA}
              alt=""
              aria-hidden
              className="absolute inset-0 size-full max-w-none object-cover object-bottom"
            />
            <img
              src={A.theoryB}
              alt="Юрий и Алексей на съёмке"
              className="absolute inset-0 size-full max-w-none object-cover object-bottom"
            />
          </div>
        </div>

        <div className={`${CARD} w-[275px] shrink-0 self-stretch justify-between`}>
          <p className={CARD_TITLE}>{THEORY.kinesiology.title}</p>
          <p className={CARD_BODY}>{THEORY.kinesiology.body}</p>
        </div>

        <div className="flex w-[275px] shrink-0 flex-col items-start gap-[20px] self-stretch">
          <div className="relative min-h-px w-full flex-1 overflow-hidden rounded-[16px]">
            <img
              src={A.anatomyShoulder}
              alt="Анатомия плечевого сустава"
              className="absolute left-0 top-[-133.37%] h-[467.77%] w-full max-w-none"
            />
          </div>
          <div className={`${CARD} w-[275px] gap-[28px]`}>
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

        <div className={`${CARD} w-[275px] shrink-0 self-stretch justify-between`}>
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
