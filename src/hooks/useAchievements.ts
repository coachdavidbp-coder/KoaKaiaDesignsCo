"use client";

import { useCallback } from "react";
import { useAchievementStore } from "@/store/achievementStore";
import {
  getStudentAchievements,
  unlockAchievement,
  initStudentAchievements,
} from "@/lib/firebase/achievements";
import { ALL_ACHIEVEMENTS } from "@/types/achievements";

export function useAchievements(studentId?: string) {
  const { achievementsMap, pendingUnlock, setAchievements, addEarned, setPendingUnlock } =
    useAchievementStore();

  const data = studentId ? achievementsMap[studentId] : undefined;
  const earnedIds = new Set(data?.earned.map((e) => e.achievementId) ?? []);

  const loadAchievements = useCallback(async () => {
    if (!studentId) return;
    const existing = await getStudentAchievements(studentId);
    if (existing) {
      setAchievements(studentId, existing);
    } else {
      await initStudentAchievements(studentId);
      setAchievements(studentId, { studentId, earned: [], updatedAt: new Date().toISOString() });
    }
  }, [studentId, setAchievements]);

  const tryUnlock = useCallback(
    async (achievementId: string) => {
      if (!studentId) return;
      if (earnedIds.has(achievementId)) return;

      const achievement = ALL_ACHIEVEMENTS.find((a) => a.id === achievementId);
      if (!achievement) return;

      await unlockAchievement(studentId, achievementId);
      addEarned(studentId, achievementId);
      setPendingUnlock(achievement);
    },
    [studentId, earnedIds, addEarned, setPendingUnlock]
  );

  const dismissUnlock = useCallback(() => setPendingUnlock(null), [setPendingUnlock]);

  return {
    earned: data?.earned ?? [],
    earnedIds,
    earnedCount: data?.earned.length ?? 0,
    pendingUnlock,
    loadAchievements,
    tryUnlock,
    dismissUnlock,
  };
}
