import { Leaf, Wallet, Flame } from "lucide-react";
import type { RemixMode } from "./IngredientInputForm";

export interface RecipeData {
  recipeName: string;
  ingredientsUsed: string[];
  instructions: string[];
  moneySaved: number;
  carbonPrevented: number;
  estimatedCalories?: number;
  detectedFrom?: string;
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
            <span className="text-[10px] text-zinc-500 font-medium">
              Terdeteksi: <span className="font-bold text-zinc-700">{recipe.detectedFrom}</span>
            </span>
          )}
        </div>
        <h2 className="text-xl font-bold text-[#1A1A1A] tracking-tight leading-tight">
          {recipe.recipeName}
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3.5 bg-zinc-50 border border-zinc-200 rounded-xl space-y-0.5">
          <div className="flex items-center gap-1.5 text-zinc-500">
            <Wallet size={11} />
            <span className="text-[9px] font-semibold">Estimasi Hemat</span>
          </div>
          <p className="text-sm font-bold text-[#1A1A1A]">
            Rp {(recipe.moneySaved || 0).toLocaleString("id-ID")}
          </p>
        </div>
        <div className="p-3.5 bg-zinc-50 border border-zinc-200 rounded-xl space-y-0.5">
          <div className="flex items-center gap-1.5 text-zinc-500">
            <Leaf size={11} />
            <span className="text-[9px] font-semibold">CO₂ Dicegah</span>
          </div>
          <p className="text-sm font-bold text-emerald-600">
            {recipe.carbonPrevented || 0} Kg
          </p>
        </div>
        <div className="p-3.5 bg-zinc-50 border border-zinc-200 rounded-xl space-y-0.5">
          <div className="flex items-center gap-1.5 text-zinc-500">
            <Flame size={11} />
            <span className="text-[9px] font-semibold">Kalori</span>
          </div>
          <p className="text-sm font-bold text-amber-600">
            {recipe.estimatedCalories || 300} kkal
          </p>
        </div>
      </div>

      {recipe.ingredientsUsed?.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-[10px] font-semibold text-zinc-500">
            {isDetect ? "Bahan yang Dibutuhkan" : "Bahan yang Digunakan"}
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {recipe.ingredientsUsed.map((b, i) => (
              <span key={i}
                className="text-[10px] font-medium px-2.5 py-1 bg-white border border-zinc-200 text-zinc-600 rounded-lg"
              >
                {b}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-3">
        <h4 className="text-[10px] font-semibold text-zinc-500">
          {isDetect ? "Tutorial Cara Membuat" : "Langkah Pengolahan"}
        </h4>
        {recipe.instructions?.length > 0 ? (
          <ol className="space-y-2">
            {recipe.instructions.map((step, idx) => (
              <li key={idx} className="flex gap-2 items-start">
                <span className="shrink-0 w-5 h-5 rounded-md bg-zinc-800 text-white text-[9px] font-semibold flex items-center justify-center mt-0.5">
                  {idx + 1}
                </span>
                <p className="text-xs text-zinc-600 leading-relaxed">{step}</p>
              </li>
            ))}
          </ol>
        ) : (
          <p className="text-xs text-zinc-400 italic">
            Tidak ada detail langkah.
          </p>
        )}
      </div>
    </div>
  );
}