import { DesktopPage } from "@/components/desktop";
import { MobilePage } from "@/components/mobile";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f5f5f5]">
      <div className="hidden lg:block">
        <DesktopPage />
      </div>
      <div className="lg:hidden">
        <MobilePage />
      </div>
    </main>
  );
}
