"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { motion } from "framer-motion";

interface ProfileData {
  nickname: string;
  dailyBudgetTarget: number;
  medicalConditions: string[];
  allergies: string[];
  generalLocation: string;
  latitude: number | null;
  longitude: number | null;
}

export default function ProfilePage() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [locating, setLocating] = useState(false); // Loading khusus deteksi GPS
  const [message, setMessage] = useState({ type: "", text: "" });

  const [formData, setFormData] = useState<ProfileData>({
    nickname: "",
    dailyBudgetTarget: 30000,
    medicalConditions: [],
    allergies: [],
    generalLocation: "",
    latitude: null,
    longitude: null,
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
              generalLocation: data.profile.generalLocation || "",
              latitude: data.profile.latitude || null,
              longitude: data.profile.longitude || null,
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

  // Fungsi Proteksi Lokasi: Mengambil GPS Perangkat & Mengubah menjadi Teks Wilayah Baku
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setMessage({
        type: "error",
        text: "Browser Anda tidak mendukung deteksi lokasi GPS.",
      });
      return;
    }

    setLocating(true);
    setMessage({ type: "", text: "" });

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          // Reverse Geocoding gratis menggunakan Nominatim OpenStreetMap API
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=14&addressdetails=1`,
          );

          if (response.ok) {
            const geoData = await response.json();
            // Ambil nama kecamatan/kota/desa yang human-readable
            const displayName = geoData.display_name
              .split(",")
              .slice(0, 3)
              .join(",")
              .trim();

            setFormData((prev) => ({
              ...prev,
              latitude,
              longitude,
              generalLocation:
                displayName ||
                `Koordinat: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
            }));
            setMessage({
              type: "success",
              text: "Lokasi GPS berhasil disinkronkan!",
            });
          } else {
            // Fallback jika API Geocode sibuk
            setFormData((prev) => ({ ...prev, latitude, longitude }));
          }
        } catch (err) {
          console.error("Reverse geocode error:", err);
        } finally {
          setLocating(false);
        }
      },
      (error) => {
        setLocating(false);
        setMessage({
          type: "error",
          text: "Gagal mendeteksi lokasi. Pastikan izin GPS di browser Anda aktif.",
        });
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validasi Akhir sebelum dikirim ke database
    if (!formData.latitude || !formData.longitude) {
      setMessage({
        type: "error",
        text: "Gagal menyimpan. Harap klik tombol deteksi lokasi terlebih dahulu untuk mengunci koordinat Remix Share yang valid!",
      });
      return;
    }

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
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setMessage({
          type: "success",
          text: "Profil Foodremix berhasil diperbarui!",
        });
      } else {
        const errData = await res.json();
        setMessage({
          type: "error",
          text: errData.error || "Gagal memperbarui profil.",
        });
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "Gangguan koneksi server." });
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
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-3">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-zinc-300 border-t-[#1A1A1A]" />
        <p className="text-xs font-semibold text-zinc-400">
          Sinkronisasi data profil Foodremix...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-16">
      <div className="border-b border-zinc-200 pb-5">
        <h1 className="text-2xl font-black tracking-tight text-[#1A1A1A]">
          Profil Pengguna
        </h1>
        <p className="text-xs text-zinc-500">
          Konfigurasi batas proteksi medis dan lokasi presisi untuk fitur Remix
          Share.
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
                Informasi Dasar & Lokasi
              </h3>
              <p className="text-[11px] text-zinc-400">
                Data koordinat GPS dikunci rapat demi akurasi jarak patungan
                pangan.
              </p>
            </div>
          </div>

          {message.text && (
            <div
              className={`p-3 border text-xs font-semibold rounded-xl ${
                message.type === "success"
                  ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                  : "bg-rose-50 border-rose-200 text-rose-800"
              }`}
            >
              {message.text}
            </div>
          )}

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

          {/* DENGAN VALIDASI DETEKSI LOKASI GPS BAKU */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold tracking-wide uppercase text-zinc-400 block">
              Wilayah Tempat Tinggal (General Location)
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={formData.generalLocation}
                readOnly
                placeholder="Klik tombol disamping untuk sinkronisasi lokasi..."
                className="flex-1 px-4 py-2.5 text-xs bg-zinc-100 border border-zinc-200 text-zinc-600 rounded-xl outline-none cursor-not-allowed"
                required
              />
              <button
                type="button"
                onClick={handleDetectLocation}
                disabled={locating}
                className="px-4 py-2.5 bg-zinc-100 border border-zinc-300 text-zinc-700 text-xs font-bold rounded-xl hover:bg-zinc-200 transition flex items-center justify-center gap-2 shrink-0 disabled:opacity-50"
              >
                <svg
                  className={`h-4 w-4 text-zinc-600 ${locating ? "animate-spin" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                {locating ? "Mencari GPS..." : "Deteksi Lokasi"}
              </button>
            </div>

            {/* Indikator tersembunyi penanda validitas data koordinat */}
            {formData.latitude && formData.longitude && (
              <p className="text-[10px] font-bold text-emerald-600 flex items-center gap-1 mt-1">
                ✓ Koordinat Terkunci: [{formData.latitude.toFixed(5)},{" "}
                {formData.longitude.toFixed(5)}]
              </p>
            )}
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
              <button
                type="button"
                onClick={addCondition}
                className="px-4 py-2 bg-[#1A1A1A] text-white text-xs font-bold rounded-xl hover:bg-zinc-800"
              >
                Tambah
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {formData.medicalConditions.map((condition, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-sky-50 border border-sky-100 text-sky-800 text-[11px] font-bold rounded-lg uppercase"
                >
                  {condition}
                  <button
                    type="button"
                    onClick={() => removeCondition(index)}
                    className="text-sky-400 hover:text-sky-700 font-bold"
                  >
                    ×
                  </button>
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
              <button
                type="button"
                onClick={addAllergy}
                className="px-4 py-2 bg-[#1A1A1A] text-white text-xs font-bold rounded-xl hover:bg-zinc-800"
              >
                Tambah
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {formData.allergies.map((allergy, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 border border-amber-100 text-amber-800 text-[11px] font-bold rounded-lg uppercase"
                >
                  {allergy}
                  <button
                    type="button"
                    onClick={() => removeAllergy(index)}
                    className="text-amber-400 hover:text-amber-700 font-bold"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="flex justify-end border-t border-zinc-100 pt-4">
            <button
              type="submit"
              disabled={submitting || locating}
              className="px-5 py-2.5 bg-[#1A1A1A] text-white text-xs font-bold rounded-xl hover:bg-zinc-800 transition disabled:opacity-50"
            >
              {submitting ? "Menyimpan..." : "Simpan Profil"}
            </button>
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
              yang telah Anda daftarkan.
            </div>
          </div>

          <div className="bg-[#1A1A1A] text-white rounded-3xl p-6 shadow-md relative overflow-hidden">
            <span className="text-[10px] font-black tracking-widest uppercase text-zinc-400 block">
              Jangkauan Komunitas
            </span>
            <h4 className="text-sm font-black mt-1 mb-2">Lokasi P2P Aktif</h4>
            <p className="text-xs text-zinc-300 leading-relaxed font-normal">
              Saat ini profil Anda terdaftar di area{" "}
              <span className="text-amber-400 font-bold">
                {formData.generalLocation || "Belum ditentukan"}
              </span>
              . Anda dapat berpartisipasi membagikan bahan pangan berlebih atau
              patungan belanja dengan pengguna lain di sekitar radius wilayah
              ini.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
