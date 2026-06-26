"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const featuresData = [
  { emoji: "📊", title: "Dashboard", desc: "Halaman utama yang menampilkan statistik penggunaan, total uang yang dihemat, carbon footprint yang dicegah, dan riwayat aktivitas terbaru." },
  { emoji: "🎨", title: "Remix Area", desc: "Membuat resep kreatif dari bahan yang dimiliki di kulkas atau mendeteksi makanan dari foto dengan tutorial memasak lengkap." },
  { emoji: "📸", title: "Remix Picker", desc: "Pemindai makanan dengan dukungan webcam dan upload file. Mengidentifikasi bahan makanan, nutrisi, dan memberikan informasi detail secara otomatis menggunakan AI vision." },
  { emoji: "💬", title: "Remix Chat", desc: "Asisten AI untuk konsultasi resep, alternatif makanan alergi, dan tips hemat memasak dengan dukungan chat history context." },
  { emoji: "🎮", title: "Remix Game", desc: "Game edukatif yang mengajarkan pentingnya mengurangi limbah makanan melalui gameplay yang menyenangkan dengan puzzle, audio, dan joystick control." },
  { emoji: "📈", title: "Rekam Gizi", desc: "Pencatatan asupan harian dengan visualisasi nutrisi melalui Daily Macro Donut Chart, Nutrient Bar Chart, dan Journal Card." },
  { emoji: "🔔", title: "Notifikasi", desc: "Sistem notifikasi untuk mengingatkan jurnal nutrisi harian, update resep, dan aktivitas komunitas." },
  { emoji: "👤", title: "Profil", desc: "Manajemen profil pengguna termasuk nickname, target budget, medical conditions, allergies, dan statistik penghematan yang dapat dilihat." },
];

