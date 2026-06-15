"use client";

import { motion } from "framer-motion";
import { Star, Home, RotateCcw } from "lucide-react";
import { WritingSet, ActivityResult } from "@/types/writing";

interface WritingCompleteProps {
  set: WritingSet;
  results: ActivityResult[];
  score: number;
  xpEarned: number;
  onGoHome: () => void;
  onPlayAgain: () => void;
}

const SCORE_MSGS = [
  { min: 100, emoji: "🌟", msg: "PERFECT!", sub: "You got every activity right. You're a writing star!" },
  { min: 80,  emoji: "⭐", msg: "Amazing Writer!", sub: "Excellent work on your writing skills!" },
  { min: 60,  emoji: "👍", msg: "Good Job!", sub: "Every practice session makes you a better writer!" },
  { min: 0,   emoji: "📝", msg: "Keep Practicing!", sub: "Writing takes time — you're doing great!" },
];

export function WritingComplete({
  set,
  results,
  score,
  xpEarned,
  onGoHome,
  onPlayAgain,
}: WritingCompleteProps) {
  const msg = SCORE_MSGS.find((m) => score >= m.min) ?? SCORE_MSGS[SCORE_MSGS.length - 1];
  const correct = results.filter((r) => r.correct).length;
  const starCount = Math.max(0, Math.round(score / 20));

  return (
    <div className="min-h-full flex flex-col items-center justify-center px-6 py-10 text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
        className="text-8xl mb-4"
      >
        {msg.emoji}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h1 className="text-3xl font-bold text-white mb-2">{msg.msg}</h1>
        <p className="text-gray-400 mb-6 max-w-xs">{msg.sub}</p>
      </motion.div>

      {/* Rewards */}
      <motion.div
        className="grid grid-cols-3 gap-3 w-full max-w-xs mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <RewardBox emoji="✅" value={`${correct}/${results.length}`} label="Correct" color={set.theme.primary} />
        <RewardBox emoji="💎" value={`+${set.crystalReward}`} label="Crystals" color="#F59E0B" />
        <RewardBox emoji="⚡" value={`+${xpEarned}`} label="XP" color="#3B82F6" />
      </motion.div>

      {/* Stars */}
      <motion.div
        className="flex gap-2 justify-center mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {Array.from({ length: 5 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.6 + i * 0.08, type: "spring" }}
          >
            <Star
              className={`w-6 h-6 ${i < starCount ? "text-amber-400 fill-amber-400" : "text-gray-700 fill-gray-800"}`}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Buttons */}
      <motion.div
        className="flex flex-col gap-3 w-full max-w-xs"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <button
          onClick={onGoHome}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-black text-sm transition-all active:scale-95 shadow-lg"
          style={{ background: `linear-gradient(135deg, ${set.theme.primary}, ${set.theme.secondary})` }}
        >
          <Home className="w-4 h-4" />
          Back to Writing Workshop
        </button>
        <button
          onClick={onPlayAgain}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-gray-300 text-sm bg-white/10 border border-white/10 hover:bg-white/15 transition-all active:scale-95"
        >
          <RotateCcw className="w-4 h-4" />
          Try Again
        </button>
      </motion.div>
    </div>
  );
}

function RewardBox({ emoji, value, label, color }: { emoji: string; value: string; label: string; color: string }) {
  return (
    <div className="flex flex-col items-center gap-1 p-3 rounded-2xl bg-white/5 border border-white/10">
      <span className="text-2xl">{emoji}</span>
      <span className="font-bold text-sm" style={{ color }}>{value}</span>
      <span className="text-xs text-gray-500">{label}</span>
    </div>
  );
}
