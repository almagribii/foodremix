"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/lib/hooks/useAuth";
import { useToast } from "@/components/ui/Toast";
import PageLoader from "@/components/ui/PageLoader";
import IngredientInputForm, {
  RemixMode,
} from "./components/IngredientInputForm";
import RecipeResultCard, { RecipeData } from "./components/RecipeResultCard";
import {
  CheckCircle2,
  Leaf,
  Sparkles,
  ArrowRight,
  ChefHat,
  Search,
  Wallet,
  Clock,
  X,
} from "lucide-react";
import Lottie from "lottie-react";
import bot from "./components/food.json";

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
  const {
    error: toastError,
    warning: toastWarning,
    success: toastSuccess,
  } = useToast();

  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [recipe, setRecipe] = useState<RecipeData | null>(null);
  const [activeMode, setActiveMode] = useState<RemixMode>("remix");
  const [histories, setHistories] = useState<HistoryData[]>([]);
  const [selectedHistoryId, setSelectedHistoryId] = useState<string | null>(
    null,
  );

  const [inputImagePreview, setInputImagePreview] = useState<string | null>(
    null,
  );
  const [inputImageBase64, setInputImageBase64] = useState<string | null>(null);

  const [isDragging, setIsDragging] = useState(false);

  const getToken = useCallback(
    () =>
      token ||
      (typeof window !== "undefined" ? localStorage.getItem("token") : null),
    [token],
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
      if (!t) {
        setHistoryLoading(false);
        return;
      }
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
    return () => {
      mounted = false;
    };
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
            mode === "detect"
              ? "Makanan Tidak Terdeteksi"
              : "Input Tidak Valid",
            data.reason ||
              data.solution ||
              "Coba dengan foto yang lebih jelas.",
          );
        } else {
          const recipeWithMeta: RecipeData = {
            ...data.recipe,
            detectedFrom:
              mode === "detect" ? data.recipe?.recipeName : undefined,
          };
          setRecipe(recipeWithMeta);
          toastSuccess(
            mode === "detect"
              ? "Makanan terdeteksi!"
              : "Resep berhasil diracik!",
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

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!loading && !recipe) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (loading || recipe) return;

    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setInputImagePreview(result);
        setInputImageBase64(result.split(",")[1]);
        toastSuccess("Gambar berhasil dimuat", "Foto siap diracik bersama AI.");
      };
      reader.readAsDataURL(file);
    } else if (file) {
      toastError(
        "Format salah",
        "Hanya mendukung file gambar (PNG, JPG, WebP).",
      );
    }
  };

  return (
    <div className="max-w-7xl mx-auto pb-20 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-zinc-200">
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">
            Remix Area
          </p>
          <h1 className="text-3xl font-black tracking-tight text-[#1A1A1A]">
            Dapur Kreasi AI
          </h1>
          <p className="text-xs text-zinc-500 mt-1 font-medium">
            Racik resep dari sisa bahan · Deteksi makanan &amp; dapatkan
            tutorialnya
          </p>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-zinc-400">
          <ChefHat size={12} />
          <span>{histories.length} Menu Tersimpan</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-6">
          <IngredientInputForm
            onGenerate={handleGenerate}
            loading={loading}
            imagePreview={inputImagePreview}
            onImageChange={(preview, base64) => {
              setInputImagePreview(preview);
              setInputImageBase64(base64);
            }}
          />
        </div>

        <div className="lg:col-span-7 xl:col-span-8">
          <div className="w-full min-h-130 bg-white border border-zinc-200 rounded-3xl overflow-hidden relative shadow-sm flex flex-col">
            <AnimatePresence mode="wait">
              {loading && !inputImagePreview && (
                <motion.div
                  key="loading-text"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-1 flex items-center justify-center p-8"
                >
                  <PageLoader
                    variant="inline"
                    message={
                      activeMode === "detect"
                        ? "Mendeteksi makanan..."
                        : "Meracik menu..."
                    }
                  />
                </motion.div>
              )}

              {!loading && recipe && (
                <motion.div
                  key="recipe-result"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="relative flex-1 overflow-y-auto p-6 sm:p-8"
                >
                  <div className="absolute inset-0 m-auto w-40 h-40 lg:w-70 lg:h-70 flex items-center justify-center pointer-events-none z-0 opacity-15 select-none">
                    <Lottie
                      animationData={bot}
                      loop={true}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="relative z-10">
                    <RecipeResultCard recipe={recipe} mode={activeMode} />
                  </div>
                </motion.div>
              )}

              {(!recipe || loading) && (inputImagePreview || !loading) && (
                <motion.div
                  key="zero-state"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`flex-1 flex flex-col items-center justify-center text-center p-8 relative transition-colors duration-200 ${
                    isDragging ? "bg-zinc-50/80" : ""
                  }`}
                >
                  <div
                    className={`absolute inset-4 border-2 border-dashed rounded-2xl pointer-events-none z-10 transition-colors ${
                      isDragging ? "border-[#1A1A1A]" : "border-zinc-200"
                    }`}
                  />

                  {inputImagePreview ? (
                    <div className="w-full max-w-xl relative rounded-2xl overflow-hidden border border-zinc-200 shadow-xs z-20 p-2 bg-zinc-50/50 flex items-center justify-center">
                      <Image
                        src={inputImagePreview}
                        alt="Preview Foto Kuliner"
                        width={640}
                        height={480}
                        className="w-full h-auto max-h-[450px] object-contain rounded-xl"
                        unoptimized
                      />

                      {loading && (
                        <>
                          <motion.div
                            className="absolute inset-x-2 h-0.5 bg-linear-to-r from-transparent via-[#EAB308] to-transparent shadow-[0_0_12px_#EAB308] z-30"
                            animate={{ top: ["4%", "94%", "4%"] }}
                            transition={{
                              duration: 2,
                              ease: "easeInOut",
                              repeat: Infinity,
                            }}
                          />
                          <div className="absolute inset-2 bg-black/40 backdrop-blur-[1px] rounded-xl flex flex-col items-center justify-center gap-2 z-20">
                            <div className="p-2.5 bg-[#EAB308]/10 border border-[#EAB308]/30 rounded-xl text-[#EAB308]">
                              {activeMode === "detect" ? (
                                <Search size={18} />
                              ) : (
                                <Sparkles size={18} />
                              )}
                            </div>
                            <p className="text-white text-[10px] font-black uppercase tracking-widest">
                              {activeMode === "detect"
                                ? "Mendeteksi Makanan..."
                                : "Gemini AI Meracik..."}
                            </p>
                          </div>
                        </>
                      )}

                      {!loading && (
                        <>
                          <button
                            type="button"
                            onClick={() => {
                              setInputImagePreview(null);
                              setInputImageBase64(null);
                            }}
                            className="absolute top-5 right-5 p-2 bg-white/95 backdrop-blur-xs hover:bg-white border border-zinc-200 text-zinc-500 hover:text-red-500 rounded-xl transition-all shadow-md cursor-pointer z-30"
                          >
                            <X size={14} strokeWidth={2.5} />
                          </button>
                          <div className="absolute bottom-5 left-5 right-5 bg-white/90 backdrop-blur-xs border border-zinc-200/60 px-3 py-2 rounded-xl text-left flex items-center justify-between z-30">
                            <span className="text-[10px] font-black uppercase tracking-wider text-zinc-700">
                              Gambar Siap Dirajang AI
                            </span>
                            <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">
                              Asli Bersih
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-4">
                      <div
                        className={`w-40 h-40 lg:w-56 lg:h-56 flex items-center justify-center select-none mix-blend-multiply transition-all duration-200 ${
                          isDragging ? "scale-105 opacity-50" : "opacity-25"
                        }`}
                      >
                        <Lottie
                          animationData={bot}
                          loop={true}
                          className="w-full h-full"
                        />
                      </div>
                      <div className="space-y-1 max-w-xs relative z-10">
                        <h3
                          className={`text-xs font-black uppercase tracking-wider transition-colors ${
                            isDragging ? "text-emerald-600" : "text-[#1A1A1A]"
                          }`}
                        >
                          {isDragging
                            ? "Lepaskan Gambar Sekarang!"
                            : "Tarik & Jatuhkan Foto Kulinermu"}
                        </h3>
                        <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
                          Semua Format Gambar Didukung (JPEG, PNG, WebP, dll)
                        </p>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

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
            <p className="text-xs text-zinc-400 font-medium">
              Belum ada riwayat tersimpan.
            </p>
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
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  className={`text-left w-full rounded-2xl p-4 border transition-all duration-200 flex flex-col gap-3 ${
                    isSelected
                      ? "bg-[#1A1A1A] border-[#1A1A1A] shadow-lg"
                      : "bg-white border-zinc-200 hover:border-zinc-400 hover:shadow-sm"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div
                      className={`text-[9px] font-black px-2 py-0.5 rounded-md border ${
                        isSelected
                          ? "bg-[#EAB308] border-[#EAB308] text-[#1A1A1A]"
                          : "bg-emerald-50 text-emerald-700 border-emerald-100"
                      }`}
                    >
                      {isSelected ? "Aktif" : "Selesai"}
                    </div>
                    <ArrowRight
                      size={11}
                      className={`shrink-0 mt-0.5 transition-transform ${isSelected ? "text-zinc-500 translate-x-0" : "text-zinc-300"}`}
                    />
                  </div>

                  <div className="space-y-0.5 flex-1">
                    <h4
                      className={`text-xs font-black line-clamp-2 leading-snug ${isSelected ? "text-white" : "text-[#1A1A1A]"}`}
                    >
                      {h.recipeName}
                    </h4>
                    <p
                      className={`text-[10px] font-medium line-clamp-1 ${isSelected ? "text-zinc-500" : "text-zinc-400"}`}
                    >
                      {h.ingredientsUsed.slice(0, 3).join(", ")}
                      {h.ingredientsUsed.length > 3 && " …"}
                    </p>
                  </div>

                  <div
                    className={`flex items-center justify-between pt-2.5 border-t text-[10px] font-black ${isSelected ? "border-zinc-700" : "border-zinc-100"}`}
                  >
                    <div
                      className={`flex items-center gap-1 ${isSelected ? "text-emerald-400" : "text-emerald-600"}`}
                    >
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

        {histories.length > 0 && (
          <div className="flex flex-wrap gap-3 pt-2">
            <div className="inline-flex items-center gap-2 bg-white border border-zinc-200 rounded-2xl px-4 py-2.5 shadow-sm">
              <Wallet size={12} className="text-zinc-400" />
              <span className="text-[10px] font-black text-zinc-500 uppercase tracking-wider">
                Total Hemat
              </span>
              <span className="text-xs font-black text-[#1A1A1A]">
                Rp{" "}
                {histories
                  .reduce((acc, h) => acc + (h.moneySaved || 0), 0)
                  .toLocaleString("id-ID")}
              </span>
            </div>
            <div className="inline-flex items-center gap-2 bg-white border border-zinc-200 rounded-2xl px-4 py-2.5 shadow-sm">
              <Leaf size={12} className="text-emerald-500" />
              <span className="text-[10px] font-black text-zinc-500 uppercase tracking-wider">
                Total CO₂
              </span>
              <span className="text-xs font-black text-emerald-600">
                {histories
                  .reduce((acc, h) => acc + (h.carbonPrevented || 0), 0)
                  .toFixed(1)}{" "}
                Kg
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
