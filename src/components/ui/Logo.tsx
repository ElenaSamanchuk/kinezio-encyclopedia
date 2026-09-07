/**
 * Текстовый логотип KINEZIO FITNESS. На Тильде это картинка 55×20.6;
 * здесь набран шрифтом, чтобы не тянуть лишний файл и остаться чётким на 2x.
 */
export function Logo({ className = "" }: { className?: string }) {
  return (
    <a
      href="https://kineziofitness.online/"
      aria-label="KINEZIO FITNESS"
      className={`block w-[55px] shrink-0 leading-[1.15] tracking-[0.137em] ${className}`}
    >
      <span className="block text-[9px] font-extrabold uppercase text-[#242424]">
        Kinezio
      </span>
      <span className="logo-fitness block text-[9px] font-extrabold uppercase">
        Fitness
      </span>
    </a>
  );
}
