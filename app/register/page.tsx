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

  // Auto-detect lokasi sekarang
  const handleAutoDetectLocation = async () => {
    setLocatingGeolocation(true);
    setError("");

    if (!navigator.geolocation) {
      setError("Browser Anda tidak support geolocation");
      setLocatingGeolocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude: lat, longitude: lng } = position.coords;
        setLatitude(lat);
        setLongitude(lng);

        // Reverse geocoding menggunakan Nominatim (OpenStreetMap)
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
          );
          const data = await response.json();
          
          // Extract nama lokasi dari response
          const locationName =
            data.address?.city ||
            data.address?.town ||
            data.address?.village ||
            data.address?.county ||
            `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
          
          setGeneralLocation(locationName);
        } catch (err) {
          // Fallback jika reverse geocoding error
          setGeneralLocation(`${lat.toFixed(4)}, ${lng.toFixed(4)}`);
        }

        setLocatingGeolocation(false);
      },
      (err) => {
        setError(`Error: ${err.message}`);
        setLocatingGeolocation(false);
      },
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
      setError("Nama, email, nickname, lokasi, dan password harus diisi");
      return;
    }

    if (password.length < 6) {
      setError("Password minimal 6 karakter");
      return;
    }

    if (password !== confirmPassword) {
      setError("Password tidak cocok");
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
            .map((c) => c.trim())
            .filter((c) => c),
          allergies: allergies
            .split(",")
            .map((a) => a.trim())
            .filter((a) => a),
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
    <div className="min-h-screen bg-bg-light py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-card rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Daftar Akun</h1>
          <p className="text-foreground mb-6">Bergabunglah dengan Foodremix</p>

          {error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Nama Lengkap */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Nama Lengkap *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                  placeholder="Nama lengkap"
                  disabled={loading}
                  required
                />
              </div>

              {/* Nickname */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Nickname *
                </label>
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                  placeholder="Nama panggilan"
                  disabled={loading}
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                  placeholder="you@example.com"
                  disabled={loading}
                  required
                />
              </div>

              {/* Lokasi */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Lokasi *
                </label>
                
                {/* Location input + buttons */}
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={generalLocation}
                    onChange={(e) => setGeneralLocation(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                    placeholder="Masukkan atau pilih lokasi"
                    disabled={loading}
                    required
                  />
                  <button
                    type="button"
                    onClick={handleAutoDetectLocation}
                    disabled={loading || locatingGeolocation}
                    className="px-4 py-2 bg-accent text-primary rounded-lg font-semibold hover:bg-opacity-90 transition disabled:opacity-50 whitespace-nowrap"
                  >
                    {locatingGeolocation ? "Detecting..." : "📍 Auto"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowMap(!showMap)}
                    disabled={loading}
                    className="px-4 py-2 bg-accent text-primary rounded-lg font-semibold hover:bg-opacity-90 transition disabled:opacity-50 whitespace-nowrap"
                  >
                    🗺️ Map
                  </button>
                </div>

                {/* Map picker */}
                {showMap && (
                  <div className="mb-4 p-4 border border-gray-300 rounded-lg bg-white">
                    <LocationMap
                      onSelectLocation={handleMapSelect}
                      initialLat={latitude}
                      initialLng={longitude}
                    />
                  </div>
                )}

                {latitude && longitude && (
                  <p className="text-xs text-foreground mt-1">
                    📍 Koordinat: {latitude.toFixed(4)}, {longitude.toFixed(4)}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Password *
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                  placeholder="••••••••"
                  disabled={loading}
                  required
                />
              </div>

              {/* Konfirmasi Password */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Konfirmasi Password *
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                  placeholder="••••••••"
                  disabled={loading}
                  required
                />
              </div>

              {/* Daily Budget Target */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Target Budget Harian (Rp)
                </label>
                <input
                  type="number"
                  value={dailyBudgetTarget}
                  onChange={(e) => setDailyBudgetTarget(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                  placeholder="30000"
                  disabled={loading}
                  min="0"
                />
              </div>

              {/* Medical Conditions */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Kondisi Medis
                </label>
                <input
                  type="text"
                  value={medicalConditions}
                  onChange={(e) => setMedicalConditions(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                  placeholder="maag, hipertensi (pisahkan dengan koma)"
                  disabled={loading}
                />
              </div>

              {/* Allergies */}
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-foreground mb-1">
                  Alergi Makanan
                </label>
                <input
                  type="text"
                  value={allergies}
                  onChange={(e) => setAllergies(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                  placeholder="seafood, laktosa (pisahkan dengan koma)"
                  disabled={loading}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-opacity-90 transition disabled:opacity-50 mt-6"
            >
              {loading ? "Daftar..." : "Daftar"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-foreground">
              Sudah punya akun?{" "}
              <Link
                href="/login"
                className="text-accent font-semibold hover:underline"
              >
                Masuk di sini
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
