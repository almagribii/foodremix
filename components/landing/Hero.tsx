"use client";

import { motion, Variants } from "framer-motion";
import Image from "next/image";
import { Sparkles, Bot, Layers, Flame } from "lucide-react";
import { Button } from "../ui";

const fallingIngredients = [
  { emoji: "🥚", size: "text-3xl", left: "10%", top: "15%", delay: 0, duration: 8, xRange: [0, 15, 0], yRange: [0, -20, 0] },
  { emoji: "🥬", size: "text-4xl", left: "12%", top: "65%", delay: 1.5, duration: 10, xRange: [0, -10, 0], yRange: [0, -30, 0] },
  { emoji: "🍜", size: "text-3xl", left: "20%", top: "40%", delay: 0.5, duration: 9, xRange: [0, 20, 0], yRange: [0, -15, 0] },
  { emoji: "🌶️", size: "text-2xl", left: "7%", top: "45%", delay: 2, duration: 7, xRange: [0, -15, 0], yRange: [0, -25, 0] },
  { emoji: "🍅", size: "text-3xl", left: "88%", top: "20%", delay: 1, duration: 8, xRange: [0, -15, 0], yRange: [0, -20, 0] },
  { emoji: "🥚", size: "text-2xl", left: "80%", top: "55%", delay: 2.5, duration: 9, xRange: [0, 10, 0], yRange: [0, -25, 0] },
  { emoji: "🥬", size: "text-3xl", left: "85%", top: "75%", delay: 0.8, duration: 11, xRange: [0, -20, 0], yRange: [0, -15, 0] },
  { emoji: "🍄", size: "text-3xl", left: "76%", top: "15%", delay: 1.2, duration: 7.5, xRange: [0, 15, 0], yRange: [0, -30, 0] },
];

const taglineVariants: Variants = {
  hidden: { opacity: 0, letterSpacing: "0.1em", y: -10 },
  visible: {
    opacity: [0, 1, 0.7, 1],
    letterSpacing: "0.35em",
    y: 0,
    transition: { 
      duration: 4, 
      ease: "easeInOut",
      times: [0, 0.2, 0.6, 1],
      repeat: Infinity,
      repeatType: "reverse"
    }
  }
};

