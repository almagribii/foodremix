"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  userNickname: string;
}

export default function Sidebar({
  isOpen,
  onClose,
  userNickname,
}: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const menuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: (
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
            d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
          />
        </svg>
      ),
    },
    {
      name: "Remix Area",
      path: "/dashboard/remix",
      icon: (
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
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z"
          />
        </svg>
      ),
    },
    {
      name: "Remix Picker",
      path: "/dashboard/picker",
      icon: (
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
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
    },
    {
      name: "Remix Chat",
      path: "/dashboard/chat",
      icon: (
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
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
      ),
    },
    {
      name: "Rekam Gizi",
      path: "/dashboard/journal",
      icon: (
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
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
        </svg>
      ),
    },
  ];

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token") || "";
      if (token) {
        await fetch("/api/auth/logout", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        });
      }
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      router.replace("/");
      setTimeout(() => {
        window.location.reload();
      }, 100);
    }
  };

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-30 flex h-full flex-col justify-between bg-[#1A1A1A] text-white py-6 shadow-xl transition-all duration-300 ease-in-out lg:translate-x-0 ${
        isOpen
          ? "w-64 translate-x-0 px-0"
          : "w-20 -translate-x-full lg:translate-x-0 px-0"
      }`}
    >
      <div
        className={`flex items-center shrink-0 ${isOpen ? "justify-between px-6" : "justify-center"}`}
      >
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative h-9 w-9 overflow-hidden rounded-xl transition-transform group-hover:scale-105">
            <Image
              src="/logo-food.png"
              alt="Foodremix Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          {isOpen && (
            <h1 className="text-xl font-black tracking-wider text-[#EAB308] animate-in fade-in duration-200">
              Foodremix
            </h1>
          )}
        </Link>
        {isOpen && (
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-zinc-800 text-zinc-400 hover:text-white lg:hidden transition-colors"
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>

      <div className="flex-1 flex flex-col justify-center my-8">
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => {
                  if (window.innerWidth < 1024) onClose();
                }}
                className={`relative flex items-center transition-all duration-200 text-sm font-semibold group w-full ${
                  isOpen ? "px-6 py-3.5 gap-4" : "justify-center py-5"
                } ${
                  isActive
                    ? "bg-gradient-to-r from-amber-500/10 to-transparent border-l-[3px] border-[#EAB308] text-[#EAB308]"
                    : "text-zinc-400 hover:bg-zinc-800/40 hover:text-white border-l-[3px] border-transparent"
                }`}
              >
                <span
                  className={`transition-colors duration-200 ${isActive ? "text-[#EAB308]" : "text-zinc-400 group-hover:text-white"}`}
                >
                  {item.icon}
                </span>

                {isOpen ? (
                  <span className="animate-in fade-in duration-150">
                    {item.name}
                  </span>
                ) : (
                  <span className="absolute left-full ml-4 px-3 py-2 bg-[#1A1A1A] text-zinc-200 text-xs font-bold rounded-xl border border-zinc-800 shadow-xl opacity-0 scale-95 pointer-events-none group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 whitespace-nowrap z-50">
                    {item.name}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="pt-4 shrink-0 space-y-3 px-4">
        <Link
          href="/dashboard/profile"
          onClick={() => {
            if (window.innerWidth < 1024) onClose();
          }}
          className={`relative flex items-center justify-between rounded-2xl transition-all duration-200 group text-left ${
            isOpen
              ? "p-3 bg-zinc-900/40 border border-zinc-800/50 hover:bg-zinc-800/50 hover:border-zinc-700/60"
              : "justify-center p-1.5 hover:bg-zinc-800/60"
          }`}
        >
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#EAB308] text-[#1A1A1A] font-black text-xs shadow-md">
              {userNickname.substring(0, 2).toUpperCase()}
            </div>
            {isOpen ? (
              <div className="overflow-hidden animate-in fade-in duration-200">
                <p className="text-[10px] text-zinc-500 font-medium tracking-wide uppercase">
                  Profil Saya
                </p>
                <p className="truncate text-sm font-bold text-zinc-200 group-hover:text-[#EAB308] transition-colors">
                  {userNickname}
                </p>
              </div>
            ) : (
              <span className="absolute left-full ml-4 px-3 py-2 bg-[#1A1A1A] text-zinc-200 text-xs font-bold rounded-xl border border-zinc-800 shadow-xl opacity-0 scale-95 pointer-events-none group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 whitespace-nowrap z-50">
                Profil ({userNickname})
              </span>
            )}
          </div>
          {isOpen && (
            <svg
              className="h-4 w-4 text-zinc-500 group-hover:text-white transition-transform duration-200 group-hover:translate-x-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
          )}
        </Link>

        <button
          onClick={handleLogout}
          className={`relative flex items-center rounded-2xl text-sm font-bold text-zinc-400 hover:bg-rose-950/20 hover:text-rose-400 transition-all duration-200 group ${
            isOpen ? "w-full px-4 py-3.5 gap-4" : "justify-center w-full py-3.5"
          }`}
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
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          {isOpen ? (
            <span className="animate-in fade-in duration-200">Keluar</span>
          ) : (
            <span className="absolute left-full ml-4 px-3 py-2 bg-rose-950 text-rose-300 text-xs font-bold rounded-xl border border-rose-900 shadow-xl opacity-0 scale-95 pointer-events-none group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 whitespace-nowrap z-50">
              Keluar Aplikasi
            </span>
          )}
        </button>
      </div>
    </aside>
  );
}
