import { Button } from "@/components/ui";
import Link from "next/link";

export const metadata = {
  title: "Game",
  description: "Mainkan Monster Junk sebagai game edukatif utama di Foodremix.",
};

export default function Page() {
  return (
    <main className="flex min-h-screen w-full items-center justify-center">
      <section className="w-full max-w-6xl overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white shadow-2xl">
        <div
          className="relative px-6 py-10 text-white sm:px-10 sm:py-16 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/background.webp')`,
          }}
        >
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[2px]"></div>

          <div className="relative z-10">
            <h1 className="mt-2 text-4xl font-black tracking-tighter sm:text-5xl">
              Monster Junk
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-200 sm:text-base font-medium">
              Satu game edukatif untuk sekarang. Nanti kamu bisa ganti aset dan
              isi visualnya dengan versi yang lebih final.
            </p>

            <div className="mt-6 flex flex-wrap gap-3 text-[10px] font-bold uppercase tracking-widest">
              <span className="rounded-xl border border-white/20 bg-black/30 backdrop-blur-md px-4 py-2">
                Puzzle sampah
              </span>
              <span className="rounded-xl border border-white/20 bg-black/30 backdrop-blur-md px-4 py-2">
                Audio aktif
              </span>
              <span className="rounded-xl border border-white/20 bg-black/30 backdrop-blur-md px-4 py-2">
                Siap dimainkan
              </span>
            </div>

            <div className="mt-8">
              <Link href="/monster-junk">
                <Button variant="accent">Mainkan Monster Junk →</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
