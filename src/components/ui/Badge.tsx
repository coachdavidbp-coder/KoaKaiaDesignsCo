import { cn } from "@/lib/utils/cn";

type BadgeVariant = "blue" | "purple" | "gold" | "green" | "red" | "gray";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variants: Record<BadgeVariant, string> = {
  blue: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  purple: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  gold: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  green: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  red: "bg-red-500/20 text-red-300 border-red-500/30",
  gray: "bg-gray-500/20 text-gray-300 border-gray-500/30",
};

export function Badge({ children, variant = "blue", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
