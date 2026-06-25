"use client";

import { useState, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

interface HeaderProps {
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
}

export default function Header({
  onToggleSidebar,
  isSidebarOpen,
}: HeaderProps) {
  const pathname = usePathname();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [currentTime, setCurrentTime] = useState<number>(() => Date.now());

  const fetchNotifications = useCallback(async (signal?: AbortSignal) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/notifications", {
        headers: { Authorization: `Bearer ${token}` },
        signal,
      });
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name !== "AbortError") {
        console.error("Failed to load notifications", err);
      }
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const triggerFetch = async () => {
      await fetchNotifications(controller.signal);
    };

    triggerFetch();

    return () => {
      controller.abort();
    };
  }, [pathname, fetchNotifications]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleToggleDropdown = async () => {
    const next = !showDropdown;
    setShowDropdown(next);

    if (next) {
      setCurrentTime(Date.now());
    }

    if (next && unreadCount > 0) {
      try {
        const token = localStorage.getItem("token");
        await fetch("/api/notifications", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ markAll: true }),
        });
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      } catch (_) {}
    }
  };

  function formatRelativeTime(iso: string, now: number) {
    if (!now) return "...";
    const diff = now - new Date(iso).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return "Baru saja";
    if (minutes < 60) return `${minutes} mnt lalu`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} jam lalu`;
    return `${Math.floor(hours / 24)} hari lalu`;
  }

  function typeColor(type: string) {
    switch (type) {
      case "WELLNESS":
        return "border-rose-400";
      case "PICKER_ALERT":
        return "border-amber-400";
      case "REMIX_ALERT":
        return "border-emerald-400";
      default:
        return "border-blue-400";
    }
  }

  const generateBreadcrumbs = () => {
    if (!pathname) return [];

    const paths = pathname.split("/").filter((path) => path);
    return paths.map((path, index) => {
      const url = `/${paths.slice(0, index + 1).join("/")}`;
      const label = path
        .replace(/[-_]/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());

      return { label, url, isLast: index === paths.length - 1 };
    });
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <header
      className={`fixed top-0 right-0 z-9999 flex h-20 items-center justify-between bg-[#F5F5F3]/80 backdrop-blur-md px-4 sm:px-6 lg:px-8 border-b border-zinc-200 transition-all duration-300 ease-in-out ${
        isSidebarOpen ? "left-0 lg:left-64" : "left-0 lg:left-20"
      }`}
    >
      <div className="flex items-center gap-4 overflow-hidden flex-1 mr-4">
        <Button
          onClick={onToggleSidebar}
          type="button"
          className="p-2.5 !px-2.5 !py-2.5 shrink-0"
          variant="secondary"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h7"
            />
          </svg>
        </Button>

        <nav className="flex items-center space-x-2 text-xs font-semibold overflow-x-auto no-scrollbar py-1">
          <Link
            href="/dashboard"
            className="text-zinc-400 hover:text-zinc-800 transition-colors whitespace-nowrap shrink-0"
          >
            Home
          </Link>

          {breadcrumbs.map((crumb) => {
            if (crumb.label.toLowerCase() === "dashboard") return null;

            return (
              <div
                key={crumb.url}
                className="flex items-center space-x-2 shrink-0"
              >
                <svg
                  className="h-3 w-3 text-zinc-300 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
                {crumb.isLast ? (
                  <span className="text-[#1A1A1A] font-black truncate max-w-35 sm:max-w-50">
                    {crumb.label}
                  </span>
                ) : (
                  <Link
                    href={crumb.url}
                    className="text-zinc-400 hover:text-zinc-800 transition-colors whitespace-nowrap"
                  >
                    {crumb.label}
                  </Link>
                )}
              </div>
            );
          })}
        </nav>
      </div>

      <div className="relative shrink-0">
        <Button
          onClick={handleToggleDropdown}
          type="button"
          className="relative p-2.5 !px-2.5 !py-2.5"
          variant="secondary"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white ring-2 ring-white">
              {unreadCount}
            </span>
          )}
        </Button>

        {showDropdown && (
          <div className="absolute right-0 mt-3 w-72 sm:w-80 rounded-2xl bg-white p-4 shadow-xl ring-1 ring-black/5 border border-zinc-100 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="mb-3 flex items-center justify-between border-b border-zinc-100 pb-2">
              <h3 className="text-sm font-bold text-[#1A1A1A]">
                Pemberitahuan
              </h3>
              <span className="text-xs text-zinc-400">{unreadCount} baru</span>
            </div>

            <div className="max-h-60 overflow-y-auto space-y-2">
              {notifications.length === 0 ? (
                <p className="text-center py-6 text-xs text-zinc-400">
                  Tidak ada notifikasi baru
                </p>
              ) : (
                notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`p-3 rounded-xl text-xs transition-colors border-l-[3px] ${
                      notif.isRead
                        ? "bg-zinc-50 text-zinc-600 border-transparent"
                        : `bg-[#EAB308]/10 text-[#1A1A1A] ${typeColor(notif.type)}`
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <p className="font-bold line-clamp-1">{notif.title}</p>
                      <span className="text-[9px] text-zinc-400 font-medium whitespace-nowrap shrink-0">
                        {formatRelativeTime(notif.createdAt, currentTime)}
                      </span>
                    </div>
                    <p className="text-zinc-500 mt-0.5 line-clamp-2">
                      {notif.message}
                    </p>
                  </div>
                ))
              )}
            </div>

            <Link
              href="/dashboard/notifications"
              onClick={() => setShowDropdown(false)}
              className="mt-3 block text-center text-[10px] font-black uppercase tracking-wider text-zinc-400 hover:text-[#1A1A1A] transition pt-3 border-t border-zinc-100"
            >
              Lihat Semua Notifikasi →
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
