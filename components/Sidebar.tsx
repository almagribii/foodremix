"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ChefHat,
  ScanFace,
  MessageSquareText,
  Gamepad2,
  BookOpenCheck,
  Bell,
} from "lucide-react";

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
      icon: <LayoutDashboard className="h-5 w-5" strokeWidth={2} />,
    },
    {
      name: "Remix Area",
      path: "/dashboard/remix",
      icon: <ChefHat className="h-5 w-5" strokeWidth={2} />,
    },
    {
      name: "Remix Picker",
      path: "/dashboard/picker",
      icon: <ScanFace className="h-5 w-5" strokeWidth={2} />,
    },
    {
      name: "Remix Chat",
      path: "/dashboard/chat",
      icon: <MessageSquareText className="h-5 w-5" strokeWidth={2} />,
    },
    {
      name: "Remix Game",
      path: "/dashboard/game",
      icon: <Gamepad2 className="h-5 w-5" strokeWidth={2} />,
    },
    {
      name: "Rekam Gizi",
      path: "/dashboard/journal",
      icon: <BookOpenCheck className="h-5 w-5" strokeWidth={2} />,
    },
    {
      name: "Notifikasi",
      path: "/dashboard/notifications",
      icon: <Bell className="h-5 w-5" strokeWidth={2} />,
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
      className={`fixed inset-y-0 left-0 z-99999 flex h-full flex-col justify-between bg-[#1A1A1A] text-white py-6 shadow-xl transition-all duration-300 ease-in-out lg:translate-x-0 ${
        isOpen
          ? "w-64 translate-x-0 px-0"
          : "w-20 -translate-x-full lg:translate-x-0 px-0"
      }`}
    >
      <div className="relative flex flex-col items-center shrink-0 w-full px-4">
        <Link
          href="/"
          className={`flex items-center transition-all duration-200 group w-full ${
            isOpen
              ? "flex-col justify-center text-center gap-2 pt-2"
              : "justify-center"
          }`}
        >
          <div className="relative h-10 w-10 overflow-hidden rounded-xl transition-transform group-hover:scale-105">
            <Image
              src="/logo-food.png"
              alt="Foodremix Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          {isOpen && (
            <h1 className="text-xl font-black tracking-wider text-[#EAB308] animate-in fade-in zoom-in-95 duration-200">
              Foodremix
            </h1>
          )}
        </Link>

        {isOpen && (
          <button
            onClick={onClose}
            className="absolute top-2 right-4 p-1.5 rounded-xl hover:bg-zinc-800 text-zinc-400 hover:text-white lg:hidden transition-colors"
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
                    ? "bg-linear-to-r from-amber-500/10 to-transparent border-l-[3px] border-[#EAB308] text-[#EAB308]"
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
