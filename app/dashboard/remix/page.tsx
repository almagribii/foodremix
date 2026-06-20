"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import IngredientInputForm from "./components/IngredientInputForm";
import RecipeResultCard from "./components/RecipeResultCard";
import ShareLockModal from "./components/ShareLockModal";

interface RecipeData {
  recipeName: string;
  ingredientsUsed: string[];
  instructions: string[];
  moneySaved: number;
  carbonPrevented: number;
}

interface RemixHistoryItem {
  id: string;
  recipeName: string;
  ingredientsUsed: string[];
  moneySaved: number;
  carbonPrevented: number;
  cookedAt: string;
}

export default function RemixAreaPage() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [recipe, setRecipe] = useState<RecipeData | null>(null);
  const [remixHistoryId, setRemixHistoryId] = useState<string | null>(null);
  const [histories, setHistories] = useState<RemixHistoryItem[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // State khusus untuk menampung panduan solusi troubleshooting gambar
  const [imageErrorDetails, setImageErrorDetails] = useState<{
    reason: string;
    solutions: string[];
  } | null>(null);

  // 1. Sinkronisasi data histori masakan pasca-aksi secara asinkronis
  const refreshHistories = useCallback(async () => {
    const activeToken = token || localStorage.getItem("token");
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

  // 2. Fetch data histori awal saat komponen mount (Bebas Eror ESLint Cascading)
  useEffect(() => {
    let isMounted = true;

    const initFetch = async () => {
      const activeToken = token || localStorage.getItem("token");
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
        console.error("Gagal sinkronisasi histori awal:", err);
      }
    };

    initFetch();

    return () => {
      isMounted = false;
    };
  }, [token]);

  // 3. Aksi Kirim Input Multimodal (Kamera Webcam + Teks Bahan)
  // Ganti fungsi handleGenerateRecipe di dalam file app/dashboard/remix/page.tsx kamu:

  const handleGenerateRecipe = async (
    ingredients: string[],
    imageBase64: string | null,
    targetBudget: number,
  ) => {
    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");
    setImageErrorDetails(null);
    const activeToken = token || localStorage.getItem("token");

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
        // FIKS VALIDASI DINAMIS: Cek status balasan dari klasifikasi cerdas Gemini AI
        if (data.status === "INVALID") {
          setRecipe(null);
          setRemixHistoryId(null);
          setErrorMessage(data.reason || "Input terdeteksi tidak valid.");
          setImageErrorDetails({
            reason: data.reason,
            solutions: [
              data.solution ||
                "Silakan periksa kembali kecocokan input Anda dengan tema aplikasi.",
            ],
          });
        } else {
          setRecipe(data.recipe);
          setRemixHistoryId(data.remixHistoryId);
          await refreshHistories();
        }
      } else {
        setErrorMessage(data.error || "Gagal meracik menu lewat AI.");
      }
    } catch (err) {
      console.error(err);
      setErrorMessage("Terjadi gangguan koneksi sirkuit ke server AI.");
    } finally {
      setLoading(false);
    }
  };

  // 4. Aksi Menerbitkan Postingan Berbagi/Patungan ke Remix Share
  const handlePublishShare = async (
    postType: "DONASI" | "PATUNGAN",
    title: string,
    description: string,
  ) => {
    setSuccessMessage("");
    setErrorMessage("");
    const activeToken = token || localStorage.getItem("token");

    try {
      const res = await fetch("/api/community/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${activeToken}`,
        },
        body: JSON.stringify({
          postType,
          title,
          description,
          recipeName: recipe?.recipeName || "Menu Kustom",
          remixHistoryId: remixHistoryId,
        }),
      });

      if (res.ok) {
        setSuccessMessage(
          "Aksi Remix Share Anda sukses disiarkan ke sirkuit komunitas terdekat!",
        );
        setIsModalOpen(false);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        const data = await res.json();
        setErrorMessage(data.error || "Gagal mengunggah postingan komunitas.");
      }
    } catch (err) {
      console.error("Gagal melakukan share lock:", err);
      setErrorMessage("Gangguan koneksi saat mempublikasikan postingan.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-16">
      {/* Header Utama Halaman */}
      <div className="border-b border-zinc-200 pb-5">
        <h1 className="text-2xl font-black tracking-tight text-[#1A1A1A]">
          Remix Area
        </h1>
        <p className="text-xs text-zinc-500">
          Transformasikan jepretan live webcam kulkas dan catatan sisa pangan
          Anda menjadi hidangan ramah lingkungan via AI.
        </p>
      </div>

      {/* Tampilan Status Alert Notifikasi */}
      {successMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl">
          ✓ {successMessage}
        </div>
      )}

      {errorMessage && !imageErrorDetails && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold rounded-xl">
          🚨 {errorMessage}
        </div>
      )}

      {/* INTERACTIVE TROUBLESHOOTING CARD (TAMPIL JIKA GAMBAR INVALID) */}
      {imageErrorDetails && (
        <div className="p-5 bg-rose-50/50 border border-rose-200/80 rounded-3xl space-y-3 shadow-xs">
          <div className="flex items-center gap-2 text-rose-800">
            <span className="text-base">🚨</span>
            <h4 className="text-xs font-black uppercase tracking-wider">
              {errorMessage}
            </h4>
          </div>
          <p className="text-xs text-zinc-600 leading-relaxed font-medium">
            {imageErrorDetails.reason}
          </p>
          <div className="space-y-1.5 border-t border-rose-200/50 pt-3">
            <span className="text-[10px] font-bold text-rose-900 tracking-wide uppercase block">
              Langkah Solusi Perbaikan:
            </span>
            <ul className="list-disc pl-4 text-xs text-zinc-600 space-y-1 font-medium">
              {imageErrorDetails.solutions.map((sol, idx) => (
                <li key={idx} className="pl-0.5">
                  {sol}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Tata Letak Grid Utama */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Kolom Kiri: Form Input Multimodal + Panel Histori Kulkas */}
        <div className="lg:col-span-4 space-y-6">
          <IngredientInputForm
            onGenerateRecipe={handleGenerateRecipe}
            loading={loading}
            defaultBudget={30000}
          />

          {/* List Riwayat Memasak Persisten */}
          <div className="bg-white border border-zinc-200/80 rounded-3xl p-5 shadow-sm space-y-3">
            <span className="text-[10px] font-black tracking-wider uppercase text-zinc-400 block">
              Riwayat Racikan Kulkas
            </span>
            {histories.length === 0 ? (
              <div className="text-zinc-400 text-xs text-center py-4 font-medium">
                Belum ada catatan memasak.
              </div>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {histories.map((h) => (
                  <div
                    key={h.id}
                    className="p-2.5 bg-zinc-50 border border-zinc-100 rounded-xl flex justify-between items-center text-xs"
                  >
                    <div className="truncate pr-2">
                      <p className="font-bold text-zinc-800 truncate">
                        {h.recipeName}
                      </p>
                      <p className="text-[10px] text-zinc-400 font-semibold truncate">
                        {h.ingredientsUsed.join(", ")}
                      </p>
                    </div>
                    <span className="text-[10px] font-black text-emerald-600 whitespace-nowrap">
                      +{h.carbonPrevented}Kg CO₂
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Kolom Kanan: Tampilan Hasil Resep Kreatif Gemini AI */}
        <div className="lg:col-span-8">
          <RecipeResultCard
            recipe={recipe}
            onOpenShareModal={() => setIsModalOpen(true)}
          />
        </div>
      </div>

      {/* Modal Dialog Overlay P2P Share Lock */}
      <ShareLockModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmitPost={handlePublishShare}
      />
    </div>
  );
}
