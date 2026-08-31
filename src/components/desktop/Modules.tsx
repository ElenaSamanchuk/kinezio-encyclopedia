import { MODULES } from "@/lib/content";

const CARD =
  "flex flex-col items-start rounded-[16px] bg-white p-[20px] justify-self-stretch";

export function Modules() {
  const [m1, m2, m3, m4] = MODULES;

  return (
    <section id="program" className="mx-auto mt-[120px] flex w-[1160px] flex-col items-start gap-[36px]">
      <h2 className="w-full text-[30px] font-semibold leading-[normal] text-[#242424]">Что находится внутри</h2>

      <div className="grid w-full grid-cols-2 gap-[24px]">
        <article className={`${CARD} h-[232px] justify-between`}>
          <Head label={m1.label} title={m1.title} lead={m1.lead} />
          <Body>{m1.body}</Body>
        </article>

        <article className={`${CARD} h-[232px] justify-between`}>
          <Head label={m2.label} title={m2.title} lead={m2.lead} />
          <Body>{m2.body}</Body>
        </article>

        <article className={`${CARD} h-[253px] justify-between`}>
          <Head
            label={m3.label}
            title={m3.title}
            lead={
              <>
                {m3.leadLines[0]}
                <br />
                {m3.leadLines[1]}
              </>
            }
          />
          <Body>{m3.body}</Body>
        </article>

        <article className={`${CARD} h-[254px] justify-between`}>
          <Head label={m4.label} title={m4.title} lead={m4.lead} />
          <div className="w-full text-[14px] font-semibold leading-[1.3] text-[#242424]">
            <p className="leading-[1.3]">{m4.bodyIntro}</p>
            <ul className="list-disc">
              {m4.bodyList.map((li) => (
                <li key={li} className="ms-[21px] leading-[1.3]">
                  {li}
                </li>
              ))}
            </ul>
          </div>
        </article>
      </div>
    </section>
  );
}

function Head({
  label,
  title,
  lead,
}: {
  label: string;
  title: string;
  lead: React.ReactNode;
}) {
  return (
    <div className="flex w-full flex-col items-start gap-[12px]">
      <p className="w-full text-[12px] font-extrabold leading-[1.2] text-[#ff6332]">{label}</p>
      <h3 className="font-display w-full text-[20px] uppercase leading-[1.2] text-[#242424]">
        {title}
      </h3>
      <p className="w-full text-[14px] font-semibold leading-[1.3] text-[#8a8e96]">{lead}</p>
    </div>
  );
}

function Body({ children }: { children: React.ReactNode }) {
  return (
    <p className="w-full text-[14px] font-semibold leading-[1.3] text-[#242424]">{children}</p>
  );
}
