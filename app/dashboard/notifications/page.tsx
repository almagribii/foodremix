"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  BellOff,
  CheckCheck,
  ShieldAlert,
  Utensils,
  ScanLine,
  RefreshCw,
  Settings2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useToast } from "@/components/ui/Toast";

// ─── Tipe ─────────────────────────────────────────────────────────
interface NotifLog {
  id: string;
  title: string;
  message: string;
  type: "BUDGET" | "WELLNESS" | "PICKER_ALERT" | "REMIX_ALERT";
  isRead: boolean;
  createdAt: string;
}

interface NotifSetting {
  dinnerReminderTime: string;
  journalReminderTime: string;
}

// ─── Util ──────────────────────────────────────────────────────────
function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

function typeIcon(type: NotifLog["type"]) {
  switch (type) {
    case "WELLNESS":
      return <ShieldAlert size={15} className="text-rose-500" />;
    case "PICKER_ALERT":
      return <ScanLine size={15} className="text-amber-500" />;
    case "REMIX_ALERT":
      return <Utensils size={15} className="text-emerald-500" />;
    default:
      return <Bell size={15} className="text-blue-500" />;
  }
}

function typeLabel(type: NotifLog["type"]) {
  switch (type) {
    case "WELLNESS":
      return "Kesehatan";
    case "PICKER_ALERT":
      return "Picker";
    case "REMIX_ALERT":
      return "Remix";
    default:
      return "Budget";
  }
}

