"use client";

import { HTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils/cn";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "glow" | "gold" | "glass" | "solid";
  interactive?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { className, variant = "default", interactive = false, children, ...props },
  ref
) {
  return (
    <div
      ref={ref}
      className={cn(
        "rounded-2xl border transition-all duration-200",
        variant === "default" &&
          "bg-gray-900/80 border-white/10 shadow-card backdrop-blur-sm",
        variant === "glow" &&
          "bg-gray-900/80 border-blue-500/30 shadow-game-glow backdrop-blur-sm",
        variant === "gold" &&
          "bg-gradient-to-br from-amber-900/40 to-gray-900/80 border-amber-500/30 shadow-gold-glow backdrop-blur-sm",
        variant === "glass" &&
          "bg-white/5 border-white/10 backdrop-blur-md shadow-card",
        variant === "solid" &&
          "bg-gray-800 border-gray-700 shadow-card",
        interactive &&
          "cursor-pointer hover:border-blue-500/50 hover:shadow-game-glow hover:-translate-y-0.5 active:translate-y-0",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});
