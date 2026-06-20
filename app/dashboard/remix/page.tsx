"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/lib/hooks/useAuth";
import IngredientInputForm from "./components/IngredientInputForm";
import RecipeResultCard, { RecipeData } from "./components/RecipeResultCard";
import {
  CheckCircle2,
  Leaf,
  Sparkles,
  AlertTriangle,
  History,
  ArrowRight,
} from "lucide-react";

interface HistoryData {
  id: string;
  recipeName: string;
  ingredientsUsed: string[];
  instructions: string[];
  moneySaved: number;
  carbonPrevented: number;
}

export default function RemixAreaPage() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [recipe, setRecipe] = useState<RecipeData | null>(null);
  const [histories, setHistories] = useState<HistoryData[]>([]);
  const [selectedHistoryId, setSelectedHistoryId] = useState<string | null>(
    null,
  );
  const [errorMessage, setErrorMessage] = useState("");

  const [currentPhotoReview, setCurrentPhotoReview] = useState<string | null>(
    null,
  );
  const [imageErrorDetails, setImageErrorDetails] = useState<{
    reason: string;
    solutions: string[];
  } | null>(null);

  // 1. Definisikan loadHistories agar bisa dipanggil kembali dari fungsi lain (seperti handleGenerateRecipe)
  const loadHistories = useCallback(async () => {
    const activeToken =
      token ||
      (typeof window !== "undefined" ? localStorage.getItem("token") : null);
    if (!activeToken) return;
    try {
      const res = await fetch("/api/remix/history", {
        headers: { Authorization: `Bearer ${activeToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        setHistories(data.histories || []);
      }
    } catch (err) {
      console.error("Gagal sinkronisasi histori kulkas:", err);
    }
  }, [token]);

  // 2. Di dalam useEffect, lakukan pemanggilan asinkron murni lewat IIFE (Immediately Invoked Function Expression)
  useEffect(() => {
    let isMounted = true;

    const fetchOnLoad = async () => {
      const activeToken =
        token ||
        (typeof window !== "undefined" ? localStorage.getItem("token") : null);

      // Pastikan token ada sebelum melakukan fetch asinkron
      if (!activeToken) return;

      try {
        const res = await fetch("/api/remix/history", {
          headers: { Authorization: `Bearer ${activeToken}` },
        });
        if (res.ok && isMounted) {
          const data = await res.json();
          setHistories(data.histories || []);
        }
      } catch (err) {
        console.error("Gagal sinkronisasi histori kulkas:", err);
      }
    };

    fetchOnLoad();

    return () => {
      isMounted = false; // Mencegah memory leak / race condition
    };
  }, [token]);
  
  const handleGenerateRecipe = async (
    ingredients: string[],
    imageBase64: string | null,
    targetBudget: number,
  ) => {
    setLoading(true);
    setErrorMessage("");
    setImageErrorDetails(null);
    setRecipe(null);
    setSelectedHistoryId(null); // Reset riwayat terpilih saat meracik baru

    if (imageBase64) {
      setCurrentPhotoReview(`data:image/jpeg;base64,${imageBase64}`);
    } else {
      setCurrentPhotoReview(null);
    }

    const activeToken =
      token ||
      (typeof window !== "undefined" ? localStorage.getItem("token") : null);
    try {
      const res = await fetch("/api/remix/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${activeToken}`,
        },
        body: JSON.stringify({ ingredients, imageBase64, targetBudget }),
      });

      const data = await res.json();

      if (res.ok) {
        if (data.status === "INVALID") {
          setErrorMessage(data.reason || "Input terdeteksi tidak valid.");
          setImageErrorDetails({
            reason: data.reason,
            solutions: [
              data.solution || "Silakan periksa kembali kecocokan input Anda.",
            ],
          });
        } else {
          setRecipe(data.recipe);
          await loadHistories();
        }
      } else {
        setErrorMessage(data.error || "Gagal meracik menu lewat AI.");
      }
    } catch (err) {
      setErrorMessage("Terjadi gangguan koneksi sirkuit ke server AI.");
    } finally {
      setLoading(false);
    }
  };

  // Fungsi saat riwayat diklik untuk menampilkan detail
  const handleSelectHistory = (historyItem: HistoryData) => {
    setSelectedHistoryId(historyItem.id);
    setImageErrorDetails(null);
    setRecipe({
      recipeName: historyItem.recipeName,
      ingredientsUsed: historyItem.ingredientsUsed,
      instructions: historyItem.instructions || [],
      moneySaved: historyItem.moneySaved || 0,
      carbonPrevented: historyItem.carbonPrevented,
    });
  };

  return (
    <div className="min-h-screen bg-[#F5F5F3] px-4 sm:px-8 py-12 selection:bg-[#EAB308] selection:text-[#1A1A1A]">
      <div className="max-w-7xl mx-auto space-y-10 pb-20">
        {/* Header Halaman - Premium & Minimalis */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-zinc-200/80 pb-8 gap-4">
          <div className="space-y-1">
            <h1 className="text-4xl font-black tracking-tight text-[#1A1A1A]">
              Remix Area
            </h1>
            <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">
              Pindai kulkas dengan live webcam • Optimasi SDGs Hemat Pangan
            </p>
          </div>
          {errorMessage && (
            <span className="text-xs bg-rose-50 border border-rose-100 text-rose-600 px-3 py-1.5 rounded-xl font-bold animate-pulse">
              ⚠️ {errorMessage}
            </span>
          )}
        </div>

        {/* TROUBLESHOOTING ALERT CARD */}
        {imageErrorDetails && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 bg-rose-50 border border-rose-200 rounded-[1.5rem] space-y-3 shadow-xs"
          >
            <div className="flex items-center gap-2 text-rose-800">
              <AlertTriangle size={16} className="text-rose-600" />
              <h4 className="text-xs font-black uppercase tracking-widest">
                Sensor Menolak Input
              </h4>
            </div>
            <p className="text-xs text-zinc-700 font-semibold leading-relaxed">
              {imageErrorDetails.reason}
            </p>
            <div className="space-y-1.5 border-t border-rose-200/50 pt-3">
              <span className="text-[10px] font-bold text-rose-900 tracking-wide uppercase block">
                Solusi Perbaikan:
              </span>
              <ul className="list-disc pl-4 text-xs text-zinc-600 space-y-1 font-medium">
                {imageErrorDetails.solutions.map((sol, idx) => (
                  <li key={idx} className="pl-0.5">
                    {sol}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}

        {/* GRID UTAMA - ASIMETRIS KELAS ATAS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* KIRI (4 Kolom): Panel Kontrol Utama */}
          <div className="lg:col-span-5 xl:col-span-4 sticky top-6">
            <IngredientInputForm
              onGenerateRecipe={handleGenerateRecipe}
              loading={loading}
            />
          </div>

          {/* KANAN (8 Kolom): Output Visual & Hasil Resep */}
          <div className="lg:col-span-7 xl:col-span-8">
            <div className="w-full min-h-[500px] lg:min-h-[540px] bg-white border border-zinc-200 rounded-[2.5rem] p-8 flex flex-col justify-between overflow-hidden relative shadow-[0_24px_70px_rgba(0,0,0,0.02)] transition-all duration-300">
              <AnimatePresence mode="wait">
                {(() => {
                  // 1. SCANNING STATE VIDEO/FOTO VIA WEBCAM
                  if (loading && currentPhotoReview) {
                    return (
                      <motion.div
                        key="loading-scanner"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 flex flex-col bg-[#1A1A1A]"
                      >
                        <Image
                          src={currentPhotoReview}
                          alt="Foto Kulkas Diulas"
                          fill
                          className="object-cover opacity-40 filter brightness-75 scale-105 transition-transform duration-700"
                          unoptimized
                        />

                        {/* LASER LINE EFFECT */}
                        <motion.div
                          className="absolute inset-x-0 h-[3px] bg-gradient-to-r from-transparent via-[#EAB308] to-transparent shadow-[0_0_15px_#EAB308] z-10"
                          animate={{ top: ["2%", "96%", "2%"] }}
                          transition={{
                            duration: 1.8,
                            ease: "easeInOut",
                            repeat: Infinity,
                          }}
                        />

                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center space-y-3 bg-black/30 backdrop-blur-[3px] z-20 p-6">
                          <div className="p-3 bg-[#EAB308]/10 backdrop-blur-md rounded-2xl border border-[#EAB308]/20 text-[#EAB308] animate-pulse">
                            <Sparkles size={24} />
                          </div>
                          <p className="text-white text-xs font-black uppercase tracking-widest">
                            Gemini AI Memindai Bahan...
                          </p>
                          <p className="text-zinc-400 text-[10px] tracking-wide font-medium max-w-[260px] leading-relaxed">
                            Mengekstrak nilai nutrisi & memvalidasi keaslian
                            pangan sisa secara berkala
                          </p>
                        </div>
                      </motion.div>
                    );
                  }

                  // 2. LOADING TEXT TANPA WEBCAM
                  if (loading) {
                    return (
                      <motion.div
                        key="loading-text"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex-1 flex flex-col items-center justify-center text-center space-y-4"
                      >
                        <div className="h-7 w-7 animate-spin rounded-full border-2 border-zinc-200 border-t-[#1A1A1A]" />
                        <p className="text-zinc-400 text-[10px] font-black uppercase tracking-widest">
                          Meracik Menu Gizi Terbaik...
                        </p>
                      </motion.div>
                    );
                  }

                  // 3. RENDER RESEP AKTIF / RESEP DARI DETAIl RIWAYAT
                  if (recipe) {
                    return (
                      <motion.div
                        key="recipe-result"
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="w-full h-full overflow-y-auto"
                      >
                        {selectedHistoryId && (
                          <div className="mb-4 inline-flex items-center gap-2 bg-[#1A1A1A] text-white text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg">
                            <History size={10} /> Menampilkan Arsip Riwayat
                          </div>
                        )}
                        <RecipeResultCard
                          recipe={recipe}
                          onOpenShareModal={() => {}}
                        />
                      </motion.div>
                    );
                  }

                  // 4. ZERO STATE (HALAMAN KOSONG AWAL)
                  return (
                    <motion.div
                      key="zero-state"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex-1 flex flex-col items-center justify-center text-center space-y-4"
                    >
                      <div className="w-16 h-16 bg-[#F5F5F3] border border-zinc-200 rounded-2xl flex items-center justify-center text-2xl shadow-xs">
                        🍳
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-xs font-black text-[#1A1A1A] uppercase tracking-widest">
                          Hasil Kreasiku
                        </h4>
                        <p className="text-zinc-400 text-[11px] font-medium max-w-[280px] mx-auto leading-relaxed">
                          Pilih item di riwayat bawah untuk memuat arsip lama,
                          atau racik menu baru melalui panel kiri.
                        </p>
                      </div>
                    </motion.div>
                  );
                })()}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* SECTION RIWAYAT KREASI YANG INTERAKTIF & BISA DIKLIK */}
        <div className="space-y-5 pt-10 border-t border-zinc-200/80">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-zinc-500">
              <CheckCircle2 size={14} className="text-zinc-400" />
              <h3 className="text-xs font-black uppercase tracking-widest">
                Riwayat Kreasi Kulkas
              </h3>
            </div>
            <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
              {histories.length} Menu Tersimpan
            </span>
          </div>

          {histories.length === 0 ? (
            <div className="text-center py-10 bg-white border border-dashed border-zinc-200 rounded-[2rem] text-xs text-zinc-400 font-medium">
              Belum ada riwayat menu yang tersimpan.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {histories.map((h) => {
                const isSelected = selectedHistoryId === h.id;
                return (
                  <button
                    key={h.id}
                    type="button"
                    onClick={() => handleSelectHistory(h)}
                    className={`text-left w-full bg-white border rounded-[1.75rem] p-5 shadow-[0_4px_25px_rgba(0,0,0,0.01)] transition-all duration-300 group flex flex-col justify-between ${
                      isSelected
                        ? "border-[#EAB308] ring-2 ring-[#EAB308]/20 bg-amber-50/10"
                        : "border-zinc-200 hover:border-zinc-400 hover:shadow-md"
                    }`}
                  >
                    <div className="w-full">
                      <div className="flex items-center justify-between mb-3">
                        <span
                          className={`text-[9px] font-black px-2.5 py-0.5 rounded-md border flex items-center gap-1.5 transition ${
                            isSelected
                              ? "bg-[#EAB308] border-[#EAB308] text-[#1A1A1A]"
                              : "bg-emerald-50 text-emerald-800 border-emerald-100 group-hover:bg-emerald-100/50"
                          }`}
                        >
                          <span
                            className={`w-1 h-1 rounded-full ${isSelected ? "bg-[#1A1A1A]" : "bg-emerald-500"}`}
                          />
                          {isSelected ? "Aktif" : "Success"}
                        </span>

                        <ArrowRight
                          size={12}
                          className={`text-zinc-400 group-hover:text-[#1A1A1A] transition-transform duration-200 ${
                            isSelected
                              ? "translate-x-0 text-[#1A1A1A]"
                              : "group-hover:translate-x-1"
                          }`}
                        />
                      </div>

                      <h4 className="text-xs font-black text-[#1A1A1A] line-clamp-1 mb-1 tracking-tight">
                        {h.recipeName}
                      </h4>
                      <p className="text-[10px] text-zinc-400 font-bold mb-4 line-clamp-1 uppercase tracking-tight">
                        {h.ingredientsUsed.join(", ")}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 text-emerald-600 border-t border-zinc-100 pt-3 mt-2 w-full">
                      <Leaf size={10} fill="currentColor" />
                      <span className="text-[10px] font-black">
                        +{h.carbonPrevented}Kg CO₂
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
