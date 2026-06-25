"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  Target, 
  User,
  Globe,
  Mail,
  ArrowRight,
  Bot,
  Wallet,
  Heart,
  Layers,
  TrendingUp,
  ShieldCheck,
  Cpu,
  Palette,
  LayoutTemplate
} from "lucide-react";

// ─── BATIK OVERLAY IDENTIK DENGAN HERO ───
const BatikOverlay = ({ opacityClass = "opacity-[0.05]" }: { opacityClass?: string }) => (
  <div 
    className={`absolute inset-0 pointer-events-none select-none mix-blend-overlay ${opacityClass} z-0`}
    style={{ 
      backgroundImage: "url('/bg-pattern.jpeg')", 
      backgroundRepeat: "repeat", 
      backgroundSize: "180px auto",
      filter: "contrast(115%) brightness(98%)"
    }}
  />
);

// ─── AMBIENT GLOW (Pendaran Cahaya Latar Belakang) ───
const AmbientGlow = ({ color = "from-amber-500/[0.03]", className = "" }) => (
  <div className={`absolute rounded-full blur-[130px] pointer-events-none z-0 ${color} ${className}`} />
);

export default function PremiumEcosystemUnified() {
  const ctaCardRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<"solusi" | "tech" | "budget" | "misi">("solusi");

  // DATA INTERAKTIF BENTO TABS
  const bentoContent = {
    solusi: {
      tag: "Zero Waste Management",
      title: "Solusi Cerdas Pengendali Bahan Makanan Mubazir",
      desc: "Foodremix hadir untuk mengeliminasi siklus pembuangan logistik dapur yang sia-sia. Kami mengonversi sisa bahan makanan mentah Anda menjadi kreasi kuliner premium bernilai gizi tinggi secara presisi.",
      stats: "87% Reduksi Sampah Organik Rumah Tangga",
      icon: <Bot className="text-[#A17E26]" size={26} />
    },
    tech: {
      tag: "Artificial Intelligence Ecosystem",
      title: "Teknologi RemixAI Hasil Optimasi Tingkat Tinggi",
      desc: "Bukan sekadar pencarian kata kunci acak. Mesin kecerdasan buatan kami menganalisis kompatibilitas senyawa rasa secara real-time untuk menyusun panduan memasak paling rasional berdasarkan ketersediaan bahan dapur Anda.",
      stats: "Sub-detik Komputasi & Generasi Resep",
      icon: <Sparkles className="text-[#A17E26]" size={26} />
    },
    budget: {
      tag: "Financial Efficiency",
      title: "Asisten Finansial Anda, Selamatkan Anggaran Dompet",
      desc: "Dirancang khusus dengan riset mendalam perilaku belanja anak kos dan keluarga modern. Menekan pengeluaran belanja berlebih dengan memaksimalkan penggunaan stok tersembunyi di kulkas Anda.",
      stats: "Hemat Hingga Rp450.000+ Setiap Bulan",
      icon: <Wallet className="text-[#A17E26]" size={26} />
    },
    misi: {
      tag: "Our Grand Mission",
      title: "Membangun Pola Pikir Baru Terhadap Bahan Pangan",
      desc: "Misi fundamental kami melampaui urusan dapur harian. Foodremix bergerak aktif membangun budaya keberlanjutan demi menciptakan generasi cerdas pangan yang lebih menghargai rantai pasok kuliner bumi.",
      stats: "Menuju Indonesia Bebas Food Waste 2030",
      icon: <Heart className="text-[#A17E26]" size={26} />
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ctaCardRef.current) return;
    const { left, top } = ctaCardRef.current.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;
    ctaCardRef.current.style.setProperty("--x", `${x}px`);
    ctaCardRef.current.style.setProperty("--y", `${y}px`);
  };

  return (
    <div className="w-full bg-[#F5F3EF] text-stone-800 relative overflow-hidden select-none font-sans antialiased">
      
      {/* AMBIENT BACKGROUND GLOWS */}
      <AmbientGlow color="from-amber-500/[0.04]" className="top-40 left-10 w-[700px] h-[700px]" />
      <AmbientGlow color="from-stone-400/[0.02]" className="bottom-80 right-20 w-[600px] h-[600px]" />

      {/* ─── SECTION 1: HERO SUB-BAB (Latar Gelap Khas Hero) ─── */}
      <section className="relative bg-[#1C1614] pt-40 pb-32 px-6 flex flex-col items-center text-center overflow-hidden">
        <BatikOverlay opacityClass="opacity-[0.06]" />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-20 max-w-3xl space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-[#A17E26]" />
            <span className="text-[9px] uppercase tracking-[0.25em] text-stone-400 font-bold">Foodremix Intelligence</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-serif italic text-white leading-tight tracking-tight">
            Evolusi Tradisi & <span className="font-extrabold text-[#A17E26] not-italic block md:inline">Esensi Ekosistem</span>
          </h1>
          
          <p className="text-stone-400 max-w-xl mx-auto text-xs md:text-sm font-normal leading-relaxed opacity-75">
            Sebuah manifestasi teknologi kecerdasan buatan terapan yang menyatu harmonis bersama cita rasa kuliner nusantara yang berkelanjutan.
          </p>
        </motion.div>
      </section>

      {/* ─── SECTION 2: CORE PILLARS (Latar Krem Hangat / #F5F3EF) ─── */}
      <section className="py-24 px-6 bg-[#F5F3EF] relative z-20 overflow-hidden border-t border-stone-200/40">
        <BatikOverlay opacityClass="opacity-[0.03]" />
        
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center relative z-10">
          <div className="space-y-4">
            <div className="text-[11px] font-bold text-[#A17E26] uppercase tracking-widest flex items-center gap-2">
              <Layers size={14} /> Pondasi Filosofis
            </div>
            <h2 className="text-3xl font-serif italic text-stone-900 tracking-tight">
              Menjaga Keseimbangan <br /><span className="font-black text-[#A17E26] not-italic">Sirkularitas Kuliner</span>
            </h2>
            <p className="text-stone-500 text-xs md:text-sm leading-relaxed">
              Kami percaya tidak ada bahan pangan yang pantas berakhir sia-sia di tempat pembuangan. Melalui metodologi cerdas, kami merangkai kembali esensi memasak modern menjadi kegiatan yang menyenangkan sekaligus bertanggung jawab.
            </p>
          </div>

          <div className="grid gap-4">
            <div className="p-6 bg-white/70 border border-stone-200/50 backdrop-blur-sm rounded-2xl shadow-sm space-y-2 hover:border-amber-500/20 transition-all duration-300">
              <div className="flex items-center gap-3 text-stone-900 font-bold text-sm">
                <div className="p-1.5 bg-amber-500/[0.08] text-[#A17E26] rounded-lg"><Target size={16} /></div>
                Visi Berkelanjutan
              </div>
              <p className="text-stone-500 text-xs leading-relaxed">
                Menjadi standar ekosistem kuliner terdepan yang efisien, adaptif, dan mampu menekan laju kerugian pangan nasional secara komprehensif dari hulu ke hilir.
              </p>
            </div>

            <div className="p-6 bg-white/70 border border-stone-200/50 backdrop-blur-sm rounded-2xl shadow-sm space-y-2 hover:border-amber-500/20 transition-all duration-300">
              <div className="flex items-center gap-3 text-stone-900 font-bold text-sm">
                <div className="p-1.5 bg-amber-500/[0.08] text-[#A17E26] rounded-lg"><TrendingUp size={16} /></div>
                Misi Terukur
              </div>
              <p className="text-stone-500 text-xs leading-relaxed">
                Menyediakan algoritma rekomendasi resep instan berakurasi tinggi serta mengedukasi masyarakat secara masif mengenai efisiensi finansial logistik rumah tangga.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECTION 3: BENTO INTERACTIVE EXPERIENCE (Seksi Tab Konten) ─── */}
      <section className="py-24 px-6 bg-stone-100/60 border-y border-stone-200/40 relative z-20 overflow-hidden">
        <BatikOverlay opacityClass="opacity-[0.02]" />
        
        <div className="max-w-5xl mx-auto space-y-12 relative z-10">
          
          <div className="text-center max-w-md mx-auto space-y-2">
            <h2 className="text-3xl font-serif italic text-stone-900">
              Mengenal Lebih Dekat <span className="font-black text-[#A17E26] not-italic">Platform</span>
            </h2>
            <p className="text-xs text-stone-400 font-bold uppercase tracking-wider">
              Pilih pilar di bawah untuk melihat transparansi performa platform
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            
            {/* Navigasi Tab Sisi Kiri */}
            <div className="md:col-span-1 flex flex-col gap-2">
              {(Object.keys(bentoContent) as Array<keyof typeof bentoContent>).map((key) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between group cursor-pointer ${
                    activeTab === key 
                      ? "bg-white border-[#A17E26]/40 shadow-sm text-stone-900" 
                      : "bg-transparent border-stone-200/40 text-stone-500 hover:bg-white/40"
                  }`}
                >
                  <div className="flex items-center gap-3 font-medium text-xs md:text-sm">
                    <span className={`p-2 rounded-lg transition-colors ${activeTab === key ? "bg-amber-500/10" : "bg-stone-200/40"}`}>
                      {bentoContent[key].icon}
                    </span>
                    {key === "tech" ? "RemixAI Tech" : key.charAt(0).toUpperCase() + key.slice(1)}
                  </div>
                  <ArrowRight size={14} className={`opacity-0 group-hover:opacity-100 transition-opacity ${activeTab === key ? "text-[#A17E26] opacity-100" : ""}`} />
                </button>
              ))}
            </div>

            {/* Panel Konten Dinamis Sisi Kanan */}
            <div className="md:col-span-2 bg-white/90 border border-stone-200/50 rounded-2xl p-8 flex flex-col justify-between shadow-sm relative overflow-hidden min-h-[280px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-5"
                >
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-[#A17E26] bg-amber-500/[0.06] px-2.5 py-1 rounded-full uppercase tracking-wider">
                      {bentoContent[activeTab].tag}
                    </span>
                    <h3 className="text-xl font-bold text-stone-900 tracking-tight leading-snug">
                      {bentoContent[activeTab].title}
                    </h3>
                  </div>

                  <p className="text-stone-500 text-xs md:text-sm leading-relaxed max-w-xl font-normal">
                    {bentoContent[activeTab].desc}
                  </p>
                </motion.div>
              </AnimatePresence>

              <div className="pt-5 border-t border-stone-100 mt-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-[11px] font-semibold text-stone-600">
                  <ShieldCheck size={16} className="text-[#A17E26]" /> 
                  <span>Indikator Dampak Positif:</span>
                  <span className="text-stone-900 underline decoration-[#A17E26] decoration-2 font-bold ml-1">
                    {bentoContent[activeTab].stats}
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─── SECTION 4: THE CREATORS (3 COLS GRID - GAYA FEATURES.TSX) ─── */}
      <section className="py-24 px-6 bg-[#1C1614] text-white relative z-20 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.015] bg-[url('/bg-pattern.jpeg')] bg-repeat pointer-events-none" />
        <BatikOverlay opacityClass="opacity-[0.06]" />
        
        <div className="max-w-6xl mx-auto space-y-14 relative z-10">
          
          <div className="text-center space-y-1">
            <h2 className="text-3xl font-serif italic tracking-tight">
              Para <span className="text-[#A17E26] not-italic font-black">Kreator</span>
            </h2>
            <p className="text-stone-500 text-[9px] uppercase tracking-widest font-bold font-sans">
              Membangun Masa Depan Kuliner Digital
            </p>
          </div>

          {/* Grid Layout Tiga Kolom Sejajar Identik Dengan Struktur `Features.tsx` */}
          <div className="grid sm:grid-cols-3 gap-5">
            
            {/* Card Kreator 1: Almagribi */}
            <div className="bg-white/[0.02] border border-white/5 p-6 rounded-[2rem] space-y-4 hover:border-white/10 transition-all duration-300 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-11 h-11 rounded-2xl bg-white/[0.04] border border-white/10 p-2.5 text-[#A17E26] flex items-center justify-center">
                  <Cpu size={22} strokeWidth={2} />
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-baseline justify-between">
                    <h3 className="text-base font-bold text-white tracking-tight">Almagribi</h3>
                    <span className="text-[8px] font-mono tracking-wider text-[#A17E26] uppercase">Founder & AI Brain</span>
                  </div>
                  <p className="text-stone-400 text-xs font-light leading-relaxed">
                    Arsitek utama ideasi sekaligus perancang inti kecerdasan buatan platform. Memformulasikan penalaran logika *engine* website agar mampu beroperasi secara analitis dan adaptif.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-3 text-stone-600 pt-4 border-t border-white/[0.03] mt-4">
                <Link href="#" className="hover:text-[#A17E26] transition-colors"><User size={14} /></Link>
                <Link href="#" className="hover:text-[#A17E26] transition-colors"><Globe size={14} /></Link>
                <Link href="#" className="hover:text-[#A17E26] transition-colors"><Mail size={14} /></Link>
              </div>
            </div>

            {/* Card Kreator 2: Winss */}
            <div className="bg-white/[0.02] border border-white/5 p-6 rounded-[2rem] space-y-4 hover:border-white/10 transition-all duration-300 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-11 h-11 rounded-2xl bg-white/[0.04] border border-white/10 p-2.5 text-[#A17E26] flex items-center justify-center">
                  <LayoutTemplate size={22} strokeWidth={2} />
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-baseline justify-between">
                    <h3 className="text-base font-bold text-white tracking-tight">Winss</h3>
                    <span className="text-[8px] font-mono tracking-wider text-[#A17E26] uppercase">UI/UX Engineer</span>
                  </div>
                  <p className="text-stone-400 text-xs font-light leading-relaxed">
                    Penerjemah kode interaksi visual front-end halaman web. Berfokus mentransformasikan kenyamanan navigasi antarmuka digital demi menciptakan kepuasan pengalaman pengguna yang elegan.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 text-stone-600 pt-4 border-t border-white/[0.03] mt-4">
                <Link href="#" className="hover:text-[#A17E26] transition-colors"><User size={14} /></Link>
                <Link href="#" className="hover:text-[#A17E26] transition-colors"><Globe size={14} /></Link>
                <Link href="#" className="hover:text-[#A17E26] transition-colors"><Mail size={14} /></Link>
              </div>
            </div>

            {/* Card Kreator 3: Binoy */}
            <div className="bg-white/[0.02] border border-white/5 p-6 rounded-[2rem] space-y-4 hover:border-white/10 transition-all duration-300 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-11 h-11 rounded-2xl bg-white/[0.04] border border-white/10 p-2.5 text-[#A17E26] flex items-center justify-center">
                  <Palette size={22} strokeWidth={2} />
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-baseline justify-between">
                    <h3 className="text-base font-bold text-white tracking-tight">Binoy</h3>
                    <span className="text-[8px] font-mono tracking-wider text-[#A17E26] uppercase">Figma Designer</span>
                  </div>
                  <p className="text-stone-400 text-xs font-light leading-relaxed">
                    Konseptor rancangan tata letak grafis dan purwarupa di Figma. Menyusun keselarasan palet warna premium, tipografi berkelas, serta panduan gaya visual dasar sebelum masuk tahap produksi.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 text-stone-600 pt-4 border-t border-white/[0.03] mt-4">
                <Link href="#" className="hover:text-[#A17E26] transition-colors"><User size={14} /></Link>
                <Link href="#" className="hover:text-[#A17E26] transition-colors"><Globe size={14} /></Link>
                <Link href="#" className="hover:text-[#A17E26] transition-colors"><Mail size={14} /></Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─── SECTION 5: INTERACTIVE SOROT CTA ─── */}
      <section className="py-24 px-6 bg-[#F5F3EF] relative z-20 border-t border-stone-200/30">
        <BatikOverlay opacityClass="opacity-[0.03]" />
        
        <div 
          ref={ctaCardRef}
          onMouseMove={handleMouseMove}
          className="max-w-4xl mx-auto bg-white border border-stone-200/70 rounded-2xl p-8 md:p-12 shadow-[0_15px_40px_rgba(0,0,0,0.003)] relative overflow-hidden group cursor-default z-10"
        >
          {/* Efek Sorot Lampu Mengikuti Kursor */}
          <div 
            className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"
            style={{
              background: `radial-gradient(240px circle at var(--x, 0px) var(--y, 0px), rgba(161,126,38,0.07), transparent 80%)`,
            }}
          />

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-8 justify-between">
            <div className="space-y-2">
              <span className="text-[9px] font-extrabold text-[#A17E26] bg-stone-100 px-2.5 py-1 rounded-full uppercase tracking-widest">
                ✦ Akses Eksklusif
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-[#1C1614] tracking-tight leading-tight">
                Siap Mentransformasi <br />Isi Kulkas Anda?
              </h2>
            </div>
            
            <motion.button 
              whileHover={{ scale: 1.01, y: -0.5 }}
              whileTap={{ scale: 0.99 }}
              className="w-full md:w-auto shrink-0 bg-[#1C1614] text-white px-7 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm shadow-stone-900/10 cursor-pointer"
            >
              Mulai Eksplorasi AI <ArrowRight size={13} />
            </motion.button>
          </div>
        </div>
      </section>

    </div>
  );
}