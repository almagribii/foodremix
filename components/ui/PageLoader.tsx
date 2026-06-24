"use client";

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
        ? "flex flex-col items-center justify-center h-[calc(100vh-160px)] w-full"
        : "flex flex-col items-center justify-center py-12 w-full";

  const defaultMsg =
    variant === "page" ? "Memverifikasi sesi..." : "Memuat data...";

  return (
    <div className={containerClass}>
      <div className="relative flex flex-col items-center justify-center h-20 w-full mb-5">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="absolute w-12 h-12 rounded-full border-2 border-transparent border-t-[#EAB308]/40 border-r-[#EAB308]/20"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
          className="absolute w-8 h-8 rounded-full border-2 border-transparent border-t-[#1A1A1A] border-r-[#1A1A1A]/30"
        />
        <motion.div
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="w-3.5 h-3.5 rounded-full bg-[#EAB308]"
        />
      </div>

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
