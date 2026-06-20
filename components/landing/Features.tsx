"use client";

import React from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { Bot, Wallet, Heart, Users, Leaf, Sparkles } from "lucide-react";

function FeatureCard({ icon, title, desc, delay }: { icon: React.ReactNode; title: string; desc: string; delay: number }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      className="group relative rounded-[28px] border border-stone-200/50 bg-white p-8 text-center flex flex-col items-center transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/[0.03] hover:border-amber-500/20 overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
    >
      {/* Efek Magis: Cahaya Emas Lembut Mengikuti Kursor */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-[28px] opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useTransform(
            [mouseX, mouseY],
            ([x, y]) => `radial-gradient(120px circle at ${x}px ${y}px, rgba(234, 179, 8, 0.06), transparent 80%)`
          ),
        }}
      />
      
      <div className="relative z-10 flex flex-col items-center">
        <div className="w-12 h-12 rounded-2xl bg-[#F5F5F3] text-stone-600 flex items-center justify-center transition-all duration-300 group-hover:bg-amber-50 group-hover:text-[#a17e26] border border-stone-100">
          {icon}
        </div>

        <h3 className="font-bold text-lg mt-5 text-stone-800 transition-colors duration-300 group-hover:text-[#a17e26]">
          {title}
        </h3>
        
        <p className="mt-2 text-xs sm:text-sm text-stone-400 font-medium leading-relaxed max-w-[240px]">
          {desc}
        </p>
      </div>
    </motion.div>
  );
}

export default function Features() {
  const features = [
    { icon: <Bot size={20} />, title: "AI Menu", desc: "Ciptakan resep premium kreatif dari sisa bahan makanan." },
    { icon: <Wallet size={20} />, title: "Hemat Budget", desc: "Smart tracking finansial harian khusus anak kost." },
    { icon: <Leaf size={20} />, title: "Eco Friendly", desc: "Kurangi limbah makanan dan ikut berkontribusi untuk bumi." },
    { icon: <Heart size={20} />, title: "Wellness AI", desc: "Pantau jurnal nutrisi berkala yang adaptif dengan tubuhmu." },
    { icon: <Users size={20} />, title: "Komunitas", desc: "Temukan partner patungan bahan terdekat di sekitarmu." },
    { icon: <Sparkles size={20} />, title: "Smart Recipe", desc: "Rekomendasi takaran memasak yang pas agar anti-mubazir." },
  ];

  return (
    <section id="fitur" className="py-24 bg-[#FBFBFA]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center max-w-lg mx-auto space-y-3">
          <span className="text-[11px] font-bold tracking-widest text-amber-600/80 uppercase bg-amber-50 px-3 py-1 rounded-full border border-amber-500/10">Features</span>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight text-stone-800">
            Semua yang Kamu Butuhkan
          </h2>
          <p className="text-xs sm:text-sm text-stone-400 font-medium leading-relaxed">
            Menyatukan kecerdasan buatan, efisiensi anggaran belanja, dan kelestarian ekosistem dapur lingkungan.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
          {features.map((item, index) => (
            <FeatureCard
              key={item.title}
              icon={item.icon}
              title={item.title}
              desc={item.desc}
              delay={index * 0.05}
            />
          ))}
        </div>
      </div>
    </section>
  );
}