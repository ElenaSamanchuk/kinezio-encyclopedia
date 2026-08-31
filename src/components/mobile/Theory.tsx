import { A } from "@/lib/assets";
import { THEORY } from "@/lib/content";

const CARD = "flex w-full flex-col items-start gap-[16px] rounded-[16px] bg-white p-[20px]";
const CARD_TITLE = "w-full text-[16px] font-bold leading-[1.3] text-[#ff6332]";
const CARD_BODY = "w-full text-[14px] font-medium leading-[1.3] text-[#242424]";

export function Theory() {
  return (
    <section className="mx-auto mt-[68px] flex w-[406px] flex-col items-start gap-[24px]">
      <h2 className="w-[258px] text-[24px] font-semibold leading-[normal] text-[#242424]">
        {THEORY.titleMobile}
      </h2>

      <div className="flex w-full flex-col items-start gap-[20px]">
        <div className="flex w-full flex-col items-start gap-[20px]">
          <div className={CARD}>
            <p className={CARD_TITLE}>{THEORY.clear.title}</p>
            <p className={CARD_BODY}>
              {THEORY.clear.bodyMobile[0]}
              <br />
              {THEORY.clear.bodyMobile[1]}
            </p>
          </div>
          <div className="relative h-[200px] w-full overflow-hidden rounded-[16px]">
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

        <div className={CARD}>
          <p className={CARD_TITLE}>{THEORY.kinesiology.title}</p>
          <p className={CARD_BODY}>{THEORY.kinesiology.bodyMobile}</p>
        </div>

        <div className="flex w-full flex-col items-start gap-[20px]">
          <div className="relative h-[165px] w-full overflow-hidden rounded-[16px]">
            <img
              src={A.anatomyShoulder}
              alt="Анатомия плечевого сустава"
              className="absolute left-[0.01%] top-[-100.21%] h-[399.56%] w-[99.97%] max-w-none"
            />
          </div>
          <div className={CARD}>
            <p className={CARD_TITLE}>{THEORY.anatomy.title}</p>
            <p className={CARD_BODY}>{THEORY.anatomy.body}</p>
          </div>
        </div>

        <div className={`${CARD} gap-[15px]`}>
          <p className={CARD_TITLE}>{THEORY.breathing.title}</p>
          <p className={CARD_BODY}>{THEORY.breathing.body}</p>
        </div>
      </div>
    </section>
  );
}
