"use client";

import { useState, useRef } from "react";
import Image from "next/image";

interface IngredientFormProps {
  onGenerateRecipe: (
    ingredients: string[],
    imageBase64: string | null,
    targetBudget: number,
  ) => void;
  loading: boolean;
  defaultBudget: number;
}

export default function IngredientInputForm({
  onGenerateRecipe,
  loading,
  defaultBudget,
}: IngredientFormProps) {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [currentInput, setCurrentInput] = useState("");
  const [budget, setBudget] = useState(defaultBudget);

  // State Webcam & Preview Foto
  const [isWebcamActive, setIsWebcamActive] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const handleAddIngredient = () => {
    if (
      currentInput.trim() &&
      !ingredients.includes(currentInput.trim().toLowerCase())
    ) {
      setIngredients([...ingredients, currentInput.trim().toLowerCase()]);
      setCurrentInput("");
    }
  };

  const handleRemoveIngredient = (indexToRemove: number) => {
    setIngredients(ingredients.filter((_, i) => i !== indexToRemove));
  };

  // 1. Nyalakan Live Stream Webcam
  const startWebcam = async () => {
    setImagePreview(null);
    setImageBase64(null);
    setIsWebcamActive(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }, // Prioritas kamera belakang HP
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Gagal mengakses webcam:", err);
      setIsWebcamActive(false);
    }
  };

  // 2. Ambil Foto (Capture Snapshot)
  const capturePhoto = () => {
    if (videoRef.current) {
      const video = videoRef.current;
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;

      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL("image/jpeg");
        setImagePreview(dataUrl);
        setImageBase64(dataUrl.split(",")[1]);
      }
      stopWebcam();
    }
  };

  // 3. Matikan Webcam
  const stopWebcam = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsWebcamActive(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validasi: Berjalan lancar jika ada teks ATAU ada gambar snapshot kamera
    if (ingredients.length === 0 && !imageBase64) return;
    onGenerateRecipe(ingredients, imageBase64, budget);
  };

  return (
    <div className="bg-white border border-zinc-200/80 rounded-3xl p-6 shadow-sm space-y-5">
      <div>
        <h3 className="text-sm font-black text-zinc-800 tracking-tight">
          Remix Scanner Multimodal
        </h3>
        <p className="text-[11px] text-zinc-400 font-medium">
          Scan kulkas via webcam atau ketik catatan bahan sisa Anda secara
          fleksibel.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* LOKASI SCANNER LIVE WEBCAM / NEXT IMAGE PREVIEW */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold tracking-wide uppercase text-zinc-400 block">
            Kamera Pindai Kulkas
          </label>

          {isWebcamActive ? (
            <div className="relative rounded-xl overflow-hidden border border-zinc-200 bg-black h-48 flex items-center justify-center">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="h-full w-full object-cover"
              />
              <div className="absolute bottom-3 inset-x-0 flex justify-center gap-2 px-4 z-10">
                <button
                  type="button"
                  onClick={capturePhoto}
                  className="px-4 py-1.5 bg-emerald-600 text-white noble-font text-[11px] font-bold rounded-lg shadow-md hover:bg-emerald-700 transition"
                >
                  📸 Ambil Foto
                </button>
                <button
                  type="button"
                  onClick={stopWebcam}
                  className="px-3 py-1.5 bg-zinc-800 text-white noble-font text-[11px] font-bold rounded-lg shadow-md hover:bg-zinc-700 transition"
                >
                  Batal
                </button>
              </div>
            </div>
          ) : imagePreview ? (
            <div className="relative rounded-xl overflow-hidden border border-zinc-200 bg-zinc-50 h-48 flex items-center justify-center">
              {/* FIKS: Menggunakan Next.js Image Component dengan properti unoptimized untuk Base64 string */}
              <Image
                src={imagePreview}
                alt="Snapshot Isi Kulkas"
                fill
                className="object-cover"
                unoptimized
              />
              <div className="absolute bottom-3 inset-x-0 flex justify-center gap-2 z-10">
                <button
                  type="button"
                  onClick={startWebcam}
                  className="px-3 py-1.5 bg-zinc-900/80 backdrop-blur-xs text-white text-[11px] font-bold rounded-lg shadow-md hover:bg-zinc-900 transition"
                >
                  Ulangi Jret
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setImagePreview(null);
                    setImageBase64(null);
                  }}
                  className="px-2.5 py-1.5 bg-rose-600 text-white text-[11px] font-bold rounded-lg shadow-md hover:bg-rose-700 transition"
                >
                  ×
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={startWebcam}
              disabled={loading}
              className="w-full py-8 border-2 border-dashed border-zinc-200 hover:border-zinc-400 transition rounded-xl flex flex-col items-center justify-center gap-1 bg-zinc-50/50 cursor-pointer group text-xs font-bold text-zinc-500"
            >
              <span className="text-xl group-hover:scale-110 transition duration-150">
                📷
              </span>
              <span>Aktifkan Live Webcam Kulkas</span>
            </button>
          )}
        </div>

        {/* INPUT TEKS MANUAl CATATAN */}
        <div className="space-y-1.5 border-t border-zinc-100 pt-3">
          <label className="text-[10px] font-bold tracking-wide uppercase text-zinc-400 block">
            Catatan Bahan Manual (Teks)
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              placeholder="Contoh: ayam suwir, telur dadar"
              className="flex-1 px-4 py-2.5 text-xs bg-zinc-50 border border-zinc-200 text-[#1A1A1A] rounded-xl outline-none"
              onKeyDown={(e) =>
                e.key === "Enter" && (e.preventDefault(), handleAddIngredient())
              }
              disabled={loading}
            />
            <button
              type="button"
              onClick={handleAddIngredient}
              className="px-4 py-2 bg-zinc-100 text-zinc-800 text-xs font-bold rounded-xl hover:bg-zinc-200"
              disabled={loading}
            >
              Tambah
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {ingredients.map((ing, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-zinc-100 border border-zinc-200 text-zinc-700 text-[11px] font-bold rounded-lg uppercase"
              >
                {ing}
                <button
                  type="button"
                  onClick={() => handleRemoveIngredient(idx)}
                  className="text-zinc-400 font-bold"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Slider Target Anggaran */}
        <div className="space-y-2 border-t border-zinc-100 pt-4">
          <div className="flex justify-between items-center text-[10px] font-bold tracking-wide uppercase text-zinc-400">
            <span>Batas Anggaran Pelengkap</span>
            <span className="text-zinc-800 font-black text-xs normal-case">
              Rp {budget.toLocaleString("id-ID")}
            </span>
          </div>
          <input
            type="range"
            min="5000"
            max="100000"
            step="5000"
            value={budget}
            onChange={(e) => setBudget(Number(e.target.value))}
            className="w-full h-1.5 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-[#1A1A1A]"
            disabled={loading}
          />
        </div>

        {/* Tombol Eksekusi Cerdas AI */}
        <button
          type="submit"
          disabled={loading || (ingredients.length === 0 && !imageBase64)}
          className="w-full px-5 py-3 bg-[#1A1A1A] text-white text-xs font-bold rounded-xl hover:bg-zinc-800 transition shadow-sm disabled:opacity-40 flex items-center justify-center gap-2 text-xs"
        >
          {loading
            ? "Gemini Sedang Menganalisis Kulkas..."
            : "Mulai Remix Menu via AI"}
        </button>
      </form>
    </div>
  );
}
