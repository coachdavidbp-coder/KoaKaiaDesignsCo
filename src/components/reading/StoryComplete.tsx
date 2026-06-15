"use client";

import { motion } from "framer-motion";
import { Star, BookOpen, Home, RotateCcw } from "lucide-react";
import { Story } from "@/types/reading";
import { Button } from "@/components/ui/Button";

interface StoryCompleteProps {
  story: Story;
  score: number;
  questionsTotal: number;
  wordsLearned: string[];
  crystalsEarned: number;
  xpEarned: number;
  onGoHome: () => void;
  onReadAgain: () => void;
}

const SCORE_MESSAGES = [
  { min: 100, emoji: "🌟", message: "PERFECT SCORE!", sub: "You got every question right. You're a reading legend!" },
  { min: 80, emoji: "⭐", message: "Amazing Job!", sub: "You really understood that story. Fantastic work!" },
  { min: 60, emoji: "👍", message: "Good Reading!", sub: "You're getting better every story. Keep going!" },
  { min: 0, emoji: "📚", message: "Nice Try!", sub: "Reading takes practice. Every story makes you stronger!" },
];

export function StoryComplete({
  story,
  score,
  questionsTotal,
  wordsLearned,
  crystalsEarned,
  xpEarned,
  onGoHome,
  onReadAgain,
}: StoryCompleteProps) {
  const msg = SCORE_MESSAGES.find((m) => score >= m.min) ?? SCORE_MESSAGES[SCORE_MESSAGES.length - 1];
  const questionsCorrect = Math.round((score / 100) * questionsTotal);

  return (
    <div
      className="min-h-full flex flex-col items-center justify-center px-6 py-10 text-center"
      style={{
        background: `radial-gradient(ellipse at 50% 0%, ${story.theme.primary}20, transparent 70%)`,
      }}
    >
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
        <h1 className="text-3xl font-bold text-white mb-2">{msg.message}</h1>
        <p className="text-gray-400 mb-8 max-w-xs">{msg.sub}</p>
      </motion.div>

      <motion.div
        className="grid grid-cols-3 gap-3 w-full max-w-xs mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <RewardBox emoji="🧠" value={`${questionsCorrect}/${questionsTotal}`} label="Correct" color={story.theme.primary} />
        <RewardBox emoji="💎" value={`+${crystalsEarned}`} label="Crystal" color="#F59E0B" />
        <RewardBox emoji="⚡" value={`+${xpEarned}`} label="XP" color="#3B82F6" />
      </motion.div>

      {wordsLearned.length > 0 && (
        <motion.div
          className="w-full max-w-xs mb-8 p-4 rounded-2xl border border-white/10 bg-white/5 text-left"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="w-4 h-4 text-blue-400" />
            <p className="text-sm font-bold text-white">New Words Learned!</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {wordsLearned.map((w) => (
              <span
                key={w}
                className="px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-medium"
              >
                {w}
              </span>
            ))}
          </div>
        </motion.div>
      )}

      <motion.div
        className="flex flex-col gap-3 w-full max-w-xs"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Button
          onClick={onGoHome}
          size="lg"
          className="w-full"
          leftIcon={<Home className="w-5 h-5" />}
        >
          Back to Adventure Map
        </Button>
        <Button
          onClick={onReadAgain}
          variant="ghost"
          size="lg"
          className="w-full"
          leftIcon={<RotateCcw className="w-4 h-4" />}
        >
          Read Again
        </Button>
      </motion.div>

      <motion.div
        className="mt-8 flex gap-2 justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        {Array.from({ length: Math.max(0, Math.round(score / 20)) }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.8 + i * 0.1, type: "spring" }}
          >
            <Star className="w-6 h-6 text-amber-400 fill-amber-400" />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

function RewardBox({
  emoji,
  value,
  label,
  color,
}: {
  emoji: string;
  value: string;
  label: string;
  color: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1 p-3 rounded-2xl bg-white/5 border border-white/10">
      <span className="text-2xl">{emoji}</span>
      <span className="font-bold text-white text-sm" style={{ color }}>
        {value}
      </span>
      <span className="text-xs text-gray-500">{label}</span>
    </div>
  );
}
