"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface DashboardStats {
  totalMoneySaved: number;
  totalCarbonPrevented: number;
  averageHealthScore: number;
  recentHistory: Array<{
    id: string;
    recipeName: string;
    ingredientsUsed: string[];
    moneySaved: number;
    cookedAt: string;
  }>;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("/api/dashboard/stats", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (err) {
        console.error("Failed to fetch dashboard stats:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <p className="text-sm text-zinc-500 animate-pulse font-medium">
          Mengumpulkan data gizi dan finansial...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-bold text-[#1A1A1A]">
          Halo, Selamat Datang Kembali! 🌟
        </h1>
        <p className="text-sm text-zinc-500 mt-1">
          Berikut adalah rangkuman dampak kesehatan dan finansial yang kamu
          ciptakan.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div className="rounded-2xl bg-white p-6 border border-zinc-200/60 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-zinc-500">
              Total Uang Dihemat
            </span>
            <span className="text-2xl">💵</span>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-[#1A1A1A]">
              Rp {(stats?.totalMoneySaved || 0).toLocaleString("id-ID")}
            </h3>
            <p className="text-xs text-green-600 font-medium mt-1">
              📈 Berhasil menekan pengeluaran makan mentah
            </p>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 border border-zinc-200/60 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-zinc-500">
              Emisi CO₂ Dicegah
            </span>
            <span className="text-2xl">🌱</span>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-[#1A1A1A]">
              {(stats?.totalCarbonPrevented || 0).toFixed(2)} Kg
            </h3>
            <p className="text-xs text-zinc-500 font-medium mt-1">
              Dampak positif dari pengurangan sampah makanan
            </p>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 border border-zinc-200/60 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-zinc-500">
              Skor Kesehatan Imbang
            </span>
            <span className="text-2xl">❤️</span>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-[#1A1A1A]">
              {stats?.averageHealthScore || 0}{" "}
              <span className="text-sm font-normal text-zinc-400">/100</span>
            </h3>
            <div className="mt-2 h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#EAB308] rounded-full transition-all duration-500"
                style={{ width: `${stats?.averageHealthScore || 0}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl bg-white p-6 border border-zinc-200/60 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-bold text-[#1A1A1A]">
              Riwayat Remix Memasak
            </h2>
            <Link
              href="/dashboard/remix"
              className="text-xs font-semibold text-[#EAB308] hover:underline"
            >
              Mulai Masak Baru →
            </Link>
          </div>

          <div className="divide-y divide-zinc-100 overflow-hidden">
            {!stats?.recentHistory || stats.recentHistory.length === 0 ? (
              <p className="text-center py-12 text-sm text-zinc-400">
                Belum ada riwayat memasak. Yuk, olah sisa bahan makananmu!
              </p>
            ) : (
              stats.recentHistory.map((item) => (
                <div
                  key={item.id}
                  className="py-4 first:pt-0 last:pb-0 flex justify-between items-center gap-4"
                >
                  <div className="overflow-hidden">
                    <p className="font-semibold text-sm text-[#1A1A1A] truncate">
                      {item.recipeName}
                    </p>
                    <p className="text-xs text-zinc-400 mt-0.5 truncate">
                      Bahan: {item.ingredientsUsed.join(", ")}
                    </p>
                    <p className="text-[10px] text-zinc-400 mt-1">
                      {new Date(item.cookedAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-green-50 text-green-700 border border-green-100">
                      +Rp {item.moneySaved.toLocaleString("id-ID")}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-2xl bg-gradient-to-br from-[#1A1A1A] to-zinc-800 p-6 text-white flex flex-col justify-between shadow-lg">
          <div>
            <span className="text-2xl">💡</span>
            <h3 className="text-base font-bold text-[#EAB308] mt-4">
              Penyelamat Dompet Harian
            </h3>
            <p className="text-xs text-zinc-300 mt-2 leading-relaxed">
              Punya sisa bahan makanan di ujung meja atau uang saku menipis di
              akhir bulan? Jangan biarkan terbuang sia-sia dan menjadi beban
              lingkungan.
            </p>
          </div>
          <Link
            href="/dashboard/remix"
            className="mt-6 w-full py-3 rounded-xl bg-[#EAB308] text-[#1A1A1A] text-center text-sm font-bold shadow-md hover:bg-yellow-500 transition-colors"
          >
            Buka Remix Area 🍳
          </Link>
        </div>
      </div>
    </div>
  );
}
