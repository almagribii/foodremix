"use client";

import { motion } from "framer-motion";

interface DailySummaryProps {
  currentCalories: number;
  currentSugar: number;
  currentProtein: number;
  dateString: string; 
}

export default function DailyNutrientSummary({
  currentCalories,
  currentSugar,
  currentProtein,
}: DailySummaryProps) {
  const targets = { calories: 1800, sugar: 50, protein: 70 };

  const renderProgressRing = (
    current: number,
    target: number,
    strokeColor: string,
    label: string,
    unit: string,
  ) => {
    const percentage = Math.min(Math.round((current / target) * 100), 100);

    // Perubahan dimensi agar bulatan lebih besar & teks tidak nabrak/terpotong
    const radius = 38;
    const strokeWidth = 5.5;
    const strokeDasharray = 2 * Math.PI * radius;
    const strokeDashoffset =
      strokeDasharray - (percentage / 100) * strokeDasharray;

    return (
      <div className="flex flex-col items-center gap-3 flex-1">
        {/* Dimensi kontainer dinaikkan ke h-24 w-24 */}
        <div className="relative h-24 w-24 flex items-center justify-center">
          <svg
            className="absolute -rotate-90 transform h-24 w-24"
            viewBox="0 0 96 96"
          >
            <circle
              cx="48"
              cy="48"
              r={radius}
              fill="transparent"
              stroke="#F4F4F5"
              strokeWidth={strokeWidth}
            />
            <motion.circle
              cx="48"
              cy="48"
              r={radius}
              fill="transparent"
              className={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              initial={{ strokeDashoffset: strokeDasharray }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              strokeDasharray={strokeDasharray}
            />
          </svg>

          {/* Teks di dalam bulatan dengan spasi yang proporsional */}
          <div className="text-center z-10 px-2">
            <span className="text-xs font-black text-zinc-800 block tracking-tight leading-none">
              {current}
              {unit}
            </span>
            <span className="text-[9px] text-zinc-400 font-bold block mt-1 tracking-wide">
              / {target}
              {unit}
            </span>
          </div>
        </div>

        <span className="text-[11px] font-black text-zinc-500 tracking-wide mt-1">
          {label}
        </span>
      </div>
    );
  };

  return (
    <div className="bg-white border border-zinc-200/80 rounded-3xl p-6 shadow-sm space-y-6">
      <h3 className="text-sm font-black text-zinc-800 tracking-tight">
        Capaian Gizi Hari Ini
      </h3>

      <div className="flex items-center justify-between gap-4 py-2">
        {renderProgressRing(
          currentCalories,
          targets.calories,
          "stroke-sky-400",
          "Total Kalori",
          "Kcal",
        )}
        {renderProgressRing(
          currentSugar,
          targets.sugar,
          "stroke-orange-400",
          "Gula Tambahan",
          "g",
        )}
        {renderProgressRing(
          currentProtein,
          targets.protein,
          "stroke-amber-400",
          "Protein",
          "g",
        )}
      </div>

      <div className="text-xs text-zinc-500 border-t border-zinc-100 pt-4 leading-relaxed font-medium">
        Asupan kalori dan gula hari ini dalam batas wajar. Tingkatkan konsumsi
        protein sedikit lagi untuk mengimbangi pemulihan fisik.
      </div>
    </div>
  );
}
