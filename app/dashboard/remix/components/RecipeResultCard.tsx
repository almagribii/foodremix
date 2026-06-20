"use client";

interface RecipeData {
  recipeName: string;
  ingredientsUsed: string[];
  instructions: string[];
  moneySaved: number;
  carbonPrevented: number;
}

interface RecipeResultCardProps {
  recipe: RecipeData | null;
  onOpenShareModal: () => void;
}

export default function RecipeResultCard({
  recipe,
  onOpenShareModal,
}: RecipeResultCardProps) {
  if (!recipe) {
    return (
      <div className="bg-zinc-50 border border-dashed border-zinc-200 rounded-3xl p-12 text-center text-xs text-zinc-400 font-medium flex flex-col items-center justify-center h-full min-h-[300px]">
        <svg
          className="h-8 w-8 text-zinc-300 mb-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
        Belum ada racikan menu gizi aktif. Masukkan kombinasi bahan baku Anda di
        panel sebelah kiri.
      </div>
    );
  }

  return (
    <div className="bg-white border border-zinc-200/80 rounded-3xl p-6 shadow-sm space-y-6">
      {/* Header Resep */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-zinc-100 pb-4">
        <div className="space-y-1">
          <span className="text-[9px] font-black tracking-widest uppercase bg-emerald-50 border border-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md">
            Gemini AI Optimization
          </span>
          <h2 className="text-xl font-black text-zinc-800 tracking-tight">
            {recipe.recipeName}
          </h2>
        </div>
        <button
          onClick={onOpenShareModal}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-sky-50 border border-sky-100 text-sky-800 hover:bg-sky-100 transition text-xs font-bold rounded-xl shrink-0"
        >
          🤝 Bagi / Patungan Bahan
        </button>
      </div>

      {/* Metrik SDGs */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 bg-zinc-50/60 border border-zinc-100 rounded-2xl">
          <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider block">
            Estimasi Uang Dihemat
          </span>
          <span className="text-sm font-black text-zinc-800">
            Rp {recipe.moneySaved.toLocaleString("id-ID")}
          </span>
        </div>
        <div className="p-3 bg-zinc-50/60 border border-zinc-100 rounded-2xl">
          <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider block">
            Emisi Karbon Dicegah
          </span>
          <span className="text-sm font-black text-emerald-600">
            {recipe.carbonPrevented} Kg CO₂
          </span>
        </div>
      </div>

      {/* Detail Langkah */}
      <div className="space-y-3">
        <div>
          <h4 className="text-xs font-black uppercase tracking-wider text-zinc-400">
            Langkah Pengolahan Kreatif
          </h4>
        </div>
        <ol className="space-y-2.5 list-decimal pl-4 text-xs text-zinc-600 leading-relaxed font-medium">
          {recipe.instructions.map((step, idx) => (
            <li key={idx} className="pl-1">
              {step}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
