"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Bot, Wallet, Heart, Sparkles } from "lucide-react";

const aboutData = [
  { 
    icon: <Bot size={24} />, 
    title: "Solusi Anti-Mubazir", 
    desc: "Foodremix berkomitmen mengatasi masalah bahan makanan yang terbuang. Kami membantu Anda memanfaatkan sisa logistik dapur menjadi hidangan lezat berkelas." 
  },
  { 
    icon: <Sparkles size={24} />, 
    title: "Teknologi RemixAI", 
    desc: "Melalui algoritma cerdas, sistem kami merancang rekomendasi resep unik yang disesuaikan secara instan dengan kombinasi bahan apa pun yang Anda miliki." 
  },
  { 
    icon: <Wallet size={24} />, 
    title: "Hemat Budget Kos", 
    desc: "Dirancang ramah di kantong dengan pelacakan cerdas, menjadikannya opsi paling praktis bagi anak kos maupun siapa saja yang ingin menekan pengeluaran bulanan." 
  },
  { 
    icon: <Heart size={24} />, 
    title: "Misi Utama Kami", 
    desc: "Bukan hanya sekadar memberikan resep biasa, melainkan membangun kebiasaan baru untuk menghargai setiap bahan pangan dengan dukungan teknologi masa kini." 
  },
];

const fallingIngredients = [
  { emoji: "🥚", size: "text-3xl", left: "6%", top: "25%", delay: 0.5, duration: 8.5, xRange: [0, -12, 0], yRange: [0, -25, 0] },
  { emoji: "🥬", size: "text-4xl", left: "10%", top: "65%", delay: 1.8, duration: 10.5, xRange: [0, 15, 0], yRange: [0, -35, 0] },
  { emoji: "🍜", size: "text-3xl", left: "18%", top: "45%", delay: 0.8, duration: 9.5, xRange: [0, 18, 0], yRange: [0, -20, 0] },
  { emoji: "🌶️", size: "text-2xl", left: "5%", top: "50%", delay: 2.2, duration: 7.5, xRange: [0, -18, 0], yRange: [0, -30, 0] },
  { emoji: "🍅", size: "text-3xl", left: "85%", top: "25%", delay: 1.2, duration: 9, xRange: [0, 10, 0], yRange: [0, -22, 0] },
  { emoji: "🥩", size: "text-3xl", left: "90%", top: "60%", delay: 2.5, duration: 11, xRange: [0, -15, 0], yRange: [0, -40, 0] },
  { emoji: "🧀", size: "text-2xl", left: "78%", top: "40%", delay: 0.3, duration: 8, xRange: [0, -10, 0], yRange: [0, -15, 0] },
  { emoji: "🧅", size: "text-3xl", left: "82%", top: "75%", delay: 1.6, duration: 10, xRange: [0, 20, 0], yRange: [0, -30, 0] },
];

