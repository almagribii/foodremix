"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Camera, Plus, Zap } from "lucide-react";

interface IngredientFormProps {
  onGenerateRecipe: (
    ingredients: string[],
    imageBase64: string | null,
    targetBudget: number,
  ) => void;
  loading: boolean;
}

export default function IngredientInputForm({
  onGenerateRecipe,
  loading,
}: IngredientFormProps) {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [currentInput, setCurrentInput] = useState("");
  const [budget, setBudget] = useState(0);

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

  const startWebcam = async () => {
    setImagePreview(null);
    setImageBase64(null);
    setIsWebcamActive(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
          width: { ideal: 480 },
          height: { ideal: 480 },
        },
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

  const capturePhoto = () => {
    if (videoRef.current) {
      const video = videoRef.current;
      const canvas = document.createElement("canvas");
      const size = Math.min(video.videoWidth, video.videoHeight) || 480;
      canvas.width = size;
      canvas.height = size;

      const ctx = canvas.getContext("2d");
      if (ctx) {
        const sx = (video.videoWidth - size) / 2;
        const sy = (video.videoHeight - size) / 2;
        ctx.drawImage(video, sx, sy, size, size, 0, 0, size, size);
        const dataUrl = canvas.toDataURL("image/jpeg");
        setImagePreview(dataUrl);
        setImageBase64(dataUrl.split(",")[1]);
      }
      stopWebcam();
    }
  };

  const stopWebcam = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsWebcamActive(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (ingredients.length === 0 && !imageBase64) return;
    onGenerateRecipe(ingredients, imageBase64, budget);
  };

  return (
    <div className="bg-[#1A1A1A] text-white rounded-[2rem] p-6 space-y-6 shadow-[0_20px_50px_rgba(26,26,26,0.15)] border border-white/5">
      <div className="space-y-1">
        <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
          Remix Scanner
        </h3>
        <p className="text-xs text-zinc-300 font-medium tracking-tight">
          Scan kulkas dengan sensor live webcam
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* CAMERA SECTION */}
        <div className="space-y-2">
          <label className="text-[9px] font-black tracking-widest uppercase text-zinc-500 block">
            Kamera Pindai Kulkas
          </label>

          {isWebcamActive ? (
            <div className="relative w-full aspect-square bg-zinc-950 rounded-2xl overflow-hidden border border-zinc-800 flex items-center justify-center">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-4 inset-x-0 flex justify-center gap-2 px-4 z-10">
                <button
                  type="button"
                  onClick={capturePhoto}
                  className="px-4 py-2 bg-[#EAB308] hover:bg-[#F3C022] text-[#1A1A1A] text-[10px] font-black uppercase tracking-wider rounded-xl transition shadow-lg"
                >
                  📸 Ambil Foto
                </button>
                <button
                  type="button"
                  onClick={stopWebcam}
                  className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-[10px] font-bold rounded-xl transition"
                >
                  Batal
                </button>
              </div>
            </div>
          ) : imagePreview ? (
            <div className="relative w-full aspect-square bg-zinc-950 rounded-2xl overflow-hidden border border-zinc-800 flex items-center justify-center">
              <Image
                src={imagePreview}
                alt="Snapshot Isi Kulkas"
                fill
                className="object-cover"
                unoptimized
              />
              <div className="absolute bottom-4 inset-x-0 flex justify-center gap-2 z-10">
                <button
                  type="button"
                  onClick={startWebcam}
                  className="px-4 py-2 bg-white/10 backdrop-blur-md text-white text-[10px] font-bold rounded-xl border border-white/10 hover:bg-white/20 transition"
                >
                  Ulangi Scan
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setImagePreview(null);
                    setImageBase64(null);
                  }}
                  className="px-3 py-2 bg-rose-600/90 text-white text-[10px] font-black rounded-xl hover:bg-rose-700 transition"
                >
                  ✕
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={startWebcam}
              disabled={loading}
              className="w-full aspect-square border-2 border-dashed border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/10 transition-all duration-300 rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer group"
            >
              <Camera
                size={24}
                className="group-hover:scale-105 transition text-zinc-600 group-hover:text-zinc-400"
              />
              <span className="text-[9px] font-black tracking-widest uppercase text-zinc-500 group-hover:text-zinc-400">
                Aktifkan Live Webcam
              </span>
            </button>
          )}
        </div>

        {/* TEXT INPUT SECTION */}
        <div className="space-y-2 pt-2 border-t border-zinc-800/60">
          <label className="text-[9px] font-black tracking-widest uppercase text-zinc-500 block">
            Catatan Bahan Tambahan
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              placeholder="Contoh: ayam, telur, kubis"
              className="flex-1 px-4 py-2.5 text-xs bg-zinc-900 border border-zinc-800 text-white rounded-xl focus:border-zinc-600 outline-none transition font-medium placeholder:text-zinc-600"
              onKeyDown={(e) =>
                e.key === "Enter" && (e.preventDefault(), handleAddIngredient())
              }
              disabled={loading}
            />
            <button
              type="button"
              onClick={handleAddIngredient}
              className="px-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl transition"
              disabled={loading}
            >
              <Plus size={14} strokeWidth={3} />
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {ingredients.map((ing, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-zinc-900 border border-zinc-800 text-zinc-300 text-[9px] font-black rounded-lg uppercase tracking-wider"
              >
                {ing}
                <button
                  type="button"
                  onClick={() => handleRemoveIngredient(idx)}
                  className="text-zinc-500 hover:text-zinc-300 transition"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* BUDGET SLIDER */}
        <div className="space-y-2 pt-2 border-t border-zinc-800/60">
          <div className="flex justify-between items-center text-[9px] font-black tracking-widest uppercase text-zinc-500">
            <span>Batas Anggaran Pelengkap</span>
            <span className="text-[#EAB308] font-black text-xs tracking-normal">
              Rp {budget.toLocaleString("id-ID")}
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="100000"
            step="5000"
            value={budget}
            onChange={(e) => setBudget(Number(e.target.value))}
            className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#EAB308]"
            disabled={loading}
          />
        </div>

        {/* SUBMIT BUTTON */}
        <button
          type="submit"
          disabled={loading || (ingredients.length === 0 && !imageBase64)}
          className="w-full bg-[#EAB308] hover:bg-[#F3C022] disabled:opacity-20 disabled:hover:bg-[#EAB308] text-[#1A1A1A] font-black py-3.5 rounded-xl flex items-center justify-center gap-2 transition duration-200 text-xs uppercase tracking-widest shadow-lg shadow-[#EAB308]/5"
        >
          <Zap size={13} fill="currentColor" />
          {loading ? "Analisis AI..." : "Racik Menu Baru"}
        </button>
      </form>
    </div>
  );
}
