"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "primary"
    | "secondary"
    | "outline"
    | "ghost"
    | "destructive"
    | "accent";
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
    const baseClasses =
      "inline-flex items-center justify-center gap-2 rounded-xl font-bold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 uppercase tracking-wider active:scale-[0.99]";

    const variantClasses = {
      primary:
        "bg-[var(--primary)] text-white hover:bg-[var(--primary)]/90 focus-visible:ring-[var(--primary)] shadow-lg hover:shadow-xl",
      secondary:
        "bg-[var(--card)] text-[var(--primary)] border border-zinc-200 hover:bg-zinc-50 focus-visible:ring-[var(--primary)] shadow-sm",
      outline:
        "border border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)]/5 focus-visible:ring-[var(--primary)]",
      ghost:
        "text-[var(--primary)] hover:bg-[var(--primary)]/5 focus-visible:ring-[var(--primary)]",
      destructive:
        "bg-rose-500 text-white hover:bg-rose-600 focus-visible:ring-rose-500 shadow-lg hover:shadow-xl",
      accent:
        "bg-[var(--accent)] text-black hover:bg-[var(--accent)]/90 focus-visible:ring-[var(--accent)] shadow-lg hover:shadow-xl",
    };

    const sizeClasses = {
      sm: "px-3 py-1.5 text-xs",
      md: "px-4 py-2.5 text-xs",
      lg: "px-6 py-4 text-sm",
    };

    return (
      <button
        className={cn(
          baseClasses,
          variantClasses[variant],
          sizeClasses[size],
          loading && "opacity-70 cursor-wait",
          className,
        )}
        disabled={disabled || loading}
        ref={ref}
        {...props}
      >
        {loading ? (
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : null}
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";

export { Button };
