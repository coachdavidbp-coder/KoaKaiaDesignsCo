"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Achievement, RARITY_COLORS } from "@/types/achievements";
import { useAchievements } from "@/hooks/useAchievements";

interface AchievementUnlockProps {
  studentId: string;
}

export function AchievementUnlock({ studentId }: AchievementUnlockProps) {
  const { pendingUnlock, dismissUnlock } = useAchievements(studentId);

  useEffect(() => {
    if (!pendingUnlock) return;
    const t = setTimeout(dismissUnlock, 5000);
    return () => clearTimeout(t);
  }, [pendingUnlock, dismissUnlock]);

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
      <AnimatePresence>
        {pendingUnlock && (
          <AchievementToast achievement={pendingUnlock} onDismiss={dismissUnlock} />
        )}
      </AnimatePresence>
    </div>
  );
}

function AchievementToast({
  achievement,
  onDismiss,
}: {
  achievement: Achievement;
  onDismiss: () => void;
}) {
  const rarity = RARITY_COLORS[achievement.rarity];

  return (
    <motion.div
      className="pointer-events-auto cursor-pointer"
      initial={{ y: -80, opacity: 0, scale: 0.8 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      exit={{ y: -80, opacity: 0, scale: 0.8 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      onClick={onDismiss}
    >
      <div
        className={`flex items-center gap-3 px-5 py-3 rounded-2xl border backdrop-blur-xl shadow-2xl ${rarity.bg} ${rarity.border}`}
        style={{ minWidth: "280px" }}
      >
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl border shrink-0 ${rarity.bg} ${rarity.border}`}
        >
          {achievement.emoji}
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-yellow-400">
            Achievement Unlocked!
          </p>
          <p className="font-bold text-white text-sm">{achievement.name}</p>
          <p className="text-xs text-gray-400">{achievement.description}</p>
        </div>
        <div className="shrink-0 text-right ml-2">
          {achievement.xpReward > 0 && (
            <p className="text-xs text-blue-300 font-bold">+{achievement.xpReward} XP</p>
          )}
          {achievement.coinReward > 0 && (
            <p className="text-xs text-yellow-300 font-bold">+{achievement.coinReward} 🪙</p>
          )}
          {achievement.gemReward > 0 && (
            <p className="text-xs text-purple-300 font-bold">+{achievement.gemReward} 💜</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
