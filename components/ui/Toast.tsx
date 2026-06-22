"use client";

/**
 * components/ui/Toast.tsx
 *
 * Floating toast notification system — muncul di kanan atas.
 * Bisa dipakai dari mana saja via useToast() hook.
 *
 * Tipe:
 *   success  — hijau emerald
 *   error    — merah rose
 *   warning  — kuning amber
 *   info     — biru langit
 */

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  X,
} from "lucide-react";

// ─── Tipe ─────────────────────────────────────────────────────────
export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number; // ms, default 4000; 0 = tetap sampai ditutup manual
}

interface ToastContextValue {
  toast: (opts: Omit<ToastItem, "id">) => void;
  success: (title: string, message?: string, duration?: number) => void;
  error: (title: string, message?: string, duration?: number) => void;
  warning: (title: string, message?: string, duration?: number) => void;
  info: (title: string, message?: string, duration?: number) => void;
}

// ─── Context ───────────────────────────────────────────────────────
export const ToastContext = createContext<ToastContextValue | undefined>(
  undefined,
);

// ─── Hook ──────────────────────────────────────────────────────────
export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast harus digunakan dalam ToastProvider");
  return ctx;
}

// ─── Config visual per tipe ────────────────────────────────────────
const STYLE: Record<
  ToastType,
  { bg: string; border: string; icon: React.ReactNode; progress: string; label: string }
> = {
  success: {
    bg: "bg-white",
    border: "border-emerald-200",
    icon: <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />,
    progress: "bg-emerald-400",
    label: "bg-emerald-50 text-emerald-700 border-emerald-100",
  },
  error: {
    bg: "bg-white",
    border: "border-rose-200",
    icon: <XCircle size={16} className="text-rose-500 shrink-0 mt-0.5" />,
    progress: "bg-rose-400",
    label: "bg-rose-50 text-rose-700 border-rose-100",
  },
  warning: {
    bg: "bg-white",
    border: "border-amber-200",
    icon: <AlertTriangle size={16} className="text-amber-500 shrink-0 mt-0.5" />,
    progress: "bg-amber-400",
    label: "bg-amber-50 text-amber-700 border-amber-100",
  },
  info: {
    bg: "bg-white",
    border: "border-sky-200",
    icon: <Info size={16} className="text-sky-500 shrink-0 mt-0.5" />,
    progress: "bg-sky-400",
    label: "bg-sky-50 text-sky-700 border-sky-100",
  },
};

const TYPE_LABEL: Record<ToastType, string> = {
  success: "Berhasil",
  error: "Error",
  warning: "Perhatian",
  info: "Info",
};

// ─── Single Toast Item ─────────────────────────────────────────────
function ToastCard({
  item,
  onDismiss,
}: {
  item: ToastItem;
  onDismiss: (id: string) => void;
}) {
  const s = STYLE[item.type];
  const duration = item.duration ?? 4000;
  const [progress, setProgress] = useState(100);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startRef = useRef<number>(Date.now());
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (duration === 0) return; // persistent

    const tick = 50; // ms update rate
    const total = duration;

    intervalRef.current = setInterval(() => {
      if (paused) return;
      const elapsed = Date.now() - startRef.current;
      const remaining = Math.max(0, 100 - (elapsed / total) * 100);
      setProgress(remaining);
      if (remaining <= 0) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        onDismiss(item.id);
      }
    }, tick);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paused, duration]);

  const handlePause = () => {
    setPaused(true);
  };

  const handleResume = () => {
    // Reset start time to "now minus elapsed" so the bar continues from where it left off
    const elapsed = (1 - progress / 100) * (duration ?? 4000);
    startRef.current = Date.now() - elapsed;
    setPaused(false);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 80, scale: 0.92 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 80, scale: 0.92, transition: { duration: 0.18 } }}
      transition={{ type: "spring", stiffness: 420, damping: 34 }}
      onMouseEnter={handlePause}
      onMouseLeave={handleResume}
      className={`relative w-[340px] max-w-[calc(100vw-2rem)] rounded-2xl border shadow-[0_8px_32px_rgba(0,0,0,0.10)] overflow-hidden pointer-events-auto ${s.bg} ${s.border}`}
      style={{ backdropFilter: "blur(12px)" }}
    >
      {/* Progress bar */}
      {duration !== 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-zinc-100">
          <div
            className={`h-full transition-none ${s.progress}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      <div className="flex items-start gap-3 px-4 py-3.5 pr-10">
        {s.icon}

        <div className="flex-1 min-w-0 space-y-0.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`text-[9px] font-black px-1.5 py-0.5 rounded border uppercase tracking-wider ${s.label}`}
            >
              {TYPE_LABEL[item.type]}
            </span>
          </div>
          <p className="text-xs font-black text-[#1A1A1A] leading-snug mt-1">
            {item.title}
          </p>
          {item.message && (
            <p className="text-[11px] text-zinc-500 font-medium leading-relaxed">
              {item.message}
            </p>
          )}
        </div>
      </div>

      {/* Close button */}
      <button
        onClick={() => onDismiss(item.id)}
        className="absolute top-3 right-3 p-1 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition"
      >
        <X size={12} strokeWidth={3} />
      </button>
    </motion.div>
  );
}

// ─── Provider & Container ──────────────────────────────────────────
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback((opts: Omit<ToastItem, "id">) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => {
      // Batasi max 5 toast sekaligus — buang yang paling lama
      const next = [...prev, { ...opts, id }];
      return next.length > 5 ? next.slice(next.length - 5) : next;
    });
  }, []);

  const success = useCallback(
    (title: string, message?: string, duration?: number) =>
      toast({ type: "success", title, message, duration }),
    [toast],
  );
  const error = useCallback(
    (title: string, message?: string, duration?: number) =>
      toast({ type: "error", title, message, duration }),
    [toast],
  );
  const warning = useCallback(
    (title: string, message?: string, duration?: number) =>
      toast({ type: "warning", title, message, duration }),
    [toast],
  );
  const info = useCallback(
    (title: string, message?: string, duration?: number) =>
      toast({ type: "info", title, message, duration }),
    [toast],
  );

  return (
    <ToastContext.Provider value={{ toast, success, error, warning, info }}>
      {children}

      {/* Portal-like fixed container — kanan atas */}
      <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-2.5 items-end pointer-events-none">
        <AnimatePresence mode="popLayout" initial={false}>
          {toasts.map((t) => (
            <ToastCard key={t.id} item={t} onDismiss={dismiss} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
