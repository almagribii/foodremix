"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuth } from "../../lib/hooks/useAuth";
import {
  Sparkles,
  Menu,
  X,
  LayoutDashboard,
  LogOut,
  LogIn,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function Navbar() {
  const { isAuthenticated, loading, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const navLinks = [
    { name: "Beranda", path: "/" },
    { name: "Remix Picker", path: "/remix-area" },
    { name: "Game", path: "/game" },

    { name: "Tentang", path: "/tentang" },
  ];

  return (
    <>
      <motion.nav
        className="sticky top-0 z-50 backdrop-blur-md bg-[#FBFBFA]/90 border-b border-stone-200/50"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="max-w-6xl mx-auto px-5 sm:px-6 h-18 flex justify-between items-center">
          <Link
            href="/"
            className="flex gap-2.5 items-center group select-none"
          >
            <div className="w-8 h-8 relative rounded-xl overflow-hidden border border-stone-200/80 shadow-sm group-hover:scale-105 transition-transform duration-300 ease-out">
              <Image
                src="/logo-trans.png"
                alt="Foodremix Logo"
                fill
                className="object-cover"
              />
            </div>
            <div className="-mt-1 text-lg sm:block font-bold">
              <span className="text-[#eab308]">
                <span className="hoverText text-hover-primary">F</span>
                <span className="hoverText text-hover-primary">o</span>
                <span className="hoverText text-hover-primary">o</span>
                <span className="hoverText text-hover-primary">d</span>
              </span>
              <span className="text-[#4D2E00]">
                <span className="hoverText text-hover-secondary">r</span>
                <span className="hoverText text-hover-secondary">e</span>
                <span className="hoverText text-hover-secondary">m</span>
                <span className="hoverText text-hover-secondary">i</span>
                <span className="hoverText text-hover-secondary">x</span>
              </span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.path;
              return (
                <Link
                  key={link.name}
                  href={link.path}
                  className={`transition-colors duration-300 text-sm font-medium relative py-1.5 cursor-pointer group ${
                    isActive
                      ? "text-[#eab308]"
                      : "text-stone-500 hover:text-stone-900"
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <motion.span
                      layoutId="activeNavLine"
                      className="absolute bottom-0 left-0 h-0.5 bg-[#eab308] w-full rounded-full"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30,
                      }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          <div className="hidden md:flex items-center gap-3">
            {!loading ? (
              isAuthenticated ? (
                <Link href="/dashboard">
                  <Button variant="accent" size="sm">
                    <span className="flex items-center justify-center gap-2 w-full">
                      <LayoutDashboard size={15} />
                      Dashboard
                    </span>
                  </Button>
                </Link>
              ) : (
                <Link href="/login">
                  <Button variant="accent" size="sm">
                    <span className="flex items-center justify-center gap-2 w-full">
                      Mulai
                      <ArrowRight size={15} />
                    </span>
                  </Button>
                </Link>
              )
            ) : (
              <div className="w-20 h-8 bg-stone-100 animate-pulse rounded-lg" />
            )}
          </div>

          <button
            onClick={toggleMenu}
            className="md:hidden p-2 text-stone-600 hover:text-stone-900 transition-colors cursor-pointer rounded-xl hover:bg-stone-100"
            aria-label="Toggle Menu"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 top-16 bg-[#FBFBFA] z-40 md:hidden flex flex-col justify-between p-6 shadow-xl"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex flex-col gap-2.5 mt-2">
              {navLinks.map((link) => {
                const isActive = pathname === link.path;
                return (
                  <Link
                    key={link.name}
                    href={link.path}
                    onClick={closeMenu}
                    className={`py-3.5 px-4 rounded-xl transition-all text-base font-medium flex items-center justify-between ${
                      isActive
                        ? "bg-[#eab308]/10 text-[#d9a406] font-semibold"
                        : "text-stone-600 active:bg-stone-100"
                    }`}
                  >
                    {link.name}
                    {isActive && (
                      <div className="w-1.5 h-1.5 rounded-full bg-[#eab308]" />
                    )}
                  </Link>
                );
              })}
            </div>

            <div className="flex flex-col gap-3 border-t border-stone-200/60 pt-6 w-full">
              {!loading &&
                (isAuthenticated ? (
                  <>
                    <Link
                      href="/dashboard"
                      onClick={closeMenu}
                      className="w-full"
                    >
                      <Button
                        variant="accent"
                        className="w-full"
                      >
                       
                        <span className="flex items-center justify-center gap-2 w-full">
                          <LayoutDashboard size={15} />
                          Masuk Dashboard
                        </span>
                      </Button>
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        closeMenu();
                      }}
                      className="w-full py-4 mt-1 text-center text-sm font-medium text-stone-500 hover:text-red-500 active:bg-red-50/50 rounded-xl transition-colors border border-stone-200/60"
                    >
                      <span className="flex items-center justify-center gap-2 w-full">
                        <LogOut size={15} />
                        Keluar Akun
                      </span>
                    </button>
                  </>
                ) : (
                  <Link href="/login" onClick={closeMenu} className="w-full">
                    <Button
                      variant="accent"
                      className="w-full"
                    >
                      <span className="flex items-center justify-center gap-2 w-full">
                        <LogIn size={16} />
                        Masuk ke Akun
                      </span>
                    </Button>
                  </Link>
                ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
