"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  User, 
  Mail, 
  Lock, 
  Wallet, 
  Activity, 
  ArrowRight 
} from "lucide-react";

export default function RegisterPage() {
  const cardRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({
    name: "",
    nickname: "",
    email: "",
    password: "",
    confirmPassword: "",
    dailyTarget: "",
    medicalConditions: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  // Efek Sorotan Glow Mengikuti Mouse
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const { left, top } = cardRef.current.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;
    cardRef.current.style.setProperty("--x", `${x}px`);
    cardRef.current.style.setProperty("--y", `${y}px`);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-6 md:p-12 overflow-hidden bg-[#FBFBFA]">
      
      {/* ─── BACKGROUND STYLE BATIK HALUS (Clean & Light dari Hero) ─── */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.04] select-none z-0"
        style={{
          backgroundImage: "url('/bg-pattern.jpeg')", // Pattern batik putih terang
          backgroundRepeat: "repeat",
          backgroundSize: "160px auto",
        }}
      />

      {/* AMBIENT LIGHT GLOW (Pendaran emas halus di tengah latar belakang) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-500/[0.03] rounded-full blur-[100px] pointer-events-none" />

      {/* ─── PEMBATAS GELOMBANG ATAS (Gaya Transisi Gelap & Emas) ─── */}
      <div className="absolute top-0 left-0 w-full pointer-events-none z-10 filter drop-shadow-[0_4px_10px_rgba(0,0,0,0.04)]">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto overflow-visible">
          <path 
            d="M0,0 L1440,0 L1440,45 C1320,65, 1200,25, 1080,45 C960,65, 840,25, 720,45 C600,65, 480,25, 360,45 C240,65, 120,25, 0,45 Z" 
            fill="#1C1614" 
          />
          <path 
            d="M0,45 C120,25, 240,65, 360,45 C480,25, 600,65, 720,45 C840,25, 960,65, 1080,45 C1200,25, 1320,65, 1440,45" 
            stroke="#eab308" 
            strokeWidth="1.5" 
            strokeLinecap="round"
            opacity="0.75"
          />
        </svg>
      </div>

      {/* ─── FLOATING REGISTER CARD (Ukuran Standar & Ramping) ─── */}
      <motion.div 
        ref={cardRef}
        onMouseMove={handleMouseMove}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-20 w-full max-w-[520px] bg-white/80 border border-stone-200/90 rounded-[2.5rem] p-8 md:p-10 shadow-[0_25px_50px_rgba(28,22,20,0.04),inset_0_1px_2px_rgba(255,255,255,0.8)] backdrop-blur-xl group/card flex flex-col gap-6"
      >
        {/* Radial Glow interaktif saat kursor bergerak di atas card */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_var(--x,0px)_var(--y,0px),rgba(234,179,8,0.04)_0%,transparent_50%)] transition-opacity duration-300 opacity-0 group-hover/card:opacity-100 rounded-[2.5rem]" />
        
        {/* LOGO & HEADER BRAND */}
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center gap-2 mb-3">
            {/* LOGO MENGGUNAKAN ASET FAVICON CUSTOM ANDA */}
            <div className="relative w-7 h-7 bg-white/5 rounded-lg p-0.5 border border-stone-200/50 overflow-hidden">
              <Image 
                src="/favicon.ico" 
                alt="Foodremix Logo" 
                fill
                className="object-contain p-0.5"
              />
            </div>
            <span className="text-lg font-bold tracking-tight text-[#1C1614]">
              food<span className="text-amber-500 font-medium">remix</span>
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-[#1C1614] tracking-tight">Buat Akun Baru</h2>
          <p className="text-[10px] font-bold text-stone-400 mt-1 uppercase tracking-wider font-sans">Mulai Langkah Dapur Hijau Anda</p>
        </div>

        {/* INPUT FORM */}
        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          
          {/* BARIS: Nama Lengkap & Panggilan */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-stone-500 ml-1">Nama Lengkap</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400" />
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="John Doe"
                  className="w-full bg-stone-100/70 border border-stone-200 rounded-xl py-2.5 pl-10 pr-3 text-xs font-bold text-[#1C1614] placeholder-stone-400 focus:outline-none focus:border-amber-500/50 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-stone-500 ml-1">Panggilan</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400" />
                <input
                  type="text"
                  name="nickname"
                  required
                  placeholder="John"
                  className="w-full bg-stone-100/70 border border-stone-200 rounded-xl py-2.5 pl-10 pr-3 text-xs font-bold text-[#1C1614] placeholder-stone-400 focus:outline-none focus:border-amber-500/50 focus:bg-white transition-all"
                />
              </div>
            </div>
          </div>

          {/* INPUT: Email */}
          <div className="space-y-1">
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-stone-500 ml-1">Alamat Email</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400" />
              <input
                type="email"
                name="email"
                required
                placeholder="name@example.com"
                className="w-full bg-stone-100/70 border border-stone-200 rounded-xl py-2.5 pl-10 pr-3 text-xs font-bold text-[#1C1614] placeholder-stone-400 focus:outline-none focus:border-amber-500/50 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* BARIS: Password & Konfirmasi */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-stone-500 ml-1">Kata Sandi</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400" />
                <input
                  type="password"
                  name="password"
                  required
                  placeholder="••••••••"
                  className="w-full bg-stone-100/70 border border-stone-200 rounded-xl py-2.5 pl-10 pr-3 text-xs font-bold text-[#1C1614] placeholder-stone-400 focus:outline-none focus:border-amber-500/50 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-stone-500 ml-1">Konfirmasi</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400" />
                <input
                  type="password"
                  name="confirmPassword"
                  required
                  placeholder="••••••••"
                  className="w-full bg-stone-100/70 border border-stone-200 rounded-xl py-2.5 pl-10 pr-3 text-xs font-bold text-[#1C1614] placeholder-stone-400 focus:outline-none focus:border-amber-500/50 focus:bg-white transition-all"
                />
              </div>
            </div>
          </div>

          <div className="py-0.5">
            <div className="w-full h-px bg-gradient-to-r from-transparent via-stone-200 to-transparent" />
          </div>

          {/* BARIS: Target & Kondisi Medis */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-stone-500 ml-1">Budget Harian (Rp)</label>
              <div className="relative">
                <Wallet className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400" />
                <input
                  type="number"
                  name="dailyTarget"
                  placeholder="50000"
                  className="w-full bg-stone-100/70 border border-stone-200 rounded-xl py-2.5 pl-10 pr-3 text-xs font-bold text-[#1C1614] placeholder-stone-400 focus:outline-none focus:border-amber-500/50 focus:bg-white transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-stone-500 ml-1">Alergi / Medis</label>
              <div className="relative">
                <Activity className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400" />
                <input
                  type="text"
                  name="medicalConditions"
                  placeholder="Alergi Udang, dll"
                  className="w-full bg-stone-100/70 border border-stone-200 rounded-xl py-2.5 pl-10 pr-3 text-xs font-bold text-[#1C1614] placeholder-stone-400 focus:outline-none focus:border-amber-500/50 focus:bg-white transition-all"
                />
              </div>
            </div>
          </div>

          {/* TOMBOL DAFTAR (Warna Gelap #1C1614) */}
          <motion.button
            whileHover={{ scale: 1.01, backgroundColor: "#2e2421" }}
            whileTap={{ scale: 0.99 }}
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#1C1614] text-white font-extrabold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all mt-4 shadow-[0_10px_20px_rgba(28,22,20,0.12)] group/btn text-xs uppercase tracking-wider"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                Daftar Sekarang
                <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
              </>
            )}
          </motion.button>
        </form>

        {/* REDIRECT LINK */}
        <p className="text-center text-stone-400 text-xs font-medium">
          Sudah memiliki akun?{" "}
          <Link href="/login" className="text-[#1C1614] font-bold hover:underline">
            Masuk di sini
          </Link>
        </p>
      </motion.div>

      {/* ─── PEMBATAS GELOMBANG BAWAH (Gaya Transisi Gelap & Emas) ─── */}
      <div className="absolute bottom-0 left-0 w-full pointer-events-none z-10 filter drop-shadow-[0_-4px_10px_rgba(0,0,0,0.04)]">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto overflow-visible">
          <path 
            d="M0,80 L1440,80 L1440,35 C1320,55, 1200,15, 1080,35 C960,55, 840,15, 720,35 C600,55, 480,15, 360,35 C240,55, 120,15, 0,35 Z" 
            fill="#1C1614" 
          />
          <path 
            d="M0,35 C120,15, 240,55, 360,35 C480,15, 600,55, 720,35 C840,15, 960,55, 1080,35 C1200,15, 1320,55, 1440,35" 
            stroke="#eab308" 
            strokeWidth="1.5" 
            strokeLinecap="round"
            opacity="0.75"
          />
        </svg>
      </div>

    </div>
  );
}