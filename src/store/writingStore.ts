import { create } from "zustand";
import { WritingProgress, SavedStory } from "@/types/writing";

interface WritingState {
  progressMap: Record<string, WritingProgress>;
  setProgress: (studentId: string, progress: WritingProgress) => void;
  markSetComplete: (studentId: string, setId: string) => void;
  addStory: (studentId: string, story: SavedStory) => void;
}

export const useWritingStore = create<WritingState>()((set) => ({
  progressMap: {},

  setProgress: (studentId, progress) =>
    set((state) => ({
      progressMap: { ...state.progressMap, [studentId]: progress },
    })),

  markSetComplete: (studentId, setId) =>
    set((state) => {
      const existing = state.progressMap[studentId];
      if (!existing || existing.setsCompleted.includes(setId)) return state;
      return {
        progressMap: {
          ...state.progressMap,
          [studentId]: {
            ...existing,
            setsCompleted: [...existing.setsCompleted, setId],
          },
        },
      };
    }),

  addStory: (studentId, story) =>
    set((state) => {
      const existing = state.progressMap[studentId];
      if (!existing) return state;
      return {
        progressMap: {
          ...state.progressMap,
          [studentId]: {
            ...existing,
            stories: [...existing.stories, story],
          },
        },
      };
    }),
}));
