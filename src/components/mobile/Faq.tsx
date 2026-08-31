import { FAQ_MOBILE } from "@/lib/content";
import { FaqAccordion } from "@/components/ui/FaqAccordion";

export function Faq() {
  return (
    <section data-kin-reveal id="faq" className="mx-auto mt-[68px] flex w-[406px] flex-col items-start gap-[24px]">
      <h2 className="w-full text-[24px] font-semibold leading-[normal] text-[#242424]">Вопросы и ответы</h2>
      <FaqAccordion
        items={FAQ_MOBILE}
        questionClass="text-[14px]"
        answerClass="text-[13px]"
        gapClass="gap-[12px]"
      />
    </section>
  );
}
