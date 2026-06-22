"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import {
  Camera,
  Plus,
  Zap,
  Search,
  Upload,
  RefreshCw,
  X,
  Wallet,
} from "lucide-react";
import { useToast } from "@/components/ui/Toast";

export type RemixMode = "remix" | "detect";

interface IngredientFormProps {
  onGenerate: (
    ingredients: string[],
    imageBase64: string | null,
    targetBudget: number,
    mode: RemixMode,
  ) => void;
  loading: boolean;
}

export default function IngredientInputForm({
  onGenerate,
  loading,
}: IngredientFormProps) {
  const { error: toastError } = useToast();
  const [mode, setMode] = useState<RemixMode>("remix");
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [currentInput, setCurrentInput] = useState("");
  const [budget, setBudget] = useState(0);
  const [isWebcamActive, setIsWebcamActive] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const addIngredient = () => {
    const val = currentInput.trim().toLowerCase();
    if (val && !ingredients.includes(val)) {
      setIngredients((p) => [...p, val]);
      setCurrentInput("");
    }
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
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch {
      setIsWebcamActive(false);
      toastError(
        "Kamera tidak bisa diakses",
        "Pastikan izin kamera sudah diberikan.",
      );
    }
  };

  const stopWebcam = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setIsWebcamActive(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const size = Math.min(video.videoWidth, video.videoHeight) || 480;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      const sx = (video.videoWidth - size) / 2;
      const sy = (video.videoHeight - size) / 2;
      ctx.drawImage(video, sx, sy, size, size, 0, 0, size, size);
      const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
      setImagePreview(dataUrl);
      setImageBase64(dataUrl.split(",")[1]);
    }
    stopWebcam();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    stopWebcam();
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setImagePreview(result);
      setImageBase64(result.split(",")[1]);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const clearImage = () => {
    setImagePreview(null);
    setImageBase64(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (ingredients.length === 0 && !imageBase64) return;
    onGenerate(ingredients, imageBase64, budget, mode);
  };

  const handleModeChange = (newMode: RemixMode) => {
    setMode(newMode);
    // Reset data opsional saat ganti mode agar bersih
    setIngredients([]);
    clearImage();
  };

  const canSubmit = ingredients.length > 0 || !!imageBase64;

  return (
    <div className="bg-[#121214] text-zinc-100 rounded-3xl overflow-hidden shadow-[0_32px_64px_rgba(0,0,0,0.4)] border border-zinc-800/80 max-w-md mx-auto transition-all duration-300">
      {/* Mode Toggle Tab */}
      <div className="flex p-1.5 bg-zinc-900/50 border-b border-zinc-800/60 gap-1">
        <button
          type="button"
          onClick={() => handleModeChange("remix")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-[11px] font-bold uppercase tracking-wider transition-all duration-200 ${
            mode === "remix"
              ? "bg-[#EAB308] text-zinc-950 shadow-md font-black"
              : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40"
          }`}
        >
          <Zap size={13} fill={mode === "remix" ? "currentColor" : "none"} />
          Remix Bahan
        </button>
        <button
          type="button"
          onClick={() => handleModeChange("detect")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-[11px] font-bold uppercase tracking-wider transition-all duration-200 ${
            mode === "detect"
              ? "bg-[#EAB308] text-zinc-950 shadow-md font-black"
              : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40"
          }`}
        >
          <Search size={13} />
          Deteksi Makanan
        </button>
      </div>

      <div className="p-6 space-y-6">
        {/* Mode description */}
        <div className="bg-zinc-900/40 border border-zinc-800/40 rounded-xl p-3">
          <p className="text-xs text-zinc-400 font-medium leading-relaxed">
            {mode === "remix"
              ? "Foto atau ketik sisa bahan di kulkasmu, AI akan meracik resep kreatif & hemat!"
              : "Foto atau ketik nama makanan jadi, AI akan mendeteksi dan memberikan tutorial lengkapnya."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Camera/Upload area */}
          <div className="space-y-2.5">
            <label className="text-[10px] font-bold tracking-widest uppercase text-zinc-400 block">
              {mode === "remix" ? "Visual Bahan (Opsional)" : "Foto Makanan"}
            </label>

            {isWebcamActive ? (
              <div className="relative w-full aspect-square bg-zinc-950 rounded-2xl overflow-hidden border border-zinc-800 shadow-inner">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                <canvas ref={canvasRef} className="hidden" />
                <div className="absolute bottom-4 inset-x-0 flex justify-center gap-2 z-10 px-4">
                  <button
                    type="button"
                    onClick={capturePhoto}
                    className="flex-1 py-3 bg-amber-500 hover:bg-amber-400 active:scale-95 text-zinc-950 text-xs font-black uppercase tracking-wider rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all"
                  >
                    <Camera size={14} /> Ambil Foto
                  </button>
                  <button
                    type="button"
                    onClick={stopWebcam}
                    className="px-4 py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold rounded-xl transition-colors"
                  >
                    Batal
                  </button>
                </div>
              </div>
            ) : imagePreview ? (
              <div className="relative w-full aspect-square bg-zinc-950 rounded-2xl overflow-hidden border border-zinc-800">
                <Image
                  src={imagePreview}
                  alt="Preview"
                  fill
                  className="object-cover"
                  unoptimized
                />
                <button
                  type="button"
                  onClick={clearImage}
                  className="absolute top-3 right-3 p-2 bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700/50 rounded-xl text-zinc-400 hover:text-white transition shadow-md"
                >
                  <X size={14} />
                </button>
                <button
                  type="button"
                  onClick={startWebcam}
                  className="absolute bottom-3 left-3 px-3 py-2 bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700/50 text-zinc-200 text-[10px] font-bold rounded-xl flex items-center gap-1.5 transition shadow-md"
                >
                  <RefreshCw size={11} /> Ganti Foto
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={startWebcam}
                  disabled={loading}
                  className="flex flex-col items-center justify-center gap-2.5 py-6 border border-dashed border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/30 rounded-2xl transition-all duration-200 group disabled:opacity-50"
                >
                  <div className="p-2.5 bg-zinc-900 rounded-xl group-hover:bg-zinc-800 transition-colors">
                    <Camera
                      size={18}
                      className="text-zinc-400 group-hover:text-amber-400 transition-colors"
                    />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 group-hover:text-zinc-200">
                    Kamera
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  disabled={loading}
                  className="flex flex-col items-center justify-center gap-2.5 py-6 border border-dashed border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/30 rounded-2xl transition-all duration-200 group disabled:opacity-50"
                >
                  <div className="p-2.5 bg-zinc-900 rounded-xl group-hover:bg-zinc-800 transition-colors">
                    <Upload
                      size={18}
                      className="text-zinc-400 group-hover:text-amber-400 transition-colors"
                    />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 group-hover:text-zinc-200">
                    Unggah
                  </span>
                </button>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
            )}
          </div>

          {/* Text input */}
          <div className="space-y-2.5 border-t border-zinc-800/60 pt-5">
            <label className="text-[10px] font-bold tracking-widest uppercase text-zinc-400 block">
              {mode === "remix"
                ? "Daftar Bahan Manual"
                : "Atau Tulis Nama Makanan"}
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addIngredient())
                }
                placeholder={
                  mode === "remix"
                    ? "Contoh: ayam, telur, cabai…"
                    : "Contoh: nasi goreng, soto…"
                }
                className="flex-1 px-4 py-3 text-sm bg-zinc-900/90 border border-zinc-800 text-white rounded-xl focus:border-zinc-600 focus:bg-zinc-900 outline-none placeholder:text-zinc-600 font-medium transition-all"
                disabled={loading}
              />
              <button
                type="button"
                onClick={addIngredient}
                disabled={loading}
                className="px-4 bg-zinc-800 hover:bg-amber-500 hover:text-zinc-950 text-zinc-200 rounded-xl transition-all duration-200 flex items-center justify-center disabled:opacity-50"
              >
                <Plus size={16} strokeWidth={2.5} />
              </button>
            </div>

            {/* Badges Container */}
            {ingredients.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1.5 animate-fadeIn">
                {ingredients.map((ing, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 pl-3 pr-1.5 py-1.5 bg-zinc-900 border border-zinc-800 text-zinc-300 text-[10px] font-bold rounded-xl uppercase tracking-wider transition-all hover:border-zinc-700"
                  >
                    {ing}
                    <button
                      type="button"
                      onClick={() =>
                        setIngredients((p) => p.filter((_, i) => i !== idx))
                      }
                      className="p-1 text-zinc-500 hover:text-red-400 hover:bg-zinc-800 rounded-lg transition-all ml-0.5"
                    >
                      <X size={10} strokeWidth={3} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          
          <button
            type="submit"
            disabled={loading || !canSubmit}
            className="w-full bg-linear-to-r bg-[#EAB308] hover:from-amber-400 hover:to-amber-500 disabled:from-zinc-800 disabled:to-zinc-800 disabled:opacity-40 text-zinc-950 font-black py-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 text-xs uppercase tracking-widest shadow-lg shadow-amber-500/5 disabled:shadow-none active:scale-[0.99]"
          >
           
            {loading
              ? mode === "remix"
                ? "Sedang Meracik..."
                : "Mendeteksi..."
              : mode === "remix"
                ? "Racik Menu Sekarang"
                : "Cari Tutorial Memasak"}
          </button>
        </form>
      </div>
    </div>
  );
}
