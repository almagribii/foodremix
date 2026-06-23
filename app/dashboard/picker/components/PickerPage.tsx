"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useAuth } from "@/lib/hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera,
  Upload,
  RefreshCw,
  CheckCircle2,
  Package,
  History,
  Calendar,
  X,
  FileImage,
} from "lucide-react";
import { useToast } from "@/components/ui/Toast";

interface ScanResult {
  id?: string;
  status: "VALID" | "INVALID";
  itemName: string;
  verdict: string;
  expectedLifespan: string;
  analysisDetails: string[];
  storageBlueprint: string[];
  scannedAt?: string;
}

type InputTab = "camera" | "upload";

export default function RemixPickerPage() {
  const { token } = useAuth();
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

  const [history, setHistory] = useState<ScanResult[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

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
      console.error("Gagal inisialisasi webcam:", err);
      setIsWebcamActive(false);
      toastError(
        "Kamera tidak dapat diakses",
        "Pastikan izin kamera sudah diberikan.",
      );
    }
  };

  const fetchHistory = async () => {
    try {
      const activeToken = token || localStorage.getItem("token");
      if (!activeToken) return;

      const res = await fetch("/api/picker/history", {
        method: "GET",
        headers: { Authorization: `Bearer ${activeToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        setHistory(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      if (!token && !localStorage.getItem("token")) return;
      try {
        setLoadingHistory(true);
        const activeToken = token || localStorage.getItem("token");
        const res = await fetch("/api/picker/history", {
          method: "GET",
          headers: { Authorization: `Bearer ${activeToken}` },
        });
        if (res.ok && isMounted) {
          const data = await res.json();
          setHistory(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (isMounted) setLoadingHistory(false);
      }
    };
    loadData();
    return () => {
      isMounted = false;
    };
  }, [token]);

  useEffect(() => {
    return () => stopWebcam();
  }, []);

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
      const activeToken = token || localStorage.getItem("token");
      const res = await fetch("/api/picker/scan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${activeToken}`,
        },
        body: JSON.stringify({ imageBase64: base64Data }),
      });

      const data = await res.json();

      if (res.ok) {
        setResult(data);
        fetchHistory();

        if (data.status === "INVALID") {
          toastWarning(
            "Objek tidak dikenali",
            "Input bukan bahan makanan yang valid.",
          );
        } else if (data.verdict && !data.verdict.includes("FRESH")) {
          toastWarning(
            "Bahan kurang layak",
            `${data.itemName} — ${data.verdict}.`,
          );
        } else {
          toastSuccess(
            "Analisis selesai",
            `${data.itemName} berhasil dianalisis.`,
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
        console.error("Error konversi canvas:", err);
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

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!loading && !result && activeTab === "upload") {
      setIsDragging(true);
    }
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (loading || result || activeTab !== "upload") return;

    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const b64 = reader.result as string;
        setImagePreview(b64);
        setImageBase64(b64.split(",")[1]);
        toastSuccess("Gambar dimuat", "Bahan makanan terdeteksi lewat drop.");
      };
      reader.readAsDataURL(file);
    } else if (file) {
      toastError(
        "Format tidak didukung",
        "Silakan jatuhkan file berupa citra gambar.",
      );
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16 animate-fadeIn">
      <div className="border-b border-zinc-200 pb-5">
        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">
          Remix Picker
        </p>
        <h1 className="text-3xl font-black tracking-tight text-[#1A1A1A]">
          Penyortir Pangan AI
        </h1>
        <p className="text-xs text-zinc-500 mt-1 font-medium">
          AI Smart Grocery Selector &amp; Lifespan Maximizer
        </p>
      </div>

      <div className="w-full min-h-120 bg-white border border-zinc-200 rounded-3xl overflow-hidden relative shadow-xs flex flex-col justify-between">
        <AnimatePresence mode="wait">
          {!result && (
            <motion.div
              key="input-and-loading-state"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`flex-1 flex flex-col p-6 sm:px-6 sm:py-10 relative transition-colors duration-200 ${
                isDragging ? "bg-zinc-50/80" : ""
              }`}
            >
              {!loading && (
                <div className="flex p-1.5 bg-zinc-50 border border-zinc-200 rounded-2xl gap-1 max-w-md mx-auto w-full mb-8 z-20">
                  <button
                    type="button"
                    onClick={() => handleTabChange("upload")}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all duration-200 ${
                      activeTab === "upload"
                        ? "bg-[#eab308] text-black shadow-xs"
                        : "text-zinc-400 hover:text-zinc-600"
                    }`}
                  >
                    <Upload size={12} /> Unggah File
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTabChange("camera")}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all duration-200 ${
                      activeTab === "camera"
                        ? "bg-[#eab308] text-black shadow-xs"
                        : "text-zinc-400 hover:text-zinc-600"
                    }`}
                  >
                    <Camera size={12} /> Kamera Live
                  </button>
                </div>
              )}

              <div className="flex-1 flex flex-col items-center justify-center max-w-5xl mx-auto w-full relative">
                {imagePreview ? (
                  <div className="w-full max-w-2xl relative rounded-2xl overflow-hidden border border-zinc-200 shadow-xs z-20 flex items-center justify-center bg-zinc-50/50 p-2 min-h-75">
                    <Image
                      src={imagePreview}
                      alt="Target Analisis"
                      width={640}
                      height={450}
                      className="w-full h-auto max-h-112.5 object-contain rounded-xl"
                      unoptimized
                    />

                    {loading && (
                      <motion.div
                        className="absolute inset-x-2 h-0.5 bg-linear-to-r from-transparent via-[#EAB308] to-transparent shadow-[0_0_12px_#EAB308] z-30"
                        animate={{ top: ["4%", "94%", "4%"] }}
                        transition={{
                          duration: 2,
                          ease: "easeInOut",
                          repeat: Infinity,
                        }}
                      />
                    )}

                    {!loading && (
                      <>
                        <button
                          type="button"
                          onClick={handleResetSession}
                          className="absolute top-5 right-5 p-2 bg-white/95 backdrop-blur-xs hover:bg-white border border-zinc-200 text-zinc-500 hover:text-red-500 rounded-xl transition-all shadow-md cursor-pointer z-30"
                        >
                          <X size={14} strokeWidth={2.5} />
                        </button>
                        <div className="absolute bottom-5 left-5 right-5 bg-white/90 backdrop-blur-xs border border-zinc-200/60 px-3 py-2 rounded-xl text-left flex items-center justify-between z-30">
                          <span className="text-[10px] font-black uppercase tracking-wider text-zinc-700">
                            File Siap
                          </span>
                          <span className="text-[9px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-100">
                            Asli Bersih
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                ) : activeTab === "camera" ? (
                  isWebcamActive && (
                    <div className="relative rounded-2xl overflow-hidden border border-zinc-200 shadow-sm bg-zinc-950 h-auto">
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-120 h-120 object-contain"
                      />
                      <div className="absolute bottom-4 inset-x-0 flex justify-center gap-2 px-4 z-10">
                        <button
                          type="button"
                          onClick={handleCaptureAndScan}
                          className="flex-1 py-3 bg-[#EAB308] text-zinc-950 text-xs font-black uppercase tracking-wider rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all active:scale-98"
                        >
                          <Camera size={14} /> Ambil Foto &amp; Periksa
                        </button>
                        <button
                          type="button"
                          onClick={stopWebcam}
                          className="px-4 py-3 bg-white border border-zinc-200 text-zinc-700 text-xs font-bold rounded-xl transition shadow-xs"
                        >
                          Mati
                        </button>
                      </div>
                    </div>
                  )
                ) : (
                  /* FIKS: Mengubah padding py-16 menjadi py-20 atau menyesuaikan tinggi ruang kosong */
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
                      <h3 className="text-xs font-black text-[#1A1A1A] uppercase tracking-wider">
                        {isDragging
                          ? "Lepaskan Sekarang!"
                          : "Pilih atau Seret Foto"}
                      </h3>
                      <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
                        Semua Format Gambar Didukung (JPEG, PNG, WebP, dll)
                      </p>
                    </div>
                  </div>
                )}

                {imagePreview && !loading && (
                  <button
                    onClick={handleProcessUploadedImage}
                    className="w-full max-w-md mt-5 bg-[#1A1A1A] text-white font-black py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all text-[10px] uppercase tracking-widest shadow-xs active:scale-99"
                  >
                    <Upload size={13} /> Jalankan Inspeksi Bahan
                  </button>
                )}
              </div>
            </motion.div>
          )}

          {result && !loading && (
            <div className="space-y-6 flex-1 p-6 sm:p-10 animate-fadeIn max-w-4xl mx-auto w-full">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <span className="text-[10px] font-black tracking-wider uppercase text-zinc-400 block mb-1">
                    AI Verdict &amp; Analysis
                  </span>
                  <h2 className="text-2xl font-black text-[#1A1A1A] tracking-tight">
                    {result.itemName}
                  </h2>
                </div>
                <button
                  onClick={handleResetSession}
                  className="px-3 py-1.5 bg-zinc-50 border border-zinc-200 rounded-xl text-[10px] font-black uppercase tracking-wider hover:bg-zinc-100 transition flex items-center gap-1 text-zinc-600"
                >
                  <RefreshCw size={10} /> Pindai Baru
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                <div
                  className={`md:col-span-5 p-5 border rounded-2xl shadow-xs space-y-3 ${
                    result.verdict.includes("FRESH")
                      ? "bg-emerald-50/40 border-emerald-200/60"
                      : "bg-rose-50/40 border-rose-200/60"
                  }`}
                >
                  <div className="flex items-center gap-2 text-xs font-black">
                    <CheckCircle2
                      size={14}
                      className={
                        result.verdict.includes("FRESH")
                          ? "text-emerald-600"
                          : "text-rose-600"
                      }
                    />
                    <span
                      className={
                        result.verdict.includes("FRESH")
                          ? "text-emerald-800"
                          : "text-rose-800"
                      }
                    >
                      VERDICT: {result.verdict}
                    </span>
                  </div>
                  <ul className="text-xs text-zinc-600 font-medium list-disc pl-4 space-y-1.5 leading-relaxed">
                    {result.analysisDetails.map((detail, idx) => (
                      <li key={idx}>{detail}</li>
                    ))}
                    <li className="list-none pt-2 text-[11px] font-bold text-zinc-500">
                      ⌛ Rentang Kesegaran:{" "}
                      <span className="text-[#1A1A1A] font-black">
                        {result.expectedLifespan}
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="md:col-span-7 space-y-3 border border-zinc-100 rounded-2xl p-5 bg-zinc-50/20">
                  <div className="flex items-center gap-1.5 text-xs font-black text-[#1A1A1A]">
                    <Package size={14} />
                    <h3>INSTANT STORAGE BLUEPRINT:</h3>
                  </div>
                  <ul className="text-xs text-zinc-600 font-medium space-y-2.5 pl-1">
                    {result.storageBlueprint.map((blueprint, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2.5 leading-relaxed"
                      >
                        <span className="h-5 w-5 rounded-md bg-white border border-zinc-200 text-[10px] font-black flex items-center justify-center text-zinc-500 shrink-0 mt-0.5">
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

      <div className="bg-white border border-zinc-200 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-zinc-100 pb-3">
          <History size={15} className="text-zinc-700" />
          <h3 className="text-xs font-black text-[#1A1A1A] uppercase tracking-widest">
            Riwayat Inspeksi Pangan
          </h3>
        </div>

        {loadingHistory ? (
          <div className="py-6 text-center text-xs text-zinc-400">
            Memuat riwayat...
          </div>
        ) : history.length === 0 ? (
          <p className="text-xs text-zinc-400 py-4 text-center">
            Belum ada riwayat pemindaian bahan.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
            {history.map((item) => (
              <div
                key={item.id}
                onClick={() => setResult(item)}
                className="p-4 border border-zinc-200 hover:border-zinc-400 rounded-2xl bg-white hover:shadow-sm transition cursor-pointer flex flex-col justify-between gap-4 group animate-fadeIn"
              >
                <div className="space-y-1">
                  <div className="flex justify-between items-start gap-2">
                    <h4 className="text-xs font-black text-zinc-800 group-hover:text-amber-600 transition line-clamp-1">
                      {item.itemName}
                    </h4>
                    <span
                      className={`text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-md border shrink-0 ${
                        item.verdict.includes("FRESH")
                          ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                          : "bg-rose-50 text-rose-700 border-rose-100"
                      }`}
                    >
                      {item.verdict.includes("FRESH")
                        ? "FRESH"
                        : "Cari Yang Lain"}
                    </span>
                  </div>
                  <p className="text-[10px] text-zinc-400 font-medium line-clamp-1">
                    Blueprint: {item.storageBlueprint[0]}
                  </p>
                </div>

                <div className="flex items-center gap-1 text-[9px] text-zinc-400 font-bold border-t border-zinc-100 pt-2">
                  <Calendar size={10} />
                  {item.scannedAt
                    ? new Date(item.scannedAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : ""}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
