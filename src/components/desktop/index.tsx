import { Canvas } from "@/components/ui/Canvas";
import { Angles } from "./Angles";
import { Authors } from "./Authors";
import { Certificate } from "./Certificate";
import { Faq } from "./Faq";
import { FinalCta } from "./FinalCta";
import { Hero } from "./Hero";
import { Intro } from "./Intro";
import { Modules } from "./Modules";
import { Moment } from "./Moment";
import { PhoneSection } from "./PhoneSection";
import { Pricing } from "./Pricing";
import { Theory } from "./Theory";

/** Desktop artboard — Figma frame «ИТОГОВЫЙ» (3163:312), 1440 × 6421. */
export function DesktopPage() {
  return (
    <Canvas width={1440}>
      <div className="kin-bleed relative w-[1440px] bg-[#f5f5f5] kin-tail">
        <Hero />
        <Intro />
        <Modules />
        <Moment />
        <Theory />
        <Angles />
        <PhoneSection />
        <Authors />
        <Certificate />
        <Pricing />
        <Faq />
        <FinalCta />
      </div>
    </Canvas>
  );
}
