"use client";

import { motion } from "framer-motion";

export default function NutrientBarChart() {
  // Data Statis Global Keberhasilan Komunitas Foodremix (SDGs Metric)
  const globalStats = {
    totalFoodSaved: "1,240 Kg",
    co2Prevented: "2.8 Ton",
    activeContributors: "482 User",
    wasteDistribution: [
      { label: "Bahan Organik Sisa", value: 45, color: "stroke-sky-400" },
      { label: "Kelebihan Porsi Masak", value: 35, color: "stroke-amber-400" },
      {
        label: "Produk Hampir Kedaluwarsa",
        value: 20,
        color: "stroke-rose-400",
      },
    ],
  };

  return (
    <div className="bg-white border border-zinc-200/80 rounded-3xl p-6 shadow-sm grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
      {/* SEKTOR KIRI: INFORMASI GLOBAL IMPACT IMPACT */}
      <div className="md:col-span-6 space-y-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[#1A1A1A]">
            <svg
              className="h-4 w-4 text-emerald-600 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
              />
            </svg>
            <h4 className="text-xs font-black uppercase tracking-wider">
              Dampak Lingkungan Komunitas
            </h4>
          </div>
          <p className="text-[11px] text-zinc-400 font-semibold tracking-wide">
            Akumulasi Gerakan Penyelamatan Pangan Foodremix
          </p>
        </div>

        {/* Grid Informasi Metrik */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3.5 bg-zinc-50 border border-zinc-100/80 rounded-2xl space-y-1">
            <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider block">
              Pangan Terselamatkan
            </span>
            <span className="text-lg font-black text-zinc-800 tracking-tight">
              {globalStats.totalFoodSaved}
            </span>
          </div>
          <div className="p-3.5 bg-zinc-50 border border-zinc-100/80 rounded-2xl space-y-1">
            <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider block">
              Reduksi Emisi CO2
            </span>
            <span className="text-lg font-black text-emerald-600 tracking-tight">
              {globalStats.co2Prevented}
            </span>
          </div>
        </div>

        <p className="text-[11px] text-zinc-500 leading-relaxed font-medium">
          Melalui kolaborasi fitur{" "}
          <span className="font-bold text-zinc-700">Remix Share</span> dan
          optimasi bahan baku sisa kulkas via AI, komunitas kita telah berhasil
          menekan potensi penumpukan sampah organik secara signifikan bulan ini.
        </p>
      </div>

      {/* SEKTOR KANAN: SVG DIAGRAM DATA TREN GLOBAL DISTRIBUTION */}
      <div className="md:col-span-6 flex flex-col sm:flex-row items-center gap-6 justify-center border-t md:border-t-0 md:border-l border-zinc-100 pt-5 md:pt-0 md:pl-6">
        {/* Lingkaran Donut Chart Komposit Manual */}
        <div className="relative h-28 w-28 flex items-center justify-center shrink-0">
          <svg
            className="absolute -rotate-90 transform h-28 w-28"
            viewBox="0 0 100 100"
          >
            {/* Sesi 1: 45% (Bahan Organik Sisa) */}
            <motion.circle
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
              className="stroke-sky-400"
              strokeWidth="10"
              initial={{ strokeDasharray: "0 251.2" }}
              animate={{ strokeDasharray: `${(45 / 100) * 251.2} 251.2` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
            {/* Sesi 2: 35% (Kelebihan Porsi) - Offset diputar */}
            <motion.circle
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
              className="stroke-amber-400"
              strokeWidth="10"
              initial={{ strokeDasharray: "0 251.2" }}
              animate={{
                strokeDasharray: `${(35 / 100) * 251.2} 251.2`,
              }}
              style={{
                transformOrigin: "50px 50px",
                rotate: `${(45 / 100) * 360}deg`,
              }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
            />
            {/* Sesi 3: 20% (Hampir Kedaluwarsa) */}
            <motion.circle
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
              className="stroke-rose-400"
              strokeWidth="10"
              initial={{ strokeDasharray: "0 251.2" }}
              animate={{
                strokeDasharray: `${(20 / 100) * 251.2} 251.2`,
              }}
              style={{
                transformOrigin: "50px 50px",
                rotate: `${((45 + 35) / 100) * 360}deg`,
              }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            />
          </svg>
          <div className="text-center z-10">
            <span className="text-base font-black text-zinc-800 tracking-tighter block leading-none">
              Global
            </span>
            <span className="text-[9px] text-zinc-400 font-bold block mt-0.5 uppercase tracking-widest">
              Trends
            </span>
          </div>
        </div>

        {/* Keterangan Parameter Donut */}
        <div className="flex flex-col gap-2 w-full">
          <span className="text-[9px] font-black text-zinc-400 uppercase tracking-wider block">
            Kategori Terbanyak
          </span>
          {globalStats.wasteDistribution.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between text-[11px] font-bold text-zinc-600"
            >
              <div className="flex items-center gap-2 truncate">
                <span
                  className={`h-2.5 w-2.5 rounded-md shrink-0 ${
                    item.color === "stroke-sky-400"
                      ? "bg-sky-400"
                      : item.color === "stroke-amber-400"
                        ? "bg-amber-400"
                        : "bg-rose-400"
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </div>
              <span className="text-zinc-800 font-black pl-2">
                {item.value}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
