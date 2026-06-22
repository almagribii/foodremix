"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import {
  Camera, Plus, Zap, Search, Upload, RefreshCw, X,
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

export default function IngredientInputForm({ onGenerate, loading }: IngredientFormProps) {
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
        video: { facingMode: "environment", width: { ideal: 480 }, height: { ideal: 480 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch {
      setIsWebcamActive(false);
      toastError("Kamera tidak bisa diakses", "Pastikan izin kamera sudah diberikan.");
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

  const canSubmit = ingredients.length > 0 || !!imageBase64;

  return (
    <div className="bg-[#1A1A1A] text-white rounded-3xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.18)] border border-white/5">
      {/* Mode Toggle */}
      <div className="flex border-b border-zinc-800">
        <button
          type="button"
          onClick={() => setMode("remix")}
          className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-[10px] font-black uppercase tracking-widest transition-colors ${
            mode === "remix"
              ? "bg-[#EAB308] text-[#1A1A1A]"
              : "text-zinc-500 hover:text-zinc-300"
          }`}
        >
          <Zap size={11} fill={mode === "remix" ? "currentColor" : "none"} />
          Remix Bahan
        </button>
        <button
          type="button"
          onClick={() => setMode("detect")}
          className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-[10px] font-black uppercase tracking-widest transition-colors ${
            mode === "detect"
              ? "bg-[#EAB308] text-[#1A1A1A]"
              : "text-zinc-500 hover:text-zinc-300"
          }`}
        >
          <Search size={11} />
          Deteksi Makanan
        </button>
      </div>

      <div className="p-5 space-y-5">
        {/* Mode description */}
        <p className="text-[10px] text-zinc-500 font-medium leading-relaxed">
          {mode === "remix"
            ? "Foto atau ketik sisa bahan di kulkasmu, AI akan meracik resep hemat."
            : "Foto atau ketik nama makanan jadi, AI akan memberikan tutorial cara membuatnya."}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Camera/Upload area */}
          <div className="space-y-2">
            <label className="text-[9px] font-black tracking-widest uppercase text-zinc-500 block">
              {mode === "remix" ? "Foto Isi Kulkas" : "Foto Makanan"}
            </label>

            {isWebcamActive ? (
              <div className="relative w-full aspect-square bg-zinc-950 rounded-2xl overflow-hidden border border-zinc-800">
                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                <canvas ref={canvasRef} className="hidden" />
                <div className="absolute bottom-3 inset-x-0 flex justify-center gap-2 z-10">
                  <button type="button" onClick={capturePhoto}
                    className="px-4 py-2 bg-[#EAB308] text-[#1A1A1A] text-[10px] font-black uppercase tracking-wider rounded-xl shadow-lg flex items-center gap-1.5">
                    <Camera size={11} /> Ambil Foto
                  </button>
                  <button type="button" onClick={stopWebcam}
                    className="px-3 py-2 bg-zinc-800 text-white text-[10px] font-bold rounded-xl">
                    Batal
                  </button>
                </div>
              </div>
            ) : imagePreview ? (
              <div className="relative w-full aspect-square bg-zinc-950 rounded-2xl overflow-hidden border border-zinc-800">
                <Image src={imagePreview} alt="Preview" fill className="object-cover" unoptimized />
                <button type="button" onClick={clearImage}
                  className="absolute top-2 right-2 p-1.5 bg-zinc-950/80 border border-zinc-800 rounded-lg text-zinc-400 hover:text-white transition">
                  <X size={12} />
                </button>
                <button type="button" onClick={startWebcam}
                  className="absolute bottom-2 left-2 px-3 py-1.5 bg-zinc-950/80 border border-zinc-800 text-white text-[9px] font-black rounded-lg flex items-center gap-1.5">
                  <RefreshCw size={10} /> Ulangi
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button type="button" onClick={startWebcam} disabled={loading}
                  className="flex flex-col items-center justify-center gap-2 py-5 border border-dashed border-zinc-800 hover:border-zinc-600 rounded-2xl transition group">
                  <Camera size={18} className="text-zinc-600 group-hover:text-zinc-400 transition" />
                  <span className="text-[9px] font-black uppercase tracking-wider text-zinc-600 group-hover:text-zinc-400">Kamera</span>
                </button>
                <button type="button" onClick={() => fileRef.current?.click()} disabled={loading}
                  className="flex flex-col items-center justify-center gap-2 py-5 border border-dashed border-zinc-800 hover:border-zinc-600 rounded-2xl transition group">
                  <Upload size={18} className="text-zinc-600 group-hover:text-zinc-400 transition" />
                  <span className="text-[9px] font-black uppercase tracking-wider text-zinc-600 group-hover:text-zinc-400">Unggah</span>
                </button>
                <input ref={fileRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              </div>
            )}
          </div>

          {/* Text input */}
          <div className="space-y-2 border-t border-zinc-800/60 pt-4">
            <label className="text-[9px] font-black tracking-widest uppercase text-zinc-500 block">
              {mode === "remix" ? "Tambah Bahan Teks" : "Atau Ketik Nama Makanan"}
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addIngredient())}
                placeholder={mode === "remix" ? "ayam, telur, cabai…" : "nasi goreng, soto ayam…"}
                className="flex-1 px-3 py-2.5 text-xs bg-zinc-900 border border-zinc-800 text-white rounded-xl focus:border-zinc-600 outline-none placeholder:text-zinc-600 font-medium"
                disabled={loading}
              />
              <button type="button" onClick={addIngredient} disabled={loading}
                className="px-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl transition">
                <Plus size={14} strokeWidth={3} />
              </button>
            </div>
            {ingredients.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {ingredients.map((ing, idx) => (
                  <span key={idx}
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-zinc-900 border border-zinc-800 text-zinc-300 text-[9px] font-black rounded-lg uppercase tracking-wider">
                    {ing}
                    <button type="button" onClick={() => setIngredients((p) => p.filter((_, i) => i !== idx))}
                      className="text-zinc-600 hover:text-zinc-300 transition ml-0.5">
                      <X size={9} strokeWidth={3} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Budget (remix only) */}
          {mode === "remix" && (
            <div className="space-y-2 border-t border-zinc-800/60 pt-4">
              <div className="flex justify-between text-[9px] font-black tracking-widest uppercase text-zinc-500">
                <span>Batas Anggaran</span>
                <span className="text-[#EAB308] tracking-normal text-xs">
                  Rp {budget.toLocaleString("id-ID")}
                </span>
              </div>
              <input type="range" min="0" max="100000" step="5000" value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#EAB308]"
                disabled={loading}
              />
            </div>
          )}

          {/* Submit */}
          <button type="submit" disabled={loading || !canSubmit}
            className="w-full bg-[#EAB308] hover:bg-[#F3C022] disabled:opacity-20 text-[#1A1A1A] font-black py-3.5 rounded-xl flex items-center justify-center gap-2 transition text-xs uppercase tracking-widest shadow-lg">
            {mode === "remix" ? <Zap size={13} fill="currentColor" /> : <Search size={13} />}
            {loading
              ? mode === "remix" ? "Meracik..." : "Mendeteksi..."
              : mode === "remix" ? "Racik Menu" : "Deteksi & Tutorial"
            }
          </button>
        </form>
      </div>
    </div>
  );
}
