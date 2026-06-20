"use client";

export interface RecipeData {
  recipeName: string;
  ingredientsUsed: string[];
  instructions: string[];
  moneySaved: number;
  carbonPrevented: number;
}

interface RecipeResultCardProps {
  recipe: RecipeData;
  onOpenShareModal: () => void;
}

export default function RecipeResultCard({
  recipe,
  onOpenShareModal,
}: RecipeResultCardProps) {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-zinc-100 pb-5">
        <div className="space-y-1.5">
          <span className="text-[9px] font-black tracking-widest uppercase bg-[#EAB308]/10 border border-[#EAB308]/20 text-[#7A5E05] px-2.5 py-0.5 rounded-md inline-block">
            Gemini AI Optimization
          </span>
          <h2 className="text-2xl font-black text-[#1A1A1A] tracking-tight">
            {recipe.recipeName}
          </h2>
        </div>
        <button
          type="button"
          onClick={onOpenShareModal}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#1A1A1A] hover:bg-zinc-800 text-white transition text-[10px] font-black uppercase tracking-widest rounded-xl shrink-0 shadow-sm"
        >
          🤝 Patungan Bahan
        </button>
      </div>

      {/* Grid Penghitung Target SDGs */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-[#F5F5F3] border border-zinc-200/60 rounded-xl">
          <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest block mb-0.5">
            Estimasi Uang Dihemat
          </span>
          <span className="text-base font-black text-[#1A1A1A]">
            Rp{" "}
            {recipe.moneySaved
              ? recipe.moneySaved.toLocaleString("id-ID")
              : "0"}
          </span>
        </div>
        <div className="p-4 bg-[#F5F5F3] border border-zinc-200/60 rounded-xl">
          <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest block mb-0.5">
            Emisi Karbon Dicegah
          </span>
          <span className="text-base font-black text-emerald-600">
            {recipe.carbonPrevented || 0} Kg CO₂
          </span>
        </div>
      </div>

      {/* Langkah Resep */}
      <div className="space-y-3 pt-2">
        <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
          Langkah Pengolahan Kreatif
        </h4>
        {recipe.instructions && recipe.instructions.length > 0 ? (
          <ol className="space-y-3 list-decimal pl-4 text-xs text-zinc-600 leading-relaxed font-medium">
            {recipe.instructions.map((step, idx) => (
              <li
                key={idx}
                className="pl-1 marker:font-bold marker:text-zinc-400"
              >
                {step}
              </li>
            ))}
          </ol>
        ) : (
          <p className="text-xs text-zinc-400 font-medium italic">
            Tidak ada detail langkah instruksi untuk resep ini.
          </p>
        )}
      </div>
    </div>
  );
}