export default function AboutSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % aboutData.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + aboutData.length) % aboutData.length);
  };

  return (
    <section 
      id="testimoni" 
      className="py-24 bg-[#FBFBFA] relative z-20 -mt-1 overflow-hidden flex flex-col items-center justify-center min-h-[580px] select-none"
    >
      
      {/* EFFECT BAHAN MAKANAN MELAYANG */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
        {fallingIngredients.map((ing, index) => (
          <motion.div
            key={index}
            className={`absolute ${ing.size} select-none opacity-40`}
            style={{ left: ing.left, top: ing.top }}
            animate={{
              x: ing.xRange,
              y: ing.yRange,
              rotate: [0, 15, -15, 0],
            }}
            transition={{
              duration: ing.duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: ing.delay,
            }}
          >
            {ing.emoji}
          </motion.div>
        ))}
      </div>

      {/* BACKGROUND DEKORASI */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.05] select-none z-0"
        style={{
          backgroundImage: "url('/bg-pattern.jpeg')", 
          backgroundRepeat: "repeat",
          backgroundSize: "240px auto", 
        }}
      />

      <div className="max-w-6xl w-full mx-auto px-6 relative z-10 flex flex-col items-center">
        
        {/* HEADER */}
        <div className="text-center max-w-xl mx-auto mb-16 space-y-3.5">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-100 text-[10px] font-bold text-stone-500 uppercase tracking-widest border border-stone-200/60"
          >
            <span className="w-1 h-1 rounded-full bg-[#a17e26]" /> Tentang Platform
          </motion.div>
          <h2 className="font-serif italic text-3xl md:text-4xl text-stone-800 tracking-tight">
            Mengenal Lebih Dekat <span className="font-extrabold text-[#a17e26] not-italic">Foodremix</span>
          </h2>
          <p className="text-xs text-stone-400 font-bold tracking-wider uppercase">
            Mengubah sisa bahan makanan menjadi mahakarya kuliner
          </p>
        </div>

        {/* CAROUSEL UTAMA */}
        <div className="relative w-full max-w-3xl flex items-center justify-center px-4">
          
          <button
            onClick={handlePrev}
            className="absolute left-0 sm:left-4 md:left-12 p-3 rounded-2xl border border-amber-500/10 bg-white/80 backdrop-blur-md text-stone-500 hover:text-amber-600 hover:border-amber-500/40 transition-all active:scale-95 z-30 cursor-pointer shadow-md shadow-amber-500/[0.03]"
            aria-label="Previous Item"
          >
            <ChevronLeft size={18} />
          </button>

          <div className="w-full overflow-hidden py-4">
            <div 
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {aboutData.map((item, index) => {
                const isActive = index === activeIndex;

                return (
                  <div key={index} className="w-full flex-shrink-0 px-4">
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.98 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      // IMPLEMENTASI AMBIENT GLOW TIDAK LEBAY (Sesuai modifikasi konsep pendaran ringan di atas background terang)
                      className={`relative bg-white border rounded-[36px] p-10 md:p-12 transition-all duration-500 flex flex-col items-center text-center gap-6 ${
                        isActive 
                          ? "border-amber-500/30 shadow-[0_0_35px_rgba(245,158,11,0.07)]" 
                          : "border-stone-200/60 shadow-xl shadow-amber-900/[0.005]"
                      }`}
                    >
                      {/* Inner Ambient Top Gradient Glow */}
                      {isActive && (
                        <div className="absolute inset-0 rounded-[36px] bg-gradient-to-b from-amber-500/[0.03] to-transparent pointer-events-none" />
                      )}

                      {/* Icon Box Glow */}
                      <div className={`p-4 rounded-2xl mb-2 transition-all duration-500 ${
                        isActive 
                          ? "bg-amber-500/10 text-amber-600 scale-105 shadow-[0_0_15px_rgba(245,158,11,0.12)]" 
                          : "bg-stone-50 text-stone-400"
                      }`}>
                        {item.icon}
                      </div>

                      <div className="space-y-3 max-w-lg relative z-10">
                        <h3 className={`font-serif italic text-xl tracking-tight transition-colors duration-500 ${
                          isActive ? "text-amber-600 font-extrabold not-italic" : "text-stone-800"
                        }`}>
                          {item.title}
                        </h3>
                        <p className="text-xs text-stone-500 font-medium leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    </motion.div>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            onClick={handleNext}
            className="absolute right-0 sm:right-4 md:right-12 p-3 rounded-2xl border border-amber-500/10 bg-white/80 backdrop-blur-md text-stone-500 hover:text-amber-600 hover:border-amber-500/40 transition-all active:scale-95 z-30 cursor-pointer shadow-md shadow-amber-500/[0.03]"
            aria-label="Next Item"
          >
            <ChevronRight size={18} />
          </button>

        </div>

        {/* DOT INDIKATOR CAROUSEL */}
        <div className="flex items-center gap-2 mt-8 z-10 bg-amber-500/[0.02] border border-amber-500/10 px-4 py-2 rounded-full shadow-inner">
          {aboutData.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === activeIndex ? "w-6 bg-amber-600/70" : "w-1.5 bg-stone-300"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

      </div>

    </section>
  );
}