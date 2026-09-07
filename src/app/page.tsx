import { DesktopPage } from "@/components/desktop";
import { MobilePage } from "@/components/mobile";
import { Header } from "@/components/ui/Header";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f5f5f5]">
      {/* Шапка внутри артборда: сборка для Тильды режет <main> на два блока
          по data-kin-canvas, и меню должно уехать в них вместе с контентом. */}
      <div className="hidden lg:block">
        <Header />
        <DesktopPage />
      </div>
      <div className="lg:hidden">
        <Header />
        <MobilePage />
      </div>
    </main>
  );
}
