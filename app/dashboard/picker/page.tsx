"use client";

import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { motion } from "framer-motion";
import {
  Camera,
  Upload,
  RefreshCw,
  CheckCircle2,
  Package,
  History,
  Calendar,
} from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import PageLoader from "@/components/ui/PageLoader";

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

  const [isWebcamActive, setIsWebcamActive] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [history, setHistory] = useState<ScanResult[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

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
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  const startWebcam = async () => {
    setResult(null);
    setImagePreview(null);
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
    } catch (err) {
      console.error(err);
      setIsWebcamActive(false);
      toastError(
        "Kamera tidak dapat diakses",
        "Izin kamera ditolak atau perangkat tidak mendukung webcam.",
      );
    }
  };

  const stopWebcam = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setIsWebcamActive(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    stopWebcam();
    setResult(null);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
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
            "Input bukan bahan makanan yang valid. Coba foto yang lebih jelas.",
          );
        } else if (data.verdict && !data.verdict.includes("FRESH")) {
          toastWarning(
            "Bahan kurang layak",
            `${data.itemName} — ${data.verdict}. Pertimbangkan alternatif lain.`,
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
    if (!videoRef.current || !canvasRef.current || loading) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      const size = Math.min(video.videoWidth, video.videoHeight) || 480;
      canvas.width = size;
      canvas.height = size;
      const sx = (video.videoWidth - size) / 2;
      const sy = (video.videoHeight - size) / 2;
      ctx.drawImage(video, sx, sy, size, size, 0, 0, size, size);
      const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
      setImagePreview(dataUrl);
      stopWebcam();
      await executeAnalysis(dataUrl);
    }
  };

  const handleProcessUploadedImage = async () => {
    if (!imagePreview || loading) return;
    await executeAnalysis(imagePreview);
  };

  const handleResetSession = () => {
    setImagePreview(null);
    setResult(null);
    stopWebcam();
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-16">
      <div className="border-b border-zinc-200 pb-5">
        <h1 className="text-2xl font-black tracking-tight text-[#1A1A1A]">
          Remix Picker
        </h1>
        <p className="text-xs text-zinc-500">
          AI Smart Grocery Selector &amp; Lifespan Maximizer
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-6 bg-white border border-zinc-200/80 rounded-3xl p-5 shadow-sm space-y-4">
          <span className="text-[10px] font-black tracking-wider uppercase text-zinc-400 block">
            Media Selector
          </span>

          <div className="relative w-full aspect-square bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-200 shadow-inner flex items-center justify-center">
            {isWebcamActive && !imagePreview ? (
              <div className="relative w-full h-full">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-zinc-900/60 backdrop-blur-md border border-white/20 rounded-full text-[10px] font-bold text-white tracking-widest uppercase flex items-center gap-1.5 z-10">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  Live Feed
                </div>
                <div className="absolute bottom-4 inset-x-0 flex justify-center gap-2 px-4 z-10">
                  <button
                    type="button"
                    onClick={handleCaptureAndScan}
                    className="px-4 py-2 bg-[#EAB308] hover:bg-[#F3C022] text-[#1A1A1A] text-[10px] font-black uppercase tracking-wider rounded-xl transition shadow-lg flex items-center gap-1.5"
                  >
                    <Camera size={12} /> Ambil Foto &amp; Pindai
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
              <div className="relative w-full h-full">
                <img
                  src={imagePreview}
                  alt="Review Target"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={handleResetSession}
                  className="absolute top-4 right-4 p-2 bg-zinc-950/80 border border-zinc-800 rounded-xl text-white text-xs font-bold hover:bg-zinc-900 transition flex items-center gap-1"
                >
                  <RefreshCw size={12} /> Ulangi
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 w-full h-full p-4">
                <button
                  type="button"
                  onClick={startWebcam}
                  disabled={loading}
                  className="flex flex-col items-center justify-center gap-2 text-zinc-500 hover:text-zinc-400 border border-dashed border-zinc-800 rounded-2xl transition group"
                >
                  <Camera
                    size={24}
                    className="group-hover:scale-105 transition text-zinc-600 group-hover:text-zinc-400"
                  />
                  <span className="text-[10px] font-black uppercase tracking-wider">
                    Gunakan Kamera
                  </span>
                </button>

                <label className="flex flex-col items-center justify-center gap-2 text-zinc-500 hover:text-zinc-400 border border-dashed border-zinc-800 rounded-2xl transition cursor-pointer group">
                  <Upload
                    size={24}
                    className="group-hover:scale-105 transition text-zinc-600 group-hover:text-zinc-400"
                  />
                  <span className="text-[10px] font-black uppercase tracking-wider">
                    Unggah File
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    disabled={loading}
                  />
                </label>
              </div>
            )}

            <canvas ref={canvasRef} className="hidden" />

            {loading && (
              <motion.div
                initial={{ top: "0%" }}
                animate={{ top: "100%" }}
                transition={{
                  repeat: Infinity,
                  duration: 1.5,
                  ease: "easeInOut",
                  repeatType: "reverse",
                }}
                className="absolute left-0 right-0 h-0.5 bg-[#eab308] shadow-[0_0_10px_#eab308] z-10"
              />
            )}
          </div>

          <p className="text-center text-[11px] font-medium text-zinc-400">
            Pilih opsi kamera instan atau unggah foto komoditas pangan pasar.
          </p>

          {imagePreview && !result && (
            <div className="pt-2">
              <button
                onClick={handleProcessUploadedImage}
                disabled={loading}
                className="w-full py-3 bg-[#1A1A1A] text-white font-bold text-xs rounded-xl hover:bg-zinc-800 transition shadow-sm flex items-center justify-center gap-2"
              >
                <Upload size={13} /> Analisis Dokumen Gambar Berkas
              </button>
            </div>
          )}
        </div>

        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white border border-zinc-200/80 rounded-3xl p-6 shadow-sm space-y-6 min-h-[400px] flex flex-col justify-between">
            {!result && !loading && (
              <div className="flex flex-col items-center justify-center text-center my-auto space-y-3 text-zinc-400 py-12">
                <div className="w-12 h-12 bg-zinc-50 border border-zinc-200 rounded-2xl flex items-center justify-center text-zinc-600">
                  <Package size={20} />
                </div>
                <h4 className="text-xs font-bold text-zinc-700">
                  Mesin Analisis Siap
                </h4>
                <p className="text-[11px] max-w-xs leading-relaxed">
                  Ambil foto bahan pangan mentah di pasar untuk melihat
                  keputusan kelayakan gizi dan blueprint masa simpannya.
                </p>
              </div>
            )}

            {loading && !result && (
              <PageLoader variant="inline" message="Menganalisis bahan..." />
            )}

            {result && (
              <div className="space-y-6 flex-1">
                <div>
                  <span className="text-[10px] font-black tracking-wider uppercase text-zinc-400 block mb-1">
                    AI Verdict &amp; Analysis
                  </span>
                  <h2 className="text-lg font-black text-[#1A1A1A] tracking-tight">
                    {result.itemName}
                  </h2>
                </div>

                <div
                  className={`p-4 border rounded-2xl shadow-sm space-y-3 ${result.verdict.includes("FRESH") ? "bg-emerald-50/50 border-emerald-200/60" : "bg-rose-50/40 border-rose-200/60"}`}
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
                    <li className="list-none pt-1 text-[11px] font-bold text-zinc-500">
                      ⌛ Rentang Ekspektasi:{" "}
                      <span className="text-[#1A1A1A] font-black">
                        {result.expectedLifespan}
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="space-y-2 pt-2 border-t border-zinc-100">
                  <div className="flex items-center gap-1.5 text-xs font-black text-[#1A1A1A]">
                    <Package size={14} />
                    <h3>INSTANT STORAGE BLUEPRINT:</h3>
                  </div>
                  <ul className="text-xs text-zinc-600 font-medium list-none space-y-2 pl-1 pt-1">
                    {result.storageBlueprint.map((blueprint, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2.5 leading-relaxed"
                      >
                        <span className="h-5 w-5 rounded-md bg-zinc-100 border border-zinc-200 text-[10px] font-black flex items-center justify-center text-zinc-500 shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span>{blueprint}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-zinc-100 flex items-center justify-between text-[10px] font-bold text-zinc-400">
              <span>SECURITY LOG: ATOM-ENCRYPTED</span>
              <span>SINGLE-PLAYER MODE</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-zinc-200/80 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-zinc-100 pb-3">
          <History size={16} className="text-zinc-700" />
          <h3 className="text-sm font-black text-[#1A1A1A] uppercase tracking-wider">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {history.map((item) => (
              <div
                key={item.id}
                onClick={() => setResult(item)}
                className="p-4 border border-zinc-100 hover:border-zinc-300 rounded-2xl bg-zinc-50/50 hover:bg-zinc-50 transition cursor-pointer flex justify-between items-start group"
              >
                <div className="space-y-1">
                  <h4 className="text-xs font-black text-zinc-800 group-hover:text-amber-600 transition">
                    {item.itemName}
                  </h4>
                  <div className="flex items-center gap-1 text-[10px] text-zinc-400 font-medium">
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
                  <p className="text-[11px] text-zinc-500 line-clamp-1 mt-1">
                    Blueprint: {item.storageBlueprint[0]}
                  </p>
                </div>
                <span
                  className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border ${item.verdict.includes("FRESH") ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-rose-50 text-rose-700 border-rose-200"}`}
                >
                  {item.verdict.includes("FRESH") ? "FRESH" : "REJECTED"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
