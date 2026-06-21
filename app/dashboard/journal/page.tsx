"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/components/ui/Toast";

import JournalCard from "@/components/rekam-gizi/JournalCard";
import DailyNutrientSummary from "@/components/rekam-gizi/DailyNutrientSummary";
import NutrientBarChart from "@/components/rekam-gizi/NutrientBarChart";
import DailyMacroDonut from "@/components/rekam-gizi/DailyMacroDonut";

interface JournalLog {
  id: string;
  userMood: string;
  foodEaten: string;
  userStory: string;
  aiInsight: string;
  healthScore: number;
  createdAt: string;
}

interface AnalyticsData {
  daily: { calories: number; sugar: number; protein: number };
  minerals: { label: string; value: number }[];
  macro: { karbo: number; lemak: number; protein: number };
}

export default function RekamGiziPage() {
  const { token } = useAuth();
  const { success: toastSuccess, error: toastError } = useToast();
  const [journals, setJournals] = useState<JournalLog[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  const [selectedDate, setSelectedDate] = useState(() => {
    const tzoffset = new Date().getTimezoneOffset() * 60000;
    return new Date(Date.now() - tzoffset).toISOString().slice(0, 10);
  });

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [userMood, setUserMood] = useState("HAPPY");
  const [foodEaten, setFoodEaten] = useState("");
  const [userStory, setUserStory] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const loadData = useCallback(
    async (authToken: string | null, targetDate: string) => {
      try {
        const activeToken = authToken || localStorage.getItem("token");
        if (!activeToken) return;

        const res = await fetch(`/api/journal?date=${targetDate}`, {
          headers: { Authorization: `Bearer ${activeToken}` },
        });
        if (res.ok) {
          const data = await res.json();
          setJournals(data.journals || []);
          setAnalytics(data.analytics);
        }
      } catch (err) {
        console.error("Gagal memuat data rekam gizi:", err);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
  
      if (isMounted) {
        await loadData(token, selectedDate);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [token, selectedDate, loadData]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!foodEaten || !userStory) return;
    setSubmitting(true);
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

      if (res.ok) {
        const newRecord = await res.json();
        setJournals((prev) => [newRecord, ...prev]);
        setFoodEaten("");
        setUserStory("");
        setUserMood("HAPPY");
        setIsFormOpen(false);
        toastSuccess("Jurnal tersimpan!", "Entri gizi baru berhasil direkam.");
        loadData(activeToken, selectedDate);
      } else {
        const data = await res.json();
        toastError("Gagal menyimpan", data.error || "Terjadi kesalahan saat menyimpan.");
      }
    } catch (err) {
      console.error(err);
      toastError("Gangguan koneksi", "Tidak dapat terhubung ke server.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-3">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-zinc-300 border-t-[#1A1A1A]" />
        <p className="text-xs font-semibold text-zinc-400">
          Sinkronisasi analitik rekam gizi...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-200 pb-5">
        <div className="space-y-0.5">
          <h1 className="text-2xl font-black tracking-tight text-[#1A1A1A]">
            Rekam Gizi
          </h1>
          <p className="text-xs text-zinc-500">
            Analisis rekam gizi komprehensif berbasis data asupan nyata Anda.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center bg-white border border-zinc-200 px-3 py-2 rounded-xl shadow-sm gap-2">
            <svg
              className="h-4 w-4 text-zinc-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="text-xs font-bold text-zinc-700 outline-none cursor-pointer bg-transparent"
            />
          </div>

          <button
            onClick={() => setIsFormOpen(!isFormOpen)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#1A1A1A] text-white text-xs font-bold rounded-xl hover:bg-zinc-800 transition shadow-sm"
          >
            <motion.svg
              animate={{ rotate: isFormOpen ? 45 : 0 }}
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
            </motion.svg>
            {isFormOpen ? "Tutup Form" : "Rekam Baru"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7 space-y-6">
          <AnimatePresence initial={false}>
            {isFormOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1, marginBottom: 24 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="bg-white border border-zinc-200/80 rounded-3xl p-5 shadow-sm space-y-4">
                  <h3 className="text-sm font-black text-[#1A1A1A]">
                    Entri Baru Rekam Gizi
                  </h3>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                      type="text"
                      value={foodEaten}
                      onChange={(e) => setFoodEaten(e.target.value)}
                      placeholder="Contoh: Nasi padang lauk kikil"
                      className="w-full px-4 py-2.5 text-xs bg-zinc-50 border border-zinc-200 rounded-xl outline-none"
                      required
                    />
                    <textarea
                      value={userStory}
                      onChange={(e) => setUserStory(e.target.value)}
                      placeholder="Tulis keluhan..."
                      rows={3}
                      className="w-full px-4 py-2.5 text-xs bg-zinc-50 border border-zinc-200 rounded-xl outline-none resize-none"
                      required
                    />
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={submitting}
                        className="px-5 py-2.5 bg-[#1A1A1A] text-white text-xs font-bold rounded-xl"
                      >
                        {submitting ? "Proses..." : "Simpan"}
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-3">
            <span className="text-[10px] font-black tracking-wider uppercase text-zinc-400 block">
              Riwayat Catatan Gizi
            </span>
            {journals.length === 0 ? (
              <div className="bg-white border border-zinc-200/60 rounded-2xl p-8 text-center text-xs text-zinc-400">
                Belum ada entri gizi tersemat.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {journals.map((log) => (
                  <JournalCard key={log.id} log={log} />
                ))}
              </div>
            )}
          </div>
          <NutrientBarChart />
        </div>

        {/* FIKS: Duplikasi tag kolom sebelah kanan sudah dibersihkan total */}
        <div className="lg:col-span-5 space-y-6">
          <DailyNutrientSummary
            currentCalories={analytics?.daily.calories || 0}
            currentSugar={analytics?.daily.sugar || 0}
            currentProtein={analytics?.daily.protein || 0}
            dateString={selectedDate}
          />
          <DailyMacroDonut
            macro={
              analytics?.daily.calories && analytics.daily.calories > 0
                ? analytics.macro
                : { karbo: 0, lemak: 0, protein: 0 }
            }
            dateString={selectedDate}
          />
        </div>
      </div>
    </div>
  );
}
