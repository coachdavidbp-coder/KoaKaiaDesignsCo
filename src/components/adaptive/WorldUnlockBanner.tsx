"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const WORLD_NAMES: Record<number, { name: string; emoji: string; color: string }> = {
  3: { name: "Thunder Peak", emoji: "⚡", color: "#F59E0B" },
  5: { name: "Ocean Deep",   emoji: "🌊", color: "#3B82F6" },
};

interface WorldUnlockBannerProps {
  levelIds: number[];
  onDismiss: () => void;
}

export function WorldUnlockBanner({ levelIds, onDismiss }: WorldUnlockBannerProps) {
  const world = levelIds.length > 0 ? WORLD_NAMES[levelIds[levelIds.length - 1]] : null;
  if (!world) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="w-full rounded-3xl border overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${world.color}20, #0D1117 60%)`,
          borderColor: world.color + "40",
        }}
        initial={{ opacity: 0, scale: 0.95, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      >
        <div className="flex items-center gap-3 p-4">
          <motion.div
            className="text-3xl"
            animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
            transition={{ duration: 0.6 }}
          >
            {world.emoji}
          </motion.div>
          <div className="flex-1">
            <p
              className="text-[10px] font-bold uppercase tracking-widest mb-0.5"
              style={{ color: world.color }}
            >
              🔓 New World Unlocked!
            </p>
            <p className="font-bold text-white text-sm">{world.name} is now open!</p>
            <p className="text-xs text-gray-400 mt-0.5">
              New stories, words, and challenges await you.
            </p>
          </div>
          <button
            onClick={onDismiss}
            className="p-1.5 rounded-xl text-gray-500 hover:text-white hover:bg-white/10 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
