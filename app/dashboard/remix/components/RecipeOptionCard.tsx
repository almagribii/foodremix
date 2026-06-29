"use client";

import { Leaf, Wallet, CheckCircle2, Flame } from "lucide-react";
import type { RecipeData } from "./RecipeResultCard";

interface RecipeOptionCardProps {
  option: RecipeData;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
}

const optionThemes = [
  {
    name: "Pedas & Gurih",
    iconColor: "text-orange-600",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
    badgeColor: "text-orange-700 bg-orange-100 border-orange-200",
    emoji: "🌶️",
  },
  {
    name: "Sehat & Segar",
    iconColor: "text-emerald-600",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
    badgeColor: "text-emerald-700 bg-emerald-100 border-emerald-200",
    emoji: "🥗",
  },
  {
    name: "Gurih & Kenyal",
    iconColor: "text-amber-600",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    badgeColor: "text-amber-700 bg-amber-100 border-amber-200",
    emoji: "🍳",
  },
];

export default function RecipeOptionCard({
  option,
  index,
  isSelected,
  onSelect,
}: RecipeOptionCardProps) {
  const theme = optionThemes[index] || optionThemes[0];

  return (
    <div
      onClick={onSelect}
      className={`flex flex-col h-full rounded-2xl border-2 transition-all duration-300 cursor-pointer group ${
        isSelected
          ? "border-zinc-800 bg-zinc-50 shadow-md"
          : `${theme.borderColor} ${theme.bgColor} hover:shadow-md`
      }`}
    >
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-start justify-between mb-3">
          <span className="text-lg">{theme.emoji}</span>
          <span
            className={`text-[9px] px-2 py-1 rounded-md border ${theme.badgeColor}`}
          >
            Opsi {index + 1}
          </span>
        </div>

        <h3
          className={`text-sm font-bold text-[#1A1A1A] mb-4 line-clamp-2 leading-snug ${
            isSelected ? "text-[#1A1A1A]" : ""
          }`}
        >
          {option.recipeName}
        </h3>

        <div className="space-y-2 mb-3">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1 text-[9px] text-zinc-500">
              <Wallet size={10} />
              Estimasi Hemat
            </span>
            <span className="text-[10px] font-bold text-[#1A1A1A]">
              Rp {(option.moneySaved || 0).toLocaleString("id-ID")}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1 text-[9px] text-zinc-500">
              <Leaf size={10} />
              CO₂ Dicegah
            </span>
            <span className="text-[10px] font-bold text-emerald-600">
              {(option.carbonPrevented || 0).toFixed(1)} Kg
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1 text-[9px] text-zinc-500">
              <Flame size={10} />
              Kalori
            </span>
            <span className="text-[10px] font-bold text-amber-600">
              {(option.estimatedCalories || 300)} kkal
            </span>
          </div>
        </div>

        <div className="flex-1">
          <p className="text-[9px] font-bold text-zinc-400 mb-1.5">
            Bahan Utama:
          </p>
          <div className="flex flex-wrap gap-1">
            {option.ingredientsUsed.slice(0, 4).map((ing, i) => (
              <span
                key={i}
                className="text-[8px] font-medium px-1.5 py-0.5 bg-white border border-zinc-200 text-zinc-600 rounded-md truncate max-w-[80px]"
              >
                {ing}
              </span>
            ))}
            {option.ingredientsUsed.length > 4 && (
              <span className="text-[8px] font-medium px-1.5 py-0.5 bg-zinc-100 text-zinc-500 rounded-md">
                +{option.ingredientsUsed.length - 4}
              </span>
            )}
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-zinc-200">
          <div className="flex items-center justify-between text-[9px]">
            <span className="font-medium text-zinc-500">
              {option.instructions.length} Langkah
            </span>
            {isSelected && (
              <span className="flex items-center gap-1 font-bold text-emerald-600">
                <CheckCircle2 size={10} />
                Terpilih
              </span>
            )}
          </div>
        </div>
      </div>

      <div
        className={`px-4 py-2.5 border-t-2 ${
          isSelected ? "border-zinc-800 bg-zinc-100/50" : "border-zinc-200"
        } rounded-b-2xl transition-colors`}
      >
        <button
          type="button"
          className={`w-full text-center text-[10px] font-medium transition-all ${
            isSelected
              ? "text-[#1A1A1A]"
              : "text-zinc-500 group-hover:text-[#1A1A1A]"
          }`}
        >
          {isSelected ? "Lihat Detail" : "Pilih Opsi Ini"}
        </button>
      </div>
    </div>
  );
}