"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/hooks/useAuth";

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading, logout } = useAuth();

  // Redirect to login if not authenticated (use useEffect to avoid render warning)
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-light">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-bg-light">
      {/* Navbar */}
      <nav className="bg-card shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/dashboard" className="font-bold text-xl text-primary">
              Foodremix
            </Link>
            <div className="flex items-center gap-4">
              <span className="text-foreground">{user.name || user.email}</span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-card rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-primary mb-2">
            Selamat datang, {user.name || user.email}! 👋
          </h1>
          <p className="text-foreground mb-6">
            Anda sudah berhasil login ke Foodremix
          </p>

          {/* User Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-bg-light rounded-lg p-6">
              <h2 className="text-lg font-semibold text-primary mb-4">
                Informasi Akun
              </h2>
              <dl className="space-y-3">
                <div>
                  <dt className="text-sm font-medium text-foreground">Email</dt>
                  <dd className="text-foreground">{user.email}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-foreground">Nama</dt>
                  <dd className="text-foreground">{user.name || "-"}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-foreground">
                    Terdaftar
                  </dt>
                  <dd className="text-foreground">
                    {new Date(user.createdAt).toLocaleDateString("id-ID")}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="bg-bg-light rounded-lg p-6">
              <h2 className="text-lg font-semibold text-primary mb-4">
                Quick Links
              </h2>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/profile"
                    className="text-accent hover:underline font-semibold"
                  >
                    → Edit Profile
                  </Link>
                </li>
                <li>
                  <Link
                    href="/community"
                    className="text-accent hover:underline font-semibold"
                  >
                    → Community & Share
                  </Link>
                </li>
                <li>
                  <Link
                    href="/wellness"
                    className="text-accent hover:underline font-semibold"
                  >
                    → Wellness Journal
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
