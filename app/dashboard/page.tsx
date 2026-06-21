"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { useAuth } from "@/lib/hooks/useAuth";
import {
  Utensils, Leaf, HeartPulse, ScanLine, BookOpen,
  Bell, ArrowRight, ChevronRight, Sparkles, TrendingUp,
  ShieldCheck, Wallet,
} from "lucide-react";

interface DashboardStats {
  totalMoneySaved: number;
  totalCarbonPrevented: number;
  averageHealthScore: number;
  totalRemix: number;
  totalPickerScans: number;
  totalJournalEntries: number;
  unreadNotifications: number;
  recentHistory: Array<{
    id: string;
    recipeName: string;
    ingredientsUsed: string[];
    moneySaved: number;
    carbonPrevented: number;
    cookedAt: string;
  }>;
  recentJournals: Array<{
    id: string;
    foodEaten: string;
    healthScore: number;
    userMood: string;
    createdAt: string;
  }>;
  profile: {
    nickname: string;
    dailyBudgetTarget: number;
    medicalConditions: string[];
    allergies: string[];
  } | null;
}

// ─── Helpers ─────────────────────────────────────────────────────
function scoreColor(score: number) {
  if (score >= 80) return { bar: "bg-emerald-400", text: "text-emerald-600", label: "Prima" };
  if (score >= 60) return { bar: "bg-amber-400", text: "text-amber-600", label: "Waspada" };
  return { bar: "bg-rose-400", text: "text-rose-600", label: "Bahaya" };
}

function moodEmoji(mood: string) {
  const map: Record<string, string> = {
    HAPPY: "😊", SAD: "😔", ANXIOUS: "😰", TIRED: "😴",
    ENERGETIC: "⚡", SICK: "🤒", NEUTRAL: "😐",
  };
  return map[mood] ?? "😐";
}

function relativeTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const h = Math.floor(diff / 3600000);
  if (h < 1) return "Baru saja";
  if (h < 24) return `${h} jam lalu`;
  const d = Math.floor(h / 24);
  return `${d} hari lalu`;
}

// Animasi varian untuk stagger anak
const containerVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 340, damping: 26 },
  },
};

