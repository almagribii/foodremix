"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/lib/hooks/useAuth";
import { useToast } from "@/components/ui/Toast";
import PageLoader from "@/components/ui/PageLoader";
import IngredientInputForm, { RemixMode } from "./components/IngredientInputForm";
import RecipeResultCard, { RecipeData } from "./components/RecipeResultCard";
import {
  CheckCircle2, Leaf, Sparkles, History, ArrowRight,
  ChefHat, Search, Wallet, Clock,
} from "lucide-react";

interface HistoryData {
  id: string;
  recipeName: string;
  ingredientsUsed: string[];
  instructions: string[];
  moneySaved: number;
  carbonPrevented: number;
  cookedAt: string;
}

function relativeTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const h = Math.floor(diff / 3600000);
  if (h < 1) return "Baru saja";
  if (h < 24) return `${h} jam lalu`;
  return `${Math.floor(h / 24)} hari lalu`;
}

export default function RemixAreaPage() {
  const { token } = useAuth();
  const { error: toastError, warning: toastWarning, success: toastSuccess } = useToast();

  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [recipe, setRecipe] = useState<RecipeData | null>(null);
  const [activeMode, setActiveMode] = useState<RemixMode>("remix");
  const [histories, setHistories] = useState<HistoryData[]>([]);
  const [selectedHistoryId, setSelectedHistoryId] = useState<string | null>(null);
  const [currentPhotoReview, setCurrentPhotoReview] = useState<string | null>(null);

  const getToken = useCallback(() =>
    token || (typeof window !== "undefined" ? localStorage.getItem("token") : null),
    [token]
  );

  const loadHistories = useCallback(async () => {
    const t = getToken();
    if (!t) return;
    try {
      const res = await fetch("/api/remix/history", {
        headers: { Authorization: `Bearer ${t}` },
      });
      if (res.ok) {
        const data = await res.json();
        setHistories(data.histories || []);
      }
    } catch (err) {
      console.error("Gagal sinkronisasi histori:", err);
    } finally {
      setHistoryLoading(false);
    }
  }, [getToken]);

  useEffect(() => {
    let mounted = true;
    const run = async () => {
      const t = getToken();
      if (!t) { setHistoryLoading(false); return; }
      try {
        const res = await fetch("/api/remix/history", {
          headers: { Authorization: `Bearer ${t}` },
        });
        if (res.ok && mounted) {
          const data = await res.json();
          setHistories(data.histories || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (mounted) setHistoryLoading(false);
      }
    };
    run();
    return () => { mounted = false; };
  }, [getToken]);

  const handleGenerate = async (
    ingredients: string[],
    imageBase64: string | null,
    targetBudget: number,
    mode: RemixMode,
  ) => {
    setLoading(true);
    setRecipe(null);
    setSelectedHistoryId(null);
    setActiveMode(mode);
    setCurrentPhotoReview(imageBase64 ? `data:image/jpeg;base64,${imageBase64}` : null);

    try {
      const res = await fetch("/api/remix/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ ingredients, imageBase64, targetBudget, mode }),
      });

      const data = await res.json();

      if (res.ok) {
        if (data.status === "INVALID") {
          toastWarning(
            mode === "detect" ? "Makanan Tidak Terdeteksi" : "Input Tidak Valid",
            data.reason || data.solution || "Coba dengan foto yang lebih jelas.",
          );
        } else {
          const recipeWithMeta: RecipeData = {
            ...data.recipe,
            detectedFrom: mode === "detect" ? data.recipe?.recipeName : undefined,
          };
          setRecipe(recipeWithMeta);
          toastSuccess(
            mode === "detect" ? "Makanan terdeteksi!" : "Resep berhasil diracik!",
            `"${data.recipe?.recipeName}" siap.`,
          );
          await loadHistories();
        }
      } else {
        toastError("Gagal", data.error || "Terjadi kesalahan.");
      }
    } catch {
      toastError("Gangguan koneksi", "Tidak dapat terhubung ke server AI.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectHistory = (h: HistoryData) => {
    setSelectedHistoryId(h.id);
    setRecipe({
      recipeName: h.recipeName,
      ingredientsUsed: h.ingredientsUsed,
      instructions: h.instructions || [],
      moneySaved: h.moneySaved || 0,
      carbonPrevented: h.carbonPrevented,
    });
  };

  return (
    <div className="max-w-7xl mx-auto pb-20 space-y-8">

      {/* ── Header ───────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-zinc-200">
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">
            Remix Area
          </p>
          <h1 className="text-3xl font-black tracking-tight text-[#1A1A1A]">
            Dapur Kreasi AI
          </h1>
          <p className="text-xs text-zinc-500 mt-1 font-medium">
            Racik resep dari sisa bahan · Deteksi makanan &amp; dapatkan tutorialnya
          </p>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-zinc-400">
          <ChefHat size={12} />
          <span>{histories.length} Menu Tersimpan</span>
        </div>
      </div>

      {/* ── Grid Utama ────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* Kiri: Input Panel */}
        <div className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-6">
          <IngredientInputForm onGenerate={handleGenerate} loading={loading} />
        </div>

        {/* Kanan: Result Panel */}
        <div className="lg:col-span-7 xl:col-span-8">
          <div className="w-full min-h-[520px] bg-white border border-zinc-200 rounded-3xl overflow-hidden relative shadow-sm flex flex-col">

            <AnimatePresence mode="wait">

              {/* 1. Loading — dengan photo preview */}
              {loading && currentPhotoReview && (
                <motion.div
                  key="loading-photo"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-[#1A1A1A] flex flex-col"
                >
                  <Image
                    src={currentPhotoReview}
                    alt="Preview"
                    fill
                    className="object-cover opacity-30 scale-105"
                    unoptimized
                  />
                  {/* Laser scan line */}
                  <motion.div
                    className="absolute inset-x-0 h-[2px] bg-linear-to-r from-transparent via-[#EAB308] to-transparent shadow-[0_0_12px_#EAB308] z-10"
                    animate={{ top: ["4%", "94%", "4%"] }}
                    transition={{ duration: 2, ease: "easeInOut", repeat: Infinity }}
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center z-20 gap-4 p-6 text-center bg-black/30 backdrop-blur-[2px]">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="p-3 bg-[#EAB308]/10 border border-[#EAB308]/30 rounded-2xl text-[#EAB308]"
                    >
                      {activeMode === "detect" ? <Search size={22} /> : <Sparkles size={22} />}
                    </motion.div>
                    <p className="text-white text-xs font-black uppercase tracking-widest">
                      {activeMode === "detect" ? "Mendeteksi Makanan..." : "Gemini AI Meracik..."}
                    </p>
                    <p className="text-zinc-400 text-[10px] font-medium max-w-[220px] leading-relaxed">
                      {activeMode === "detect"
                        ? "Mengidentifikasi makanan & menyusun tutorial"
                        : "Menganalisis bahan & merancang menu hemat"}
                    </p>
                  </div>
                </motion.div>
              )}

              {/* 2. Loading — tanpa photo */}
              {loading && !currentPhotoReview && (
                <motion.div
                  key="loading-text"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-1 flex items-center justify-center p-8"
                >
                  <PageLoader variant="inline" message={activeMode === "detect" ? "Mendeteksi makanan..." : "Meracik menu..."} />
                </motion.div>
              )}

              {/* 3. Hasil resep */}
              {!loading && recipe && (
                <motion.div
                  key="recipe-result"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex-1 overflow-y-auto p-6 sm:p-8"
                >
                  {selectedHistoryId && (
                    <div className="mb-5 inline-flex items-center gap-2 bg-[#1A1A1A] text-white text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl">
                      <History size={10} /> Menampilkan Riwayat
                    </div>
                  )}
                  <RecipeResultCard recipe={recipe} mode={activeMode} />
                </motion.div>
              )}

              {/* 4. Zero state */}
              {!loading && !recipe && (
                <motion.div
                  key="zero-state"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-1 flex flex-col items-center justify-center text-center gap-4 p-8"
                >
                  <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
                    <div className="flex flex-col items-center gap-2 p-4 bg-zinc-50 border border-zinc-100 rounded-2xl">
                      <div className="w-8 h-8 bg-[#EAB308]/10 border border-[#EAB308]/20 rounded-xl flex items-center justify-center">
                        <ChefHat size={14} className="text-[#EAB308]" />
                      </div>
                      <p className="text-[9px] font-black text-zinc-500 uppercase tracking-wider text-center">
                        Remix Bahan
                      </p>
                    </div>
                    <div className="flex flex-col items-center gap-2 p-4 bg-zinc-50 border border-zinc-100 rounded-2xl">
                      <div className="w-8 h-8 bg-sky-50 border border-sky-100 rounded-xl flex items-center justify-center">
                        <Search size={14} className="text-sky-500" />
                      </div>
                      <p className="text-[9px] font-black text-zinc-500 uppercase tracking-wider text-center">
                        Deteksi Makanan
                      </p>
                    </div>
                  </div>
                  <div className="space-y-1 mt-2">
                    <h4 className="text-xs font-black text-[#1A1A1A] uppercase tracking-widest">
                      Siap Berkreasi
                    </h4>
                    <p className="text-[11px] text-zinc-400 font-medium max-w-[260px] leading-relaxed">
                      Pilih mode <strong>Remix Bahan</strong> untuk meracik dari sisa kulkas, atau
                      mode <strong>Deteksi Makanan</strong> untuk mendapatkan tutorial masak dari foto.
                    </p>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* ── Riwayat ───────────────────────────────────────────── */}
      <div className="space-y-4 pt-8 border-t border-zinc-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={13} className="text-zinc-400" />
            <h3 className="text-xs font-black uppercase tracking-widest text-[#1A1A1A]">
              Riwayat Kreasi
            </h3>
          </div>
          <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
            {histories.length} tersimpan
          </span>
        </div>

        {historyLoading ? (
          <PageLoader variant="inline" message="Memuat riwayat..." />
        ) : histories.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 bg-white border border-dashed border-zinc-200 rounded-3xl gap-2">
            <div className="w-10 h-10 bg-zinc-50 border border-zinc-200 rounded-2xl flex items-center justify-center text-lg">
              🍳
            </div>
            <p className="text-xs text-zinc-400 font-medium">Belum ada riwayat tersimpan.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {histories.map((h) => {
              const isSelected = selectedHistoryId === h.id;
              return (
                <motion.button
                  key={h.id}
                  type="button"
                  onClick={() => handleSelectHistory(h)}
                  whileHover={{ y: -2 }}
                  transition={{ type: "spring" as const, stiffness: 400, damping: 20 }}
                  className={`text-left w-full rounded-2xl p-4 border transition-all duration-200 flex flex-col gap-3 ${
                    isSelected
                      ? "bg-[#1A1A1A] border-[#1A1A1A] shadow-lg"
                      : "bg-white border-zinc-200 hover:border-zinc-400 hover:shadow-sm"
                  }`}
                >
                  {/* Top row */}
                  <div className="flex items-start justify-between gap-2">
                    <div className={`text-[9px] font-black px-2 py-0.5 rounded-md border ${
                      isSelected
                        ? "bg-[#EAB308] border-[#EAB308] text-[#1A1A1A]"
                        : "bg-emerald-50 text-emerald-700 border-emerald-100"
                    }`}>
                      {isSelected ? "Aktif" : "Selesai"}
                    </div>
                    <ArrowRight size={11} className={`shrink-0 mt-0.5 transition-transform ${
                      isSelected ? "text-zinc-500 translate-x-0" : "text-zinc-300 group-hover:translate-x-0.5"
                    }`} />
                  </div>

                  {/* Name + ingredients */}
                  <div className="space-y-0.5 flex-1">
                    <h4 className={`text-xs font-black line-clamp-2 leading-snug ${
                      isSelected ? "text-white" : "text-[#1A1A1A]"
                    }`}>
                      {h.recipeName}
                    </h4>
                    <p className={`text-[10px] font-medium line-clamp-1 ${
                      isSelected ? "text-zinc-500" : "text-zinc-400"
                    }`}>
                      {h.ingredientsUsed.slice(0, 3).join(", ")}
                      {h.ingredientsUsed.length > 3 && " …"}
                    </p>
                  </div>

                  {/* Bottom stats */}
                  <div className={`flex items-center justify-between pt-2.5 border-t text-[10px] font-black ${
                    isSelected ? "border-zinc-700" : "border-zinc-100"
                  }`}>
                    <div className={`flex items-center gap-1 ${isSelected ? "text-emerald-400" : "text-emerald-600"}`}>
                      <Leaf size={9} fill="currentColor" />
                      {h.carbonPrevented}kg CO₂
                    </div>
                    <div className="flex items-center gap-1 text-zinc-400">
                      <Clock size={9} />
                      {relativeTime(h.cookedAt)}
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        )}

        {/* Summary total hemat */}
        {histories.length > 0 && (
          <div className="flex flex-wrap gap-3 pt-2">
            <div className="inline-flex items-center gap-2 bg-white border border-zinc-200 rounded-2xl px-4 py-2.5 shadow-sm">
              <Wallet size={12} className="text-zinc-400" />
              <span className="text-[10px] font-black text-zinc-500 uppercase tracking-wider">Total Hemat</span>
              <span className="text-xs font-black text-[#1A1A1A]">
                Rp {histories.reduce((acc, h) => acc + (h.moneySaved || 0), 0).toLocaleString("id-ID")}
              </span>
            </div>
            <div className="inline-flex items-center gap-2 bg-white border border-zinc-200 rounded-2xl px-4 py-2.5 shadow-sm">
              <Leaf size={12} className="text-emerald-500" />
              <span className="text-[10px] font-black text-zinc-500 uppercase tracking-wider">Total CO₂</span>
              <span className="text-xs font-black text-emerald-600">
                {histories.reduce((acc, h) => acc + (h.carbonPrevented || 0), 0).toFixed(1)} Kg
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