function typeBadgeClass(type: NotifLog["type"]) {
  switch (type) {
    case "WELLNESS":
      return "bg-rose-50 text-rose-700 border-rose-100";
    case "PICKER_ALERT":
      return "bg-amber-50 text-amber-700 border-amber-100";
    case "REMIX_ALERT":
      return "bg-emerald-50 text-emerald-700 border-emerald-100";
    default:
      return "bg-blue-50 text-blue-700 border-blue-100";
  }
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ══════════════════════════════════════════════════════════════════
// Komponen utama
// ══════════════════════════════════════════════════════════════════
export default function NotificationsPage() {
  const { success: toastSuccess, error: toastError } = useToast();
  const [logs, setLogs] = useState<NotifLog[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [loadingLogs, setLoadingLogs] = useState(false);

  const [setting, setSetting] = useState<NotifSetting | null>(null);  const [settingDraft, setSettingDraft] = useState<NotifSetting>({
    dinnerReminderTime: "17:30",
    journalReminderTime: "21:00",
  });
  const [settingLoading, setSettingLoading] = useState(false);

  const [showSettings, setShowSettings] = useState(false);
  const [markingAll, setMarkingAll] = useState(false);
  // Setiap kali nilai ini berubah, logs akan di-refetch
  const [refreshTick, setRefreshTick] = useState(0);

  const triggerRefresh = useCallback(() => setRefreshTick((n) => n + 1), []);

  // ─── Fetch logs ──────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setLoadingLogs(true);
      try {
        const token = getToken();
        const params = new URLSearchParams({
          page: String(page),
          limit: "15",
          ...(unreadOnly ? { unreadOnly: "true" } : {}),
        });
        const res = await fetch(`/api/notifications/logs?${params}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok && !cancelled) {
          const data = await res.json();
          setLogs(data.logs || []);
          setTotal(data.total || 0);
          setTotalPages(data.totalPages || 1);
        }
      } finally {
        if (!cancelled) setLoadingLogs(false);
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [page, unreadOnly, refreshTick]);

  // ─── Fetch settings ──────────────────────────────────────────
  useEffect(() => {
    async function fetchSettings() {
      const token = getToken();
      const res = await fetch("/api/notifications/settings", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setSetting(data);
        setSettingDraft({
          dinnerReminderTime: data.dinnerReminderTime,
          journalReminderTime: data.journalReminderTime,
        });
      }
    }
    fetchSettings();
  }, []);

  // ─── Tandai semua dibaca ─────────────────────────────────────
  const handleMarkAll = async () => {
    setMarkingAll(true);
    try {
      const token = getToken();
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ markAll: true }),
      });
      triggerRefresh();
      toastSuccess("Semua dibaca", "Semua notifikasi telah ditandai sebagai dibaca.");
    } finally {
      setMarkingAll(false);
    }
  };

  // ─── Tandai satu notif dibaca ────────────────────────────────
  const handleMarkOne = async (id: string) => {
    setLogs((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
    );
    const token = getToken();
    await fetch("/api/notifications", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ ids: [id] }),
    });
  };

  // ─── Simpan setting ──────────────────────────────────────────
  const handleSaveSetting = async () => {
    setSettingLoading(true);
    try {
      const token = getToken();
      const res = await fetch("/api/notifications/settings", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(settingDraft),
      });
      if (res.ok) {
        const data = await res.json();
        setSetting(data);
        toastSuccess("Pengaturan disimpan", "Jadwal pengingat berhasil diperbarui.");
      } else {
        toastError("Gagal menyimpan", "Terjadi kesalahan saat menyimpan pengaturan.");
      }
    } finally {
      setSettingLoading(false);
    }
  };

  const unreadCount = logs.filter((n) => !n.isRead).length;

  return (
    <div className="min-h-screen bg-[#F5F5F3] px-4 sm:px-8 py-12 selection:bg-[#EAB308] selection:text-[#1A1A1A]">
      <div className="max-w-4xl mx-auto space-y-8 pb-20">
        {/* ── Header ────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-zinc-200/80 pb-8 gap-4">
          <div className="space-y-1">
            <h1 className="text-4xl font-black tracking-tight text-[#1A1A1A]">
              Notifikasi
            </h1>
            <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">
              Sistem Peringatan Kesehatan & Aktivitas
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Tandai semua dibaca */}
            <button
              onClick={handleMarkAll}
              disabled={markingAll}
              className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider px-3 py-2 bg-white border border-zinc-200 text-zinc-600 rounded-xl hover:bg-zinc-50 hover:border-zinc-300 transition shadow-sm disabled:opacity-50"
            >
              <CheckCheck size={12} />
              {markingAll ? "Memproses..." : "Baca Semua"}
            </button>

            {/* Toggle filter unread */}
            <button
              onClick={() => {
                setUnreadOnly((p) => !p);
                setPage(1);
              }}
              className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider px-3 py-2 border rounded-xl transition shadow-sm ${
                unreadOnly
                  ? "bg-[#EAB308] border-[#EAB308] text-[#1A1A1A]"
                  : "bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50"
              }`}
            >
              {unreadOnly ? <Bell size={12} /> : <BellOff size={12} />}
              {unreadOnly ? "Semua" : "Belum Dibaca"}
            </button>

            {/* Refresh */}
            <button
              onClick={triggerRefresh}
              disabled={loadingLogs}
              className="p-2.5 bg-white border border-zinc-200 text-zinc-500 rounded-xl hover:bg-zinc-50 transition shadow-sm disabled:opacity-50"
            >
              <RefreshCw size={13} className={loadingLogs ? "animate-spin" : ""} />
            </button>

            {/* Settings */}
            <button
              onClick={() => setShowSettings((p) => !p)}
              className={`p-2.5 border rounded-xl transition shadow-sm ${
                showSettings
                  ? "bg-[#1A1A1A] border-[#1A1A1A] text-white"
                  : "bg-white border-zinc-200 text-zinc-500 hover:bg-zinc-50"
              }`}
            >
              <Settings2 size={13} />
            </button>
          </div>
        </div>

        {/* ── Panel Pengaturan Pengingat ─────────────────────────── */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="bg-white border border-zinc-200 rounded-[2rem] p-6 shadow-sm space-y-5"
            >
              <div className="flex items-center gap-2 mb-1">
                <Settings2 size={14} className="text-zinc-500" />
                <h3 className="text-xs font-black uppercase tracking-widest text-[#1A1A1A]">
                  Pengaturan Pengingat
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-wider block">
                    Pengingat Makan Malam
                  </label>
                  <input
                    type="time"
                    value={settingDraft.dinnerReminderTime}
                    onChange={(e) =>
                      setSettingDraft((p) => ({
                        ...p,
                        dinnerReminderTime: e.target.value,
                      }))
                    }
                    className="w-full border border-zinc-200 rounded-xl px-3 py-2.5 text-sm font-semibold text-[#1A1A1A] bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-[#EAB308]/40 focus:border-[#EAB308] transition"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-wider block">
                    Pengingat Rekam Jurnal
                  </label>
                  <input
                    type="time"
                    value={settingDraft.journalReminderTime}
                    onChange={(e) =>
                      setSettingDraft((p) => ({
                        ...p,
                        journalReminderTime: e.target.value,
                      }))
                    }
                    className="w-full border border-zinc-200 rounded-xl px-3 py-2.5 text-sm font-semibold text-[#1A1A1A] bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-[#EAB308]/40 focus:border-[#EAB308] transition"
                  />
                </div>
              </div>

              <button
                onClick={handleSaveSetting}
                disabled={settingLoading}
                className="px-4 py-2.5 text-[10px] font-black uppercase tracking-wider rounded-xl transition shadow-sm bg-[#1A1A1A] text-white hover:bg-zinc-800 disabled:opacity-60"
              >
                {settingLoading ? "Menyimpan..." : "Simpan Pengaturan"}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Stats Bar ─────────────────────────────────────────── */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2 bg-white border border-zinc-200 rounded-2xl px-4 py-2.5 shadow-sm">
            <Bell size={12} className="text-zinc-400" />
            <span className="text-[11px] font-black text-[#1A1A1A]">
              {total}
            </span>
            <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
              Total
            </span>
          </div>
          {unreadCount > 0 && (
            <div className="flex items-center gap-2 bg-[#EAB308]/10 border border-[#EAB308]/30 rounded-2xl px-4 py-2.5 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-[#EAB308] animate-pulse" />
              <span className="text-[11px] font-black text-[#1A1A1A]">
                {unreadCount}
              </span>
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
                Belum Dibaca
              </span>
            </div>
          )}
        </div>

        {/* ── Daftar Notifikasi ─────────────────────────────────── */}
        <div className="space-y-3">
          {loadingLogs ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="h-20 bg-white border border-zinc-200 rounded-[1.75rem] animate-pulse"
                />
              ))}
            </div>
          ) : logs.length === 0 ? (
            <div className="text-center py-16 bg-white border border-dashed border-zinc-200 rounded-[2rem]">
              <div className="w-12 h-12 bg-zinc-50 border border-zinc-200 rounded-2xl flex items-center justify-center mx-auto mb-3 text-zinc-400">
                <BellOff size={20} />
              </div>
              <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
                Tidak ada notifikasi
              </p>
              <p className="text-[11px] text-zinc-400 mt-1">
                {unreadOnly
                  ? "Semua notifikasi sudah dibaca"
                  : "Belum ada aktivitas tercatat"}
              </p>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {logs.map((notif) => (
                <motion.div
                  key={notif.id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  onClick={() => !notif.isRead && handleMarkOne(notif.id)}
                  className={`flex items-start gap-4 p-4 sm:p-5 rounded-[1.75rem] border transition-all cursor-pointer group ${
                    notif.isRead
                      ? "bg-white border-zinc-100 hover:border-zinc-200"
                      : "bg-[#EAB308]/5 border-[#EAB308]/20 hover:border-[#EAB308]/40 shadow-[0_2px_16px_rgba(234,179,8,0.06)]"
                  }`}
                >
                  {/* Ikon tipe */}
                  <div
                    className={`shrink-0 w-9 h-9 rounded-xl border flex items-center justify-center mt-0.5 ${
                      notif.isRead
                        ? "bg-zinc-50 border-zinc-100"
                        : "bg-white border-zinc-200"
                    }`}
                  >
                    {typeIcon(notif.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      {!notif.isRead && (
                        <span className="h-1.5 w-1.5 rounded-full bg-[#EAB308] shrink-0" />
                      )}
                      <span
                        className={`text-[9px] font-black px-2 py-0.5 rounded-md border uppercase tracking-wider ${typeBadgeClass(notif.type)}`}
                      >
                        {typeLabel(notif.type)}
                      </span>
                      <span className="text-[10px] text-zinc-400 font-medium ml-auto whitespace-nowrap">
                        {formatDate(notif.createdAt)}
                      </span>
                    </div>

                    <p className="text-xs font-black text-[#1A1A1A] leading-snug">
                      {notif.title}
                    </p>
                    <p className="text-[11px] text-zinc-500 font-medium mt-1 leading-relaxed line-clamp-3">
                      {notif.message}
                    </p>
                  </div>

                  {!notif.isRead && (
                    <div className="shrink-0 self-center opacity-0 group-hover:opacity-100 transition">
                      <CheckCheck size={14} className="text-zinc-400" />
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        {/* ── Pagination ────────────────────────────────────────── */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 pt-4">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1 || loadingLogs}
              className="p-2 bg-white border border-zinc-200 rounded-xl text-zinc-500 hover:bg-zinc-50 disabled:opacity-40 transition shadow-sm"
            >
              <ChevronLeft size={14} />
            </button>

            <span className="text-xs font-black text-zinc-500">
              {page} / {totalPages}
            </span>

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages || loadingLogs}
              className="p-2 bg-white border border-zinc-200 rounded-xl text-zinc-500 hover:bg-zinc-50 disabled:opacity-40 transition shadow-sm"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
