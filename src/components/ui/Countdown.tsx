"use client";

import { useEffect, useState } from "react";
import { SALE_END, SALE_END_MS } from "@/lib/content";

const UNITS = ["дня", "час", "мин", "сек"] as const;

function remaining(to: Date) {
  const ms = Math.max(0, to.getTime() - Date.now());
  const total = Math.floor(ms / 1000);
  return [
    Math.floor(total / 86400),
    Math.floor((total % 86400) / 3600),
    Math.floor((total % 3600) / 60),
    total % 60,
  ];
}

const pad = (n: number) => String(n).padStart(2, "0");

export function Countdown({ className = "" }: { className?: string }) {
  // Render zeros on the server so the markup matches the design's static state,
  // then start ticking once mounted.
  const [parts, setParts] = useState<number[] | null>(null);

  useEffect(() => {
    setParts(remaining(SALE_END));
    const id = setInterval(() => setParts(remaining(SALE_END)), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      data-kin-countdown={SALE_END_MS}
      className={`flex w-full items-center gap-[4px] whitespace-nowrap text-[#ff612f] ${className}`}
    >
      {UNITS.map((unit, i) => (
        <div
          key={unit}
          className="flex flex-col items-center justify-center rounded-[5px] border-[0.5px] border-[rgba(155,158,164,0.2)] bg-white px-[10px] py-[5px] first:w-auto [&:not(:first-child)]:w-[42px]"
        >
          <span
            suppressHydrationWarning
            data-kin-countdown-value={i}
            className="text-[14px] font-bold uppercase"
          >
            {parts ? pad(parts[i]) : "00"}
          </span>
          <span className="text-[12px] font-medium">{unit}</span>
        </div>
      ))}
    </div>
  );
}
