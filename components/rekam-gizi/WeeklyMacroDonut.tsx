"use client";

interface MacroData {
  karbo: number;
  lemak: number;
  protein: number;
}

interface WeeklyMacroDonutProps {
  macro: MacroData;
}

export default function WeeklyMacroDonut({ macro }: WeeklyMacroDonutProps) {
  // Hitung offset stroke berdasarkan prop asli
  const karboStroke = macro.karbo;
  const lemakStroke = macro.lemak;
  const proteinStroke = macro.protein;

  return (
    <div className="bg-white border border-zinc-200/80 rounded-3xl p-5 shadow-sm space-y-4">
      <h3 className="text-sm font-black text-zinc-800 tracking-tight">
        Pecahan Gizi Makro Minggu Ini
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
        <div className="flex justify-center relative items-center">
          <svg
            width="120"
            height="120"
            viewBox="0 0 36 36"
            className="transform -rotate-90"
          >
            <circle
              cx="18"
              cy="18"
              r="15.915"
              fill="transparent"
              stroke="#E4E4E7"
              strokeWidth="3.5"
            />
            <circle
              cx="18"
              cy="18"
              r="15.915"
              fill="transparent"
              stroke="#FCD34D"
              strokeWidth="3.5"
              strokeDasharray={`${karboStroke} ${100 - karboStroke}`}
              strokeDashoffset="0"
            />
            <circle
              cx="18"
              cy="18"
              r="15.915"
              fill="transparent"
              stroke="#93C5FD"
              strokeWidth="3.5"
              strokeDasharray={`${lemakStroke} ${100 - lemakStroke}`}
              strokeDashoffset={`-${karboStroke}`}
            />
            <circle
              cx="18"
              cy="18"
              r="15.915"
              fill="transparent"
              stroke="#86EFAC"
              strokeWidth="3.5"
              strokeDasharray={`${proteinStroke} ${100 - proteinStroke}`}
              strokeDashoffset={`-${karboStroke + lemakStroke}`}
            />
          </svg>
          <div className="absolute text-center">
            <span className="text-xs font-black text-zinc-700 block">
              {macro.karbo}%
            </span>
            <span className="text-[8px] uppercase tracking-wider text-zinc-400 font-bold block">
              Karbo
            </span>
          </div>
        </div>

        <div className="space-y-2 text-xs font-bold text-zinc-600">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-blue-300" />
              Lemak
            </div>
            <span>{macro.lemak}%</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-amber-300" />
              Karbo
            </div>
            <span>{macro.karbo}%</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-300" />
              Protein
            </div>
            <span>{macro.protein}%</span>
          </div>
        </div>
      </div>

      <div className="bg-zinc-50 border border-zinc-100 rounded-2xl p-3.5 text-xs text-zinc-700">
        <h5 className="font-bold text-zinc-800 mb-0.5">Saran Imbang</h5>
        <p className="text-zinc-500 leading-relaxed text-[11px]">
          {macro.lemak > 35
            ? "Pecahan lemak terdeteksi tinggi. Kurangi menu gorengan dan perbanyak asupan serat karbohidrat kompleks."
            : "Kombinasi makronutrien mingguan Anda berada di rasio ideal. Pertahankan kestabilan porsi saat ini."}
        </p>
      </div>
    </div>
  );
}
