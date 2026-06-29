"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/lib/hooks/useAuth";
import { useToast } from "@/components/ui/Toast";
import PageLoader from "@/components/ui/PageLoader";
import IngredientInputForm, { RemixMode } from "./IngredientInputForm";
import RecipeResultCard, { RecipeData } from "./RecipeResultCard";
import RecipeOptionCard from "./RecipeOptionCard";
import { Button } from "@/components/ui/Button";
import {
  CheckCircle2,
  Leaf,
  ArrowRight,
  ChefHat,
  Wallet,
  Clock,
  X,
  MessageCircle,
  Send,
} from "lucide-react";
import Lottie from "lottie-react";
import bot from "./food.json";

interface HistoryData {
  id: string;
  recipeName: string;
  ingredientsUsed: string[];
  instructions: string[];
  moneySaved: number;
  carbonPrevented: number;
  estimatedCalories?: number;
  cookedAt: string;
}

interface OptionsResponse {
  status: "VALID" | "INVALID";
  reason?: string;
  solution?: string;
  options: RecipeData[];
  mode: RemixMode;
  error?: string;
  message?: string;
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

  const [activeMode, setActiveMode] = useState<RemixMode>("remix");
  const [histories, setHistories] = useState<HistoryData[]>([]);
  const [selectedHistoryId, setSelectedHistoryId] = useState<string | null>(
    null,
  );

  const [inputImagePreview, setInputImagePreview] = useState<string | null>(
    null,
  );

  const [isDragging, setIsDragging] = useState(false);

