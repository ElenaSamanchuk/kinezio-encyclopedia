/**
 * Русская веб-типографика.
 *
 * Короткие слова не должны висеть в конце строки, а тире — начинать новую.
 * И то и другое лечится неразрывным пробелом U+00A0.
 *
 * Прогоняется по дереву контента при загрузке модуля, поэтому статический
 * экспорт и сниппеты Тильды несут уже готовый текст. Символ переживает
 * минификацию сборки: она схлопывает пробелы только внутри тегов, текстовые
 * узлы копируются как есть.
 */

/** Трёхбуквенные предлоги и союзы. Одно- и двухбуквенные клеим все подряд. */
const GLUE_3 = new Set([
  "без", "для", "над", "под", "при", "про", "как", "что", "или", "изо", "обо",
  "уже", "все", "вся", "его", "их", "там", "тут", "так", "чем", "нет", "они",
]);

const LETTER = "A-Za-zА-Яа-яЁё";
const SHORT = new RegExp(`(^|[\\s(«"])([${LETTER}]{1,3})[ \\t]+(?=[«"(]?[${LETTER}0-9])`, "g");
const NUMBER = new RegExp(`(\\d)[ \\t]+(?=[${LETTER}])`, "g");

function glue(s: string): string {
  return s.replace(SHORT, (whole, before: string, word: string) =>
    word.length <= 2 || GLUE_3.has(word.toLowerCase())
      ? `${before}${word}\u00A0`
      : whole
  );
}

export function typo(s: string): string {
  // Два прохода: подряд идущие короткие слова («и в зале») склеиваются за один
  // проход только по первому — регулярка не пересекает уже съеденную границу.
  let out = glue(glue(s));
  out = out.replace(NUMBER, "$1\u00A0");
  out = out.replace(/ +(—|–)( |$)/g, "\u00A0$1$2");
  return out;
}

/** Рекурсивно применяет typo() к строкам, сохраняя форму и литеральные типы. */
export function nb<T>(value: T): T {
  if (typeof value === "string") return typo(value) as unknown as T;
  if (Array.isArray(value)) return value.map(nb) as unknown as T;
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value)) out[k] = nb(v);
    return out as T;
  }
  return value;
}
