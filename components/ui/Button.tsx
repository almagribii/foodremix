"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "accent";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  children: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary", 
      size = "md",
      loading = false,
      disabled,
      children,
      ...props
    },
    ref,
  ) => {
    // 1. Base Classes: Di sinilah letak keajaibannya
    // - rounded-full: Bentuk pil sempurna seperti gambar
    // - border-2: Garis tepi yang tegas
    // - shadow-hard: Kita akan gunakan custom utility untuk bayangan keras di bawah
    // - active:translate-y-0.5: Efek menekan saat diklik, bayangan sedikit menghilang
    // - group-hover: Efek hover yang sedikit menggeser posisi
    const baseClasses =
      "inline-flex flex-row items-center justify-center gap-2 rounded-full font-bold transition-all duration-150 ease-out border-2 active:translate-y-0.5 disabled:pointer-events-none disabled:opacity-50 select-none group group/btn focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2";    // 2. Variant Kelas: Mendefinisikan warna utama, border, dan bayangan
    const variantClasses = {
      // Primary: Warna krim seperti di gambar Anda
      primary:
        "bg-[#FFF0E6] text-[#4D2E00] border-[#4D2E00] shadow-[4px_4px_0px_#4D2E00] hover:bg-[#FFF0E6]/90 focus-visible:ring-[#4D2E00]/50",

      // Secondary: Versi gelap dari desain ini
      secondary:
        "bg-[#4D2E00] text-[#FFF0E6] border-[#4D2E00] shadow-[4px_4px_0px_#FFF0E6] hover:bg-[#4D2E00]/90 focus-visible:ring-[#4D2E00]/50",

      // Accent: Menggunakan warna aksen kustom (contoh)
      accent:
        "bg-[var(--accent)] text-black border-black shadow-[4px_4px_0px_black] hover:bg-[var(--accent)]/90 focus-visible:ring-black/50",
    };

    // 3. Size Classes: Sedikit lebih besar untuk desain ini agar proporsional
    const sizeClasses = {
      sm: "px-5 py-2.5 text-xs rounded-full gap-1.5",
      md: "px-6 py-3.5 text-sm rounded-full",
      lg: "px-8 py-5 text-base rounded-full gap-2.5",
    };

    return (
      <button
        className={cn(
          baseClasses,
          variantClasses[variant],
          sizeClasses[size],
          loading && "opacity-80 cursor-wait",
          className,
        )}
        disabled={disabled || loading}
        ref={ref}
        {...props}
      >
        {loading ? (
          <svg
            className="animate-spin -ml-1 mr-0.5 h-4 w-4 text-current"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        ) : null}
        <span
          className={cn(
            loading && "translate-x-0.5 transition-transform",
            "group-hover:translate-y-[-1px]",
          )}
        >
          {children}
        </span>
      </button>
    );
  },
);

Button.displayName = "Button";

export { Button };
