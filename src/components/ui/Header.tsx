"use client";

import { useEffect, useState } from "react";
import { SITE_ACTIONS, SITE_NAV } from "@/lib/content";
import { Logo } from "./Logo";

/**
 * Шапка сайта — меню с kineziofitness.online, снятое замерами с боевой
 * страницы: содержимое это фиксированные 1162px по центру (на 1440/1600/1920
 * ширина одна, меняются только поля), полоса 80px, всё по вертикальному
 * центру. Ширины боксов пунктов и отступы между ними неравные — у Тильды это
 * Zero Block с ручной расстановкой, повторены как есть.
 *
 * Открытое меню живёт в `data-kin-open`, а не в условном рендере: разметка
 * оверлея должна попасть в статический экспорт, где состоянием рулит
 * vanilla-рантайм Тильды. Показ/скрытие делает CSS по атрибуту.
 */
export function Header() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div data-kin-menu="1" data-kin-open={String(open)} className="relative z-50 w-full bg-white">
      <div className="mx-auto flex h-[80px] w-full max-w-[1202px] items-center px-[20px]">
        <button
          type="button"
          data-kin-menu-toggle="1"
          onClick={() => setOpen(true)}
          aria-label="Открыть меню"
          aria-expanded={open}
          className="ml-[4px] flex size-[31px] shrink-0 cursor-pointer flex-col items-center justify-center gap-[4px] rounded-full bg-[#242424] transition-opacity hover:opacity-85"
        >
          <span className="block h-[1.5px] w-[13px] rounded-full bg-white" />
          <span className="block h-[1.5px] w-[13px] rounded-full bg-white" />
          <span className="block h-[1.5px] w-[13px] rounded-full bg-white" />
        </button>

        <Logo className="ml-[9px]" />

        <nav className="hidden items-center xl:flex">
          {SITE_NAV.map((item) => (
            <a
              key={item.label}
              href={item.href}
              style={{ width: item.w, marginLeft: item.ml }}
              className="shrink-0 whitespace-nowrap text-center text-[11px] font-semibold leading-[1.3] text-[#242424] transition-opacity hover:opacity-60"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-[5px]">
          <a
            href={SITE_ACTIONS.platform.href}
            className="hidden h-[36px] items-center justify-center rounded-full bg-[#242424] px-[20px] text-[11px] font-extrabold text-white transition-opacity hover:opacity-85 sm:inline-flex xl:w-[105px] xl:px-0"
          >
            {SITE_ACTIONS.platform.label}
          </a>
          <a
            href={SITE_ACTIONS.account.href}
            className="inline-flex h-[36px] items-center justify-center rounded-full bg-[#242424] px-[20px] text-[11px] font-semibold text-white transition-opacity hover:opacity-85 xl:w-[68px] xl:px-0"
          >
            {SITE_ACTIONS.account.label}
          </a>
        </div>
      </div>

      <div data-kin-menu-panel="1" className="fixed inset-0 z-[60] flex-col bg-white">
        <div className="mx-auto flex h-[80px] w-full max-w-[1202px] shrink-0 items-center px-[20px]">
          <button
            type="button"
            data-kin-menu-close="1"
            onClick={() => setOpen(false)}
            aria-label="Закрыть меню"
            className="relative ml-[4px] flex size-[31px] shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#242424] transition-opacity hover:opacity-85"
          >
            <span className="absolute block h-[1.5px] w-[14px] rotate-45 rounded-full bg-white" />
            <span className="absolute block h-[1.5px] w-[14px] -rotate-45 rounded-full bg-white" />
          </button>
          <Logo className="ml-[9px]" />
        </div>

        <nav className="mx-auto flex w-full max-w-[1202px] flex-1 flex-col items-start gap-[24px] overflow-y-auto px-[20px] pb-[40px] pt-[20px]">
          {SITE_NAV.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={() => setOpen(false)}
              className="text-[20px] font-semibold leading-[1.3] text-[#242424] transition-opacity hover:opacity-60"
            >
              {item.label}
            </a>
          ))}

          <div className="mt-auto flex w-full flex-col gap-[10px] pt-[32px]">
            <a
              href={SITE_ACTIONS.platform.href}
              className="inline-flex h-[48px] items-center justify-center rounded-full bg-[#242424] px-[24px] text-[14px] font-extrabold text-white"
            >
              {SITE_ACTIONS.platform.label}
            </a>
            <a
              href={SITE_ACTIONS.account.href}
              className="inline-flex h-[48px] items-center justify-center rounded-full border border-[#242424] px-[24px] text-[14px] font-semibold text-[#242424]"
            >
              {SITE_ACTIONS.account.label}
            </a>
          </div>
        </nav>
      </div>
    </div>
  );
}
