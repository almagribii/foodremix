"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "../../lib/hooks/useAuth"; // Jalur disesuaikan dengan struktur folder luar lib Anda
import { Sparkles } from "lucide-react";

export default function Navbar() {
  const { isAuthenticated, loading, logout } = useAuth();

  return (
    <motion.nav 
      className="sticky top-0 z-50 backdrop-blur-md bg-[#FBFBFA]/80 border-b border-stone-200/40"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
        
        {/* BRAND LOGO BARU KIRI */}
        <Link href="/" className="flex gap-2.5 items-center group select-none">
          <div className="w-8 h-8 relative rounded-xl overflow-hidden border border-stone-200 shadow-xs group-hover:scale-105 transition-transform duration-300">
            <Image 
              src="/favicon.ico" 
              alt="Foodremix Logo" 
              fill
              className="object-cover"
            />
          </div>
          <h1 className="font-extrabold text-base tracking-tight text-stone-700">
            Food<span className="text-[#a17e26] font-black">remix</span>
          </h1>
        </Link>

        {/* MENU TENGAH */}
        <div className="hidden md:flex gap-8 text-[11px] font-bold tracking-widest text-stone-400">
          <a href="#fitur" className="hover:text-[#a17e26] transition-colors duration-200 uppercase">Fitur</a>
          <a href="#cara-kerja" className="hover:text-[#a17e26] transition-colors duration-200 uppercase">Cara Kerja</a>
          <a href="#testimoni" className="hover:text-[#a17e26] transition-colors duration-200 uppercase">Testimoni</a>
        </div>

        {/* TOMBOL KANAN */}
        <div className="flex gap-3 text-xs font-bold items-center">
          {!loading && (
            <>
              {isAuthenticated ? (
                <>
                  <Link
                    href="/dashboard"
                    className="px-5 py-2.5 bg-white text-amber-950 border border-amber-500/20 rounded-full font-extrabold shadow-xs hover:bg-amber-50 hover:border-amber-500/50 transition-all flex items-center gap-1.5"
                  >
                    <Sparkles size={12} className="text-amber-500" />
                    Dashboard
                  </Link>
                  <button
                    onClick={logout}
                    className="px-4 py-2.5 text-stone-400 hover:text-red-600 transition-colors duration-200 cursor-pointer"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="px-5 py-2.5 text-stone-500 hover:text-[#a17e26] transition-colors duration-200 flex items-center cursor-pointer"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="px-5 py-2 bg-stone-100 text-stone-600 rounded-full hover:bg-stone-200/70 transition-all cursor-pointer"
                  >
                    Daftar
                  </Link>
                </>
              )}
            </>
          )}
        </div>

      </div>
    </motion.nav>
  );
}