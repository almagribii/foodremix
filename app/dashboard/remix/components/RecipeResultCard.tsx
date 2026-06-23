"use client";

import { Leaf, Wallet,  } from "lucide-react";
import type { RemixMode } from "./IngredientInputForm";

export interface RecipeData {
  recipeName: string;
  ingredientsUsed: string[];
  instructions: string[];
  moneySaved: number;
  carbonPrevented: number;
  detectedFrom?: string; // nama makanan asli yang dideteksi (mode detect)
}

interface RecipeResultCardProps {
  recipe: RecipeData;
  mode?: RemixMode;
}

export default function RecipeResultCard({ recipe, mode = "remix" }: RecipeResultCardProps) {
  const isDetect = mode === "detect";

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 pb-5 border-b border-zinc-100">
        <div className="flex items-center gap-2 flex-wrap">
          
          {isDetect && recipe.detectedFrom && (
            <span className="text-[10px] text-zinc-400 font-medium">
              Terdeteksi: <span className="font-black text-zinc-600">{recipe.detectedFrom}</span>
            </span>
          )}
        </div>
        <h2 className="text-xl font-black text-[#1A1A1A] tracking-tight leading-tight">
          {recipe.recipeName}
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="p-3.5 bg-zinc-50 border border-zinc-200/60 rounded-2xl space-y-0.5">
          <div className="flex items-center gap-1.5 text-zinc-400">
            <Wallet size={11} />
            <span className="text-[9px] font-black uppercase tracking-wider">Estimasi Hemat</span>
          </div>
          <p className="text-sm font-black text-[#1A1A1A]">
            Rp {(recipe.moneySaved || 0).toLocaleString("id-ID")}
          </p>
        </div>
        <div className="p-3.5 bg-zinc-50 border border-zinc-200/60 rounded-2xl space-y-0.5">
          <div className="flex items-center gap-1.5 text-zinc-400">
            <Leaf size={11} />
            <span className="text-[9px] font-black uppercase tracking-wider">CO₂ Dicegah</span>
          </div>
          <p className="text-sm font-black text-emerald-600">
            {recipe.carbonPrevented || 0} Kg
          </p>
        </div>
      </div>

      {/* ── Bahan ────────────────────────────────────────────── */}
      {recipe.ingredientsUsed?.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
            {isDetect ? "Bahan yang Dibutuhkan" : "Bahan yang Digunakan"}
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {recipe.ingredientsUsed.map((b, i) => (
              <span key={i}
                className="text-[10px] font-bold px-2.5 py-1 bg-white border border-zinc-200 text-zinc-600 rounded-lg">
                {b}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ── Instruksi ─────────────────────────────────────────── */}
      <div className="space-y-3">
        <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
          {isDetect ? "Tutorial Cara Membuat" : "Langkah Pengolahan"}
        </h4>
        {recipe.instructions?.length > 0 ? (
          <ol className="space-y-2.5">
            {recipe.instructions.map((step, idx) => (
              <li key={idx} className="flex gap-3 items-start">
                <span className="shrink-0 w-5 h-5 rounded-lg bg-[#1A1A1A] text-white text-[9px] font-black flex items-center justify-center mt-0.5">
                  {idx + 1}
                </span>
                <p className="text-xs text-zinc-600 font-medium leading-relaxed">{step}</p>
              </li>
            ))}
          </ol>
        ) : (
          <p className="text-xs text-zinc-400 font-medium italic">
            Tidak ada detail langkah instruksi.
          </p>
        )}
      </div>
    </div>
  );
}
