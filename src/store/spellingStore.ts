import { create } from "zustand";
import { SpellingProgress, WordMastery } from "@/types/spelling";

interface SpellingState {
  progressMap: Record<string, SpellingProgress>;
  setProgress: (studentId: string, progress: SpellingProgress) => void;
  updateMastery: (studentId: string, mastery: Record<string, WordMastery>, setsCompleted: string[], totalWordsMastered: number) => void;
}

export const useSpellingStore = create<SpellingState>()((set) => ({
  progressMap: {},

  setProgress: (studentId, progress) =>
    set((state) => ({
      progressMap: { ...state.progressMap, [studentId]: progress },
    })),

  updateMastery: (studentId, mastery, setsCompleted, totalWordsMastered) =>
    set((state) => {
      const existing = state.progressMap[studentId];
      if (!existing) return state;
      return {
        progressMap: {
          ...state.progressMap,
          [studentId]: { ...existing, wordMastery: mastery, setsCompleted, totalWordsMastered },
        },
      };
    }),
}));
