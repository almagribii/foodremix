"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
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

const MOODS = [
  {
    label: "Happy",
    value: "HAPPY",
    icon: (
      <svg
        className="h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    color: "text-emerald-600 bg-emerald-50 border-emerald-100",
  },
  {
    label: "Normal",
    value: "NORMAL",
    icon: (
      <svg
        className="h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12h6M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    color: "text-blue-600 bg-blue-50 border-blue-100",
  },
  {
    label: "Lelah",
    value: "LELAH",
    icon: (
      <svg
        className="h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M13 10V3L4 14h7v7l9-11h-7z"
        />
      </svg>
    ),
    color: "text-amber-600 bg-amber-50 border-amber-100",
  },
  {
    label: "Stres",
    value: "STRES",
    icon: (
      <svg
        className="h-4 w-4"
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
    ),
    color: "text-rose-600 bg-rose-50 border-rose-100",
  },
];

export default function WellnessJournalPage() {
  const { token } = useAuth();

  const [journals, setJournals] = useState<JournalLog[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);

  const [userMood, setUserMood] = useState("HAPPY");
  const [foodEaten, setFoodEaten] = useState("");
  const [userStory, setUserStory] = useState("");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    async function fetchJournals() {
      try {
        const activeToken = token || localStorage.getItem("token");
        const res = await fetch("/api/journal", {
          headers: { Authorization: `Bearer ${activeToken}` },
        });
        if (res.ok) {
          const data = await res.json();
          setJournals(data);
        }
      } catch (err) {
        console.error("Gagal mengambil data jurnal:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchJournals();
  }, [token]);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!foodEaten || !userStory) return;

    setSubmitting(true);
    setMessage({ type: "", text: "" });
    const activeToken = token || localStorage.getItem("token");

    try {
      const res = await fetch("/api/journal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${activeToken}`,
        },
        body: JSON.stringify({ userMood, foodEaten, userStory }),
      });

      const data = await res.json();

      if (res.ok) {
        setJournals([data, ...journals]);
        setFoodEaten("");
        setUserStory("");
        setUserMood("HAPPY");
        setIsModalOpen(false);
      } else {
        setMessage({
          type: "error",
          text: data.error || "Gagal menyimpan jurnal.",
        });
      }
    } catch {
      setMessage({ type: "error", text: "Terjadi gangguan koneksi server." });
    } finally {
      setSubmitting(false);
    }
  };

  // Menentukan warna skema radial progress ring berdasarkan skor gizi
  const getScoreMeta = (score: number) => {
    if (score >= 80)
      return {
        stroke: "stroke-emerald-500",
        text: "text-emerald-700",
        bg: "bg-emerald-50 text-emerald-700 border-emerald-100",
        status: "Aman",
      };
    if (score >= 60)
      return {
        stroke: "stroke-amber-500",
        text: "text-amber-700",
        bg: "bg-amber-50 text-amber-700 border-amber-100",
        status: "Waspada",
      };
    return {
      stroke: "stroke-rose-500",
      text: "text-rose-700",
      bg: "bg-rose-50 text-rose-700 border-rose-100",
      status: "Bahaya",
    };
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-3">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-zinc-300 border-t-[#1A1A1A]" />
        <p className="text-xs font-semibold text-zinc-400">
          Sinkronisasi data jurnal...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16">
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-200 pb-5">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-[#1A1A1A]">
            Wellness Journal
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Analisis rekam medis otomatis keselarasan gizi Anda harian.
          </p>
        </div>
        <button
          onClick={() => {
            setMessage({ type: "", text: "" });
            setIsModalOpen(true);
          }}
          className="inline-flex items-center justify-center gap-2 px-4.5 py-2.5 bg-[#1A1A1A] text-white text-xs font-bold rounded-xl hover:bg-zinc-800 transition-all shadow-sm shrink-0"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4v16m8-8H4"
            />
          </svg>
          Entri Baru
        </button>
      </div>

      {/* Sub-label Judul dengan Sistem Penjelasan / Tooltip */}
      <div className="flex items-center justify-between relative">
        <div className="flex items-center gap-1.5 select-none">
          <span className="text-[10px] font-black tracking-wider uppercase text-zinc-400">
            Riwayat Catatan Gizi
          </span>
          <button
            type="button"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            className="text-zinc-400 hover:text-zinc-600 transition"
          >
            <svg
              className="h-3.5 w-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </button>

          <AnimatePresence>
            {showTooltip && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 5 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 5 }}
                className="absolute left-0 top-6 z-40 p-3 bg-zinc-900 border border-zinc-800 text-white rounded-xl text-[10px] leading-relaxed max-w-xs shadow-xl font-medium"
              >
                <p className="font-bold border-b border-zinc-800 pb-1 mb-1 text-[#EAB308]">
                  Apa itu Indeks Kepatuhan?
                </p>
                Persentase akurasi kecocokan asupan makanan Anda terhadap
                riwayat penyakit lambung/alergi bawaan yang terdaftar di sistem
                profil Anda.
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <span className="text-[10px] text-zinc-400 font-bold">
          {journals.length} Entri Terdata
        </span>
      </div>

      {/* Grid Horizontal Layout berbentuk Card Box */}
      {journals.length === 0 ? (
        <div className="bg-white border border-zinc-200/60 rounded-2xl p-12 text-center space-y-2">
          <p className="text-xs text-zinc-400 font-semibold">
            Belum ada riwayat entri rekam gizi tersemat.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 items-start">
          {journals.map((j) => {
            const isExpanded = expandedId === j.id;
            const currentMoodObj =
              MOODS.find((m) => m.value === j.userMood) || MOODS[1];
            const meta = getScoreMeta(j.healthScore);

            // Variabel hitung rumus matematika lingkaran radial progress SVG
            const radius = 18;
            const strokeDasharray = 2 * Math.PI * radius;
            const strokeDashoffset =
              strokeDasharray - (j.healthScore / 100) * strokeDasharray;

            return (
              <motion.div
                key={j.id}
                layout
                className="bg-white border border-zinc-200/80 rounded-2xl shadow-sm overflow-hidden flex flex-col transition-all duration-200 hover:border-zinc-300"
              >
                {/* Konten Kartu Utama */}
                <div className="p-4 flex items-center justify-between gap-4 flex-1">
                  <div className="space-y-3 overflow-hidden">
                    <div
                      className={`flex h-7 w-7 items-center justify-center rounded-lg border w-fit ${currentMoodObj.color}`}
                    >
                      {currentMoodObj.icon}
                    </div>

                    <div className="space-y-0.5">
                      <p className="text-[10px] text-zinc-400 font-bold tracking-wide uppercase">
                        {new Date(j.createdAt).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                      <h3 className="text-sm font-black text-zinc-800 line-clamp-2 leading-snug">
                        {j.foodEaten}
                      </h3>
                    </div>
                  </div>

                  {/* Bulatan Progress SVG & Info Status Indeks Kepatuhan */}
                  <div className="flex flex-col items-center gap-1.5 shrink-0 pl-2 border-l border-zinc-100">
                    <div className="relative h-12 w-12 flex items-center justify-center">
                      <svg className="absolute -rotate-90 transform h-12 w-12">
                        {/* Lingkaran Background Abu-abu */}
                        <circle
                          cx="24"
                          cy="24"
                          r={radius}
                          fill="transparent"
                          stroke="#E4E4E7"
                          strokeWidth="3"
                        />
                        {/* Lingkaran Progress Berwarna Aktif */}
                        <motion.circle
                          cx="24"
                          cy="24"
                          r={radius}
                          fill="transparent"
                          className={`${meta.stroke}`}
                          strokeWidth="3"
                          strokeLinecap="round"
                          initial={{ strokeDashoffset: strokeDasharray }}
                          animate={{ strokeDashoffset }}
                          transition={{ duration: 0.5, ease: "easeOut" }}
                          strokeDasharray={strokeDasharray}
                        />
                      </svg>
                      <span
                        className={`text-[11px] font-black tracking-tighter ${meta.text}`}
                      >
                        {j.healthScore}%
                      </span>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded text-[9px] font-bold border tracking-wide uppercase scale-90 ${meta.bg}`}
                    >
                      {meta.status}
                    </span>
                  </div>
                </div>

                {/* Tombol Drawer Aksi */}
                <button
                  onClick={() => toggleExpand(j.id)}
                  className="w-full px-4 py-2.5 bg-zinc-50 border-t border-zinc-100 flex items-center justify-between text-[10px] font-bold text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100/50 transition-colors select-none"
                >
                  <span>
                    {isExpanded ? "Sembunyikan Detail" : "Lihat Analisis Medis"}
                  </span>
                  <motion.svg
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
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

                {/* Area Dropdown Konten Analisis Teks di dalam Kartu */}
                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2, ease: "easeInOut" }}
                      className="border-t border-zinc-100 bg-zinc-50/50"
                    >
                      <div className="p-4 space-y-3.5 text-xs">
                        <div className="space-y-1">
                          <span className="text-[9px] font-black tracking-wider uppercase text-zinc-400 block">
                            Catatan Keluhan
                          </span>
                          <p className="text-zinc-600 bg-white border border-zinc-200/40 rounded-xl p-2.5 italic leading-relaxed">
                            &ldquo;{j.userStory}&rdquo;
                          </p>
                        </div>

                        <div className="space-y-1">
                          <span className="text-[9px] font-black tracking-wider uppercase text-[#bc9003] block">
                            Rekomendasi AI
                          </span>
                          <div className="bg-[#EAB308]/5 border border-[#EAB308]/20 rounded-xl p-3 text-zinc-700 leading-relaxed whitespace-pre-line">
                            {j.aiInsight}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Modal Dialog Input Form Overlay */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                if (!submitting) setIsModalOpen(false);
              }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 15 }}
              className="relative w-full max-w-lg bg-white rounded-2xl border border-zinc-200 p-6 shadow-2xl space-y-5 z-10"
            >
              <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                <h3 className="text-base font-black text-[#1A1A1A]">
                  Entri Baru Wellness Journal
                </h3>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={submitting}
                  className="p-1 rounded-lg hover:bg-zinc-100 text-zinc-400 hover:text-zinc-600 transition"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold tracking-wide uppercase text-zinc-400">
                    Kondisi Emosional
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {MOODS.map((m) => (
                      <button
                        key={m.value}
                        type="button"
                        onClick={() => setUserMood(m.value)}
                        className={`py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all border ${
                          userMood === m.value
                            ? "bg-[#1A1A1A] border-[#1A1A1A] text-white shadow-sm"
                            : "bg-zinc-50 border-zinc-200 text-zinc-600 hover:bg-zinc-100"
                        }`}
                      >
                        {m.icon}
                        <span>{m.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold tracking-wide uppercase text-zinc-400">
                    Daftar Makanan Hari Ini
                  </label>
                  <input
                    type="text"
                    value={foodEaten}
                    onChange={(e) => setFoodEaten(e.target.value)}
                    placeholder="Contoh: Nasi sambal krecek pedas, es kopi susu bening"
                    className="w-full px-4 py-2.5 text-xs bg-zinc-50/60 border border-zinc-200 text-[#1A1A1A] rounded-xl outline-none transition focus:bg-white focus:border-[#EAB308] focus:ring-2 focus:ring-[#EAB308]/10"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold tracking-wide uppercase text-zinc-400">
                    Keluhan Fisik & Cerita
                  </label>
                  <textarea
                    value={userStory}
                    onChange={(e) => setUserStory(e.target.value)}
                    placeholder="Tulis keluhan atau kondisi kebugaran tubuhmu secara jujur..."
                    rows={4}
                    className="w-full px-4 py-2.5 text-xs bg-zinc-50/60 border border-zinc-200 text-[#1A1A1A] rounded-xl outline-none transition resize-none focus:bg-white focus:border-[#EAB308] focus:ring-2 focus:ring-[#EAB308]/10"
                    required
                  />
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-zinc-100">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    disabled={submitting}
                    className="px-4 py-2 text-xs font-bold text-zinc-500 hover:bg-zinc-100 rounded-lg transition"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2 bg-[#1A1A1A] text-white text-xs font-bold rounded-lg hover:bg-zinc-800 transition shadow-sm disabled:opacity-50"
                  >
                    {submitting ? "Evaluasi Medis..." : "Simpan"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
