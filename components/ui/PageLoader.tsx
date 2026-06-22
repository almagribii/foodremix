"use client";

/**
 * components/ui/PageLoader.tsx
 *
 * ONE loader untuk seluruh project.
 * Varian:
 *   "page"     — full viewport, dipakai di layout.tsx & auth gate
 *   "section"  — 60vh, dipakai di page-level data fetch
 *   "inline"   — center di dalam container, dipakai di panel / card
 *
 * Tambahan optional:
 *   message    — teks di bawah spinner (default ada per varian)
 */

import { motion } from "framer-motion";

interface PageLoaderProps {
  variant?: "page" | "section" | "inline";
  message?: string;
}

export default function PageLoader({
  variant = "section",
  message,
}: PageLoaderProps) {
  const containerClass =
    variant === "page"
      ? "fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#F5F5F3]"
      : variant === "section"
        ? "flex flex-col items-center justify-center h-[60vh] w-full"
        : "flex flex-col items-center justify-center py-12 w-full";

  const defaultMsg =
    variant === "page" ? "Memverifikasi sesi..." : "Memuat data...";

  return (
    <div className={containerClass}>
      {/* Orbiting ring */}
      <div className="relative flex items-center justify-center mb-5">
        {/* Outer slow ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="absolute w-12 h-12 rounded-full border-[2px] border-transparent border-t-[#EAB308]/40 border-r-[#EAB308]/20"
        />
        {/* Inner fast ring */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
          className="absolute w-8 h-8 rounded-full border-[2px] border-transparent border-t-[#1A1A1A] border-r-[#1A1A1A]/30"
        />
        {/* Center logo dot */}
        <motion.div
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="w-3.5 h-3.5 rounded-full bg-[#EAB308]"
        />
      </div>

      {/* Message */}
      <motion.p
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="text-[10px] font-black uppercase tracking-[0.18em] text-zinc-400"
      >
        {message ?? defaultMsg}
      </motion.p>
    </div>
  );
}
