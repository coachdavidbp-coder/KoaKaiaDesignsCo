"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Star } from "lucide-react";

const EXPLORER_RANKS = [
  { min: 1,  max: 3,        title: "Rookie Explorer",              emoji: "🌱" },
  { min: 4,  max: 6,        title: "Junior Explorer",              emoji: "⭐" },
  { min: 7,  max: 10,       title: "Adventurer",                   emoji: "🧭" },
  { min: 11, max: 15,       title: "Expert Explorer",              emoji: "🗺️" },
  { min: 16, max: 20,       title: "Master Explorer",              emoji: "👑" },
  { min: 21, max: Infinity, title: "Legend of Adventure Island",   emoji: "🌟" },
];

function getRank(level: number) {
  return EXPLORER_RANKS.find((r) => level >= r.min && level <= r.max) ?? EXPLORER_RANKS[0];
}

interface LevelUpModalProps {
  show: boolean;
  level: number;
  onDismiss: () => void;
}

export function LevelUpModal({ show, level, onDismiss }: LevelUpModalProps) {
  const rank = getRank(level);

  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <motion.div
            className="absolute inset-0 bg-black/75 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onDismiss}
          />

          <motion.div
            className="relative w-full max-w-sm text-center"
            initial={{ scale: 0.7, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 22 }}
          >
            <div className="flex justify-center gap-1.5 mb-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, rotate: -30 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.08 + i * 0.07, type: "spring" }}
                >
                  <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                </motion.div>
              ))}
            </div>

            <div className="bg-gray-900 border border-white/10 rounded-3xl p-8 shadow-2xl">
              <motion.div
                className="text-7xl mb-4 inline-block"
                animate={{ rotate: [0, -12, 12, -6, 6, 0] }}
                transition={{ delay: 0.25, duration: 0.65 }}
              >
                {rank.emoji}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-1">
                  Level Up!
                </p>
                <h2 className="text-2xl font-bold text-white mb-1">
                  Explorer Level {level}
                </h2>
                <p className="text-sm text-gray-400 mb-6">{rank.title}</p>
              </motion.div>

              <motion.button
                onClick={onDismiss}
                className="w-full py-3.5 rounded-2xl font-bold text-sm text-black transition-all active:scale-95"
                style={{ background: "linear-gradient(135deg, #FBBF24, #F59E0B)" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Keep Adventuring! ⚡
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
