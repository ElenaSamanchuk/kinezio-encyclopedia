import { FAQ_COL_LEFT, FAQ_COL_RIGHT } from "@/lib/content";
import { FaqAccordion } from "@/components/ui/FaqAccordion";

export function Faq() {
  return (
    <section id="faq" className="mx-auto mt-[120px] flex w-[1160px] flex-col items-start gap-[36px]">
      <h2 className="w-full text-[30px] font-semibold leading-[normal] text-[#242424]">Вопросы и ответы</h2>
      <div className="flex items-start gap-[16px]">
        <div className="w-[572px]">
          <FaqAccordion items={FAQ_COL_LEFT} />
        </div>
        <div className="w-[572px]">
          <FaqAccordion items={FAQ_COL_RIGHT} defaultOpen={0} answerClass="text-[14px] w-[520px]" />
        </div>
      </div>
    </section>
  );
}
