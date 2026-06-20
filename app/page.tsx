"use client";

import Link from "next/link";
import { useAuth } from "@/lib/hooks/useAuth";

export default function HomePage() {
  const { isAuthenticated, loading } = useAuth();

  return (
    <div className="min-h-screen bg-bg-light">
      {/* Navbar */}
      <nav className="bg-card shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="font-bold text-2xl text-primary">
              🍽️ Foodremix
            </Link>
            <div className="flex gap-4">
              {!loading && (
                <>
                  {isAuthenticated ? (
                    <Link
                      href="/dashboard"
                      className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 transition"
                    >
                      Dashboard
                    </Link>
                  ) : (
                    <>
                      <Link
                        href="/login"
                        className="px-4 py-2 text-primary border border-primary rounded-lg hover:bg-primary hover:text-white transition"
                      >
                        Login
                      </Link>
                      <Link
                        href="/register"
                        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 transition"
                      >
                        Daftar
                      </Link>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-primary mb-4">
            Foodremix
          </h1>
          <p className="text-xl text-foreground mb-2">
            Platform AI untuk masak kreatif & hemat budget
          </p>
          <p className="text-lg text-foreground mb-8">
            Berbagi bahan makanan, berkontribusi ke lingkungan, dan jaga
            kesehatan 🌱
          </p>

          {!loading && !isAuthenticated && (
            <div className="flex gap-4 justify-center">
              <Link
                href="/register"
                className="px-8 py-3 bg-accent text-primary rounded-lg font-semibold hover:bg-opacity-90 transition text-lg"
              >
                Mulai Sekarang
              </Link>
              <Link
                href="/login"
                className="px-8 py-3 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary hover:text-white transition text-lg"
              >
                Login
              </Link>
            </div>
          )}
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
          <div className="bg-card rounded-lg p-6 shadow-md">
            <div className="text-4xl mb-4">🤖</div>
            <h3 className="text-xl font-semibold text-primary mb-2">AI Menu</h3>
            <p className="text-foreground">
              Gemini AI membantu ciptakan menu kreatif dari bahan yang ada
            </p>
          </div>

          <div className="bg-card rounded-lg p-6 shadow-md">
            <div className="text-4xl mb-4">💰</div>
            <h3 className="text-xl font-semibold text-primary mb-2">
              Hemat Budget
            </h3>
            <p className="text-foreground">
              Kelola budget harian & cegah pemborosan dengan smart tracking
            </p>
          </div>

          <div className="bg-card rounded-lg p-6 shadow-md">
            <div className="text-4xl mb-4">🌍</div>
            <h3 className="text-xl font-semibold text-primary mb-2">
              Ramah Lingkungan
            </h3>
            <p className="text-foreground">
              Berbagi makanan & kurangi limbah dengan sistem patungan komunitas
            </p>
          </div>

          <div className="bg-card rounded-lg p-6 shadow-md">
            <div className="text-4xl mb-4">❤️</div>
            <h3 className="text-xl font-semibold text-primary mb-2">
              Wellness
            </h3>
            <p className="text-foreground">
              Jurnal kesehatan AI untuk monitor diet sesuai kondisi medis
            </p>
          </div>

          <div className="bg-card rounded-lg p-6 shadow-md">
            <div className="text-4xl mb-4">👥</div>
            <h3 className="text-xl font-semibold text-primary mb-2">
              Komunitas
            </h3>
            <p className="text-foreground">
              Terhubung dengan pengguna lain, berbagi tips & resep
            </p>
          </div>

          <div className="bg-card rounded-lg p-6 shadow-md">
            <div className="text-4xl mb-4">📍</div>
            <h3 className="text-xl font-semibold text-primary mb-2">
              Jarak Dekat
            </h3>
            <p className="text-foreground">
              Temukan pengguna di sekitar untuk berbagi & patungan makanan
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-primary text-white mt-20 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2026 Foodremix. Masak, hemat, berbagi.</p>
        </div>
      </footer>
    </div>
  );
}