export default function Features() {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % featuresData.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + featuresData.length) % featuresData.length);
  };

  return (
    <section id="fitur" className="pt-28 pb-40 bg-[#1C1614] relative overflow-hidden flex flex-col items-center justify-center">
      
      {/* BACKGROUND PATTERN UTAMA DI BODY SECTIONS */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.2] select-none z-0 mix-blend-overlay"
        style={{
          backgroundImage: "url('/bg-pattern2.png')", 
          backgroundRepeat: "repeat",
          backgroundSize: "240px auto", 
        }}
      />

      {/* AMBIENT GLOW EMAS */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-amber-500/[0.03] rounded-full blur-[140px] pointer-events-none z-0" />

      <div className="text-center max-w-2xl space-y-4 mb-16 px-6 z-10 select-none">
        <motion.span 
          initial={{ opacity: 0, y: -5 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-[10px] sm:text-xs font-bold tracking-[0.3em] text-[#c29b38] uppercase block font-sans"
        >
          ✦ Discover Premium Ecosystem ✦
        </motion.span>
        
        <motion.h2 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="italic text-4xl sm:text-5xl font-normal text-stone-100 font-serif leading-tight"
        >
          Semua yang <span className="font-extrabold text-amber-500 not-italic tracking-tight">Kamu</span> Butuhkan
        </motion.h2>

        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-xs text-stone-400 font-medium leading-relaxed max-w-lg mx-auto"
        >
          Menyatukan kecerdasan buatan, efisiensi anggaran belanja harian, serta kelestarian ekosistem dapur masa depan.
        </motion.p>
      </div>

      {/* CAROUSEL AREA COVERFLOW 3D */}
      <div className="relative w-full max-w-5xl flex items-center justify-center px-4 md:px-12 z-10 h-[460px]">
        
        <button
          onClick={handlePrev}
          className="absolute left-4 md:left-12 p-3 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md text-stone-400 hover:text-amber-400 hover:border-amber-500/30 transition-all active:scale-95 z-30 cursor-pointer shadow-lg shadow-black/30"
          aria-label="Previous Feature"
        >
          <ChevronLeft size={18} />
        </button>

        <div className="relative w-full h-full flex items-center justify-center overflow-hidden pointer-events-none">
          {featuresData.map((feature, idx) => {
            let offset = idx - activeIndex;
            
            if (offset < -2) offset += featuresData.length;
            if (offset > 2) offset -= featuresData.length;

            const isCenter = offset === 0;
            const isVisible = Math.abs(offset) <= 1;

            if (!isVisible) return null;

            return (
              <motion.div
                key={idx}
                className="absolute w-[290px] sm:w-[330px] h-[400px] rounded-[36px] border border-white/10 bg-white/[0.02] backdrop-blur-xl p-8 flex flex-col items-center justify-center text-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_25px_50px_-12px_rgba(0,0,0,0.6)] select-none"
                animate={{
                  x: offset * 230,
                  scale: isCenter ? 1 : 0.82,
                  opacity: isCenter ? 1 : 0.35,
                  zIndex: isCenter ? 20 : 10,
                  rotateY: offset * -12,
                }}
                transition={{
                  type: "spring",
                  stiffness: 240,
                  damping: 24,
                }}
              >
{isCenter && (
                   <div className="absolute inset-0 rounded-[36px] bg-gradient-to-b from-amber-500/[0.05] to-transparent pointer-events-none border border-amber-500/20" />
                 )}

                <div className={`w-16 h-16 rounded-2xl mb-4 flex items-center justify-center text-4xl transition-all duration-500 ${
                  isCenter 
                    ? "scale-110 shadow-[0_0_20px_rgba(245,158,11,0.15)]" 
                    : "opacity-70"
                }`}>
                  {feature.emoji}
                </div>

                <h3 className={`text-base font-extrabold tracking-tight mb-3 transition-colors duration-500 uppercase ${
                  isCenter ? "text-amber-400 font-black tracking-wider" : "text-stone-300"
                }`}>
                  {feature.title}
                </h3>

                <p className="text-xs text-stone-400 font-medium leading-relaxed px-2">
                  {feature.desc}
                </p>
              </motion.div>
            );
          })}
        </div>

        <button
          onClick={handleNext}
          className="absolute right-4 md:right-12 p-3 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md text-stone-400 hover:text-amber-400 hover:border-amber-500/30 transition-all active:scale-95 z-30 cursor-pointer shadow-lg shadow-black/30"
          aria-label="Next Feature"
        >
          <ChevronRight size={18} />
        </button>

      </div>

      <div className="flex items-center gap-2 mt-4 z-10 bg-white/[0.02] border border-white/5 px-4 py-2 rounded-full backdrop-blur-sm shadow-inner mb-8">
        {featuresData.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setActiveIndex(idx)}
            className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
              idx === activeIndex ? "w-6 bg-amber-500" : "w-1.5 bg-stone-600 hover:bg-stone-500"
            }`}
          />
        ))}
      </div>

      {/* ─── 3. PEMBATAS GELOMBANG TERINTEGRASI PATTERN PUTHIR (Solusi image_4ec841.png) ─── */}
      <div 
        className="absolute bottom-0 left-0 right-0 w-full overflow-hidden select-none z-30 filter drop-shadow-[0_-8px_20px_rgba(234,179,8,0.15)]"
        style={{ marginBottom: "-3px" }}
      >
        <svg 
          viewBox="0 0 1440 120" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto overflow-visible"
          preserveAspectRatio="none"
        >
          <defs>
            {/* Inject pola batik terang ke dalam kurva isi ombak */}
            <pattern id="batik-white-wave" width="240" height="240" patternUnits="userSpaceOnUse">
              <rect width="240" height="240" fill="#FBFBFA" />
              <image href="/bg-pattern.jpeg" width="240" height="240" className="opacity-[0.06]" />
            </pattern>
          </defs>

          {/* Isi struktur ombak menggunakan fill pattern batik putih */}
          <path 
            d="M0,120 L0,65 C120,45, 240,85, 360,65 C480,45, 600,85, 720,65 C840,45, 960,85, 1080,65 C1200,45, 1320,85, 1440,65 L1440,120 Z" 
            fill="url(#batik-white-wave)" 
          />
          
          {/* Garis Outline Gelap */}
          <motion.path 
            d="M0,65 C120,45, 240,85, 360,65 C480,45, 600,85, 720,65 C840,45, 960,85, 1080,65 C1200,45, 1320,85, 1440,65" 
            stroke="#1C1614" 
            strokeWidth="2.5" 
            strokeLinecap="round"
            opacity="0.85"
            animate={{ d: [
              "M0,65 C120,45, 240,85, 360,65 C480,45, 600,85, 720,65 C840,45, 960,85, 1080,65 C1200,45, 1320,85, 1440,65",
              "M0,70 C120,50, 240,80, 360,70 C480,50, 600,80, 720,70 C840,50, 960,80, 1080,70 C1200,50, 1320,80, 1440,70",
              "M0,65 C120,45, 240,85, 360,65 C480,45, 600,85, 720,65 C840,45, 960,85, 1080,65 C1200,45, 1320,85, 1440,65"
            ]}}
            transition={{ type: "tween", duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Garis Inti Berpendar Emas */}
          <motion.path 
            d="M0,65 C120,45, 240,85, 360,65 C480,45, 600,85, 720,65 C840,45, 960,85, 1080,65 C1200,45, 1320,85, 1440,65" 
            stroke="#eab308" 
            strokeWidth="1.2" 
            strokeLinecap="round"
            animate={{ d: [
              "M0,65 C120,45, 240,85, 360,65 C480,45, 600,85, 720,65 C840,45, 960,85, 1080,65 C1200,45, 1320,85, 1440,65",
              "M0,70 C120,50, 240,80, 360,70 C480,50, 600,80, 720,70 C840,50, 960,80, 1080,70 C1200,50, 1320,80, 1440,70",
              "M0,65 C120,45, 240,85, 360,65 C480,45, 600,85, 720,65 C840,45, 960,85, 1080,65 C1200,45, 1320,85, 1440,65"
            ]}}
            transition={{ type: "tween", duration: 8, repeat: Infinity, ease: "easeInOut", delay: 0.08 }}
          />
        </svg>
      </div>

    </section>
  );
}