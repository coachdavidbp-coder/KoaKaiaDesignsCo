import { create } from "zustand";
import { MathProgress } from "@/types/math";

interface MathState {
  progressMap: Record<string, MathProgress>;
  setProgress: (studentId: string, progress: MathProgress) => void;
  markMissionComplete: (studentId: string, missionId: string) => void;
}

export const useMathStore = create<MathState>()((set) => ({
  progressMap: {},

  setProgress: (studentId, progress) =>
    set((state) => ({
      progressMap: { ...state.progressMap, [studentId]: progress },
    })),

  markMissionComplete: (studentId, missionId) =>
    set((state) => {
      const existing = state.progressMap[studentId];
      if (!existing || existing.missionsCompleted.includes(missionId)) return state;
      return {
        progressMap: {
          ...state.progressMap,
          [studentId]: {
            ...existing,
            missionsCompleted: [...existing.missionsCompleted, missionId],
          },
        },
      };
    }),
}));
