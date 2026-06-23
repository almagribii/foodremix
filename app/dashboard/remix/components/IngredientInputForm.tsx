"use client";

import { useState, useRef } from "react";
import { Camera, Plus, Zap, Search, Upload, X } from "lucide-react";
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
  imagePreview: string | null;
  onImageChange: (preview: string | null, base64: string | null) => void;
}

export default function IngredientInputForm({
  onGenerate,
  loading,
  imagePreview,
  onImageChange,
}: IngredientFormProps) {
  const { error: toastError } = useToast();
  const [mode, setMode] = useState<RemixMode>("remix");
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [currentInput, setCurrentInput] = useState("");
  const [budget, setBudget] = useState(0);
  const [isWebcamActive, setIsWebcamActive] = useState(false);

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
    onImageChange(null, null);
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
      onImageChange(dataUrl, dataUrl.split(",")[1]);
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
      onImageChange(result, result.split(",")[1]);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (ingredients.length === 0 && !imagePreview) return;
    onGenerate(
      ingredients,
      imagePreview ? imagePreview.split(",")[1] : null,
      budget,
      mode,
    );
  };

  const handleModeChange = (newMode: RemixMode) => {
    setMode(newMode);
    setIngredients([]);
    onImageChange(null, null);
  };

  const canSubmit = ingredients.length > 0 || !!imagePreview;

  return (
    <div className="bg-white text-[#1A1A1A] rounded-2xl overflow-hidden shadow-sm border border-zinc-200 max-w-md mx-auto transition-all duration-300">
      {/* Mode Toggle Tab */}
      <div className="flex p-1.5 bg-zinc-50 border-b border-zinc-200 gap-1">
        <button
          type="button"
          onClick={() => handleModeChange("remix")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-[10px] font-black uppercase tracking-wider transition-all duration-200 ${
            mode === "remix"
              ? "bg-[#eab308] text-black shadow-xs"
              : "text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100"
          }`}
        >
          Remix Bahan
        </button>
        <button
          type="button"
          onClick={() => handleModeChange("detect")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all duration-200 ${
            mode === "detect"
              ? "bg-[#eab308] text-black shadow-xs"
              : "text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100"
          }`}
        >
          Deteksi Makanan
        </button>
      </div>

      <div className="p-6 space-y-6">
        <div className="bg-zinc-50 border border-zinc-100 rounded-2xl p-3.5">
          <p className="text-[11px] text-zinc-500 font-medium leading-relaxed">
            {mode === "remix"
              ? "Foto atau ketik sisa bahan di kulkasmu, AI akan meracik resep kreatif & hemat!"
              : "Foto atau ketik nama makanan jadi, AI akan mendeteksi dan memberikan tutorial lengkapnya."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Kamera / Area Unggah File */}
          <div className="space-y-2">
            <label className="text-[10px] font-black tracking-widest uppercase text-zinc-400 block">
              {mode === "remix" ? "Visual Bahan (Opsional)" : "Foto Makanan"}
            </label>

            {isWebcamActive ? (
              <div className="relative w-full aspect-square bg-zinc-950 rounded-2xl overflow-hidden border border-zinc-200">
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
                    className="flex-1 py-3 bg-[#EAB308] text-zinc-950 text-xs font-black uppercase tracking-wider rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all"
                  >
                    Bidik Foto
                  </button>
                  <button
                    type="button"
                    onClick={stopWebcam}
                    className="px-4 py-3 bg-white border border-zinc-200 text-zinc-700 text-xs font-bold rounded-xl transition-colors shadow-xs"
                  >
                    Batal
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={startWebcam}
                  disabled={loading}
                  className={`flex flex-col items-center justify-center gap-2.5 py-6 border border-dashed rounded-2xl transition-all duration-200 group disabled:opacity-50 ${
                    imagePreview
                      ? "border-emerald-200 bg-emerald-50/20"
                      : "border-zinc-200 hover:border-zinc-400 hover:bg-zinc-50"
                  }`}
                >
                  <div className="p-2.5 bg-zinc-50 rounded-xl group-hover:bg-zinc-100 border border-zinc-100 transition-colors">
                    <Camera
                      size={16}
                      className={
                        imagePreview
                          ? "text-emerald-600"
                          : "text-zinc-400 group-hover:text-[#1A1A1A]"
                      }
                    />
                  </div>
                  <span
                    className={`text-[10px] font-black uppercase tracking-wider ${imagePreview ? "text-emerald-700" : "text-zinc-400 group-hover:text-[#1A1A1A]"}`}
                  >
                    {imagePreview ? "Foto Terkunci" : "Kamera"}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  disabled={loading}
                  className={`flex flex-col items-center justify-center gap-2.5 py-6 border border-dashed rounded-2xl transition-all duration-200 group disabled:opacity-50 ${
                    imagePreview
                      ? "border-emerald-200 bg-emerald-50/20"
                      : "border-zinc-200 hover:border-zinc-400 hover:bg-zinc-50"
                  }`}
                >
                  <div className="p-2.5 bg-zinc-50 rounded-xl group-hover:bg-zinc-100 border border-zinc-100 transition-colors">
                    <Upload
                      size={16}
                      className={
                        imagePreview
                          ? "text-emerald-600"
                          : "text-zinc-400 group-hover:text-[#1A1A1A]"
                      }
                    />
                  </div>
                  <span
                    className={`text-[10px] font-black uppercase tracking-wider ${imagePreview ? "text-emerald-700" : "text-zinc-400 group-hover:text-[#1A1A1A]"}`}
                  >
                    {imagePreview ? "Ganti Gambar" : "Unggah"}
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

          {/* Form Input Teks Manual */}
          <div className="space-y-2 border-t border-zinc-100 pt-5">
            <label className="text-[10px] font-black tracking-widest uppercase text-zinc-400 block">
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
                    ? "Contoh: ayam, telur, cabai..."
                    : "Contoh: nasi goreng, soto..."
                }
                className="flex-1 px-4 py-3 text-xs bg-zinc-50 border border-zinc-200 text-[#1A1A1A] rounded-xl focus:border-zinc-400 focus:bg-white outline-none placeholder:text-zinc-400 font-medium transition-all"
                disabled={loading}
              />
              <button
                type="button"
                onClick={addIngredient}
                disabled={loading}
                className="px-4 bg-zinc-100 border border-zinc-200 text-zinc-600 hover:bg-[#1A1A1A] hover:border-[#1A1A1A] hover:text-white rounded-xl transition-all duration-200 flex items-center justify-center disabled:opacity-50"
              >
                <Plus size={14} strokeWidth={3} />
              </button>
            </div>

            {/* Container Badges */}
            {ingredients.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-2">
                {ingredients.map((ing, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 pl-2.5 pr-1 py-1 bg-zinc-50 border border-zinc-200 text-zinc-600 text-[10px] font-bold rounded-lg uppercase tracking-wider transition-all hover:border-zinc-300"
                  >
                    {ing}
                    <button
                      type="button"
                      onClick={() =>
                        setIngredients((p) => p.filter((_, i) => i !== idx))
                      }
                      className="p-1 text-zinc-400 hover:text-red-500 hover:bg-zinc-100 rounded-md transition-all ml-0.5"
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
            className="w-full bg-[#eab308] text-black disabled:bg-zinc-100 disabled:text-zinc-400 border border-transparent disabled:border-zinc-200 font-black py-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 text-[10px] uppercase tracking-widest shadow-xs active:scale-[0.99]"
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
