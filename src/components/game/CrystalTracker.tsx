"use client";

import { motion } from "framer-motion";
import { GAME_LEVELS } from "@/types/game";
import { StudentProgress } from "@/types/progress";

interface CrystalTrackerProps {
  progress: StudentProgress | null;
}

export function CrystalTracker({ progress }: CrystalTrackerProps) {
  const crystalsByLevel = progress?.crystals.byLevel ?? {};
  const totalEarned = progress?.crystals.earned ?? 0;

  const allCrystals: Array<{ levelId: number; earned: boolean; index: number }> = [];
  let globalIndex = 0;
  GAME_LEVELS.forEach((level) => {
    const earned = crystalsByLevel[level.id] ?? 0;
    for (let i = 0; i < level.crystalCount; i++) {
      allCrystals.push({ levelId: level.id, earned: i < earned, index: globalIndex++ });
    }
  });

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-white text-sm">Knowledge Crystals</h3>
        <span className="text-amber-300 font-bold text-sm">
          {totalEarned}/100 💎
        </span>
      </div>

      <div className="flex flex-wrap gap-1">
        {allCrystals.map((c) => {
          const level = GAME_LEVELS.find((l) => l.id === c.levelId)!;
          return (
            <motion.div
              key={c.index}
              initial={c.earned ? { scale: 0 } : false}
              animate={{ scale: 1 }}
              transition={{ delay: c.index * 0.01, type: "spring", stiffness: 400 }}
              className="relative"
              title={`${level.name} Crystal ${c.index + 1}`}
            >
              <div
                className={`w-4 h-4 rounded-sm transition-all duration-300 ${
                  c.earned
                    ? "opacity-100"
                    : "opacity-20 bg-gray-600"
                }`}
                style={
                  c.earned
                    ? {
                        background: `linear-gradient(135deg, ${level.theme.primaryColor}, ${level.theme.secondaryColor})`,
                        boxShadow: `0 0 4px ${level.theme.primaryColor}60`,
                      }
                    : undefined
                }
              />
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-3 gap-2 mt-1">
        {GAME_LEVELS.slice(0, 6).map((level) => {
          const earned = crystalsByLevel[level.id] ?? 0;
          const pct = (earned / level.crystalCount) * 100;
          return (
            <div key={level.id} className="text-xs">
              <div className="flex items-center justify-between mb-0.5">
                <span className="text-gray-400 truncate">
                  {level.theme.icon} L{level.id}
                </span>
                <span
                  className="font-medium"
                  style={{ color: earned > 0 ? level.theme.primaryColor : "#6B7280" }}
                >
                  {earned}/{level.crystalCount}
                </span>
              </div>
              <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${pct}%`,
                    background: `linear-gradient(90deg, ${level.theme.primaryColor}, ${level.theme.secondaryColor})`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
