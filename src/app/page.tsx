import { DesktopPage } from "@/components/desktop";
import { MobilePage } from "@/components/mobile";
import { Header } from "@/components/ui/Header";

export default function Home() {
  return (
    <>
      {/* Вне <main>: сборка для Тильды забирает только <main>, а там своя шапка. */}
      <Header />
      <main className="min-h-screen bg-[#f5f5f5]">
        <div className="hidden lg:block">
          <DesktopPage />
        </div>
        <div className="lg:hidden">
          <MobilePage />
        </div>
      </main>
    </>
  );
}