export default function Hero() {
  return (
    <section className="relative bg-[#FBFBFA] overflow-hidden pt-20 pb-28 flex flex-col items-center justify-center text-center min-h-[95vh] z-0">
      
      {/* ─── 1. BACKGROUND PATTERN BATIK MINI ─── */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.06] select-none z-0"
        style={{
          backgroundImage: "url('/bg-pattern.jpeg')", 
          backgroundRepeat: "repeat",
          backgroundSize: "240px auto", 
        }}
      />

      {/* AMBIENT GLOW SOFT BACKGROUND */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[550px] h-[550px] bg-gradient-to-tr from-amber-400/10 to-amber-200/5 rounded-full blur-[100px] pointer-events-none z-0" />

      {/* ─── 2. BAHAN MAKANAN MELAYANG ─── */}
      <div className="absolute inset-0 pointer-events-none hidden md:block select-none overflow-hidden z-10">
        {fallingIngredients.map((item, idx) => (
          <motion.div
            key={idx}
            className={`absolute ${item.size} opacity-40`}
            style={{ left: item.left, top: item.top }}
            animate={{ x: item.xRange, y: item.yRange, rotate: [0, 360] }}
            transition={{ type: "tween", duration: item.duration, delay: item.delay, repeat: Infinity, ease: "easeInOut" }}
          >
            {item.emoji}
          </motion.div>
        ))}
      </div>

      {/* KONTEN UTAMA HERO */}
      <div className="relative max-w-4xl mx-auto px-6 flex flex-col items-center z-20">
        
        {/* LOGO EMBLEM PERSEGI */}
        <motion.div 
          className="w-28 h-28 rounded-[28px] bg-gradient-to-b from-white via-[#F5F5F3] to-[#E6E6E3] p-1.5 shadow-[0_20px_40px_rgba(234,179,8,0.08)] border border-amber-500/15 flex flex-col items-center justify-center mb-8 relative group cursor-pointer"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="absolute inset-1 rounded-[24px] border border-amber-400/30 bg-gradient-to-b from-transparent to-black/[0.01]" />
          
          <motion.div 
            className="w-16 h-16 relative rounded-full overflow-hidden border border-stone-200/60 shadow-inner"
            animate={{ rotate: 360 }}
            whileHover={{ scale: 1.05 }}
            transition={{
              rotate: {
                repeat: Infinity,
                ease: "linear",
                duration: 25, 
              },
              scale: { duration: 0.2 }
            }}
          >
            <Image 
              src="/logo-food.png" 
              alt="Foodremix Main Logo"
              fill
              sizes="64px"
              className="object-cover"
            />
          </motion.div>

          <span className="text-[9px] font-black text-amber-800 tracking-[0.15em] mt-1.5 uppercase">
            Foodremix
          </span>
        </motion.div>

        <div className="space-y-6 max-w-3xl flex flex-col items-center mt-2">
          
          <motion.span 
            variants={taglineVariants}
            initial="hidden"
            animate="visible"
            className="text-[10px] sm:text-xs font-medium uppercase text-[#a17e26] font-sans block select-none mb-1 text-center"
          >
            ✦ The Art of Cooking ✦
          </motion.span>

          <h1 className="italic text-5xl sm:text-7xl font-normal text-stone-800 tracking-tight leading-[1.02] select-none font-serif text-center">
            Masak <span className="font-extrabold text-[#c29b38] -ml-1 sm:-ml-2 relative">H</span>emat
            <br />
            <span className="relative inline-block text-stone-700 font-extrabold tracking-tighter not-italic mt-1">
              Tanpa
              <span className="text-[#a17e26] font-serif italic font-normal tracking-normal lowercase ml-2 sm:ml-3">
                bingung
              </span>
            </span>
          </h1>

          <div className="w-40 h-8 relative flex items-center justify-center my-1 select-none filter drop-shadow-[0_0_8px_rgba(194,155,56,0.5)]">
            <svg 
              viewBox="0 0 160 30" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full overflow-visible"
            >
              <path 
                d="M10 15C30 5, 50 25, 70 15C90 5, 110 25, 130 15C140 10, 145 12, 150 15" 
                stroke="#292524" 
                strokeWidth="2.5" 
                strokeLinecap="round"
                opacity="0.8"
              />
              <path 
                d="M10 15C30 5, 50 25, 70 15C90 5, 110 25, 130 15C140 10, 145 12, 150 15" 
                stroke="#eab308" 
                strokeWidth="1.2" 
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute text-[9px] text-[#292524] font-bold bg-[#FBFBFA] px-1 shadow-[0_0_4px_#eab308] rounded-full border border-amber-500/30">✦</div>
          </div>

          {/* Deskripsi */}
          <p className="text-xs sm:text-sm text-stone-400 max-w-md mx-auto font-medium leading-relaxed tracking-wide text-center">
            Platform AI premium untuk anak kost, hemat budget harian, dan eco-friendly untuk bumi kita.
          </p>
        </div>

        {/* TOMBOL AKSI */}
        <motion.div 
          className="mt-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Button 

          >
            Mulai Gratis Sekarang
          </Button>
        </motion.div>

        {/* MOCKUP HP SMARTPHONE INTERAKTIF */}
        <motion.div 
          className="w-full max-w-[320px] mt-16 bg-[#121211] p-3 rounded-[48px] shadow-[0_35px_80px_rgba(161,126,38,0.1)] border border-stone-800 relative flex flex-col overflow-hidden"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          whileHover={{ y: -6, transition: { duration: 0.3 } }}
        >
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-16 h-3.5 bg-black rounded-full z-20 flex items-center justify-center">
            <div className="w-1 h-1 bg-stone-800 rounded-full" />
          </div>

          <div className="bg-[#FAF9F6] rounded-[38px] p-5 pt-8 text-left flex-1 flex flex-col justify-between border border-black/5 overflow-hidden relative min-h-[380px]">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-500/5 rounded-full blur-xl pointer-events-none" />

            <div className="space-y-5">
              <div className="flex justify-between items-center border-b border-stone-200/60 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-amber-500/10 rounded-xl text-amber-700">
                    <Bot size={16} className="animate-pulse" />
                  </div>
                  <div>
                    <h3 className="font-black text-xs text-stone-800 tracking-tight">Foodremix AI</h3>
                    <p className="text-[9px] text-emerald-600 font-bold flex items-center gap-0.5">
                      <span className="w-1 h-1 bg-emerald-500 rounded-full inline-block animate-ping" /> Smart Agent
                    </p>
                  </div>
                </div>
                <div className="p-1.5 bg-white rounded-lg border border-stone-200 text-stone-400 shadow-xs"><Layers size={12} /></div>
              </div>

              <div className="space-y-2">
                <span className="text-[9px] uppercase font-bold tracking-wider text-stone-400">Bahan di Kulkas</span>
                <div className="grid grid-cols-3 gap-1.5 text-[11px]">
                  {[
                    { emoji: "🥚", name: "Telur" },
                    { emoji: "🍜", name: "Mie" },
                    { emoji: "🥬", name: "Sawi" }
                  ].map((item) => (
                    <div key={item.name} className="bg-white border border-stone-200/80 py-2 px-1 rounded-xl text-center font-bold text-stone-700 shadow-xs flex flex-col items-center gap-0.5">
                      <span className="text-base">{item.emoji}</span>
                      <span className="text-[10px] text-stone-500">{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="relative pt-6 mt-4">
              <div className="absolute bottom-2 left-4 right-4 h-20 bg-stone-200/50 border border-stone-300/30 rounded-2xl -rotate-2 scale-95 origin-bottom z-0" />
              <div className="absolute bottom-1 left-2 right-2 h-24 bg-white/80 border border-stone-200 rounded-2xl rotate-1 scale-98 origin-bottom z-10 shadow-xs" />

              <div className="relative bg-white p-4 rounded-2xl border-l-4 border-amber-500 shadow-md space-y-2.5 z-20 border border-stone-200/80">
                <div className="flex justify-between items-start">
                  <div className="space-y-0.5">
                    <span className="text-[9px] uppercase tracking-widest text-amber-600 font-black flex items-center gap-1">
                      <Flame size={10} className="fill-amber-500 text-amber-500 animate-bounce" /> Menu Teratas
                    </span>
                    <h4 className="font-black text-sm text-stone-800 leading-tight">Mie Goreng Jepang</h4>
                  </div>
                  <span className="text-[9px] bg-amber-50 text-amber-700 font-bold px-1.5 py-0.5 rounded border border-amber-500/10">98% Match</span>
                </div>
                <p className="text-[11px] text-stone-400 font-medium leading-relaxed">
                  Kombinasi mi instan kenyal, irisan telur gurih, dan kesegaran sawi hijau.
                </p>
                <div className="border-t border-stone-100 pt-2 flex justify-between items-center text-[11px]">
                  <span className="font-bold text-stone-500">Estimasi Biaya</span>
                  <span className="font-black text-[#a17e26] text-xs">Rp 8.000</span>
                </div>
              </div>
            </div>

          </div>
        </motion.div>

      </div>

      {/* ─── 3. SECTION DIVIDER: GLOWING WAVE (POLA BATIK COKELAT MENYATU DINAMIS) ─── */}
      <div 
        className="absolute bottom-0 left-0 right-0 w-full overflow-hidden select-none z-30 filter drop-shadow-[0_-8px_20px_rgba(234,179,8,0.25)]"
        style={{
          marginBottom: "-3px" 
        }}
      >
        <svg 
          viewBox="0 0 1440 120" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto overflow-visible"
          preserveAspectRatio="none"
        >
          <defs>
            <pattern id="batik-pattern-wave" width="240" height="240" patternUnits="userSpaceOnUse">
              <rect width="240" height="240" fill="#1C1614" />
              <image href="/bg-pattern2.png" width="240" height="240" className="opacity-[0.2]" style={{ mixBlendMode: 'overlay' }} />
            </pattern>
          </defs>

          <path 
            d="M0,120 L0,65 C120,45, 240,85, 360,65 C480,45, 600,85, 720,65 C840,45, 960,85, 1080,65 C1200,45, 1320,85, 1440,65 L1440,120 Z" 
            fill="url(#batik-pattern-wave)" 
          />
          
          <motion.path 
            d="M0,65 C120,45, 240,85, 360,65 C480,45, 600,85, 720,65 C840,45, 960,85, 1080,65 C1200,45, 1320,85, 1440,65" 
            stroke="#1C1917" 
            strokeWidth="2.5" 
            strokeLinecap="round"
            opacity="0.95"
            animate={{ d: [
              "M0,65 C120,45, 240,85, 360,65 C480,45, 600,85, 720,65 C840,45, 960,85, 1080,65 C1200,45, 1320,85, 1440,65",
              "M0,70 C120,50, 240,80, 360,70 C480,50, 600,80, 720,70 C840,50, 960,80, 1080,70 C1200,50, 1320,80, 1440,70",
              "M0,65 C120,45, 240,85, 360,65 C480,45, 600,85, 720,65 C840,45, 960,85, 1080,65 C1200,45, 1320,85, 1440,65"
            ]}}
            transition={{ type: "tween", duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />

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