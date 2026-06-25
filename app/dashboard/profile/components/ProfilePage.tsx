"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { motion } from "framer-motion";
import { useToast } from "@/components/ui/Toast";
import PageLoader from "@/components/ui/PageLoader";
import { Button } from "@/components/ui/Button";

interface ProfileData {
  nickname: string;
  dailyBudgetTarget: number;
  medicalConditions: string[];
  allergies: string[];
}

export default function ProfilePage() {
  const { token } = useAuth();
  const { success: toastSuccess, error: toastError } = useToast();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState<ProfileData>({
    nickname: "",
    dailyBudgetTarget: 30000,
    medicalConditions: [],
    allergies: [],
  });

  const [newCondition, setNewCondition] = useState("");
  const [newAllergy, setNewAllergy] = useState("");

  useEffect(() => {
    let isMounted = true;
    const fetchProfile = async () => {
      const activeToken = token || localStorage.getItem("token");
      if (!activeToken) return;

      try {
        const res = await fetch("/api/user/profile", {
          headers: { Authorization: `Bearer ${activeToken}` },
        });
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.profile) {
            setFormData({
              nickname: data.profile.nickname || "",
              dailyBudgetTarget: data.profile.dailyBudgetTarget || 30000,
              medicalConditions: data.profile.medicalConditions || [],
              allergies: data.profile.allergies || [],
            });
          }
        }
      } catch (err) {
        console.error("Gagal memuat profil:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchProfile();
    return () => {
      isMounted = false;
    };
  }, [token]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const activeToken = token || localStorage.getItem("token");

    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${activeToken}`,
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toastSuccess(
          "Profil diperbarui!",
          "Data profil Foodremix berhasil disimpan.",
        );
      } else {
        const errData = await res.json();
        toastError(
          "Gagal menyimpan",
          errData.error || "Gagal memperbarui profil.",
        );
      }
    } catch (err) {
      console.error(err);
      toastError("Gangguan koneksi", "Tidak dapat terhubung ke server.");
    } finally {
      setSubmitting(false);
    }
  };

  const addCondition = () => {
    if (
      newCondition.trim() &&
      !formData.medicalConditions.includes(newCondition.trim().toLowerCase())
    ) {
      setFormData({
        ...formData,
        medicalConditions: [
          ...formData.medicalConditions,
          newCondition.trim().toLowerCase(),
        ],
      });
      setNewCondition("");
    }
  };

  const removeCondition = (indexToRemove: number) => {
    setFormData({
      ...formData,
      medicalConditions: formData.medicalConditions.filter(
        (_, i) => i !== indexToRemove,
      ),
    });
  };

  const addAllergy = () => {
    if (
      newAllergy.trim() &&
      !formData.allergies.includes(newAllergy.trim().toLowerCase())
    ) {
      setFormData({
        ...formData,
        allergies: [...formData.allergies, newAllergy.trim().toLowerCase()],
      });
      setNewAllergy("");
    }
  };

  const removeAllergy = (indexToRemove: number) => {
    setFormData({
      ...formData,
      allergies: formData.allergies.filter((_, i) => i !== indexToRemove),
    });
  };

  if (loading) {
    return <PageLoader variant="section" message="Memuat profil..." />;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-16">
      <div className="border-b border-zinc-200 pb-5">
        <h1 className="text-2xl font-black tracking-tight text-[#1A1A1A]">
          Profil Pengguna
        </h1>
        <p className="text-xs text-zinc-500">
          Konfigurasi batas proteksi medis dan preferensi gizi personal Anda.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <form
          onSubmit={handleSaveProfile}
          className="lg:col-span-7 bg-white border border-zinc-200/80 rounded-3xl p-6 shadow-sm space-y-6"
        >
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 bg-zinc-100 border border-zinc-200 rounded-2xl flex items-center justify-center text-[#1A1A1A] font-black text-lg">
              {formData.nickname
                ? formData.nickname.charAt(0).toUpperCase()
                : "U"}
            </div>
            <div>
              <h3 className="text-sm font-black text-[#1A1A1A]">
                Informasi Dasar
              </h3>
              <p className="text-[11px] text-zinc-400">
                Data profil diselaraskan untuk personalisasi akurasi mesin AI.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold tracking-wide uppercase text-zinc-400">
                Nama Panggilan (Nickname)
              </label>
              <input
                type="text"
                value={formData.nickname}
                onChange={(e) =>
                  setFormData({ ...formData, nickname: e.target.value })
                }
                className="w-full px-4 py-2.5 text-xs bg-zinc-50 border border-zinc-200 text-[#1A1A1A] rounded-xl outline-none focus:border-zinc-400 transition"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold tracking-wide uppercase text-zinc-400">
                Target Anggaran Harian (Rp)
              </label>
              <input
                type="number"
                value={formData.dailyBudgetTarget}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    dailyBudgetTarget: Number(e.target.value),
                  })
                }
                className="w-full px-4 py-2.5 text-xs bg-zinc-50 border border-zinc-200 text-[#1A1A1A] rounded-xl outline-none focus:border-zinc-400 transition"
                required
              />
            </div>
          </div>

          <div className="space-y-2 border-t border-zinc-100 pt-4">
            <label className="text-[10px] font-bold tracking-wide uppercase text-zinc-400 block">
              Proteksi Medis (Riwayat Penyakit)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newCondition}
                onChange={(e) => setNewCondition(e.target.value)}
                placeholder="Tambah penyakit (cth: maag)"
                className="flex-1 px-4 py-2.5 text-xs bg-zinc-50 border border-zinc-200 text-[#1A1A1A] rounded-xl outline-none"
                onKeyDown={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addCondition())
                }
              />
              <Button
                type="button"
                onClick={addCondition}
                variant="accent"
                size="sm"
              >
                Tambah
              </Button>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {formData.medicalConditions.map((condition, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-sky-50 border border-sky-100 text-sky-800 text-[11px] font-bold rounded-lg uppercase"
                >
                  {condition}
                  <Button
                    type="button"
                    onClick={() => removeCondition(index)}
                    variant="primary"
                    className="px-1! py-0.5! text-sky-400 hover:text-sky-700 shadow-none !uppercase-normal"
                  >
                    ×
                  </Button>
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-2 border-t border-zinc-100 pt-4">
            <label className="text-[10px] font-bold tracking-wide uppercase text-zinc-400 block">
              Alergi Makanan Aktif
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newAllergy}
                onChange={(e) => setNewAllergy(e.target.value)}
                placeholder="Tambah alergi (cth: seafood)"
                className="flex-1 px-4 py-2.5 text-xs bg-zinc-50 border border-zinc-200 text-[#1A1A1A] rounded-xl outline-none"
                onKeyDown={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addAllergy())
                }
              />
              <Button
                type="button"
                onClick={addAllergy}
                variant="accent"
                size="sm"
              >
                Tambah
              </Button>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {formData.allergies.map((allergy, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 border border-amber-100 text-amber-800 text-[11px] font-bold rounded-lg uppercase"
                >
                  {allergy}
                  <Button
                    type="button"
                    onClick={() => removeAllergy(index)}
                    variant="primary"
                    className="px-1! py-0.5! text-amber-400 hover:text-amber-700 shadow-none !uppercase-normal"
                  >
                    ×
                  </Button>
                </span>
              ))}
            </div>
          </div>

          <div className="flex justify-end border-t border-zinc-100 pt-4">
            <Button type="submit" loading={submitting} variant="accent">
              {submitting ? "Menyimpan..." : "Simpan Profil"}
            </Button>
          </div>
        </form>

        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-zinc-200/80 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-black text-[#1A1A1A] tracking-tight">
              Status Guard Foodremix
            </h3>
            <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100 space-y-3">
              <div className="flex justify-between text-xs">
                <span className="font-bold text-zinc-500">
                  Batas Hemat Harian
                </span>
                <span className="font-black text-emerald-600">
                  Rp {formData.dailyBudgetTarget.toLocaleString("id-ID")}
                </span>
              </div>
              <div className="h-2 bg-zinc-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  className="h-full bg-emerald-500 rounded-full"
                />
              </div>
            </div>
            <div className="text-xs text-zinc-500 leading-relaxed font-medium">
              Sistem AI Jurnal Kesehatan akan otomatis menyaring dan memotong
              nilai skor kesehatan (*healthScore*) jika Anda mencatat makanan
              yang melanggar{" "}
              <span className="font-bold text-zinc-700">
                {formData.medicalConditions.length} pantangan medis
              </span>{" "}
              atau{" "}
              <span className="font-bold text-zinc-700">
                {formData.allergies.length} jenis alergi
              </span>{" "}
              yang telah didaftarkan.
            </div>
          </div>

          <div className="bg-[#1A1A1A] text-white rounded-3xl p-6 shadow-md">
            <span className="text-[10px] font-black tracking-widest uppercase text-zinc-400 block">
              Proteksi Hulu
            </span>
            <h4 className="text-sm font-black mt-1 mb-2">
              Remix Picker Active
            </h4>
            <p className="text-xs text-zinc-300 leading-relaxed font-normal">
              Aplikasi berjalan dalam mode penuh{" "}
              <span className="font-bold text-white">
                Single-Player Optimizer
              </span>
              . Fitur analisis pangan akan menyesuaikan parameter rekomendasi
              penyimpanan langsung dari kecerdasan lokal multimodal AI.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
