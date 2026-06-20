"use client";

import { motion } from "framer-motion";
import { Sparkles, Bot, Layers, Flame } from "lucide-react";

// Data untuk pola bahan makanan melayang di latar belakang (Background Pattern)
const fallingIngredients = [
  { emoji: "🥚", size: "text-3xl", left: "10%", top: "15%", delay: 0, duration: 8, xRange: [0, 15, 0], yRange: [0, -20, 0] },
  { emoji: "🥬", size: "text-4xl", left: "12%", top: "65%", delay: 1.5, duration: 10, xRange: [0, -10, 0], yRange: [0, -30, 0] },
  { emoji: "🍜", size: "text-3xl", left: "20%", top: "40%", delay: 0.5, duration: 9, xRange: [0, 20, 0], yRange: [0, -15, 0] },
  { emoji: "🌶️", size: "text-2xl", left: "7%", top: "45%", delay: 2, duration: 7, xRange: [0, -15, 0], yRange: [0, -25, 0] },
  // Sisi Kanan
  { emoji: "🍅", size: "text-3xl", left: "88%", top: "20%", delay: 1, duration: 8, xRange: [0, -15, 0], yRange: [0, -20, 0] },
  { emoji: "🥚", size: "text-2xl", left: "80%", top: "55%", delay: 2.5, duration: 9, xRange: [0, 10, 0], yRange: [0, -25, 0] },
  { emoji: "🥬", size: "text-3xl", left: "85%", top: "75%", delay: 0.8, duration: 11, xRange: [0, -20, 0], yRange: [0, -15, 0] },
  { emoji: "🍄", size: "text-3xl", left: "76%", top: "15%", delay: 1.2, duration: 7.5, xRange: [0, 15, 0], yRange: [0, -30, 0] },
];

