"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/lib/hooks/useAuth";
import { useToast } from "@/components/ui/Toast";
import { Button } from "@/components/ui/Button";

export default function LoginPage() {
  const router = useRouter();
  const { login, loading, isAuthenticated } = useAuth();
  const { error: toastError } = useToast();

  const cardRef = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isAuthenticated && !loading) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, loading, router]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const { left, top } = cardRef.current.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;
    cardRef.current.style.setProperty("--x", `${x}px`);
    cardRef.current.style.setProperty("--y", `${y}px`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toastError("Form tidak lengkap", "Email dan password harus diisi.");
      return;
    }

    try {
      await login(email, password);
    } catch (err) {
      toastError(
        "Login gagal",
        err instanceof Error ? err.message : "Silahkan coba lagi.",
      );
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-6 md:p-12 overflow-hidden bg-[#FBFBFA]">
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04] select-none z-0"
        style={{
          backgroundImage: "url('/bg-pattern.jpeg')",
          backgroundRepeat: "repeat",
          backgroundSize: "160px auto",
        }}
      />

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-125 h-125 bg-amber-500/3 rounded-full blur-[100px] pointer-events-none" />

      <div className="absolute top-0 left-0 w-full pointer-events-none z-10 filter drop-shadow-[0_4px_10px_rgba(0,0,0,0.04)]">
        <svg
          viewBox="0 0 1440 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto overflow-visible"
        >
          <path
            d="M0,0 L1440,0 L1440,45 C1320,65, 1200,25, 1080,45 C960,65, 840,25, 720,45 C600,65, 480,25, 360,45 C240,65, 120,25, 0,45 Z"
            fill="#1C1614"
          />
          <path
            d="M0,45 C120,25, 240,65, 360,45 C480,25, 600,65, 720,45 C840,25, 960,65, 1080,45 C1200,25, 1320,65, 1440,45"
            stroke="#eab308"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.75"
          />
        </svg>
      </div>

      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-20 w-full max-w-130 bg-white/80 border border-stone-200/90 rounded-[2.5rem] p-8 md:p-10 shadow-[0_25px_50px_rgba(28,22,20,0.04),inset_0_1px_2px_rgba(255,255,255,0.8)] backdrop-blur-xl group/card flex flex-col gap-8"
      >
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_var(--x,0px)_var(--y,0px),rgba(234,179,8,0.04)_0%,transparent_50%)] transition-opacity duration-300 opacity-0 group-hover/card:opacity-100 rounded-[2.5rem]" />

        <div className="flex flex-col items-center text-center">
          <div className="flex items-center gap-2 mb-3">
            <div className="relative w-7 h-7 bg-white/5 rounded-lg p-0.5 border border-stone-200/50 overflow-hidden">
              <Image
                src="/logo-trans.png"
                alt="Foodremix Logo"
                fill
                className="object-contain p-0.5"
              />
            </div>
            <span className="text-lg font-bold tracking-tight text-[#1C1614]">
              food<span className="text-amber-500 font-medium">remix</span>
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-[#1C1614] tracking-tight">
            Masuk Kembali
          </h2>
          <p className="text-[10px] font-bold text-stone-400 mt-1 uppercase tracking-wider font-sans">
            Nikmati Pengalaman Dapur Hijau Pintar
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
          <div className="space-y-1.5">
            <label
              htmlFor="email"
              className="text-[10px] font-extrabold uppercase tracking-wider text-stone-500 ml-1"
            >
              Alamat Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="email"
                id="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                placeholder="name@example.com"
                className="w-full bg-stone-100/70 border border-stone-200 rounded-xl py-3 pl-11 pr-4 text-sm font-bold text-[#1C1614] placeholder-stone-400 focus:outline-none focus:border-amber-500/50 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center px-1">
              <label
                htmlFor="password"
                className="text-[10px] font-extrabold uppercase tracking-wider text-stone-500"
              >
                Kata Sandi
              </label>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                placeholder="••••••••"
                className="w-full bg-stone-100/70 border border-stone-200 rounded-xl py-3 pl-11 pr-12 text-sm font-bold text-[#1C1614] placeholder-stone-400 focus:outline-none focus:border-amber-500/50 focus:bg-white transition-all"
              />
              <Button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors px-1! py-1! shadow-none !uppercase-normal"
                variant="primary"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>

          <Button
            type="submit"
            loading={loading}
            variant="accent"
            className="w-full mt-4"
          >
            <span className="flex items-center justify-center gap-2 w-full">
              Masuk Sekarang
              <ArrowRight className="w-4 h-4 shrink-0 transition-transform duration-200 group-hover/btn:translate-x-1" />
            </span>
          </Button>
        </form>

        <p className="text-center text-stone-400 text-xs font-medium">
          Belum memiliki akun?{" "}
          <Link
            href="/register"
            className="text-[#1C1614] font-bold hover:underline"
          >
            Daftar di sini
          </Link>
        </p>
      </motion.div>

      <div className="absolute bottom-0 left-0 w-full pointer-events-none z-10 filter drop-shadow-[0_-4px_10px_rgba(0,0,0,0.04)]">
        <svg
          viewBox="0 0 1440 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto overflow-visible"
        >
          <path
            d="M0,80 L1440,80 L1440,35 C1320,55, 1200,15, 1080,35 C960,55, 840,15, 720,35 C600,55, 480,15, 360,35 C240,55, 120,15, 0,35 Z"
            fill="#1C1614"
          />
          <path
            d="M0,35 C120,15, 240,55, 360,35 C480,15, 600,55, 720,35 C840,15, 960,55, 1080,35 C1200,15, 1320,55, 1440,35"
            stroke="#eab308"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.75"
          />
        </svg>
      </div>
    </div>
  );
}
