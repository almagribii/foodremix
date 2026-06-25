"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Plus, Upload, X, ChefHat } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import Lottie from "lottie-react";
import { Button } from "@/components/ui/Button";
import bot from "../../../dashboard/remix/components/food.json"; // Sesuaikan path json Anda

type RemixMode = "remix" | "detect";

export default function PublicRemixPreviewPage() {
  const router = useRouter();
  const { error: toastError, success: toastSuccess } = useToast();

  // State Form & UI
  const [mode, setMode] = useState<RemixMode>("remix");
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [currentInput, setCurrentInput] = useState("");
  const [isWebcamActive, setIsWebcamActive] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // State Image Preview
  const [inputImagePreview, setInputImagePreview] = useState<string | null>(
    null,
  );

  // Refs untuk Kamera/File
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // Fungsi Alihkan/Redirect ke Dashboard
  const redirectToDashboard = () => {
    // Middleware Anda yang akan mengurus apakah dia ke login atau langsung ke dashboard
    router.push("/dashboard/remix");
  };

  const addIngredient = () => {
    const val = currentInput.trim().toLowerCase();
    if (val && !ingredients.includes(val)) {
      setIngredients((p) => [...p, val]);
      setCurrentInput("");
    }
  };

  const startWebcam = async () => {
    setInputImagePreview(null);
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
      setInputImagePreview(dataUrl);
    }
    stopWebcam();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    stopWebcam();
    const reader = new FileReader();
    reader.onloadend = () => {
      setInputImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setInputImagePreview(reader.result as string);
        toastSuccess("Gambar berhasil dimuat", "Foto siap diracik bersama AI.");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleModeChange = (newMode: RemixMode) => {
    setMode(newMode);
    setIngredients([]);
    setInputImagePreview(null);
  };

  return (
    <div className="max-w-7xl mx-auto pb-20 pt-6 px-4 space-y-8">
      {/* Header Promo */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-zinc-200">
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">
            Fitur Unggulan
          </p>
          <h1 className="text-3xl font-black tracking-tight text-[#1A1A1A]">
            Dapur Kreasi AI Preview
          </h1>
          <p className="text-xs text-zinc-500 mt-1 font-medium">
            Coba simulasi input sisa bahan kulkas Anda dan lihat kehebatan
            Multimodal AI.
          </p>
        </div>
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-amber-500 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full font-bold">
          <ChefHat size={12} />
          <span>Eksklusif Anggota</span>
        </div>
      </div>

      {/* Main Container Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* SISI KIRI: INPUT FORM */}
        <div className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-6">
          <div className="bg-white text-[#1A1A1A] rounded-2xl overflow-hidden shadow-sm border border-zinc-200 w-full transition-all duration-300">
            <div className="flex p-1.5 bg-zinc-50 border-b border-zinc-200 gap-1">
              <button
                type="button"
                onClick={() => handleModeChange("remix")}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-[10px] font-black uppercase tracking-wider transition-all duration-200 ${
                  mode === "remix"
                    ? "bg-[#eab308] text-black shadow-xs"
                    : "text-zinc-400 hover:text-zinc-600"
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
                    : "text-zinc-400 hover:text-zinc-600"
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

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  redirectToDashboard();
                }}
                className="space-y-5"
              >
                {/* Kamera & Upload Area */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black tracking-widest uppercase text-zinc-400 block">
                    {mode === "remix"
                      ? "Visual Bahan (Opsional)"
                      : "Foto Makanan"}
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
                          className="flex-1 py-3 bg-[#EAB308] text-zinc-950 text-xs font-black uppercase tracking-wider rounded-xl shadow-lg flex items-center justify-center gap-2"
                        >
                          Bidik Foto
                        </button>
                        <button
                          type="button"
                          onClick={stopWebcam}
                          className="px-4 py-3 bg-white border border-zinc-200 text-zinc-700 text-xs font-bold rounded-xl"
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
                        className={`flex flex-col items-center justify-center gap-2.5 py-6 border border-dashed rounded-2xl transition-all group ${
                          inputImagePreview
                            ? "border-emerald-200 bg-emerald-50/20"
                            : "border-zinc-200 hover:bg-zinc-50"
                        }`}
                      >
                        <Camera
                          size={16}
                          className={
                            inputImagePreview
                              ? "text-emerald-600"
                              : "text-zinc-400"
                          }
                        />
                        <span className="text-[10px] font-black uppercase tracking-wider text-zinc-400">
                          {inputImagePreview ? "Terkunci" : "Kamera"}
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => fileRef.current?.click()}
                        className={`flex flex-col items-center justify-center gap-2.5 py-6 border border-dashed rounded-2xl transition-all group ${
                          inputImagePreview
                            ? "border-emerald-200 bg-emerald-50/20"
                            : "border-zinc-200 hover:bg-zinc-50"
                        }`}
                      >
                        <Upload
                          size={16}
                          className={
                            inputImagePreview
                              ? "text-emerald-600"
                              : "text-zinc-400"
                          }
                        />
                        <span className="text-[10px] font-black uppercase tracking-wider text-zinc-400">
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

                {/* Manual Text Input */}
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
                        e.key === "Enter" &&
                        (e.preventDefault(), addIngredient())
                      }
                      placeholder={
                        mode === "remix"
                          ? "Contoh: ayam, telur..."
                          : "Contoh: nasi goreng..."
                      }
                      className="flex-1 px-4 py-3 text-xs bg-zinc-50 border border-zinc-200 rounded-xl outline-none"
                    />
                    <button
                      type="button"
                      onClick={addIngredient}
                      className="px-4 bg-zinc-100 border border-zinc-200 text-zinc-600 hover:bg-[#1A1A1A] hover:text-white rounded-xl transition-all"
                    >
                      <Plus size={14} strokeWidth={3} />
                    </button>
                  </div>

                  {/* Badges Display */}
                  {ingredients.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {ingredients.map((ing, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1 pl-2.5 pr-1 py-1 bg-zinc-50 border border-zinc-200 text-zinc-600 text-[10px] font-bold rounded-lg uppercase"
                        >
                          {ing}
                          <button
                            type="button"
                            onClick={() =>
                              setIngredients((p) =>
                                p.filter((_, i) => i !== idx),
                              )
                            }
                            className="p-1 text-zinc-400 hover:text-red-500"
                          >
                            <X size={10} strokeWidth={3} />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* CTA BUTTON: Menuju Ke Dashboard */}
                <Button type="submit" variant="accent" className="w-full">
                  {mode === "remix"
                    ? "Racik Menu Sekarang (Via AI)"
                    : "Cari Tutorial Memasak"}
                </Button>
              </form>
            </div>
          </div>
        </div>

        {/* SISI KANAN: LIVE VISUAL PREVIEW AREA */}
        <div className="lg:col-span-7 xl:col-span-8">
          <div className="w-full min-h-130 bg-white border border-zinc-200 rounded-3xl overflow-hidden relative shadow-sm flex flex-col">
            <div
              onDragOver={handleDragOver}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={`flex-1 flex flex-col items-center justify-center text-center p-8 relative transition-colors duration-200 ${
                isDragging ? "bg-zinc-50/80" : ""
              }`}
            >
              <div
                className={`absolute inset-4 border-2 border-dashed rounded-2xl pointer-events-none transition-colors ${
                  isDragging ? "border-[#1A1A1A]" : "border-zinc-200"
                }`}
              />

              {inputImagePreview ? (
                <div className="w-full max-w-xl relative rounded-2xl overflow-hidden border border-zinc-200 p-2 bg-zinc-50/50 flex items-center justify-center z-20">
                  <Image
                    src={inputImagePreview}
                    alt="Preview Foto Kuliner"
                    width={640}
                    height={480}
                    className="w-full h-auto max-h-112.5 object-contain rounded-xl"
                    unoptimized
                  />
                  <button
                    type="button"
                    onClick={() => setInputImagePreview(null)}
                    className="absolute top-5 right-5 p-2 bg-white/95 text-zinc-500 hover:text-red-500 rounded-xl shadow-md"
                  >
                    <X size={14} strokeWidth={2.5} />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center gap-4">
                  <div
                    className={`w-40 h-40 lg:w-56 lg:h-56 flex items-center justify-center opacity-25 mix-blend-multiply transition-transform ${
                      isDragging ? "scale-105" : ""
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
                      className={`text-xs font-black uppercase tracking-wider ${isDragging ? "text-emerald-600" : "text-[#1A1A1A]"}`}
                    >
                      {isDragging
                        ? "Lepaskan Gambar Sekarang!"
                        : "Tarik & Jatuhkan Foto Kulinermu"}
                    </h3>
                    <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
                      Interaktif Simulator Pra-Rilis
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
