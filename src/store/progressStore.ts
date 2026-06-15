import { create } from "zustand";
import { StudentProgress, MissedItem, DailyActivity } from "@/types/progress";

interface ProgressState {
  progressMap: Record<string, StudentProgress>;
  missedItemsMap: Record<string, MissedItem[]>;
  activityMap: Record<string, DailyActivity[]>;
  isLoading: boolean;
  setProgress: (studentId: string, progress: StudentProgress) => void;
  updateProgress: (studentId: string, updates: Partial<StudentProgress>) => void;
  setMissedItems: (studentId: string, items: MissedItem[]) => void;
  addMissedItem: (studentId: string, item: MissedItem) => void;
  setActivities: (studentId: string, activities: DailyActivity[]) => void;
  setLoading: (loading: boolean) => void;
}

export const useProgressStore = create<ProgressState>()((set) => ({
  progressMap: {},
  missedItemsMap: {},
  activityMap: {},
  isLoading: false,
  setProgress: (studentId, progress) =>
    set((state) => ({
      progressMap: { ...state.progressMap, [studentId]: progress },
    })),
  updateProgress: (studentId, updates) =>
    set((state) => {
      const existing = state.progressMap[studentId];
      if (!existing) return state;
      return {
        progressMap: {
          ...state.progressMap,
          [studentId]: { ...existing, ...updates },
        },
      };
    }),
  setMissedItems: (studentId, items) =>
    set((state) => ({
      missedItemsMap: { ...state.missedItemsMap, [studentId]: items },
    })),
  addMissedItem: (studentId, item) =>
    set((state) => ({
      missedItemsMap: {
        ...state.missedItemsMap,
        [studentId]: [item, ...(state.missedItemsMap[studentId] ?? [])],
      },
    })),
  setActivities: (studentId, activities) =>
    set((state) => ({
      activityMap: { ...state.activityMap, [studentId]: activities },
    })),
  setLoading: (loading) => set({ isLoading: loading }),
}));
