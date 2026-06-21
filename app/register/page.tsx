"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/hooks/useAuth";

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

  // UI states
  const [error, setError] = useState("");

  // Redirect ke dashboard jika sudah login
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, authLoading, router]);

 const handleSubmit = async (e: React.FormEvent) => {
   e.preventDefault();
   setError("");

   if (!email || !password || !name || !nickname) {
     setError("Nama, email, nickname, dan password harus diisi lengkap.");
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
       }),
     });

     const data = await res.json();

     if (!res.ok) {
       throw new Error(data.error || "Registrasi gagal");
     }

     localStorage.setItem("token", data.token);

     if (data.token) {
       window.location.href = "/dashboard";
     } else {
       router.push("/dashboard");
     }
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
