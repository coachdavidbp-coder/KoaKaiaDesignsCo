"use client";

import { use, useEffect } from "react";
import { motion } from "framer-motion";
import { Trophy } from "lucide-react";
import { useStudentStore } from "@/store/studentStore";
import { useAchievements } from "@/hooks/useAchievements";
import { ALL_ACHIEVEMENTS, RARITY_COLORS, AchievementCategory } from "@/types/achievements";
import { GameNav } from "@/components/game/GameNav";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils/cn";
import { useRouter } from "next/navigation";

const CATEGORIES: { id: AchievementCategory | "all"; label: string; emoji: string }[] = [
  { id: "all", label: "All", emoji: "⭐" },
  { id: "crystal", label: "Crystals", emoji: "💎" },
  { id: "reading", label: "Reading", emoji: "📚" },
  { id: "math", label: "Math", emoji: "🔢" },
  { id: "spelling", label: "Spelling", emoji: "✏️" },
  { id: "writing", label: "Writing", emoji: "📝" },
  { id: "streak", label: "Streaks", emoji: "🔥" },
  { id: "exploration", label: "Explore", emoji: "🗺️" },
  { id: "companion", label: "Friends", emoji: "🐕" },
];

interface Props {
  params: Promise<{ profileId: string }>;
}

export default function AchievementsPage({ params }: Props) {
  const { profileId } = use(params);
  const router = useRouter();
  const { activeStudent } = useStudentStore();
  const { earned, earnedIds, earnedCount, loadAchievements } = useAchievements(profileId);

  useEffect(() => {
    if (!activeStudent || activeStudent.id !== profileId) {
      router.push("/parent");
      return;
    }
    loadAchievements();
  }, [profileId, activeStudent, router, loadAchievements]);

  const totalCount = ALL_ACHIEVEMENTS.filter((a) => !a.secret).length;

  return (
    <div className="min-h-screen pb-24">
      <div className="bg-gray-900/90 backdrop-blur-xl border-b border-white/10 px-4 py-4 sticky top-0 z-20">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <Trophy className="w-5 h-5 text-amber-400" />
          <div>
            <h1 className="font-bold text-white text-lg leading-none">Achievements</h1>
            <p className="text-xs text-gray-400">
              {earnedCount}/{totalCount} Unlocked
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-5">
        <Card variant="glow" className="p-5 mb-6">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm text-gray-400">Achievement Score</p>
              <p className="text-3xl font-bold text-white">{earnedCount}<span className="text-gray-500 text-lg">/{totalCount}</span></p>
            </div>
            <div className="text-5xl animate-float">🏆</div>
          </div>
          <div className="h-3 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-amber-400 to-yellow-300"
              initial={{ width: 0 }}
              animate={{ width: `${(earnedCount / totalCount) * 100}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {earnedCount === 0
              ? "Complete your first mission to start earning achievements!"
              : earnedCount < 5
              ? "Great start! Keep playing to unlock more!"
              : earnedCount < 15
              ? "You're on a roll! Amazing progress!"
              : "You're an achievement machine! 🔥"}
          </p>
        </Card>

        {CATEGORIES.map(({ id, label, emoji }) => {
          const achievements = ALL_ACHIEVEMENTS.filter(
            (a) => (id === "all" || a.category === id) && !a.secret
          );
          if (achievements.length === 0) return null;

          return (
            <div key={id} className="mb-6">
              <h2 className="font-bold text-white text-sm mb-3 flex items-center gap-2">
                <span>{emoji}</span> {label}
                <span className="text-gray-500 font-normal text-xs">
                  ({achievements.filter((a) => earnedIds.has(a.id)).length}/{achievements.length})
                </span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {achievements.map((achievement, i) => {
                  const unlocked = earnedIds.has(achievement.id);
                  const rarity = RARITY_COLORS[achievement.rarity];

                  return (
                    <motion.div
                      key={achievement.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.03 }}
                    >
                      <div
                        className={cn(
                          "flex items-center gap-3 p-3 rounded-2xl border transition-all",
                          unlocked
                            ? `${rarity.bg} ${rarity.border}`
                            : "bg-white/5 border-white/10 opacity-60 grayscale"
                        )}
                      >
                        <div
                          className={cn(
                            "w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0 border",
                            unlocked ? `${rarity.bg} ${rarity.border}` : "bg-gray-800 border-gray-700"
                          )}
                        >
                          {unlocked ? achievement.emoji : "🔒"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={cn("text-sm font-bold leading-tight", unlocked ? "text-white" : "text-gray-500")}>
                            {achievement.name}
                          </p>
                          <p className="text-xs text-gray-500 leading-tight mt-0.5">
                            {achievement.description}
                          </p>
                          {unlocked && (
                            <div className="flex gap-2 mt-1">
                              {achievement.xpReward > 0 && (
                                <span className="text-[10px] text-blue-400">+{achievement.xpReward} XP</span>
                              )}
                              {achievement.coinReward > 0 && (
                                <span className="text-[10px] text-yellow-400">+{achievement.coinReward}🪙</span>
                              )}
                              {achievement.gemReward > 0 && (
                                <span className="text-[10px] text-purple-400">+{achievement.gemReward}💜</span>
                              )}
                            </div>
                          )}
                        </div>
                        {unlocked && (
                          <Badge
                            variant={
                              achievement.rarity === "legendary"
                                ? "gold"
                                : achievement.rarity === "epic"
                                ? "purple"
                                : achievement.rarity === "rare"
                                ? "blue"
                                : "gray"
                            }
                            className="shrink-0 text-[10px] capitalize"
                          >
                            {achievement.rarity}
                          </Badge>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <GameNav profileId={profileId} achievementCount={earnedCount} />
    </div>
  );
}
