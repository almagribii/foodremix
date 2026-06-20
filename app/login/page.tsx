"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/hooks/useAuth";

export default function LoginPage() {
  const router = useRouter();
  const { login, loading, isAuthenticated } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Redirect ke dashboard jika sudah login (tapi tunggu loading selesai)
  useEffect(() => {
    console.log(
      "🔍 useEffect check - isAuthenticated:",
      isAuthenticated,
      "loading:",
      loading,
    );
    if (isAuthenticated && !loading) {
      console.log("✅ Redirecting to dashboard...");
      router.push("/dashboard");
    }
  }, [isAuthenticated, loading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Email dan password harus diisi");
      return;
    }

    try {
      await login(email, password);
      // Don't manually push here, let useEffect handle it
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Login gagal, silahkan coba lagi",
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-bg-light">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Masuk</h1>
          <p className="text-foreground mb-6">
            Selamat datang kembali di Foodremix
          </p>

          {error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-foreground mb-1"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                placeholder="you@example.com"
                disabled={loading}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-foreground mb-1"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                placeholder="••••••••"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-2 rounded-lg font-semibold hover:bg-opacity-90 transition disabled:opacity-50"
            >
              {loading ? "Masuk..." : "Masuk"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-foreground">
              Belum punya akun?{" "}
              <Link
                href="/register"
                className="text-accent font-semibold hover:underline"
              >
                Daftar di sini
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
