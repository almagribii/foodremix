"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Target,
  Layers,
  TrendingUp,
  Cpu,
  Palette,
  LayoutTemplate,
} from "lucide-react";
import CTASection from "@/components/landing/CTASection";

const BatikOverlay = ({
  opacityClass = "opacity-[0.05]",
}: {
  opacityClass?: string;
}) => (
  <div
    className={`absolute inset-0 pointer-events-none select-none mix-blend-overlay ${opacityClass} z-0`}
    style={{
      backgroundImage: "url('/bg-pattern.jpeg')",
      backgroundRepeat: "repeat",
      backgroundSize: "180px auto",
      filter: "contrast(115%) brightness(98%)",
    }}
  />
);

const AmbientGlow = ({ color = "from-amber-500/[0.03]", className = "" }) => (
  <div
    className={`absolute rounded-full blur-[130px] pointer-events-none z-0 ${color} ${className}`}
  />
);

export default function PremiumEcosystemUnified() {
  return (
    <div className="w-full bg-[#F5F3EF] text-stone-800 relative overflow-hidden select-none font-sans antialiased">
      <AmbientGlow
        color="from-amber-500/[0.04]"
        className="top-40 left-10 w-175 h-175"
      />
      <AmbientGlow
        color="from-stone-400/[0.02]"
        className="bottom-80 right-20 w-150 h-150"
      />

      <section className="relative bg-[#1C1614] pt-40 pb-32 px-6 flex flex-col items-center text-center overflow-hidden">
        <BatikOverlay opacityClass="opacity-[0.06]" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-20 max-w-3xl space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/3 border border-white/10 backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-[#eab308]" />
            <span className="text-[9px] uppercase tracking-[0.25em] text-stone-400 font-bold">
              Foodremix Intelligence
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-serif italic text-white leading-tight tracking-tight">
            Evolusi Tradisi &{" "}
            <span className="font-extrabold text-[#eab308] not-italic block md:inline">
              Esensi Ekosistem
            </span>
          </h1>

          <p className="text-stone-400 max-w-xl mx-auto text-xs md:text-sm font-normal leading-relaxed opacity-75">
            Sebuah manifestasi teknologi kecerdasan buatan terapan yang menyatu
            harmonis bersama cita rasa kuliner nusantara yang berkelanjutan.
          </p>
        </motion.div>
      </section>

      <section className="py-24 px-6 bg-[#F5F3EF] relative z-20 overflow-hidden border-t border-stone-200/40">
        <BatikOverlay opacityClass="opacity-[0.03]" />

        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center relative z-10">
          <div className="space-y-4">
            <div className="text-[11px] font-bold text-[#eab308] uppercase tracking-widest flex items-center gap-2">
              <Layers size={14} /> Pondasi Filosofis
            </div>
            <h2 className="text-3xl font-serif italic text-stone-900 tracking-tight">
              Menjaga Keseimbangan <br />
              <span className="font-black text-[#eab308] not-italic">
                Sirkularitas Kuliner
              </span>
            </h2>
            <p className="text-stone-500 text-xs md:text-sm leading-relaxed">
              Kami percaya tidak ada bahan pangan yang pantas berakhir sia-sia
              di tempat pembuangan. Melalui metodologi cerdas, kami merangkai
              kembali esensi memasak modern menjadi kegiatan yang menyenangkan
              sekaligus bertanggung jawab.
            </p>
          </div>

          <div className="grid gap-4">
            <div className="p-6 bg-white/70 border border-stone-200/50 backdrop-blur-sm rounded-2xl shadow-sm space-y-2 hover:border-[#eab308]/20 transition-all duration-300">
              <div className="flex items-center gap-3 text-stone-900 font-bold text-sm">
                <div className="p-1.5 bg-amber-500/8 text-[#eab308] rounded-lg">
                  <Target size={16} />
                </div>
                Visi Berkelanjutan
              </div>
              <p className="text-stone-500 text-xs leading-relaxed">
                Menjadi standar ekosistem kuliner terdepan yang efisien,
                adaptif, dan mampu menekan laju kerugian pangan nasional secara
                komprehensif dari hulu ke hilir.
              </p>
            </div>

            <div className="p-6 bg-white/70 border border-stone-200/50 backdrop-blur-sm rounded-2xl shadow-sm space-y-2 hover:border-[#eab308]/20 transition-all duration-300">
              <div className="flex items-center gap-3 text-stone-900 font-bold text-sm">
                <div className="p-1.5 bg-amber-500/8 text-[#eab308] rounded-lg">
                  <TrendingUp size={16} />
                </div>
                Misi Terukur
              </div>
              <p className="text-stone-500 text-xs leading-relaxed">
                Menyediakan algoritma rekomendasi resep instan berakurasi tinggi
                serta mengedukasi masyarakat secara masif mengenai efisiensi
                finansial logistik rumah tangga.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 px-6 bg-[#1C1614] text-white relative z-20 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.015] bg-[url('/bg-pattern.jpeg')] bg-repeat pointer-events-none" />
        <BatikOverlay opacityClass="opacity-[0.06]" />

        <div className="max-w-6xl mx-auto space-y-14 relative z-10">
          <div className="text-center space-y-1">
            <h2 className="text-3xl font-serif italic tracking-tight">
              Para{" "}
              <span className="text-[#eab308] not-italic font-black">
                Kreator
              </span>
            </h2>
            <p className="text-stone-500 text-[9px] uppercase tracking-widest font-bold font-sans">
              Membangun Masa Depan Kuliner Digital
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-5">
            <div className="bg-white/2 border border-white/5 p-6 rounded-4xl space-y-4 hover:border-white/10 transition-all duration-300 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-white/5 border border-white/10 shrink-0">
                    <Image
                      src="/team/brucad.jpeg"
                      alt="Brucad Al Magribi"
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-baseline justify-between gap-2">
                    <h3 className="text-base font-bold text-white tracking-tight whitespace-nowrap">
                      Brucad Al Magribi
                    </h3>
                    <span className="text-[8px] font-mono tracking-wider text-[#eab308] uppercase whitespace-nowrap">
                      Full-Stack Developer
                    </span>
                  </div>
                  <p className="text-stone-400 text-xs font-light leading-relaxed">
                    Arsitek utama ideasi sekaligus perancang arsitektur web dan
                    sistem kecerdasan buatan platform. Memformulasikan penalaran
                    logika engine website serta mengelola database relasional
                    agar mampu beroperasi secara analitis, aman, dan adaptif.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 text-xs font-mono font-bold text-stone-500 pt-4 border-t border-white/5 mt-4">
                <Link
                  href="https://github.com/almagribii"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#eab308] transition-colors"
                >
                  GITHUB
                </Link>
                <Link
                  href="https://www.linkedin.com/in/brucad-al-magribi-11675233a/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#eab308] transition-colors"
                >
                  LINKEDIN
                </Link>
                <Link
                  href="mailto:brucadalm@gmail.com"
                  className="hover:text-[#eab308] transition-colors"
                >
                  EMAIL
                </Link>
              </div>
            </div>

            <div className="bg-white/2 border border-white/5 p-6 rounded-4xl space-y-4 hover:border-white/10 transition-all duration-300 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-white/5 border border-white/10 shrink-0">
                    <Image
                      src="/team/edwin.png"
                      alt="Edwin Fadhilah"
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-baseline justify-between gap-2">
                    <h3 className="text-base font-bold text-white tracking-tight whitespace-nowrap">
                      Edwin Fadhilah
                    </h3>
                    <span className="text-[8px] font-mono tracking-wider text-[#eab308] uppercase whitespace-nowrap">
                      Frontend Developer
                    </span>
                  </div>
                  <p className="text-stone-400 text-xs font-light leading-relaxed">
                    Penerjemah kode interaksi visual sisi klien pada halaman web
                    menggunakan komponen Next.js dan Tailwind CSS. Berfokus
                    menyelaraskan performa rendering aplikasi serta
                    mengimplementasikan animasi transisi dinamis demi
                    menciptakan kepuasan pengalaman pengguna.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 text-xs font-mono font-bold text-stone-500 pt-4 border-t border-white/5 mt-4">
                <Link
                  href="https://github.com/edwinfadhilahputra"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#eab308] transition-colors"
                >
                  GITHUB
                </Link>
                <Link
                  href="https://www.linkedin.com/in/edwin-fadhilah-putra-putra/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#eab308] transition-colors"
                >
                  LINKEDIN
                </Link>
                <Link
                  href="mailto:edwinnfp110@gamil.com"
                  className="hover:text-[#eab308] transition-colors"
                >
                  EMAIL
                </Link>
              </div>
            </div>

            <div className="bg-white/2 border border-white/5 p-6 rounded-4xl space-y-4 hover:border-white/10 transition-all duration-300 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-white/5 border border-white/10 shrink-0">
                    <Image
                      src="/team/abinaya.jpeg"
                      alt="Abinaya Azhar"
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-baseline justify-between gap-2">
                    <h3 className="text-base font-bold text-white tracking-tight whitespace-nowrap">
                      Abinaya Azhar
                    </h3>
                    <span className="text-[8px] font-mono tracking-wider text-[#eab308] uppercase whitespace-nowrap">
                      UI/UX Designer
                    </span>
                  </div>
                  <p className="text-stone-400 text-xs font-light leading-relaxed">
                    Konseptor rancangan tata letak grafis dan purwarupa
                    interaktif. Bertanggung jawab menyusun keselarasan sistem
                    gaya visual, tipografi berkelas, serta pemetaan alur
                    navigasi pengguna yang ergonomis sebelum masuk ke dalam
                    tahap produksi kode.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 text-xs font-mono font-bold text-stone-500 pt-4 border-t border-white/5 mt-4">
                <Link
                  href="https://github.com/ABIN-KUN123"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#eab308] transition-colors"
                >
                  GITHUB
                </Link>
                <Link
                  href="https://www.linkedin.com/in/abinaya-azhar-probo-kusumo-9ba536326/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#eab308] transition-colors"
                >
                  LINKEDIN
                </Link>
                <Link
                  href="mailto:abinayaazhar1005@gmail.com"
                  className="hover:text-[#eab308] transition-colors"
                >
                  EMAIL
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="pt-20">
        <CTASection />
      </div>
    </div>
  );
}
