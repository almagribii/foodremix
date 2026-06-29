"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import {
  Camera,
  Upload,
  RefreshCw,
  CheckCircle2,
  Package,
  X,
  FileImage,
  Info,
  AlertTriangle,
} from "lucide-react";
import { useToast } from "@/components/ui/Toast";

interface ScanResult {
  status: "VALID" | "INVALID";
  itemName: string;
  verdict: string;
  expectedLifespan: string;
  analysisDetails: string[];
  storageBlueprint: string[];
}

type InputTab = "camera" | "upload";

export default function RemixPickerPage() {
  const {
    error: toastError,
    warning: toastWarning,
    success: toastSuccess,
  } = useToast();

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState<InputTab>("upload");
  const [isWebcamActive, setIsWebcamActive] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const stopWebcam = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setIsWebcamActive(false);
  };

  const startWebcam = async () => {
    setResult(null);
    setImagePreview(null);
    setImageBase64(null);
    setIsWebcamActive(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
          width: { ideal: 640 },
          height: { ideal: 640 },
        },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) {
      console.error(err);
      setIsWebcamActive(false);
      toastError(
        "Kamera tidak dapat diakses",
        "Pastikan izin kamera sudah diberikan.",
      );
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    stopWebcam();
    setResult(null);
    const reader = new FileReader();
    reader.onloadend = () => {
      const b64 = reader.result as string;
      setImagePreview(b64);
      setImageBase64(b64.split(",")[1]);
    };
    reader.readAsDataURL(file);
  };

  const executeAnalysis = async (base64Data: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/picker/scan-guest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ imageBase64: base64Data }),
      });

      const data = await res.json();

      if (res.ok) {
        setResult(data);

        if (data.status === "INVALID") {
          toastWarning(
            "Objek tidak dikenali",
            "Pastikan Anda memotret bahan makanan yang jelas.",
          );
        } else if (data.verdict && data.verdict.includes("CARI YANG LAIN")) {
          toastWarning(
            "Bahan kurang layak",
            `${data.itemName} — Periksa kembali kondisinya.`,
          );
        } else {
          toastSuccess(
            "Analisis selesai",
            `${data.itemName} berhasil diperiksa.`,
          );
        }
      } else {
        toastError(
          "Analisis gagal",
          data.error || "Gagal memproses pemindaian.",
        );
      }
    } catch (err) {
      console.error(err);
      toastError("Gangguan koneksi", "Tidak dapat terhubung ke server AI.");
    } finally {
      setLoading(false);
    }
  };

  const handleCaptureAndScan = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    if (loading) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (ctx) {
      const width = video.videoWidth || 640;
      const height = video.videoHeight || 480;

      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(video, 0, 0, width, height);

      try {
        const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
        if (!dataUrl || !dataUrl.includes(",")) return;

        const cleanBase64 = dataUrl.split(",")[1];
        setImagePreview(dataUrl);
        setImageBase64(cleanBase64);
        stopWebcam();

        await executeAnalysis(cleanBase64);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleProcessUploadedImage = async () => {
    if (!imageBase64 || loading) return;
    await executeAnalysis(imageBase64);
  };

  const handleResetSession = () => {
    setImagePreview(null);
    setImageBase64(null);
    setResult(null);
    stopWebcam();
  };

  const handleTabChange = (tab: InputTab) => {
    setActiveTab(tab);
    handleResetSession();
    if (tab === "camera") {
      startWebcam();
    }
  };

  useEffect(() => {
    return () => stopWebcam();
  }, []);

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 pt-4 lg:pt-0 animate-fadeIn px-4 sm:px-6">
      <div className="border-b border-zinc-200 pb-5 text-center space-y-2">
       
        <h1 className="text-3xl font-bold tracking-tight text-[#1A1A1A]">
          Penyortir Pangan AI (Guest Mode)
        </h1>
        <p className="text-xs text-zinc-500 max-w-2xl mx-auto font-medium leading-relaxed">
          Gunakan kamera atau unggah foto belanjaan yang akan Anda beli untuk mencoba teknologi
          pemindaian Foodremix. Foto yang Anda kirimkan langsung diproses oleh
          AI namun{" "}
          <strong>
            tidak akan disimpan ke dalam riwayat akun atau database
          </strong>
          .
        </p>
      </div>

      <div className="w-full bg-white border border-zinc-200 rounded-3xl overflow-hidden relative shadow-xs flex flex-col justify-between">
        <AnimatePresence mode="wait">
          {!result && (
            <motion.div
              key="input-and-loading-state"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              onDragOver={(e) => {
                e.preventDefault();
                if (!loading && activeTab === "upload") setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                if (loading || activeTab !== "upload") return;
                const file = e.dataTransfer.files?.[0];
                if (file?.type.startsWith("image/")) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    const b64 = reader.result as string;
                    setImagePreview(b64);
                    setImageBase64(b64.split(",")[1]);
                  };
                  reader.readAsDataURL(file);
                }
              }}
              className="w-full flex-1 flex flex-col p-6 sm:p-10 relative transition-colors duration-200"
            >
              {!loading && (
                <div className="flex bg-transparent p-1 gap-2 max-w-md mx-auto justify-center w-full mb-8 z-20">
                  <Button
                    variant="accent"
                    onClick={() => handleTabChange("upload")}
                    className="flex-1"
                  >
                    <span className="flex items-center justify-center gap-2 w-full">
                      <Upload size={16} className="shrink-0" />
                      <span>Unggah Foto</span>
                    </span>
                  </Button>
                  <Button
                    variant="accent"
                    onClick={() => handleTabChange("camera")}
                    className="flex-1"
                  >
                    <span className="flex items-center justify-center gap-2 w-full">
                      <Camera size={16} className="shrink-0" />
                      <span>Ambil Foto</span>
                    </span>
                  </Button>
                </div>
              )}

              <div className="w-full flex-1 flex flex-col items-center justify-center relative">
                {imagePreview ? (
                  <div className="w-full max-w-3xl relative rounded-2xl overflow-hidden border border-zinc-200 shadow-xs z-20 flex flex-col items-center justify-center bg-zinc-50/50 p-2 min-h-75 gap-4">
                    <Image
                      src={imagePreview}
                      alt="Target Analisis"
                      width={640}
                      height={450}
                      className="w-full h-auto max-h-112.5 object-contain rounded-xl mx-auto"
                      unoptimized
                    />

{loading && (
                      <div
                        className="absolute inset-x-2 h-0.5 bg-linear-to-r from-transparent via-amber-400 to-transparent shadow-[0_0_12px_#EAB308] z-30 top-1/2 -translate-y-1/2"
                      />
                    )}

                    {!loading && (
                      <>
                        <Button
                          type="button"
                          onClick={handleResetSession}
                          variant="secondary"
                          className="absolute top-5 right-5 p-2 px-2! py-2! shadow-md cursor-pointer z-30"
                        >
                          <X size={14} strokeWidth={2.5} />
                        </Button>
<div className="absolute bottom-5 left-5 right-5 bg-white/90 backdrop-blur-xs border border-zinc-200/60 px-3 py-2 rounded-xl flex items-center justify-between z-30">
                          <span className="text-[10px] font-medium text-zinc-700">
                            Pratinjau Gambar
                          </span>
                          <span className="text-[9px] font-medium text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-100">
                            Mode Uji Coba
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                ) : activeTab === "camera" ? (
                  isWebcamActive && (
                    <div className="relative rounded-2xl overflow-hidden border border-zinc-200 shadow-sm bg-zinc-950 h-auto mx-auto flex flex-col items-center">
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-120 h-120 object-contain"
                      />
                      <div className="absolute bottom-4 inset-x-0 flex justify-center gap-2 px-4 z-10 max-w-sm mx-auto">
                        <Button
                          type="button"
                          onClick={handleCaptureAndScan}
                          variant="primary"
                          className="flex-1 py-3"
                          size="sm"
                        >
                          <span className="flex items-center justify-center gap-2 w-full">
                            <Camera size={14} /> Ambil Foto &amp; Periksa
                          </span>
                        </Button>
                        <Button
                          type="button"
                          onClick={stopWebcam}
                          variant="secondary"
                          className="px-4 py-3"
                          size="sm"
                        >
                          Mati
                        </Button>
                      </div>
                    </div>
                  )
                ) : (
                  <div
                    onClick={() => fileRef.current?.click()}
                    className={`w-full border-2 border-dashed rounded-3xl p-8 py-20 flex flex-col items-center justify-center gap-4 cursor-pointer transition-all ${
                      isDragging
                        ? "border-[#1A1A1A] bg-zinc-50"
                        : "border-zinc-200 hover:border-zinc-300 bg-zinc-50/30"
                    }`}
                  >
                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <div className="h-14 w-14 bg-white border border-zinc-200 rounded-2xl flex items-center justify-center text-zinc-400 shadow-xs shadow-zinc-100">
                      <FileImage size={20} />
                    </div>
                    <div className="space-y-1 text-center">
                      <h3 className="text-xs font-medium text-[#1A1A1A]">
                        Pilih atau Seret Foto
                      </h3>
                      <p className="text-[10px] text-zinc-400">
                        Mendukung format gambar JPEG, PNG, maupun WebP
                      </p>
                    </div>
                  </div>
                )}

                {imagePreview && !loading && (
                  <div className="mt-4 w-full flex justify-center">
                    <Button
                      onClick={handleProcessUploadedImage}
                      variant="accent"
                    >
                      <span className="flex items-center justify-center gap-2 w-full">
                        <Upload size={13} /> Mulai Periksa Bahan
                      </span>
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {result && !loading && (
            <div className="space-y-6 flex-1 p-6 sm:p-10 animate-fadeIn w-full flex flex-col items-center text-center">
              <div className="flex flex-col items-center gap-3 w-full">
                <div>
                  <span className="text-[10px] font-medium text-zinc-400 block mb-1">
                    Hasil Analisis Kamera AI
                  </span>
                  <h2 className="text-3xl font-black text-[#1A1A1A] tracking-tight">
                    {result.itemName}
                  </h2>
                </div>
                <button
                  onClick={handleResetSession}
                  className="px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-[10px] font-medium hover:bg-zinc-100 transition flex items-center gap-1.5 text-zinc-600 shadow-xs mx-auto"
                >
                  <RefreshCw size={11} /> Periksa Gambar Lain
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start w-full mt-4">
                <div
                  className={`md:col-span-5 p-6 border rounded-2xl shadow-xs space-y-4 flex flex-col items-center text-center w-full h-full justify-center ${
                    result.status === "VALID" &&
                    result.verdict.includes("FRESH")
                      ? "bg-emerald-50/40 border-emerald-200/60"
                      : "bg-rose-50/40 border-rose-200/60"
                  }`}
                >
<div className="flex items-center justify-center gap-2 text-sm font-medium mx-auto">
                      <CheckCircle2
                        size={16}
                        className={
                          result.status === "VALID" &&
                          result.verdict.includes("FRESH")
                            ? "text-emerald-600"
                            : "text-rose-600"
                        }
                      />
                      <span
                        className={
                          result.status === "VALID" &&
                          result.verdict.includes("FRESH")
                            ? "text-emerald-800"
                            : "text-rose-800"
                        }
                      >
                        Rekomendasi: {result.verdict}
                      </span>
                    </div>
                  <ul className="text-xs text-zinc-600 font-medium space-y-2 text-left w-full pl-2">
                    {result.analysisDetails.map((detail, idx) => (
                      <li key={idx} className="block mb-1">
                        • {detail}
                      </li>
                    ))}
                    {result.status === "VALID" && (
                      <li className="pt-3 text-[12px] font-bold text-zinc-500 block text-center border-t border-zinc-200/60 mt-2">
                        Rentang Kesegaran:{" "}
                        <span className="text-[#1A1A1A] font-black block text-sm mt-0.5">
                          {result.expectedLifespan}
                        </span>
                      </li>
                    )}
                  </ul>
                </div>

                <div className="md:col-span-7 space-y-4 border border-zinc-100 rounded-2xl p-6 bg-zinc-50/20 w-full text-left">
                  <div className="flex items-center justify-center md:justify-start gap-1.5 text-xs font-medium text-[#1A1A1A] mb-2">
                    <Package size={14} />
                    <h3>Panduan Penyimpanan Bijak:</h3>
                  </div>
                  <ul className="text-xs text-zinc-600 font-medium space-y-3 pl-1 w-full">
                    {result.storageBlueprint.map((blueprint, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-3 leading-relaxed"
                      >
                        <span className="h-5 w-5 rounded-md bg-white border border-zinc-200 text-[10px] font-medium flex items-center justify-center text-zinc-500 shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span>{blueprint}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>

      <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-5 space-y-2 text-xs text-zinc-600">
        <div className="flex items-center gap-2 text-[#1A1A1A] font-medium text-[11px]">
          <Info size={14} className="text-amber-500" />
          <span>Bagaimana Cara Kerja Fitur Ini?</span>
        </div>
        <p className="leading-relaxed">
          Kamera pintar Foodremix dirancang untuk mengenali kondisi fisik bahan
          pangan mentah seperti buah, sayur, atau lauk-pauk. Sistem akan
          meneliti kelayakan bahan belanjaan Anda secara instan dan memberikan 3
          tips penyimpanan mandiri di rumah agar bahan makanan tetap awet serta
          mengurangi sampah makanan keluarga.
        </p>
        <div className="flex items-start gap-1.5 text-rose-700 font-medium pt-1">
          <AlertTriangle size={13} className="shrink-0 mt-0.5" />
          <span>
            Penting: Jika kamera menangkap objek selain makanan (seperti benda
            mati atau foto buram), sistem otomatis akan menolak hasil analisis
            demi menjaga ketepatan informasi belanja Anda.
          </span>
        </div>
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
