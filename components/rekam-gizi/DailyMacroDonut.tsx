"use client";

import { motion } from "framer-motion";

interface MacroData {
  karbo: number;
  lemak: number;
  protein: number;
}

interface DailyMacroDonutProps {
  macro: MacroData;
  dateString: string;
}

export default function DailyMacroDonut({
  macro,
  dateString,
}: DailyMacroDonutProps) {
  // Format tanggal ke Bahasa Indonesia
  const formatIndoDate = (dateIso: string) => {
    try {
      return new Date(dateIso).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return "Hari Ini";
    }
  };

  // VALIDASI KRITIKAL: Cek apakah total nilai makro kosong/nol (Hari tanpa entri jurnal)
  const totalMacro = macro.karbo + macro.lemak + macro.protein;
  const isDataEmpty = totalMacro === 0;

  // Jika data kosong, gunakan 0 untuk stroke. Jika ada, gunakan prop asli.
  const karboStroke = isDataEmpty ? 0 : macro.karbo;
  const lemakStroke = isDataEmpty ? 0 : macro.lemak;
  const proteinStroke = isDataEmpty ? 0 : macro.protein;

  return (
    <div className="bg-white border border-zinc-200/80 rounded-3xl p-6 shadow-sm space-y-4">
      <h3 className="text-sm font-black text-zinc-800 tracking-tight">
        Proporsi Gizi Makro ({formatIndoDate(dateString)})
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
        {/* Sektor Donut SVG */}
        <div className="flex justify-center relative items-center">
          <svg
            width="120"
            height="120"
            viewBox="0 0 36 36"
            className="transform -rotate-90 overflow-visible"
          >
            {/* Lingkaran Dasar / Lingkaran Kosong saat Data 0 */}
            <circle
              cx="18"
              cy="18"
              r="15.915"
              fill="transparent"
              stroke="#F4F4F5"
              strokeWidth="4"
            />

            {!isDataEmpty && (
              <>
                {/* Karbohidrat (Amber) */}
                <motion.circle
                  cx="18"
                  cy="18"
                  r="15.915"
                  fill="transparent"
                  stroke="#FCD34D"
                  strokeWidth="4"
                  initial={{ strokeDasharray: `0 100` }}
                  animate={{
                    strokeDasharray: `${karboStroke} ${100 - karboStroke}`,
                  }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  strokeDashoffset="0"
                />

                {/* Lemak (Blue) */}
                <motion.circle
                  cx="18"
                  cy="18"
                  r="15.915"
                  fill="transparent"
                  stroke="#93C5FD"
                  strokeWidth="4"
                  initial={{ strokeDasharray: `0 100` }}
                  animate={{
                    strokeDasharray: `${lemakStroke} ${100 - lemakStroke}`,
                  }}
                  transition={{ duration: 0.4, ease: "easeOut", delay: 0.05 }}
                  strokeDashoffset={`-${karboStroke}`}
                />

                {/* Protein (Emerald) */}
                <motion.circle
                  cx="18"
                  cy="18"
                  r="15.915"
                  fill="transparent"
                  stroke="#86EFAC"
                  strokeWidth="4"
                  initial={{ strokeDasharray: `0 100` }}
                  animate={{
                    strokeDasharray: `${proteinStroke} ${100 - proteinStroke}`,
                  }}
                  transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
                  strokeDashoffset={`-${karboStroke + lemakStroke}`}
                />
              </>
            )}
          </svg>

          {/* Teks Ringkasan Tengah (Adaptif terhadap Kondisi Kosong) */}
          <div className="absolute text-center select-none">
            <span className="text-sm font-black text-zinc-800 block tracking-tight">
              {isDataEmpty ? "0" : `${macro.karbo}`}%
            </span>
            <span className="text-[8px] uppercase tracking-widest text-zinc-400 font-bold block mt-0.5">
              {isDataEmpty ? "Kosong" : "Karbo"}
            </span>
          </div>
        </div>

        {/* Legend Parameter Gizi */}
        <div className="space-y-2.5 text-xs font-bold text-zinc-600">
          <div className="flex items-center justify-between border-b border-zinc-50 pb-1.5">
            <div className="flex items-center gap-2">
              <span
                className={`h-2.5 w-2.5 rounded-md ${isDataEmpty ? "bg-zinc-200" : "bg-[#FCD34D]"}`}
              />
              Karbohidrat
            </div>
            <span className="text-zinc-800 font-black">
              {isDataEmpty ? 0 : macro.karbo}%
            </span>
          </div>

          <div className="flex items-center justify-between border-b border-zinc-50 pb-1.5">
            <div className="flex items-center gap-2">
              <span
                className={`h-2.5 w-2.5 rounded-md ${isDataEmpty ? "bg-zinc-200" : "bg-[#93C5FD]"}`}
              />
              Lemak
            </div>
            <span className="text-zinc-800 font-black">
              {isDataEmpty ? 0 : macro.lemak}%
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className={`h-2.5 w-2.5 rounded-md ${isDataEmpty ? "bg-zinc-200" : "bg-[#86EFAC]"}`}
              />
              Protein
            </div>
            <span className="text-zinc-800 font-black">
              {isDataEmpty ? 0 : macro.protein}%
            </span>
          </div>
        </div>
      </div>

      {/* Panel Rekomendasi Dinamis Harian */}
      <div className="bg-zinc-50 border border-zinc-100/80 rounded-2xl p-4 text-xs">
        <h5 className="font-bold text-zinc-800 mb-0.5">
          Evaluasi Asupan Harian
        </h5>
        <p className="text-zinc-500 leading-relaxed text-[11px] font-medium">
          {isDataEmpty
            ? "Belum ada riwayat konsumsi makanan yang dicatat untuk hari ini. Silakan tambahkan entri jurnal baru Anda."
            : macro.lemak > 35
              ? "Pecahan lemak harian Anda terdeteksi melampaui batas aman. Batasi asupan gorengan atau santan berlebih pada menu makan berikutnya."
              : macro.protein < 15
                ? "Asupan protein hari ini tergolong rendah. Tambahkan porsi lauk tinggi protein untuk mengimbangi pemulihan energi fisik Anda."
                : "Kombinasi makronutrien harian Anda berada di rasio ideal yang direkomendasikan sistem Foodremix Guard."}
        </p>
      </div>
    </div>
  );
}
