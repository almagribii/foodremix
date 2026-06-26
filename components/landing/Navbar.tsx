"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuth } from "../../lib/hooks/useAuth";
import { Sparkles, Menu, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button"; 

export default function Navbar() {
  const { isAuthenticated, loading, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const navLinks = [
    { name: "Beranda", path: "/" },
    { name: "Remix Area", path: "/remix-area" },
    { name: "Tentang", path: "/tentang" },
  ];

  return (
    <>
      <motion.nav
        className="sticky top-0 z-50 backdrop-blur-md bg-[#FBFBFA]/85 border-b border-stone-200/40"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
          <Link href="/" className="flex gap-3 items-center group select-none">
            <div className="w-8 h-8 relative rounded-xl overflow-hidden border border-stone-200/60 shadow-sm group-hover:scale-105 transition-transform duration-300 ease-out">
              <Image
                src="/logo-trans.png"
                alt="Foodremix Logo"
                fill
                className="object-cover"
              />
            </div>
            <span className="font-serif italic font-normal text-lg tracking-tight text-stone-800">
              Food
              <span className="font-extrabold text-[#a17e26] not-italic ml-0.5">
                remix
              </span>
            </span>
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
                      ? "text-[#a17e26]"
                      : "text-stone-400 hover:text-stone-800"
                  }`}
                >
                  {link.name}
                  <span
                    className={`absolute bottom-0 left-0 h-[2px] bg-[#a17e26] transition-all duration-300 ease-out rounded-full ${
                      isActive ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                </Link>
              );
            })}
          </div>

          <div className="hidden md:flex items-center gap-3">
            {!loading && (
              <>
                {isAuthenticated ? (
                  <Link href="/dashboard">
                    <Button
                      variant="accent"
                      size="sm"
                    >
                      <span className="flex items-center justify-center gap-2 w-full">
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                          />
                        </svg>{" "}
                        Dashboard
                      </span>
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link href="/login">
                      <Button variant="accent" size="sm">
                        Login
                      </Button>
                    </Link>
                    <Link href="/register">
                      <Button
                        variant="primary"
                        size="sm"
                        className="bg-stone-900 text-white hover:bg-stone-800 text-xs px-4 py-2 font-semibold"
                      >
                        Daftar
                      </Button>
                    </Link>
                  </>
                )}
              </>
            )}
          </div>

          <button
            onClick={toggleMenu}
            className="md:hidden p-2 text-stone-500 hover:text-stone-800 transition-colors cursor-pointer rounded-lg hover:bg-stone-100"
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
            className="fixed inset-0 top-16 bg-[#FBFBFA]/95 backdrop-blur-lg z-40 md:hidden flex flex-col justify-between border-t border-stone-200/50 p-6"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => {
                const isActive = pathname === link.path;

                return (
                  <Link
                    key={link.name}
                    href={link.path}
                    onClick={closeMenu}
                    className={`py-3 px-4 rounded-xl transition-all font-medium text-base flex items-center justify-between ${
                      isActive
                        ? "bg-[#a17e26]/5 text-[#a17e26] font-semibold"
                        : "text-stone-600 hover:bg-stone-100"
                    }`}
                  >
                    {link.name}
                    {isActive && (
                      <ArrowRight size={16} className="text-[#a17e26]" />
                    )}
                  </Link>
                );
              })}
            </div>

            <div className="flex flex-col gap-3 border-t border-stone-200/40 pt-6">
              {!loading && (
                <>
                  {isAuthenticated ? (
                    <>
                      <Link
                        href="/dashboard"
                        onClick={closeMenu}
                        className="w-full"
                      >
                        <Button
                          variant="accent"
                          className="w-full bg-[#eab30b] text-black py-3"
                        >
                          <Sparkles size={14} />
                          Dashboard
                        </Button>
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          closeMenu();
                        }}
                        className="w-full py-3 text-center text-sm font-medium text-stone-400 hover:text-red-500 transition-colors"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/login"
                        onClick={closeMenu}
                        className="w-full"
                      >
                        <Button
                          variant="accent"
                          className="w-full text-stone-600 py-3 font-semibold"
                        >
                          Login
                        </Button>
                      </Link>
                      <Link
                        href="/register"
                        onClick={closeMenu}
                        className="w-full"
                      >
                        <Button
                          variant="primary"
                          className="w-full bg-stone-900 text-white py-3 font-semibold"
                        >
                          Daftar
                        </Button>
                      </Link>
                    </>
                  )}
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
