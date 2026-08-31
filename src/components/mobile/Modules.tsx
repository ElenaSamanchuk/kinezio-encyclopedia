import { MODULES } from "@/lib/content";

export function Modules() {
  const [m1, m2, m3, m4] = MODULES;

  return (
    <section id="program" className="mx-auto mt-[68px] flex w-[406px] flex-col items-start gap-[24px]">
      <h2 className="w-full text-[24px] font-semibold leading-[normal] text-[#242424]">Что находится внутри</h2>

      <div className="flex w-full flex-col items-start gap-[16px]">
        <Card label={m1.label} title={m1.title} lead={m1.lead} body={m1.body} />
        <Card label={m2.label} title={m2.title} lead={m2.lead} body={m2.body} />
        <Card
          label={m3.label}
          title={m3.title}
          lead={
            <>
              {m3.leadLines[0]}
              <br />
              {m3.leadLines[1]}
            </>
          }
          body={m3.body}
        />
        <Card
          label={m4.label}
          title={m4.title}
          lead={m4.lead}
          body={
            <>
              <span className="block leading-[1.3]">{m4.bodyIntro}</span>
              <ul className="list-disc">
                {m4.bodyList.map((li, i) => (
                  <li key={li} className="ms-[21px] leading-[1.3]">
                    {i < m4.bodyList.length - 1 ? `${li};` : li}
                  </li>
                ))}
              </ul>
            </>
          }
        />
      </div>
    </section>
  );
}

function Card({
  label,
  title,
  lead,
  body,
}: {
  label: string;
  title: string;
  lead: React.ReactNode;
  body: React.ReactNode;
}) {
  return (
    <article className="flex w-full flex-col items-start gap-[24px] rounded-[16px] bg-white p-[16px]">
      <div className="flex w-full flex-col items-start gap-[12px]">
        <p className="w-full text-[12px] font-extrabold leading-[1.2] text-[#ff6332]">{label}</p>
        <h3 className="font-display w-full text-[16px] uppercase leading-[1.2] text-[#242424]">
          {title}
        </h3>
        <p className="w-full text-[14px] font-semibold leading-[1.3] text-[#8a8e96]">{lead}</p>
      </div>
      <div className="w-full text-[14px] font-semibold leading-[1.3] text-[#242424]">{body}</div>
    </article>
  );
}
