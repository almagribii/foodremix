"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "../../lib/hooks/useAuth"; 
import { Sparkles, Menu, X } from "lucide-react";

export default function Navbar() {
  const { isAuthenticated, loading, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  // Fungsi khusus untuk handle smooth scroll secara paksa (programmatic)
  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault(); // Mencegah browser langsung lompat (instant jump)
    closeMenu(); // Tutup mobile menu jika sedang terbuka

    // Jika targetId kosong, scroll langsung ke paling atas halaman (Beranda)
    if (!targetId) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      return;
    }

    const element = document.getElementById(targetId);
    if (element) {
      // Menghitung offset jika ada navbar sticky (tinggi navbar kita = 64px atau h-16)
      const offset = 64; 
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth", 
      });
    }
  };

  // PEMBARUAN: Struktur target ID disesuaikan dengan permintaan Anda
  const navLinks = [
    { name: "Beranda", targetId: "" },          // Kosong untuk scroll ke paling atas (halaman pertama)
    { name: "RemixAI", targetId: "fitur" },     // Mengarah ke section Features Anda
    { name: "Tentang", targetId: "testimoni" }, // Mengarah ke section Tentang Kami Anda
  ];

  return (
    <>
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
            <span className="font-serif italic font-normal text-lg tracking-tight text-stone-700">
              Food<span className="font-extrabold text-[#a17e26] not-italic">remix</span>
            </span>
          </Link>

          {/* LINK NAVIGASI TENGAH (DESKTOP) */}
          <div className="hidden md:flex items-center gap-10 text-[10px] font-bold tracking-widest text-stone-400">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={`#${link.targetId}`}
                onClick={(e) => handleScroll(e, link.targetId)}
                className="hover:text-[#a17e26] transition-colors duration-200 uppercase cursor-pointer relative py-1 group"
              >
                {link.name}
                <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[#a17e26] transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </div>

          {/* TOMBOL AUTENTIKASI KANAN (DESKTOP) */}
          <div className="hidden md:flex items-center gap-3 text-xs font-bold tracking-tight">
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

          {/* TOMBOL MENU MOBILE (KANAN) */}
          <button 
            onClick={toggleMenu}
            className="md:hidden p-2 text-stone-500 hover:text-stone-800 transition-colors cursor-pointer"
            aria-label="Toggle Menu"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

        </div>
      </motion.nav>

      {/* OVERLAY NAVIGATION MOBILE */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="fixed inset-0 top-16 bg-[#FBFBFA] z-40 md:hidden flex flex-col justify-between border-t border-stone-200/50"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <div className="p-6 flex flex-col gap-6 text-sm font-bold tracking-widest text-stone-500 uppercase">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={`#${link.targetId}`}
                  onClick={(e) => handleScroll(e, link.targetId)}
                  className="py-2 border-b border-stone-100 hover:text-[#a17e26] transition-colors flex items-center cursor-pointer"
                >
                  {link.name}
                </a>
              ))}

              <div className="flex flex-col gap-3 pt-6 text-xs tracking-tight normal-case">
                {!loading && (
                  <>
                    {isAuthenticated ? (
                      <>
                        <Link
                          href="/dashboard"
                          onClick={closeMenu}
                          className="w-full text-center py-3 bg-white text-amber-950 border border-amber-500/20 rounded-full font-extrabold shadow-xs flex items-center justify-center gap-1.5"
                        >
                          <Sparkles size={12} className="text-amber-500" />
                          Dashboard
                        </Link>
                        <button
                          onClick={() => { logout(); closeMenu(); }}
                          className="w-full py-2.5 text-stone-400 hover:text-red-600 transition-colors"
                        >
                          Logout
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          href="/login"
                          onClick={closeMenu}
                          className="w-full text-center py-2.5 text-stone-500 hover:text-[#a17e26] transition-colors"
                        >
                          Login
                        </Link>
                        <Link
                          href="/register"
                          onClick={closeMenu}
                          className="w-full text-center py-3 bg-stone-100 text-stone-600 rounded-full hover:bg-stone-200/70 transition-all"
                        >
                          Daftar
                        </Link>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}