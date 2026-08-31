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
import { StickyBuy } from "./StickyBuy";
import { Theory } from "./Theory";

/** Mobile artboard — Figma frame «iPhone 14 & 15 Pro Max — 1» (3133:2121), 430 × 8960. */
export function MobilePage() {
  return (
    <>
      <Canvas width={430}>
      <div className="relative w-[430px] bg-[#f5f5f5] kin-tail">
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
      <StickyBuy />
    </>
  );
}
