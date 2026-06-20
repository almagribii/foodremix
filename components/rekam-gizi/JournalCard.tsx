"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface JournalLog {
  id: string;
  userMood: string;
  foodEaten: string;
  userStory: string;
  aiInsight: string;
  healthScore: number;
  createdAt: string;
}

interface JournalCardProps {
  log: JournalLog;
}

export default function JournalCard({ log }: JournalCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Kalkulasi warna dan tema berdasarkan skor kepatuhan gizi
  const getScoreMeta = (score: number) => {
    if (score >= 85)
      return {
        stroke: "stroke-emerald-500",
        text: "text-emerald-700",
        bg: "bg-emerald-50 text-emerald-700 border-emerald-100",
        label: "AMAN",
        descColor: "text-emerald-600",
      };
    if (score >= 65)
      return {
        stroke: "stroke-amber-500",
        text: "text-amber-700",
        bg: "bg-amber-50 text-amber-700 border-amber-100",
        label: "WASPADA",
        descColor: "text-amber-600",
      };
    return {
      stroke: "stroke-rose-500",
      text: "text-rose-700",
      bg: "bg-rose-50 text-rose-700 border-rose-100",
      label: "BAHAYA",
      descColor: "text-rose-600",
    };
  };

  const meta = getScoreMeta(log.healthScore);
  const radius = 16;
  const strokeDasharray = 2 * Math.PI * radius;
  const strokeDashoffset =
    strokeDasharray - (log.healthScore / 100) * strokeDasharray;

  return (
    <div className="bg-white border border-zinc-200/80 rounded-2xl shadow-sm overflow-hidden flex flex-col transition-all duration-200 hover:border-zinc-300">
      {/* Area Ringkasan Depan */}
      <div className="p-4 flex items-start justify-between gap-4">
        <div className="space-y-2 flex-1 min-w-0">
          <div className="flex items-center gap-2">
            {/* Ikon Status Status */}
            <div
              className={`h-5 w-5 rounded-full border flex items-center justify-center shrink-0 ${meta.bg}`}
            >
              <svg
                className="h-3 w-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={3}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d={
                    log.healthScore >= 65
                      ? "M5 13l4 4L19 7"
                      : "M6 18L18 6M6 6l12 12"
                  }
                />
              </svg>
            </div>
            <span className="text-[11px] text-zinc-400 font-bold tracking-wide">
              {new Date(log.createdAt).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>

          <h3 className="text-sm font-black text-zinc-800 truncate">
            {log.foodEaten}
          </h3>

          <span className="text-zinc-500">
            {log.userStory.substring(0, 45)}...
          </span>
        </div>

        {/* Ring Kepatuhan Gizi Bulat */}
        <div className="flex flex-col items-center gap-1 shrink-0">
          <div className="relative h-11 w-11 flex items-center justify-center">
            <svg className="absolute -rotate-90 transform h-11 w-11">
              <circle
                cx="22"
                cy="22"
                r={radius}
                fill="transparent"
                stroke="#F4F4F5"
                strokeWidth="3"
              />
              <motion.circle
                cx="22"
                cy="22"
                r={radius}
                fill="transparent"
                className={`${meta.stroke}`}
                strokeWidth="3"
                strokeLinecap="round"
                initial={{ strokeDashoffset: strokeDasharray }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 0.4 }}
                strokeDasharray={strokeDasharray}
              />
            </svg>
            <span className={`text-[10px] font-black ${meta.text}`}>
              {log.healthScore}%
            </span>
          </div>
          <p className="text-xs font-semibold leading-relaxed truncate">
            <span
              className={`text-[10px] uppercase tracking-wider font-black px-1.5 py-0.5 rounded border mr-1.5 ${meta.bg}`}
            >
              {meta.label}
            </span>
          </p>
        </div>
      </div>

      {/* Tombol Pemicu Accordion Tinjau Analisis */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-2 bg-zinc-50/60 border-t border-zinc-100 flex items-center justify-between text-[11px] font-bold text-zinc-500 hover:text-zinc-800 transition-colors"
      >
        <span>
          {isExpanded ? "Sembunyikan Analisis" : "Tinjau Analisis Gizi & Saran"}
        </span>
        <motion.svg
          animate={{ rotate: isExpanded ? 180 : 0 }}
          className="h-3.5 w-3.5 text-zinc-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 9l-7 7-7-7"
          />
        </motion.svg>
      </button>

      {/* Detail Konten Dropdown AI */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-zinc-100 bg-zinc-50/40"
          >
            <div className="p-4 text-xs space-y-2 leading-relaxed text-zinc-600 whitespace-pre-line">
              <div className="font-bold text-zinc-800 flex items-center gap-1.5 mb-1">
                <svg
                  className="h-3.5 w-3.5 text-[#bc9003]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
                Ulasan Penyelarasan Gizi Medis:
              </div>
              {log.aiInsight}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
