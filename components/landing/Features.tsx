"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Bot, Wallet, Leaf, Heart, Users, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";

const featuresData = [
  { icon: <Bot size={24} />, title: "AI Menu", desc: "Ciptakan resep premium kreatif dari sisa bahan makanan." },
  { icon: <Wallet size={24} />, title: "Hemat Budget", desc: "Smart tracking finansial harian khusus anak kost." },
  { icon: <Leaf size={24} />, title: "Eco Friendly", desc: "Kurangi limbah makanan dan ikut berkontribusi untuk bumi." },
  { icon: <Heart size={24} />, title: "Wellness AI", desc: "Pantau jurnal nutrisi berkala yang adaptif dengan tubuhmu." },
  { icon: <Users size={24} />, title: "Komunitas", desc: "Temukan partner patungan bahan terdekat di sekitarmu." },
  { icon: <Sparkles size={24} />, title: "Smart Recipe", desc: "Rekomendasi takaran memasak yang pas agar anti-mubazir." },
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
    <section id="fitur" className="py-28 bg-[#1C1614] relative overflow-hidden flex flex-col items-center justify-center">
      
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

      {/* ─── 3. CAROUSEL AREA COVFRFLOW 3D ─── */}
      <div className="relative w-full max-w-5xl flex items-center justify-center px-4 md:px-12 z-10 h-[460px]">
        
        {/* Tombol Kiri Kaca Standar */}
        <button
          onClick={handlePrev}
          className="absolute left-4 md:left-12 p-3 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md text-stone-400 hover:text-amber-400 hover:border-amber-500/30 transition-all active:scale-95 z-30 cursor-pointer shadow-lg shadow-black/30"
          aria-label="Previous Feature"
        >
          <ChevronLeft size={18} />
        </button>

        {/* CONTANER UTAMA ANIMASI KOTAK */}
        <div className="relative w-full h-full flex items-center justify-center overflow-hidden性能-none">
          {featuresData.map((feature, idx) => {
            let offset = idx - activeIndex;
            
            // Loop melingkar logic
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
                  x: offset * 230,              // Jarak geser kanan kiri
                  scale: isCenter ? 1 : 0.82,    // Kunci mengecil di kanan-kiri bergantian
                  opacity: isCenter ? 1 : 0.35,  // Memudar di tepi
                  zIndex: isCenter ? 20 : 10,    // Tengah menimpa samping
                  rotateY: offset * -12,         // Rotasi kedalaman visual 3D
                }}
                transition={{
                  type: "spring",
                  stiffness: 240,
                  damping: 24,
                }}
              >
                {/* Efek Gradasi Sinar Internal Kaca Aktif */}
                {isCenter && (
                  <div className="absolute inset-0 rounded-[36px] bg-gradient-to-b from-amber-500/[0.05] to-transparent pointer-events-none border border-amber-500/20" />
                )}

                {/* Wrapper Icon */}
                <div className={`p-4 rounded-2xl mb-6 transition-all duration-500 ${
                  isCenter 
                    ? "bg-amber-500/10 text-amber-400 scale-110 shadow-[0_0_20px_rgba(245,158,11,0.15)]" 
                    : "bg-white/5 text-stone-500"
                }`}>
                  {feature.icon}
                </div>

                {/* Judul Fitur di Dalam Card (Typography Dipercantik) */}
                <h3 className={`text-base font-extrabold tracking-tight mb-3 transition-colors duration-500 uppercase ${
                  isCenter ? "text-amber-400 font-black tracking-wider" : "text-stone-300"
                }`}>
                  {feature.title}
                </h3>

                {/* Deskripsi Fitur */}
                <p className="text-xs text-stone-400 font-medium leading-relaxed px-2">
                  {feature.desc}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Tombol Kanan Kaca Standar */}
        <button
          onClick={handleNext}
          className="absolute right-4 md:right-12 p-3 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md text-stone-400 hover:text-amber-400 hover:border-amber-500/30 transition-all active:scale-95 z-30 cursor-pointer shadow-lg shadow-black/30"
          aria-label="Next Feature"
        >
          <ChevronRight size={18} />
        </button>

      </div>

      {/* Navigasi Bulat Tipis Bawah */}
      <div className="flex items-center gap-2 mt-4 z-10 bg-white/[0.02] border border-white/5 px-4 py-2 rounded-full backdrop-blur-sm shadow-inner">
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

    </section>
  );
}