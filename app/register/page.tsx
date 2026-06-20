"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/hooks/useAuth";
import dynamic from "next/dynamic";

// Lazy load map component
const LocationMap = dynamic(() => import("@/components/LocationMap"), {
  ssr: false,
});

export default function RegisterPage() {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);

  // Account fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");

  // Profile fields
  const [nickname, setNickname] = useState("");
  const [dailyBudgetTarget, setDailyBudgetTarget] = useState("30000");
  const [medicalConditions, setMedicalConditions] = useState("");
  const [allergies, setAllergies] = useState("");
  const [generalLocation, setGeneralLocation] = useState("");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);

  // UI states
  const [error, setError] = useState("");
  const [showMap, setShowMap] = useState(false);
  const [locatingGeolocation, setLocatingGeolocation] = useState(false);

  // Redirect ke dashboard jika sudah login
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, authLoading, router]);

  // Auto-detect lokasi sekarang dengan optimasi string wilayah Foodremix
  const handleAutoDetectLocation = async () => {
    setLocatingGeolocation(true);
    setError("");

    if (!navigator.geolocation) {
      setError("Browser Anda tidak mendukung deteksi lokasi GPS.");
      setLocatingGeolocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude: lat, longitude: lng } = position.coords;
        setLatitude(lat);
        setLongitude(lng);

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=14&addressdetails=1`,
          );
          const data = await response.json();

          // Memecah komponen alamat agar menghasilkan format string daerah yang rapi
          if (data.display_name) {
            const displayName = data.display_name
              .split(",")
              .slice(0, 3)
              .join(",")
              .trim();
            setGeneralLocation(displayName);
          } else {
            const locationName =
              data.address?.suburb ||
              data.address?.town ||
              data.address?.city ||
              `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
            setGeneralLocation(locationName);
          }
        } catch (err) {
          setGeneralLocation(`${lat.toFixed(4)}, ${lng.toFixed(4)}`);
        } finally {
          setLocatingGeolocation(false);
        }
      },
      (err) => {
        setError(
          `Gagal mengunci GPS: ${err.message}. Silakan pilih lewat peta.`,
        );
        setLocatingGeolocation(false);
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  // Handle map location select
  const handleMapSelect = (lat: number, lng: number, name: string) => {
    setLatitude(lat);
    setLongitude(lng);
    setGeneralLocation(name);
    setShowMap(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password || !name || !nickname || !generalLocation) {
      setError(
        "Nama, email, nickname, lokasi, dan password harus diisi lengkap.",
      );
      return;
    }

    if (password.length < 6) {
      setError("Password minimal harus 6 karakter.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Konfirmasi password tidak cocok.");
      return;
    }

    // Proteksi Akhir: Validasi ketersediaan data koordinat demi Remix Share
    if (!latitude || !longitude) {
      setError(
        "Harap klik tombol 'Auto' atau 'Peta' untuk mengunci koordinat lokasi Anda.",
      );
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          name,
          nickname,
          dailyBudgetTarget: parseFloat(dailyBudgetTarget),
          medicalConditions: medicalConditions
            .split(",")
            .map((c) => c.trim().toLowerCase())
            .filter(Boolean),
          allergies: allergies
            .split(",")
            .map((a) => a.trim().toLowerCase())
            .filter(Boolean),
          generalLocation,
          latitude,
          longitude,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Registrasi gagal");
      }

      const data = await res.json();
      localStorage.setItem("token", data.token);
      router.push("/dashboard");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Registrasi gagal, silahkan coba lagi",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 py-12 px-4 flex flex-col justify-center items-center">
      <div className="max-w-2xl w-full mx-auto">
        {/* Kontainer Utama Bergaya Minimalis Premium */}
        <div className="bg-white border border-zinc-200/80 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-[#1A1A1A]">
              Daftar Akun
            </h1>
            <p className="text-xs text-zinc-500 mt-0.5">
              Bergabunglah dengan ekosistem pangan hemat & sehat Foodremix.
            </p>
          </div>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold rounded-xl">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Nama Lengkap */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold tracking-wide uppercase text-zinc-400">
                  Nama Lengkap *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 text-xs bg-zinc-50 border border-zinc-200 text-[#1A1A1A] rounded-xl outline-none focus:border-zinc-400 transition"
                  placeholder="Nama lengkap"
                  disabled={loading}
                  required
                />
              </div>

              {/* Nickname */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold tracking-wide uppercase text-zinc-400">
                  Nama Panggilan (Nickname) *
                </label>
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  className="w-full px-4 py-2.5 text-xs bg-zinc-50 border border-zinc-200 text-[#1A1A1A] rounded-xl outline-none focus:border-zinc-400 transition"
                  placeholder="Nama panggilan akun"
                  disabled={loading}
                  required
                />
              </div>

              {/* Email */}
              <div className="md:col-span-2 space-y-1.5">
                <label className="text-[10px] font-bold tracking-wide uppercase text-zinc-400">
                  Alamat Email *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 text-xs bg-zinc-50 border border-zinc-200 text-[#1A1A1A] rounded-xl outline-none focus:border-zinc-400 transition"
                  placeholder="nama@email.com"
                  disabled={loading}
                  required
                />
              </div>

              {/* Lokasi Terproteksi Validasi */}
              <div className="md:col-span-2 space-y-1.5">
                <label className="text-[10px] font-bold tracking-wide uppercase text-zinc-400">
                  Wilayah Tempat Tinggal (Lokasi P2P) *
                </label>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={generalLocation}
                    onChange={(e) => setGeneralLocation(e.target.value)}
                    className="flex-1 px-4 py-2.5 text-xs bg-zinc-50 border border-zinc-200 text-[#1A1A1A] rounded-xl outline-none focus:border-zinc-400 transition"
                    placeholder="Masukkan atau cari lokasi Anda..."
                    disabled={loading}
                    required
                  />
                  <button
                    type="button"
                    onClick={handleAutoDetectLocation}
                    disabled={loading || locatingGeolocation}
                    className="px-4 py-2.5 bg-zinc-100 border border-zinc-300 text-zinc-700 text-xs font-bold rounded-xl hover:bg-zinc-200 transition flex items-center gap-1.5 shrink-0 disabled:opacity-50"
                  >
                    {locatingGeolocation ? "Mencari..." : "📍 Auto"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowMap(!showMap)}
                    disabled={loading}
                    className="px-4 py-2.5 bg-zinc-100 border border-zinc-300 text-zinc-700 text-xs font-bold rounded-xl hover:bg-zinc-200 transition flex items-center gap-1.5 shrink-0"
                  >
                    🗺️ Peta
                  </button>
                </div>

                {/* Map picker container rendering */}
                {showMap && (
                  <div className="mt-3 p-4 border border-zinc-200 rounded-2xl bg-zinc-50 overflow-hidden shadow-inner">
                    <LocationMap
                      onSelectLocation={handleMapSelect}
                      initialLat={latitude}
                      initialLng={longitude}
                    />
                  </div>
                )}

                {latitude && longitude && (
                  <p className="text-[10px] font-bold text-emerald-600 mt-1 flex items-center gap-1">
                    ✓ Koordinat Aktif Terkunci: [{latitude.toFixed(4)},{" "}
                    {longitude.toFixed(4)}]
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold tracking-wide uppercase text-zinc-400">
                  Password *
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 text-xs bg-zinc-50 border border-zinc-200 text-[#1A1A1A] rounded-xl outline-none focus:border-zinc-400 transition"
                  placeholder="••••••••"
                  disabled={loading}
                  required
                />
              </div>

              {/* Konfirmasi Password */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold tracking-wide uppercase text-zinc-400">
                  Konfirmasi Password *
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2.5 text-xs bg-zinc-50 border border-zinc-200 text-[#1A1A1A] rounded-xl outline-none focus:border-zinc-400 transition"
                  placeholder="••••••••"
                  disabled={loading}
                  required
                />
              </div>

              {/* Target Budget Harian */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold tracking-wide uppercase text-zinc-400">
                  Target Budget Hemat Harian (Rp)
                </label>
                <input
                  type="number"
                  value={dailyBudgetTarget}
                  onChange={(e) => setDailyBudgetTarget(e.target.value)}
                  className="w-full px-4 py-2.5 text-xs bg-zinc-50 border border-zinc-200 text-[#1A1A1A] rounded-xl outline-none focus:border-zinc-400 transition"
                  placeholder="30000"
                  disabled={loading}
                  min="0"
                />
              </div>

              {/* Medical Conditions */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold tracking-wide uppercase text-zinc-400">
                  Riwayat Penyakit (Proteksi Medis)
                </label>
                <input
                  type="text"
                  value={medicalConditions}
                  onChange={(e) => setMedicalConditions(e.target.value)}
                  className="w-full px-4 py-2.5 text-xs bg-zinc-50 border border-zinc-200 text-[#1A1A1A] rounded-xl outline-none focus:border-zinc-400 transition"
                  placeholder="maag, hipertensi (pisahkan dengan koma)"
                  disabled={loading}
                />
              </div>

              {/* Allergies */}
              <div className="md:col-span-2 space-y-1.5">
                <label className="text-[10px] font-bold tracking-wide uppercase text-zinc-400">
                  Alergi Makanan Aktif
                </label>
                <input
                  type="text"
                  value={allergies}
                  onChange={(e) => setAllergies(e.target.value)}
                  className="w-full px-4 py-2.5 text-xs bg-zinc-50 border border-zinc-200 text-[#1A1A1A] rounded-xl outline-none focus:border-zinc-400 transition"
                  placeholder="seafood, laktosa (pisahkan dengan koma)"
                  disabled={loading}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1A1A1A] text-white py-3 rounded-xl font-bold hover:bg-zinc-800 transition shadow-sm disabled:opacity-50 mt-6 text-xs"
            >
              {loading ? "Memproses Pembuatan Akun..." : "Daftar Sekarang"}
            </button>
          </form>

          <div className="pt-4 border-t border-zinc-100 text-center text-xs text-zinc-500">
            Sudah memiliki akun terdaftar?{" "}
            <Link
              href="/login"
              className="text-[#1A1A1A] font-bold hover:underline"
            >
              Masuk di sini
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
