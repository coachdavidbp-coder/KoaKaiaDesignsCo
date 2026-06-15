"use client";

import { Play, Pause, Square, Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface NarrationBarProps {
  isPlaying: boolean;
  isPaused: boolean;
  isSupported: boolean;
  rate: number;
  onPlay: () => void;
  onPause: () => void;
  onStop: () => void;
  onRateChange: (rate: number) => void;
}

const RATES = [
  { label: "Slow", value: 0.65 },
  { label: "Normal", value: 0.85 },
  { label: "Fast", value: 1.1 },
];

export function NarrationBar({
  isPlaying,
  isPaused,
  isSupported,
  rate,
  onPlay,
  onPause,
  onStop,
  onRateChange,
}: NarrationBarProps) {
  if (!isSupported) return null;

  return (
    <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-gray-800/80 border border-white/10 backdrop-blur-sm">
      <Volume2 className="w-4 h-4 text-blue-400 shrink-0" />

      <div className="flex items-center gap-2">
        {!isPlaying || isPaused ? (
          <button
            onClick={onPlay}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all active:scale-95"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            {isPaused ? "Resume" : "Listen"}
          </button>
        ) : (
          <button
            onClick={onPause}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-white text-xs font-bold transition-all active:scale-95"
          >
            <Pause className="w-3.5 h-3.5 fill-current" />
            Pause
          </button>
        )}

        {(isPlaying || isPaused) && (
          <button
            onClick={onStop}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-gray-400 hover:text-white transition-all active:scale-95"
          >
            <Square className="w-3.5 h-3.5 fill-current" />
          </button>
        )}
      </div>

      <div className="flex items-center gap-1 ml-auto">
        {RATES.map((r) => (
          <button
            key={r.value}
            onClick={() => onRateChange(r.value)}
            className={cn(
              "px-2 py-1 rounded-lg text-[10px] font-bold transition-all",
              Math.abs(rate - r.value) < 0.05
                ? "bg-blue-500/30 text-blue-300 border border-blue-500/40"
                : "text-gray-500 hover:text-gray-300"
            )}
          >
            {r.label}
          </button>
        ))}
      </div>
    </div>
  );
}
