"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import LocationMap from "@/components/LocationMap";
import { motion, AnimatePresence } from "framer-motion";

export default function EditProfilePage() {
  const router = useRouter();
  const { token, checkAuth } = useAuth();

  const [nickname, setNickname] = useState("");
  const [dailyBudgetTarget, setDailyBudgetTarget] = useState("30000");
  const [generalLocation, setGeneralLocation] = useState("");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);

  const [medicalInput, setMedicalInput] = useState("");
  const [medicalConditions, setMedicalConditions] = useState<string[]>([]);

  const [allergyInput, setAllergyInput] = useState("");
  const [allergies, setAllergies] = useState<string[]>([]);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    async function loadProfile() {
      try {
        const activeToken = token || localStorage.getItem("token");
        const res = await fetch("/api/user/profile", {
          headers: { Authorization: `Bearer ${activeToken}` },
        });
        if (res.ok) {
          const data = await res.json();

          // Failsafe: Mengamankan data dari nilai null jika record profile belum dibuat
          const safeData = data || {};

          setNickname(safeData.nickname || "");
          setDailyBudgetTarget(String(safeData.dailyBudgetTarget || 30000));
          setGeneralLocation(safeData.generalLocation || "");
          setLatitude(safeData.latitude || null);
          setLongitude(safeData.longitude || null);
          setMedicalConditions(safeData.medicalConditions || []);
          setAllergies(safeData.allergies || []);
        }
      } catch (err) {
        console.error("Gagal memuat profil:", err);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, [token]);

  const handleAddMedical = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && medicalInput.trim()) {
      e.preventDefault();
      if (!medicalConditions.includes(medicalInput.trim().toLowerCase())) {
        setMedicalConditions([
          ...medicalConditions,
          medicalInput.trim().toLowerCase(),
        ]);
      }
      setMedicalInput("");
    }
  };

  const handleRemoveMedical = (index: number) => {
    setMedicalConditions(medicalConditions.filter((_, i) => i !== index));
  };

  const handleAddAllergy = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && allergyInput.trim()) {
      e.preventDefault();
      if (!allergies.includes(allergyInput.trim().toLowerCase())) {
        setAllergies([...allergies, allergyInput.trim().toLowerCase()]);
      }
      setAllergyInput("");
    }
  };

  const handleRemoveAllergy = (index: number) => {
    setAllergies(allergies.filter((_, i) => i !== index));
  };

  const handleLocationSelect = (lat: number, lng: number, name: string) => {
    setLatitude(lat);
    setLongitude(lng);
    setGeneralLocation(name);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage({ type: "", text: "" });

    const activeToken = token || localStorage.getItem("token");

    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${activeToken}`,
        },
        body: JSON.stringify({
          nickname,
          dailyBudgetTarget,
          medicalConditions,
          allergies,
          generalLocation,
          latitude,
          longitude,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({
          type: "success",
          text: "Profil personalisasi berhasil disimpan!",
        });

        const localUser = localStorage.getItem("user");
        if (localUser) {
          const parsed = JSON.parse(localUser);
          parsed.userProfile = data.userProfile;
          localStorage.setItem("user", JSON.stringify(parsed));
        }

        if (checkAuth) await checkAuth();

        setTimeout(() => {
          router.push("/dashboard");
          window.location.reload();
        }, 1200);
      } else {
        setMessage({
          type: "error",
          text: data.error || "Gagal memperbarui profil.",
        });
      }
    } catch {
      setMessage({ type: "error", text: "Terjadi kesalahan koneksi server." });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-300 border-t-[#1A1A1A]" />
        <p className="text-xs font-medium text-zinc-400">
          Menyusun konfigurasi personalisasi...
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="max-w-4xl mx-auto space-y-8 pb-12"
    >
      <div className="flex flex-col gap-1 border-b border-zinc-200 pb-5">
        <h1 className="text-3xl font-bold tracking-tight text-[#1A1A1A]">
          Personalisasi Akun
        </h1>
        <p className="text-sm text-zinc-500">
          Sesuaikan regulasi medis, target penghematan kantong, dan penyesuaian
          sharelock P2P kamu.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {message.text && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`p-4 rounded-2xl text-xs font-semibold border backdrop-blur-sm flex items-center gap-2.5 ${
              message.type === "success"
                ? "bg-emerald-50/80 border-emerald-200 text-emerald-800"
                : "bg-rose-50/80 border-rose-200 text-rose-800"
            }`}
          >
            <span>{message.type === "success" ? "✨" : "⚠️"}</span>
            {message.text}
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white rounded-3xl border border-zinc-200/80 p-6 sm:p-8 shadow-sm space-y-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-xs font-bold tracking-wide uppercase text-zinc-500">
                Nama Panggilan
              </label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="w-full px-4 py-3 text-sm bg-zinc-50/80 border border-zinc-200 text-[#1A1A1A] rounded-2xl outline-none transition-all duration-200 focus:bg-white focus:ring-2 focus:ring-[#EAB308]/30 focus:border-[#EAB308]"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold tracking-wide uppercase text-zinc-500">
                Target Belanja Harian (Rp)
              </label>
              <input
                type="number"
                value={dailyBudgetTarget}
                onChange={(e) => setDailyBudgetTarget(e.target.value)}
                className="w-full px-4 py-3 text-sm bg-zinc-50/80 border border-zinc-200 text-[#1A1A1A] rounded-2xl outline-none transition-all duration-200 focus:bg-white focus:ring-2 focus:ring-[#EAB308]/30 focus:border-[#EAB308]"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 pt-2 border-t border-zinc-100">
            <div className="space-y-2">
              <label className="text-xs font-bold tracking-wide uppercase text-zinc-500">
                Kondisi Medis / Penyakit
              </label>
              <input
                type="text"
                value={medicalInput}
                onChange={(e) => setMedicalInput(e.target.value)}
                onKeyDown={handleAddMedical}
                placeholder="Ketik lalu tekan Enter..."
                className="w-full px-4 py-3 text-sm bg-zinc-50/80 border border-zinc-200 text-[#1A1A1A] rounded-2xl outline-none transition-all duration-200 focus:bg-white focus:ring-2 focus:ring-[#EAB308]/30 focus:border-[#EAB308]"
              />
              <div className="flex flex-wrap gap-1.5 pt-2">
                <AnimatePresence>
                  {medicalConditions.map((condition, idx) => (
                    <motion.span
                      key={condition}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-zinc-100 text-zinc-800 text-xs font-semibold rounded-xl border border-zinc-200/50"
                    >
                      {condition}
                      <button
                        type="button"
                        onClick={() => handleRemoveMedical(idx)}
                        className="text-zinc-400 hover:text-rose-500 text-sm font-bold transition-colors"
                      >
                        ✕
                      </button>
                    </motion.span>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold tracking-wide uppercase text-zinc-500">
                Alergi Makanan
              </label>
              <input
                type="text"
                value={allergyInput}
                onChange={(e) => setAllergyInput(e.target.value)}
                onKeyDown={handleAddAllergy}
                placeholder="Ketik lalu tekan Enter..."
                className="w-full px-4 py-3 text-sm bg-zinc-50/80 border border-zinc-200 text-[#1A1A1A] rounded-2xl outline-none transition-all duration-200 focus:bg-white focus:ring-2 focus:ring-[#EAB308]/30 focus:border-[#EAB308]"
              />
              <div className="flex flex-wrap gap-1.5 pt-2">
                <AnimatePresence>
                  {allergies.map((allergy, idx) => (
                    <motion.span
                      key={allergy}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#EAB308]/10 text-[#bc9003] text-xs font-semibold rounded-xl border border-[#EAB308]/20"
                    >
                      {allergy}
                      <button
                        type="button"
                        onClick={() => handleRemoveAllergy(idx)}
                        className="text-[#EAB308] hover:text-rose-500 text-sm font-bold transition-colors"
                      >
                        ✕
                      </button>
                    </motion.span>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-zinc-200/80 p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold tracking-wide uppercase text-zinc-500">
              Titik Penyelarasan Peta P2P
            </label>
            <p className="text-xs text-zinc-400">
              Tentukan cakupan wilayah pembagian makanan. Koordinat akurat
              menjamin validasi radius P2P yang efisien.
            </p>
          </div>

          <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200 text-xs font-medium text-zinc-600 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 overflow-hidden">
              <span className="text-base shrink-0">📍</span>
              <span className="truncate">
                {generalLocation || "Belum ada koordinat tersemat"}
              </span>
            </div>
            {latitude && longitude && (
              <span className="text-[10px] font-mono shrink-0 bg-zinc-200 px-2.5 py-1 rounded-lg text-zinc-700">
                {latitude.toFixed(4)}, {longitude.toFixed(4)}
              </span>
            )}
          </div>

          <div className="border border-zinc-200/80 rounded-2xl overflow-hidden shadow-inner h-[320px]">
            <LocationMap
              onSelectLocation={handleLocationSelect}
              initialLat={latitude}
              initialLng={longitude}
            />
          </div>
        </div>

        <div className="flex justify-end items-center gap-3">
          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="px-6 py-3 text-sm font-bold text-zinc-500 hover:bg-zinc-200/60 rounded-2xl transition-colors duration-200"
            disabled={submitting}
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-7 py-3 text-sm font-bold bg-[#1A1A1A] text-white hover:bg-zinc-800 rounded-2xl transition-all duration-200 disabled:opacity-50 shadow-sm"
          >
            {submitting ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </div>
      </form>
    </motion.div>
  );
}
