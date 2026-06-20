"use client";

interface MineralItem {
  label: string;
  value: number;
}

interface NutrientBarChartProps {
  data: MineralItem[];
}

export default function NutrientBarChart({ data }: NutrientBarChartProps) {
  const lowNutrients = data.filter((m) => m.value < 50).map((m) => m.label);

  return (
    <div className="bg-white border border-zinc-200/80 rounded-3xl p-5 shadow-sm grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
      <div className="md:col-span-5 space-y-2">
        <div className="flex items-center gap-2 text-rose-600">
          <svg
            className="h-4 w-4 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <h4 className="text-xs font-black uppercase tracking-wider">
            Peringatan Khusus Nutrisi
          </h4>
        </div>
        <p className="text-xs text-zinc-500 leading-relaxed">
          {lowNutrients.length > 0
            ? `Asupan ${lowNutrients.join(" dan ")} Anda terpantau berada di batas rendah bulan ini. Pertimbangkan untuk mengatur variasi menu gizi.`
            : "Luar biasa! Seluruh parameter vitamin dan mineral esensial Anda tercukupi dengan seimbang bulan ini."}
        </p>
      </div>

      <div className="md:col-span-7 flex flex-col gap-2">
        <div className="h-28 flex items-end justify-between gap-3 px-2 border-b border-zinc-200 pb-1 relative">
          <div className="absolute inset-x-0 bottom-[70%] border-t border-zinc-100/70 text-[8px] text-zinc-400 font-bold">
            <span>Cukup</span>
          </div>
          <div className="absolute inset-x-0 bottom-[35%] border-t border-zinc-100/70 text-[8px] text-zinc-400 font-bold">
            <span>Kurang</span>
          </div>

          {data.map((bar, index) => (
            <div
              key={index}
              className="flex-1 flex flex-col items-center gap-2 h-full justify-end group"
            >
              <div
                style={{ height: `${bar.value}%` }}
                className={`w-4 sm:w-6 rounded-t-md transition-all duration-300 ${
                  bar.value >= 50
                    ? "bg-sky-200 group-hover:bg-sky-300"
                    : "bg-rose-200 group-hover:bg-rose-300"
                }`}
              />
              <span className="text-[8px] font-bold text-zinc-400 text-center truncate w-full">
                {bar.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
