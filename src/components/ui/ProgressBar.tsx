"use client";

import { cn } from "@/lib/utils/cn";
import { motion } from "framer-motion";

interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showPercent?: boolean;
  variant?: "blue" | "purple" | "gold" | "green" | "gradient";
  size?: "sm" | "md" | "lg";
  animated?: boolean;
  className?: string;
}

const variantStyles = {
  blue: "bg-blue-500",
  purple: "bg-purple-500",
  gold: "bg-amber-400",
  green: "bg-emerald-500",
  gradient: "bg-gradient-to-r from-blue-500 to-purple-500",
};

const sizeStyles = {
  sm: "h-1.5",
  md: "h-2.5",
  lg: "h-4",
};

export function ProgressBar({
  value,
  max = 100,
  label,
  showPercent = false,
  variant = "gradient",
  size = "md",
  animated = true,
  className,
}: ProgressBarProps) {
  const percent = Math.min((value / max) * 100, 100);

  return (
    <div className={cn("w-full", className)}>
      {(label || showPercent) && (
        <div className="flex items-center justify-between mb-1.5">
          {label && <span className="text-xs text-gray-400">{label}</span>}
          {showPercent && (
            <span className="text-xs font-semibold text-gray-300">{Math.round(percent)}%</span>
          )}
        </div>
      )}
      <div
        className={cn(
          "w-full rounded-full bg-white/10 overflow-hidden",
          sizeStyles[size]
        )}
      >
        <motion.div
          className={cn("h-full rounded-full", variantStyles[variant])}
          initial={animated ? { width: 0 } : { width: `${percent}%` }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