// ─── Komponen Stat Card ──────────────────────────────────────────
function StatCard({
  icon, label, value, sub, accent = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
  accent?: boolean;
}) {
  return (
    <motion.div
      variants={itemVariants}
      className={`relative overflow-hidden rounded-3xl border p-5 flex flex-col gap-3 shadow-sm transition-shadow hover:shadow-md ${
        accent
          ? "bg-[#1A1A1A] border-zinc-800 text-white"
          : "bg-white border-zinc-200/70"
      }`}
    >
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
        accent ? "bg-white/10" : "bg-zinc-100"
      }`}>
        {icon}
      </div>
      <div>
        <p className={`text-[10px] font-black uppercase tracking-widest ${accent ? "text-zinc-400" : "text-zinc-400"}`}>
          {label}
        </p>
        <p className={`text-2xl font-black tracking-tight mt-0.5 ${accent ? "text-white" : "text-[#1A1A1A]"}`}>
          {value}
        </p>
        {sub && (
          <p className={`text-[11px] font-medium mt-1 ${accent ? "text-zinc-400" : "text-zinc-500"}`}>
            {sub}
          </p>
        )}
      </div>
    </motion.div>
  );
}

// ─── Quick Link Card ─────────────────────────────────────────────
function QuickLink({
  href, icon, label, desc, badge,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  desc: string;
  badge?: string;
}) {
  return (
    <motion.div variants={itemVariants}>
      <Link
        href={href}
        className="group flex items-center gap-4 bg-white border border-zinc-200/70 rounded-2xl px-4 py-3.5 hover:border-zinc-400 hover:shadow-md transition-all duration-200"
      >
        <div className="w-9 h-9 rounded-xl bg-zinc-100 flex items-center justify-center shrink-0 group-hover:bg-[#EAB308]/10 transition-colors">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-xs font-black text-[#1A1A1A] tracking-tight">{label}</p>
            {badge && (
              <span className="text-[9px] font-black px-1.5 py-0.5 bg-[#EAB308] text-[#1A1A1A] rounded-md uppercase tracking-wider">
                {badge}
              </span>
            )}
          </div>
          <p className="text-[11px] text-zinc-400 font-medium truncate">{desc}</p>
        </div>
        <ChevronRight
          size={14}
          className="text-zinc-300 group-hover:text-[#1A1A1A] group-hover:translate-x-0.5 transition-all shrink-0"
        />
      </Link>
    </motion.div>
  );
}

// ─── Skeleton Loader ─────────────────────────────────────────────
function SkeletonPulse({ className }: { className: string }) {
  return <div className={`animate-pulse bg-zinc-100 rounded-2xl ${className}`} />;
}

function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <SkeletonPulse className="h-8 w-56" />
        <SkeletonPulse className="h-4 w-80" />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => <SkeletonPulse key={i} className="h-32" />)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <SkeletonPulse className="lg:col-span-8 h-72" />
        <SkeletonPulse className="lg:col-span-4 h-72" />
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// Halaman utama
// ════════════════════════════════════════════════════════════════
export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("/api/dashboard/stats", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok && !cancelled) setStats(await res.json());
      } catch (err) {
        console.error("Dashboard stats error:", err);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    run();
    return () => { cancelled = true; };
  }, []);

  const nickname =
    stats?.profile?.nickname ||
    user?.userProfile?.nickname ||
    user?.name ||
    "Kamu";

  const healthMeta = scoreColor(stats?.averageHealthScore ?? 0);
  const budgetUsed = stats?.profile?.dailyBudgetTarget
    ? Math.min(100, ((stats.totalMoneySaved / (stats.profile.dailyBudgetTarget * 30)) * 100))
    : 0;

  if (isLoading) return (
    <div className="max-w-7xl mx-auto pb-16">
      <DashboardSkeleton />
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto pb-20 space-y-8">

      {/* ── Hero Greeting ──────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-200"
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
              Foodremix Dashboard
            </span>
            {(stats?.unreadNotifications ?? 0) > 0 && (
              <Link href="/dashboard/notifications">
                <span className="inline-flex items-center gap-1 text-[9px] font-black px-2 py-0.5 bg-[#EAB308] text-[#1A1A1A] rounded-full uppercase tracking-wider animate-pulse">
                  <Bell size={9} />
                  {stats!.unreadNotifications} notif baru
                </span>
              </Link>
            )}
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-[#1A1A1A]">
            Selamat datang,{" "}
            <span className="text-[#EAB308]">{nickname}</span> 👋
          </h1>
          <p className="text-sm text-zinc-500 mt-1 font-medium">
            Berikut ringkasan dampak kesehatan &amp; finansialmu hari ini.
          </p>
        </div>

        <Link
          href="/dashboard/remix"
          className="group inline-flex items-center gap-2.5 px-5 py-3 bg-[#1A1A1A] text-white text-xs font-black uppercase tracking-wider rounded-2xl hover:bg-zinc-800 transition shadow-md shrink-0"
        >
          <Sparkles size={13} className="text-[#EAB308]" />
          Racik Sekarang
          <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </motion.div>

      {/* ── 4 Stat Cards ──────────────────────────────────────── */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <StatCard
          icon={<Wallet size={16} className="text-emerald-600" />}
          label="Total Dihemat"
          value={`Rp ${(stats?.totalMoneySaved || 0).toLocaleString("id-ID")}`}
          sub={`${stats?.totalRemix ?? 0} resep tercatat`}
        />
        <StatCard
          icon={<Leaf size={16} className="text-emerald-500" />}
          label="Emisi Dicegah"
          value={`${(stats?.totalCarbonPrevented || 0).toFixed(1)} Kg`}
          sub="CO₂ tidak terbuang"
        />
        <StatCard
          icon={<HeartPulse size={16} className={healthMeta.text} />}
          label="Skor Kesehatan"
          value={`${stats?.averageHealthScore ?? 0}`}
          sub={`Status: ${healthMeta.label}`}
        />
        <StatCard
          accent
          icon={<TrendingUp size={16} className="text-[#EAB308]" />}
          label="Total Aktivitas"
          value={`${(stats?.totalRemix ?? 0) + (stats?.totalPickerScans ?? 0) + (stats?.totalJournalEntries ?? 0)}`}
          sub="Remix · Scan · Jurnal"
        />
      </motion.div>

      {/* ── Row Tengah: Riwayat + Health ──────────────────────── */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 lg:grid-cols-12 gap-6"
      >
        {/* Riwayat Remix */}
        <motion.div
          variants={itemVariants}
          className="lg:col-span-7 bg-white border border-zinc-200/70 rounded-3xl p-6 shadow-sm"
        >
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-zinc-100 rounded-xl flex items-center justify-center">
                <Utensils size={13} className="text-zinc-600" />
              </div>
              <h2 className="text-xs font-black uppercase tracking-widest text-[#1A1A1A]">
                Riwayat Remix
              </h2>
            </div>
            <Link
              href="/dashboard/remix"
              className="text-[10px] font-black uppercase tracking-wider text-zinc-400 hover:text-[#1A1A1A] transition flex items-center gap-1"
            >
              Lihat Semua <ArrowRight size={10} />
            </Link>
          </div>

          {!stats?.recentHistory?.length ? (
            <div className="flex flex-col items-center justify-center py-12 text-center gap-3">
              <div className="w-12 h-12 bg-zinc-50 border border-dashed border-zinc-200 rounded-2xl flex items-center justify-center text-xl">
                🍳
              </div>
              <p className="text-xs text-zinc-400 font-medium">
                Belum ada riwayat memasak.
              </p>
              <Link
                href="/dashboard/remix"
                className="text-[10px] font-black text-[#EAB308] uppercase tracking-wider hover:underline"
              >
                Mulai racik sekarang →
              </Link>
            </div>
          ) : (
            <div className="space-y-1">
              {stats.recentHistory.map((item, idx) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="group flex items-center gap-4 px-3 py-3 rounded-2xl hover:bg-zinc-50 transition-colors"
                >
                  <div className="w-8 h-8 bg-[#EAB308]/10 border border-[#EAB308]/20 rounded-xl flex items-center justify-center text-[11px] font-black text-[#7A5E05] shrink-0">
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-black text-[#1A1A1A] truncate">
                      {item.recipeName}
                    </p>
                    <p className="text-[10px] text-zinc-400 font-medium truncate mt-0.5">
                      {item.ingredientsUsed.slice(0, 3).join(", ")}
                      {item.ingredientsUsed.length > 3 && " …"}
                    </p>
                  </div>
                  <div className="text-right shrink-0 space-y-0.5">
                    <p className="text-[10px] font-black text-emerald-600">
                      +Rp {item.moneySaved.toLocaleString("id-ID")}
                    </p>
                    <p className="text-[9px] text-zinc-400 font-medium">
                      {relativeTime(item.cookedAt)}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Panel kanan: Health Score + Jurnal Terbaru */}
        <div className="lg:col-span-5 flex flex-col gap-5">

          {/* Health Score Gauge */}
          <motion.div
            variants={itemVariants}
            className="bg-white border border-zinc-200/70 rounded-3xl p-5 shadow-sm"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 bg-zinc-100 rounded-xl flex items-center justify-center">
                <HeartPulse size={13} className="text-zinc-600" />
              </div>
              <h2 className="text-xs font-black uppercase tracking-widest text-[#1A1A1A]">
                Status Kesehatan
              </h2>
            </div>

            <div className="flex items-end gap-3 mb-3">
              <span className={`text-5xl font-black tracking-tighter ${healthMeta.text}`}>
                {stats?.averageHealthScore ?? 0}
              </span>
              <div className="pb-1.5">
                <span className="text-xs text-zinc-400 font-bold">/100</span>
                <p className={`text-[10px] font-black uppercase tracking-wider ${healthMeta.text}`}>
                  {healthMeta.label}
                </p>
              </div>
            </div>

            <div className="h-2.5 w-full bg-zinc-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${stats?.averageHealthScore ?? 0}%` }}
                transition={{ duration: 0.9, ease: "easeOut", delay: 0.2 }}
                className={`h-full rounded-full ${healthMeta.bar}`}
              />
            </div>
            <p className="text-[10px] text-zinc-400 font-medium mt-2">
              Rata-rata dari {stats?.totalJournalEntries ?? 0} entri jurnal
            </p>
          </motion.div>

          {/* Mini jurnal terbaru */}
          <motion.div
            variants={itemVariants}
            className="bg-white border border-zinc-200/70 rounded-3xl p-5 shadow-sm flex-1"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-zinc-100 rounded-xl flex items-center justify-center">
                  <BookOpen size={13} className="text-zinc-600" />
                </div>
                <h2 className="text-xs font-black uppercase tracking-widest text-[#1A1A1A]">
                  Jurnal Terakhir
                </h2>
              </div>
              <Link
                href="/dashboard/journal"
                className="text-[10px] font-black uppercase tracking-wider text-zinc-400 hover:text-[#1A1A1A] transition flex items-center gap-1"
              >
                Rekam <ArrowRight size={10} />
              </Link>
            </div>

            {!stats?.recentJournals?.length ? (
              <p className="text-xs text-zinc-400 font-medium text-center py-6">
                Belum ada catatan gizi.
              </p>
            ) : (
              <div className="space-y-2">
                {stats.recentJournals.map((j) => {
                  const sc = scoreColor(j.healthScore);
                  return (
                    <div
                      key={j.id}
                      className="flex items-center gap-3 p-3 rounded-xl bg-zinc-50/70 border border-zinc-100"
                    >
                      <span className="text-base shrink-0">{moodEmoji(j.userMood)}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-black text-[#1A1A1A] truncate">
                          {j.foodEaten}
                        </p>
                        <p className="text-[10px] text-zinc-400 font-medium">
                          {relativeTime(j.createdAt)}
                        </p>
                      </div>
                      <span className={`text-[10px] font-black shrink-0 ${sc.text}`}>
                        {j.healthScore}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        </div>
      </motion.div>

      {/* ── Row Bawah: Budget Progress + Quick Links + Guard ─── */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 lg:grid-cols-12 gap-6"
      >

        {/* Budget + Aktivitas */}
        <motion.div
          variants={itemVariants}
          className="lg:col-span-4 bg-white border border-zinc-200/70 rounded-3xl p-6 shadow-sm space-y-5"
        >
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-zinc-100 rounded-xl flex items-center justify-center">
              <Wallet size={13} className="text-zinc-600" />
            </div>
            <h2 className="text-xs font-black uppercase tracking-widest text-[#1A1A1A]">
              Budget Bulanan
            </h2>
          </div>

          <div className="space-y-2">
            <div className="flex items-end justify-between">
              <span className="text-2xl font-black text-[#1A1A1A]">
                Rp {(stats?.totalMoneySaved || 0).toLocaleString("id-ID")}
              </span>
              <span className="text-[10px] font-bold text-zinc-400 pb-0.5">
                / Rp {((stats?.profile?.dailyBudgetTarget ?? 30000) * 30).toLocaleString("id-ID")}
              </span>
            </div>
            <div className="h-2.5 w-full bg-zinc-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${budgetUsed}%` }}
                transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
                className="h-full bg-[#EAB308] rounded-full"
              />
            </div>
            <p className="text-[10px] text-zinc-400 font-medium">
              {budgetUsed.toFixed(0)}% dari target hemat bulan ini
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-zinc-100">
            {[
              { icon: <Utensils size={12} />, val: stats?.totalRemix ?? 0, label: "Remix" },
              { icon: <ScanLine size={12} />, val: stats?.totalPickerScans ?? 0, label: "Scan" },
              { icon: <BookOpen size={12} />, val: stats?.totalJournalEntries ?? 0, label: "Jurnal" },
            ].map((item) => (
              <div key={item.label} className="flex flex-col items-center gap-1 py-2 bg-zinc-50 rounded-xl border border-zinc-100">
                <span className="text-zinc-500">{item.icon}</span>
                <span className="text-sm font-black text-[#1A1A1A]">{item.val}</span>
                <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">{item.label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quick Navigation */}
        <motion.div
          variants={itemVariants}
          className="lg:col-span-4 space-y-2.5"
        >
          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 px-1">
            Navigasi Cepat
          </p>
          <QuickLink
            href="/dashboard/remix"
            icon={<Utensils size={15} className="text-[#EAB308]" />}
            label="Remix Area"
            desc="Racik resep dari sisa bahan"
            badge="AI"
          />
          <QuickLink
            href="/dashboard/picker"
            icon={<ScanLine size={15} className="text-sky-500" />}
            label="Remix Picker"
            desc="Analisis kesegaran bahan pasar"
          />
          <QuickLink
            href="/dashboard/journal"
            icon={<BookOpen size={15} className="text-violet-500" />}
            label="Rekam Gizi"
            desc="Catat asupan & cek skor kesehatan"
          />
          <QuickLink
            href="/dashboard/notifications"
            icon={<Bell size={15} className="text-rose-500" />}
            label="Notifikasi"
            desc="Peringatan kesehatan & aktivitas"
            badge={stats?.unreadNotifications ? `${stats.unreadNotifications}` : undefined}
          />
        </motion.div>

        {/* Guard Card */}
        <motion.div
          variants={itemVariants}
          className="lg:col-span-4 bg-[#1A1A1A] rounded-3xl p-6 text-white flex flex-col justify-between shadow-lg overflow-hidden relative"
        >
          {/* decorative circle */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#EAB308]/5 rounded-full" />
          <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/3 rounded-full" />

          <div className="relative z-10">
            <div className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center mb-4">
              <ShieldCheck size={17} className="text-[#EAB308]" />
            </div>
            <h3 className="text-sm font-black text-white tracking-tight">
              Profil Proteksi Aktif
            </h3>
            <p className="text-[11px] text-zinc-400 mt-1.5 leading-relaxed">
              AI secara otomatis memfilter resep &amp; saran berdasarkan kondisi
              medis dan alergimu.
            </p>

            <div className="mt-4 flex flex-wrap gap-1.5">
              {(stats?.profile?.medicalConditions ?? []).map((c) => (
                <span key={c} className="text-[9px] font-black px-2 py-0.5 bg-sky-500/20 text-sky-300 border border-sky-500/20 rounded-md uppercase tracking-wider">
                  {c}
                </span>
              ))}
              {(stats?.profile?.allergies ?? []).map((a) => (
                <span key={a} className="text-[9px] font-black px-2 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/20 rounded-md uppercase tracking-wider">
                  {a}
                </span>
              ))}
              {!(stats?.profile?.medicalConditions?.length) && !(stats?.profile?.allergies?.length) && (
                <span className="text-[10px] text-zinc-500 font-medium">Belum ada kondisi terdaftar.</span>
              )}
            </div>
          </div>

          <Link
            href="/dashboard/profile"
            className="relative z-10 mt-5 flex items-center justify-between px-4 py-3 bg-white/10 hover:bg-white/15 border border-white/10 rounded-xl transition group"
          >
            <span className="text-[10px] font-black uppercase tracking-wider text-white">
              Kelola Profil
            </span>
            <ArrowRight size={12} className="text-zinc-400 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </motion.div>

      </motion.div>

    </div>
  );
}
