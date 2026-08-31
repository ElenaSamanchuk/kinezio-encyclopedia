"use client";

import { useState } from "react";
import { Img } from "@/components/ui/Img";
import { A } from "@/lib/assets";
import type { FaqItem } from "@/lib/content";

type FaqAccordionProps = {
  items: readonly FaqItem[];
  /** Index that starts expanded, matching the Figma frame. Uncontrolled only. */
  defaultOpen?: number;
  /**
   * Controlled mode. The desktop FAQ is split into two columns; both read the
   * same key so the whole block keeps a single answer open, not one per column.
   */
  openKey?: string | null;
  onToggle?: (key: string | null) => void;
  questionClass?: string;
  answerClass?: string;
  gapClass?: string;
};

export function FaqAccordion({
  items,
  defaultOpen = -1,
  openKey,
  onToggle,
  questionClass = "text-[16px]",
  answerClass = "text-[14px]",
  gapClass = "gap-[16px]",
}: FaqAccordionProps) {
  const [ownOpen, setOwnOpen] = useState(defaultOpen);
  const controlled = typeof onToggle === "function";

  return (
    <div className={`flex w-full flex-col items-start ${gapClass}`}>
      {items.map((item, i) => {
        const isOpen = controlled ? openKey === item.q : ownOpen === i;
        return (
          // Open state lives in `data-kin-open` so the Tilda JS runtime can
          // drive the accordion. Height is CSS grid-template-rows, not display:none.
          <div
            key={item.q}
            data-kin-faq-item
            data-kin-open={isOpen}
            className="w-full rounded-[12px] bg-white px-[20px] py-[12px]"
          >
            <button
              type="button"
              onClick={() =>
                controlled ? onToggle(isOpen ? null : item.q) : setOwnOpen(isOpen ? -1 : i)
              }
              aria-expanded={isOpen}
              className="flex w-full cursor-pointer items-center gap-[20px] text-left"
            >
              <span
                className={`flex-1 font-semibold leading-[1.3] text-[#242424] ${questionClass}`}
              >
                {item.q}
              </span>
              <Img
                src={A.iconChevron}
                alt=""
                aria-hidden
                data-kin-faq-chevron
                className="size-[24px] shrink-0"
              />
            </button>
            <div data-kin-faq-answer>
              <div>
                <p className={`pt-[16px] font-medium leading-[1.3] text-[#8a8e96] ${answerClass}`}>
                  {item.a}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
