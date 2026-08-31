"use client";

import { useState } from "react";
import { A } from "@/lib/assets";
import type { FaqItem } from "@/lib/content";

type FaqAccordionProps = {
  items: readonly FaqItem[];
  /** Index that starts expanded, matching the Figma frame. */
  defaultOpen?: number;
  questionClass?: string;
  answerClass?: string;
  gapClass?: string;
};

export function FaqAccordion({
  items,
  defaultOpen = -1,
  questionClass = "text-[16px]",
  answerClass = "text-[14px]",
  gapClass = "gap-[16px]",
}: FaqAccordionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className={`flex w-full flex-col items-start ${gapClass}`}>
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          // The open state lives in `data-kin-open` so the exported markup can be
          // driven by plain JS in the Tilda build, where React is not present.
          <div
            key={item.q}
            data-kin-faq-item
            data-kin-open={isOpen}
            className="w-full rounded-[12px] bg-white px-[20px] py-[12px]"
          >
            <button
              type="button"
              onClick={() => setOpen(isOpen ? -1 : i)}
              aria-expanded={isOpen}
              className="flex w-full cursor-pointer items-center gap-[20px] text-left"
            >
              <span
                className={`flex-1 font-semibold leading-[1.3] text-[#242424] ${questionClass}`}
              >
                {item.q}
              </span>
              <img
                src={A.iconChevron}
                alt=""
                aria-hidden
                data-kin-faq-chevron
                className="size-[24px] shrink-0 transition-transform duration-200"
              />
            </button>
            <p
              data-kin-faq-answer
              className={`mt-[16px] font-medium leading-[1.3] text-[#8a8e96] ${answerClass}`}
            >
              {item.a}
            </p>
          </div>
        );
      })}
    </div>
  );
}
