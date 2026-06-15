import { cn } from "@/lib/utils/cn";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  label?: string;
}

const sizes = {
  sm: "w-4 h-4 border-2",
  md: "w-8 h-8 border-2",
  lg: "w-12 h-12 border-3",
  xl: "w-16 h-16 border-4",
};

export function LoadingSpinner({ size = "md", className, label }: LoadingSpinnerProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-3", className)}>
      <div
        className={cn(
          "rounded-full border-white/10 border-t-blue-500 animate-spin",
          sizes[size]
        )}
      />
      {label && <p className="text-sm text-gray-400 animate-pulse">{label}</p>}
    </div>
  );
}

export function FullPageLoader({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="min-h-screen bg-game-bg flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="text-4xl animate-bounce">🌟</div>
        <LoadingSpinner size="lg" />
        <p className="text-gray-400 text-sm">{label}</p>
      </div>
    </div>
  );
}
