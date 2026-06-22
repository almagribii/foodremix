"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

const testimonialsData = [
  { text: "Foodremix beneran ngebantu hemat pengeluaran bulanan. Resep AI-nya praktis dan pas banget sama sisa bahan di kulkas kosan.", name: "Budi Santoso", role: "Anak Kost Aktif", city: "Bandung, Indonesia" },
  { text: "Gokil sih, iseng masukin telur ama mie instan doang, dikasih tau trik resep ala Jepang yang mewah dan ramah kantong!", name: "Siti Rahma", role: "Mahasiswa Akhir", city: "Jakarta, Indonesia" },
  { text: "Bisa nemu anak kosan sebelah buat patungan beli minyak goreng bareng. Fitur komunitasnya beneran solutif dan asik.", name: "Kevin Sanjaya", role: "Anak Kost Hemat", city: "Surabaya, Indonesia" },
  { text: "Fitur kalkulator nutrisinya nolong banget jaga kesehatan badan biar ga gampang sakit pas lagi banyak tugas kuliah.", name: "Amelia Putri", role: "Anak Kost Gym", city: "Yogyakarta, Indonesia" },
];

const fallingIngredients = [
  { emoji: "🥚", size: "text-3xl", left: "6%", top: "20%", delay: 0.5, duration: 8.5, xRange: [0, -12, 0], yRange: [0, 25, 0] },
  { emoji: "🥬", size: "text-4xl", left: "12%", top: "68%", delay: 2, duration: 9.5, xRange: [0, 15, 0], yRange: [0, -20, 0] },
  { emoji: "🍜", size: "text-3xl", left: "20%", top: "45%", delay: 0, duration: 7.5, xRange: [0, -18, 0], yRange: [0, 15, 0] },
  { emoji: "🌶️", size: "text-2xl", left: "80%", top: "20%", delay: 1.5, duration: 8, xRange: [0, 20, 0], yRange: [0, -15, 0] },
  { emoji: "🍅", size: "text-3xl", left: "88%", top: "62%", delay: 0.8, duration: 10, xRange: [0, -15, 0], yRange: [0, 20, 0] },
  { emoji: "🍄", size: "text-3xl", left: "82%", top: "40%", delay: 2.3, duration: 9, xRange: [0, 12, 0], yRange: [0, -25, 0] },
];

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Deteksi ukuran layar responsif seperti komponen Features
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % testimonialsData.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + testimonialsData.length) % testimonialsData.length);
  };

  return (
    <section id="testimoni" className="relative bg-[#FBFBFA] overflow-hidden pt-20 pb-32 flex flex-col items-center justify-center min-h-[90vh] z-0">
      
      {/* ─── BACKGROUND PATTERN BATIK MINI ─── */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.06] select-none z-0"
        style={{
          backgroundImage: "url('/bg-pattern.jpeg')", 
          backgroundRepeat: "repeat",
          backgroundSize: "240px auto", 
        }}
      />

      {/* AMBIENT GLOW BACKGROUND */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-amber-400/10 rounded-full blur-[120px] pointer-events-none z-0" />

      {/* ─── BAHAN MAKANAN MELAYANG ─── */}
      <div className="absolute inset-0 pointer-events-none hidden md:block select-none overflow-hidden z-10">
        {fallingIngredients.map((item, idx) => (
          <motion.div
            key={idx}
            className={`absolute ${item.size} opacity-[0.18]`}
            style={{ left: item.left, top: item.top }}
            animate={{ x: item.xRange, y: item.yRange, rotate: [0, 360] }}
            transition={{ type: "tween", duration: item.duration, delay: item.delay, repeat: Infinity, ease: "easeInOut" }}
          >
            {item.emoji}
          </motion.div>
        ))}
      </div>

      <div className="relative max-w-5xl mx-auto px-4 md:px-12 z-20 w-full flex flex-col items-center">
        
        {/* HEADER SECTION */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-10 select-none">
          <motion.span 
            initial={{ opacity: 0, y: -5 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[10px] sm:text-xs font-medium uppercase text-[#a17e26] tracking-[0.35em] block font-sans"
          >
            ✦ Voice of Community ✦
          </motion.span>
          
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="italic text-4xl sm:text-5xl font-normal text-stone-800 font-serif tracking-tight"
          >
            Disukai <span className="font-extrabold text-[#c29b38] not-italic tracking-tight">Anak Kost</span>
          </motion.h2>
        </div>

        {/* CAROUSEL AREA COVERFLOW 3D */}
        <div className="relative w-full max-w-5xl flex items-center justify-center h-[460px] mt-4">
          
          <button
            onClick={handlePrev}
            className="absolute left-0 sm:left-4 md:left-12 p-3 rounded-2xl border border-amber-500/10 bg-white/80 backdrop-blur-md text-stone-500 hover:text-amber-600 hover:border-amber-500/40 transition-all active:scale-95 z-30 cursor-pointer shadow-md shadow-amber-500/[0.03]"
            aria-label="Previous Testimonial"
          >
            <ChevronLeft size={18} />
          </button>

          <div className="relative w-full h-full flex items-center justify-center overflow-hidden pointer-events-none">
            {testimonialsData.map((item, idx) => {
              let offset = idx - activeIndex;
              
              if (offset < -2) offset += testimonialsData.length;
              if (offset > 2) offset -= testimonialsData.length;

              const isCenter = offset === 0;
              const isVisible = Math.abs(offset) <= 1;

              if (!isVisible) return null;

              return (
                <motion.div
                  key={idx}
                  // Mengikuti standar layout ukuran kartu dari halaman Features
                  className="absolute w-[280px] sm:w-[330px] h-[400px] rounded-[36px] bg-white/75 backdrop-blur-xl p-8 flex flex-col justify-between text-center select-none shadow-[inset_0_1px_2px_rgba(255,255,255,0.7),0_25px_50px_-12px_rgba(234,179,8,0.06)] border border-amber-500/20 relative"
                  animate={{
                    // Penyesuaian rentang jarak geser X (offset) dinamis mengikuti gaya komponen Features
                    x: offset * (isMobile ? 200 : 250),
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
                    <div className="absolute inset-0 rounded-[36px] bg-gradient-to-b from-amber-500/[0.04] to-transparent pointer-events-none border border-amber-500/20" />
                  )}

                  <div className="flex flex-col items-center flex-1 justify-center">
                    <Quote size={24} className="text-amber-500/25 mb-4 fill-amber-500/5 shrink-0" />
                    <p className={`font-medium leading-relaxed italic text-stone-600 transition-all duration-300 ${
                      isCenter ? "text-xs sm:text-[13px] text-stone-800" : "text-[11px]"
                    }`}>
                      "{item.text}"
                    </p>
                  </div>

                  <div className="flex flex-col items-center gap-2 shrink-0 mt-4">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 text-[#a17e26] flex items-center justify-center font-bold text-xs shadow-inner border border-amber-300/30">
                      {item.name[0]}
                    </div>
                    <div>
                      <h4 className="font-black text-[11px] text-stone-700 tracking-wide uppercase">{item.name}</h4>
                      <p className="text-[9px] font-bold text-amber-700/70 mt-0.5">{item.role} • {item.city}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <button
            onClick={handleNext}
            className="absolute right-0 sm:right-4 md:right-12 p-3 rounded-2xl border border-amber-500/10 bg-white/80 backdrop-blur-md text-stone-500 hover:text-amber-600 hover:border-amber-500/40 transition-all active:scale-95 z-30 cursor-pointer shadow-md shadow-amber-500/[0.03]"
            aria-label="Next Testimonial"
          >
            <ChevronRight size={18} />
          </button>

        </div>

        {/* DOT INDIKATOR CAROUSEL */}
        <div className="flex items-center gap-2 mt-4 z-10 bg-amber-500/[0.03] border border-amber-500/10 px-4 py-2 rounded-full shadow-inner">
          {testimonialsData.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                idx === activeIndex ? "w-6 bg-amber-500" : "w-1.5 bg-amber-200 hover:bg-amber-300"
              }`}
            />
          ))}
        </div>
      </div>

    </section>
  );
}