export default function Hero() {
  return (
    <section className="relative bg-[#FBFBFA] overflow-hidden pt-20 pb-28 border-b border-black/5 flex flex-col items-center justify-center text-center min-h-[95vh]">
      
      {/* 1. AMBIENT GLOW SOFT (Efek Cahaya Latar Belakang) */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[550px] h-[550px] bg-gradient-to-tr from-amber-400/5 to-amber-200/5 rounded-full blur-[100px] pointer-events-none" />

      {/* 2. ANIMASI BAHAN MAKANAN MELAYANG */}
      <div className="absolute inset-0 pointer-events-none hidden md:block select-none overflow-hidden">
        {fallingIngredients.map((item, idx) => (
          <motion.div
            key={idx}
            className={`absolute ${item.size} opacity-[0.18]`}
            style={{ left: item.left, top: item.top }}
            animate={{
              x: item.xRange,
              y: item.yRange,
              rotate: [0, 360],
            }}
            transition={{
              duration: item.duration,
              delay: item.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {item.emoji}
          </motion.div>
        ))}
      </div>

      <div className="relative max-w-4xl mx-auto px-6 flex flex-col items-center z-10">
        
        {/* 3. LOGO EMBLEM EMAS */}
        <motion.div 
          className="w-28 h-28 rounded-[28px] bg-gradient-to-b from-white via-[#F5F5F3] to-[#E6E6E3] p-0.5 shadow-[0_20px_40px_rgba(234,179,8,0.08)] border border-amber-500/15 flex items-center justify-center mb-8 relative"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="absolute inset-1 rounded-[24px] border border-amber-400/30 bg-gradient-to-b from-transparent to-black/[0.01]" />
          
          <div className="relative flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full border border-dashed border-amber-600/30 flex items-center justify-center p-1">
              <div className="w-full h-full rounded-full border border-stone-200 bg-white flex items-center justify-center shadow-xs">
                <span className="text-xl text-stone-500 select-none">🥄</span>
              </div>
            </div>
            <span className="text-[10px] font-bold text-amber-800 tracking-[0.15em] mt-1 uppercase">
              Foodremix
            </span>
          </div>
        </motion.div>

        {/* 4. TEKS UTAMA (JUDUL & DESKRIPSI) */}
        <motion.div
          className="space-y-4 max-w-2xl"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-[#c29b38] leading-[1.2]">
            Masak Hemat <br />
            <span className="text-[#a17e26] font-black">Tanpa Bingung</span>
          </h1>

          <p className="text-xs sm:text-sm md:text-base text-stone-400 max-w-md mx-auto font-medium leading-relaxed">
            Platform AI premium untuk anak kost, hemat budget harian, dan eco-friendly untuk bumi kita.
          </p>
        </motion.div>

        {/* 5. TOMBOL UTAMA (CTA) */}
        <motion.div 
          className="mt-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <button className="bg-white text-amber-900 border border-amber-500/20 px-8 py-3 rounded-full font-bold shadow-md shadow-amber-500/[0.03] hover:bg-amber-50 hover:border-amber-400/60 transition-all text-xs tracking-wide flex items-center gap-2">
            <Sparkles size={13} className="text-amber-500" />
            Mulai Gratis Sekarang
          </button>
        </motion.div>

        {/* 6. ULTIMATE PORTRAIT SMARTPHONE MOCKUP (3D STACKED CARDS) */}
        <motion.div 
          className="w-full max-w-[320px] mt-16 bg-[#121211] p-3 rounded-[48px] shadow-[0_35px_80px_rgba(161,126,38,0.1)] border border-stone-800 relative group flex flex-col overflow-hidden"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          whileHover={{ y: -6, transition: { duration: 0.3 } }}
        >
          {/* Notch Atas / Dynamic Island */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-16 h-3.5 bg-black rounded-full z-20 flex items-center justify-center">
            <div className="w-1 h-1 bg-stone-800 rounded-full" />
          </div>

          {/* Layar Aplikasi Internal */}
          <div className="bg-[#FAF9F6] rounded-[38px] p-5 pt-8 text-left flex-1 flex flex-col justify-between border border-black/5 overflow-hidden relative min-h-[380px]">
            
            {/* Ambient Gradient Glow di dalam layar smartphone */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-500/5 rounded-full blur-xl pointer-events-none" />

            {/* Bagian Atas: Aplikasi Header & Grid Bahan */}
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
                <div className="p-1.5 bg-white rounded-lg border border-stone-200 text-stone-400 shadow-xs">
                  <Layers size={12} />
                </div>
              </div>

              {/* Grid Pemilihan Bahan Makanan */}
              <div className="space-y-2">
                <span className="text-[9px] uppercase font-bold tracking-wider text-stone-400">Bahan di Kulkas</span>
                <div className="grid grid-cols-3 gap-1.5 text-[11px]">
                  {[
                    { emoji: "🥚", name: "Telur" },
                    { emoji: "🍜", name: "Mie" },
                    { emoji: "🥬", name: "Sawi" }
                  ].map((item) => (
                    <motion.div 
                      key={item.name} 
                      className="bg-white border border-stone-200/80 py-2 px-1 rounded-xl text-center font-bold text-stone-700 shadow-xs flex flex-col items-center gap-0.5"
                      whileHover={{ scale: 1.05, borderColor: "#EAB308" }}
                    >
                      <span className="text-base">{item.emoji}</span>
                      <span className="text-[10px] text-stone-500">{item.name}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bagian Bawah: Hasil Rekomendasi Menu dengan Efek Kartu Bertumpuk (3D Stacked Card) */}
            <div className="relative pt-6 mt-4">
              {/* Kartu Bayangan Paling Belakang */}
              <div className="absolute bottom-2 left-4 right-4 h-20 bg-stone-200/50 border border-stone-300/30 rounded-2xl -rotate-2 scale-95 origin-bottom z-0" />
              {/* Kartu Bayangan Lapisan Kedua */}
              <div className="absolute bottom-1 left-2 right-2 h-24 bg-white/80 border border-stone-200 rounded-2xl rotate-1 scale-98 origin-bottom z-10 shadow-xs" />

              {/* Kartu Menu Utama */}
              <motion.div 
                className="relative bg-white p-4 rounded-2xl border-l-4 border-amber-500 shadow-md space-y-2.5 z-20 cursor-pointer overflow-hidden border border-stone-200/80"
                whileHover={{ x: 2 }}
              >
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
              </motion.div>
            </div>

          </div>
        </motion.div>

      </div>
    </section>
  );
}