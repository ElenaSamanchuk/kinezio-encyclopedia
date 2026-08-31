import { FAQ_COL_LEFT, FAQ_COL_RIGHT } from "@/lib/content";
import { FaqAccordion } from "@/components/ui/FaqAccordion";

export function Faq() {
  return (
    <section data-kin-reveal id="faq" className="kin-col kin-gap flex flex-col items-start gap-[36px]">
      <h2 className="kin-h-trim w-full text-[30px] font-semibold leading-[normal] text-[#242424]">Вопросы и ответы</h2>
      <div className="flex w-full items-start gap-[16px]">
        <div className="min-w-0 flex-1">
          <FaqAccordion items={FAQ_COL_LEFT} />
        </div>
        <div className="min-w-0 flex-1">
          <FaqAccordion items={FAQ_COL_RIGHT} defaultOpen={0} answerClass="text-[14px] w-full" />
        </div>
      </div>
    </section>
  );
}
