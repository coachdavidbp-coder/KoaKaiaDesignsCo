import { create } from "zustand";
import { StudentAchievements, Achievement } from "@/types/achievements";

interface AchievementState {
  achievementsMap: Record<string, StudentAchievements>;
  pendingUnlock: Achievement | null;
  setAchievements: (studentId: string, data: StudentAchievements) => void;
  addEarned: (studentId: string, achievementId: string) => void;
  setPendingUnlock: (achievement: Achievement | null) => void;
}

export const useAchievementStore = create<AchievementState>()((set) => ({
  achievementsMap: {},
  pendingUnlock: null,
  setAchievements: (studentId, data) =>
    set((state) => ({
      achievementsMap: { ...state.achievementsMap, [studentId]: data },
    })),
  addEarned: (studentId, achievementId) =>
    set((state) => {
      const existing = state.achievementsMap[studentId];
      if (!existing) return state;
      const alreadyEarned = existing.earned.some((e) => e.achievementId === achievementId);
      if (alreadyEarned) return state;
      return {
        achievementsMap: {
          ...state.achievementsMap,
          [studentId]: {
            ...existing,
            earned: [
              ...existing.earned,
              { achievementId, earnedAt: new Date().toISOString() },
            ],
          },
        },
      };
    }),
  setPendingUnlock: (achievement) => set({ pendingUnlock: achievement }),
}));