  const [recipeOptions, setRecipeOptions] = useState<RecipeData[] | null>(null);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(
    null,
  );
  const [selectedOption, setSelectedOption] = useState<RecipeData | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<
    { role: "user" | "assistant"; content: string }[]
  >([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);

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
    setRecipeOptions(null);
    setSelectedOptionIndex(null);
    setSelectedOption(null);
    setShowChat(false);
    setChatMessages([]);
    setIsSaved(false);

    try {
      const res = await fetch("/api/remix/generate-options", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ ingredients, imageBase64, targetBudget, mode }),
      });

      const data: OptionsResponse = await res.json();

      if (res.ok) {
        setActiveMode(mode);
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
          setRecipeOptions(data.options || []);
          toastSuccess(
            mode === "detect"
              ? "Makanan terdeteksi! Pilih 1 dari 3 opsi."
              : "AI meracik 3 opsi resep! Pilih favoritmu.",
            `Berhasil menemukan ${data.options?.length || 0} pilihan resep.`,
          );
        }
      } else {
        const errorMsg = data.error || "Terjadi kesalahan.";
        toastError(
          "Gagal",
          errorMsg.includes("penuh") || errorMsg.includes("sibuk")
            ? "Server sedang sibuk. Tunggu sebentar lalu coba lagi."
            : errorMsg,
        );
      }
    } catch {
      toastError("Gangguan koneksi", "Tidak dapat terhubung ke server AI.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (index: number) => {
    setSelectedOptionIndex(index);
    setSelectedOption(recipeOptions![index]);
    setIsSaved(false);
  };

  const handleConfirmAndSave = async () => {
    if (!selectedOption || isSaved) return;

    setLoading(true);
    try {
      const res = await fetch("/api/remix/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          recipeName: selectedOption.recipeName,
          ingredientsUsed: selectedOption.ingredientsUsed,
          instructions: selectedOption.instructions,
          moneySaved: selectedOption.moneySaved,
          carbonPrevented: selectedOption.carbonPrevented,
        }),
      });

      if (res.ok) {
        await loadHistories();
        setIsSaved(true);
        toastSuccess(
          "Resep Tersimpan!",
          `"${selectedOption.recipeName}" berhasil disimpan ke riwayat.`,
        );
      }
    } catch {
      toastError("Gagal menyimpan", "Tidak dapat menyimpan resep.");
    } finally {
      setLoading(false);
    }
  };

  const handleAskAboutRecipe = async () => {
    if (!chatInput.trim() || !selectedOption || chatLoading) return;

    const userMessage = chatInput.trim();
    setChatMessages((prev) => [
      ...prev,
      { role: "user", content: userMessage },
    ]);
    setChatInput("");
    setChatLoading(true);

    try {
      const t = getToken();
      const res = await fetch("/api/chat/remix", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${t}`,
        },
        body: JSON.stringify({
          question: userMessage,
          recipeName: selectedOption.recipeName,
          ingredients: selectedOption.ingredientsUsed,
          instructions: selectedOption.instructions,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setChatMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: data.answer || "Maaf, tidak ada jawaban.",
          },
        ]);
      } else {
        setChatMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: data.error || "Maaf, gagal mendapatkan jawaban dari AI.",
          },
        ]);
      }
    } catch {
      setChatMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Gagal terhubung ke server. Coba lagi nanti.",
        },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  const handleSelectHistory = (h: HistoryData) => {
    setSelectedHistoryId(h.id);
    setSelectedOption({
      recipeName: h.recipeName,
      ingredientsUsed: h.ingredientsUsed,
      instructions: h.instructions || [],
      moneySaved: h.moneySaved || 0,
      carbonPrevented: h.carbonPrevented,
      estimatedCalories: h.estimatedCalories,
    });
    setSelectedOptionIndex(null);
    setRecipeOptions(null);
    setIsSaved(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!loading && !selectedOption) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (loading || selectedOption) return;

    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setInputImagePreview(result);
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

  const handleBackToOptions = () => {
    setSelectedOption(null);
    setSelectedOptionIndex(null);
    setShowChat(false);
  };

  const handleResetSession = () => {
    setRecipeOptions(null);
    setSelectedOptionIndex(null);
    setSelectedOption(null);
    setShowChat(false);
    setChatMessages([]);
    setInputImagePreview(null);
    setIsSaved(false);
  };

  return (
    <div className="max-w-7xl mx-auto pb-20 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-zinc-200">
        <div>
          <p className="text-[10px] text-zinc-400 mb-1 font-medium">
            Remix Area
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-[#1A1A1A]">
            Dapur Kreasi AI
          </h1>
          <p className="text-xs text-zinc-500 mt-1 font-medium">
            Racik resep dari sisa bahan &middot; Deteksi makanan &amp; dapatkan
            tutorialnya
          </p>
        </div>
        <div className="flex items-center gap-2 text-[10px] text-zinc-400">
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
            onImageChange={setInputImagePreview}
          />
        </div>

        <div className="lg:col-span-7 xl:col-span-8">
          <div className="w-full min-h-160 bg-white border border-zinc-200 rounded-2xl overflow-hidden relative shadow-sm flex flex-col">
            <AnimatePresence mode="wait">
              {loading && !inputImagePreview && !recipeOptions && (
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
                        : "Meracik 3 opsi resep..."
                    }
                  />
                </motion.div>
              )}

              {recipeOptions && recipeOptions.length > 0 && !selectedOption && (
                <motion.div
                  key="options-grid"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="p-6 sm:p-8 flex-1 w-full flex items-center justify-center flex-col space-y-5"
                >
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="text-[10px] text-zinc-500 font-medium">
                      {activeMode === "detect"
                        ? "3 Opsi Resep Untuk Membuat:"
                        : "3 Opsi Resep Dari Bahan Ini:"}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {recipeOptions.map((option, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                      >
                        <RecipeOptionCard
                          option={option}
                          index={idx}
                          isSelected={selectedOptionIndex === idx}
                          onSelect={() => handleSelectOption(idx)}
                        />
                      </motion.div>
                    ))}
                  </div>

                  <div className="flex justify-center pt-4">
                    <button
                      onClick={handleResetSession}
                      className="text-xs font-medium text-zinc-500 hover:text-[#1A1A1A] underline"
                    >
                      Ulangi Input
                    </button>
                  </div>
                </motion.div>
              )}

              {selectedOption && !showChat && (
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
                    <RecipeResultCard
                      recipe={selectedOption}
                      mode={activeMode}
                    />

                    <div className="flex items-center justify-center gap-3 mt-6 pt-4 border-t border-zinc-200">
                      {recipeOptions && (
                        <Button
                          onClick={handleBackToOptions}
                          variant="primary"
                          disabled={loading}
                        >
                          <span className="flex items-center gap-2">
                            <X size={14} /> Opsi Lain
                          </span>
                        </Button>
                      )}
                      {!recipeOptions && (
                        <Button
                          onClick={handleResetSession}
                          variant="primary"
                          disabled={loading}
                        >
                          <span className="flex items-center gap-2">
                            <X size={14} /> Kembali ke Input
                          </span>
                        </Button>
                      )}
                      <Button
                        onClick={() => setShowChat(true)}
                        variant="primary"
                        disabled={loading}
                      >
                        <span className="flex items-center gap-2">
                          <MessageCircle size={14} /> Tanya Resep Ini
                        </span>
                      </Button>
                      {recipeOptions && !isSaved && (
                        <Button
                          onClick={handleConfirmAndSave}
                          variant="accent"
                          loading={loading}
                          disabled={loading}
                        >
                          <span className="flex items-center gap-2">
                            <CheckCircle2 size={14} /> Simpan ke Riwayat
                          </span>
                        </Button>
                      )}
                      {recipeOptions && isSaved && (
                        <Button variant="secondary" disabled={true}>
                          <span className="flex items-center gap-2">
                            <CheckCircle2 size={14} /> Tersimpan!
                          </span>
                        </Button>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {showChat && selectedOption && (
                <motion.div
                  key="chat-followup"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex-1 flex flex-col p-6 sm:p-8"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xs font-bold text-[#1A1A1A]">
                      Tanya Jawab: {selectedOption.recipeName}
                    </h3>
                    <button
                      onClick={() => setShowChat(false)}
                      className="p-1.5 rounded-lg hover:bg-zinc-100 text-zinc-400"
                    >
                      <X size={14} />
                    </button>
                  </div>

                  <div className="flex-1 min-h-40 max-h-80 overflow-y-auto space-y-3 mb-4">
                    {chatMessages.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-xs text-zinc-400 font-medium">
                          Ajukan pertanyaan tentang resep ini...
                        </p>
                        <p className="text-[10px] text-zinc-300 mt-1">
                          Contoh: &ldquo;Bisa ganti cabai dengan apa?&rdquo;
                          atau &ldquo;Lebih detail langkahnya?&rdquo;
                        </p>
                      </div>
                    ) : (
                      chatMessages.map((msg, idx) => (
                        <div
                          key={idx}
                          className={`flex ${
                            msg.role === "user"
                              ? "justify-end"
                              : "justify-start"
                          }`}
                        >
                          <div
                            className={`max-w-[80%] p-3 rounded-2xl text-xs ${
                              msg.role === "user"
                                ? "bg-[#1A1A1A] text-white"
                                : "bg-zinc-100 text-zinc-600"
                            }`}
                          >
                            {msg.content}
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) =>
                        e.key === "Enter" && handleAskAboutRecipe()
                      }
                      placeholder="Tulis pertanyaan..."
                      className="flex-1 px-4 py-2.5 text-xs bg-zinc-50 border border-zinc-200 text-[#1A1A1A] rounded-xl focus:border-zinc-400 outline-none placeholder:text-zinc-400"
                      disabled={chatLoading}
                    />
                    <Button
                      onClick={handleAskAboutRecipe}
                      loading={chatLoading}
                      variant="primary"
                      size="sm"
                      disabled={!chatInput.trim()}
                    >
                      <Send size={14} />
                    </Button>
                  </div>
                </motion.div>
              )}

              {!selectedOption && !recipeOptions && (
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
                  {!loading && (
                    <div
                      className={`absolute inset-4 border-2 border-dashed rounded-2xl pointer-events-none z-10 transition-colors ${
                        isDragging ? "border-[#1A1A1A]" : "border-zinc-200"
                      }`}
                    />
                  )}

                  {loading ? (
                    <div className="w-full max-w-xl relative rounded-2xl overflow-hidden border border-zinc-200 shadow-xs z-20 p-2 bg-zinc-50/50 flex items-center justify-center">
                      {inputImagePreview && (
                        <Image
                          src={inputImagePreview}
                          alt="Preview Foto Kuliner"
                          width={640}
                          height={480}
                          className="w-full h-auto max-h-112.5 object-contain rounded-xl"
                          unoptimized
                        />
                      )}
                      <motion.div
                        className="absolute inset-x-2 h-0.5 bg-linear-to-r from-transparent via-amber-400 to-transparent shadow-[0_0_12px_#EAB308] z-30"
                        animate={{ top: ["4%", "94%", "4%"] }}
                        transition={{
                          duration: 2,
                          ease: "easeInOut",
                          repeat: Infinity,
                        }}
                      />
                    </div>
                  ) : inputImagePreview ? (
                    <div className="w-full max-w-xl relative rounded-2xl overflow-hidden border border-zinc-200 shadow-xs z-20 p-2 bg-zinc-50/50 flex items-center justify-center">
                      <Image
                        src={inputImagePreview}
                        alt="Preview Foto Kuliner"
                        width={640}
                        height={480}
                        className="w-full h-auto max-h-112.5 object-contain rounded-xl"
                        unoptimized
                      />

                      <Button
                        type="button"
                        onClick={() => {
                          setInputImagePreview(null);
                        }}
                        variant="secondary"
                        className="absolute top-5 right-5 p-2 px-2! py-2! shadow-md cursor-pointer z-30"
                      >
                        <X size={14} strokeWidth={2.5} />
                      </Button>
                      <div className="absolute bottom-5 left-5 right-5 bg-white/90 backdrop-blur-xs border border-zinc-200/60 px-3 py-2 rounded-xl text-left flex items-center justify-between z-30">
                        <span className="text-[10px] font-medium text-zinc-700">
                          Gambar Siap Diracik AI
                        </span>
                        <span className="text-[9px] font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">
                          Siap
                        </span>
                      </div>
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
                          className={`text-xs font-medium transition-colors ${
                            isDragging ? "text-emerald-600" : "text-[#1A1A1A]"
                          }`}
                        >
                          {isDragging
                            ? "Lepaskan Gambar Sekarang!"
                            : "Tarik & Jatuhkan Foto Kulinermu"}
                        </h3>
                        <p className="text-[10px] text-zinc-400 font-medium">
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
            <h3 className="text-xs font-medium text-[#1A1A1A]">
              Riwayat Kreasi
            </h3>
          </div>
          <span className="text-[10px] text-zinc-400">
            {histories.length} tersimpan
          </span>
        </div>

        {historyLoading ? (
          <PageLoader variant="inline" message="Memuat riwayat..." />
        ) : histories.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 bg-white border border-dashed border-zinc-200 rounded-2xl gap-2">
            <div className="w-10 h-10 bg-zinc-50 border border-zinc-200 rounded-xl flex items-center justify-center text-lg">
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
                      ? "bg-zinc-50 border-zinc-300 shadow-md"
                      : "bg-white border-zinc-200 hover:border-zinc-300 hover:shadow-sm"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div
                      className={`text-[9px] font-medium px-2 py-0.5 rounded-md border ${
                        isSelected
                          ? "bg-amber-100 border-amber-200 text-amber-700"
                          : "bg-emerald-50 text-emerald-700 border-emerald-100"
                      }`}
                    >
                      {isSelected ? "Dilihat" : "Selesai"}
                    </div>
                    <ArrowRight
                      size={11}
                      className={`shrink-0 mt-0.5 transition-transform ${isSelected ? "text-amber-600 translate-x-0" : "text-zinc-300"}`}
                    />
                  </div>

                  <div className="space-y-0.5 flex-1">
                    <h4
                      className={`text-xs font-bold line-clamp-2 leading-snug ${isSelected ? "text-[#1A1A1A]" : "text-[#1A1A1A]"}`}
                    >
                      {h.recipeName}
                    </h4>
                    <p
                      className={`text-[10px] font-medium line-clamp-1 ${isSelected ? "text-zinc-600" : "text-zinc-400"}`}
                    >
                      {h.ingredientsUsed.slice(0, 3).join(", ")}
                      {h.ingredientsUsed.length > 3 && " …"}
                    </p>
                  </div>

                  <div
                    className={`flex items-center justify-between pt-2.5 border-t text-[10px] font-medium ${isSelected ? "border-zinc-300" : "border-zinc-100"}`}
                  >
                    <div
                      className={`flex items-center gap-1 ${isSelected ? "text-emerald-700" : "text-emerald-600"}`}
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
            <div className="inline-flex items-center gap-2 bg-white border border-zinc-200 rounded-xl px-4 py-2.5 shadow-sm">
              <Wallet size={12} className="text-zinc-400" />
              <span className="text-[10px] text-zinc-500">Total Hemat</span>
              <span className="text-xs font-bold text-[#1A1A1A]">
                Rp{" "}
                {histories
                  .reduce((acc, h) => acc + (h.moneySaved || 0), 0)
                  .toLocaleString("id-ID")}
              </span>
            </div>
            <div className="inline-flex items-center gap-2 bg-white border border-zinc-200 rounded-xl px-4 py-2.5 shadow-sm">
              <Leaf size={12} className="text-emerald-500" />
              <span className="text-[10px] text-zinc-500">Total CO₂</span>
              <span className="text-xs font-bold text-emerald-600">
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
