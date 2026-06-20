"use client";

import { useState, useEffect } from "react";

interface Notification {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
}

interface HeaderProps {
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
}

export default function Header({
  onToggleSidebar,
  isSidebarOpen,
}: HeaderProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    async function fetchNotifications() {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("/api/notifications", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setNotifications(data);
        }
      } catch (err) {
        console.error("Failed to load notifications", err);
      }
    }
    fetchNotifications();
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <header
      className={`fixed top-0 right-0 z-10 flex h-20 items-center justify-between bg-[#F5F5F3]/80 backdrop-blur-md px-4 sm:px-6 lg:px-8 border-b border-zinc-200 transition-all duration-300 ease-in-out ${
        isSidebarOpen ? "left-0 lg:left-64" : "left-0 lg:left-20"
      }`}
    >
      <div className="flex items-center gap-4 overflow-hidden">
        <button
          onClick={onToggleSidebar}
          type="button"
          className="p-2.5 bg-white border border-zinc-200 text-[#1A1A1A] rounded-xl hover:bg-zinc-50 transition-colors shadow-sm shrink-0 flex items-center justify-center"
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
        </button>

        <div className="overflow-hidden">
          <h2 className="text-sm sm:text-lg font-bold text-[#1A1A1A] tracking-tight truncate">
            Pusat Kontrol Finansial & Gizi
          </h2>
          <p className="text-[10px] sm:text-xs text-zinc-500 truncate">
            Pantau survival memasakmu hari ini.
          </p>
        </div>
      </div>

      <div className="relative shrink-0">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          type="button"
          className="relative p-2.5 bg-white border border-zinc-200 text-[#1A1A1A] rounded-xl hover:bg-zinc-50 transition-colors shadow-sm flex items-center justify-center"
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
        </button>

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
                    className={`p-3 rounded-xl text-xs transition-colors ${
                      notif.isRead
                        ? "bg-zinc-50 text-zinc-600"
                        : "bg-[#EAB308]/10 border-l-4 border-[#EAB308] text-[#1A1A1A]"
                    }`}
                  >
                    <p className="font-bold">{notif.title}</p>
                    <p className="text-zinc-500 mt-0.5">{notif.message}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
