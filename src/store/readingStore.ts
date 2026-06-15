import { create } from "zustand";
import { ReadingProgress, StudentVocabularyEntry } from "@/types/reading";

interface ReadingState {
  progressMap: Record<string, ReadingProgress>;
  activeStoryId: string | null;
  activePage: number;
  sessionId: string | null;
  sessionStartTime: number | null;
  wordsLearnedThisSession: string[];
  setProgress: (studentId: string, progress: ReadingProgress) => void;
  addVocabEntry: (studentId: string, entry: StudentVocabularyEntry) => void;
  markStoryRead: (studentId: string, storyId: string) => void;
  setActiveStory: (storyId: string | null, sessionId?: string) => void;
  setPage: (page: number) => void;
  addLearnedWord: (word: string) => void;
  clearSession: () => void;
}

export const useReadingStore = create<ReadingState>()((set) => ({
  progressMap: {},
  activeStoryId: null,
  activePage: 0,
  sessionId: null,
  sessionStartTime: null,
  wordsLearnedThisSession: [],

  setProgress: (studentId, progress) =>
    set((state) => ({
      progressMap: { ...state.progressMap, [studentId]: progress },
    })),

  addVocabEntry: (studentId, entry) =>
    set((state) => {
      const existing = state.progressMap[studentId];
      if (!existing) return state;
      const vocab = existing.vocabulary.some((v) => v.word === entry.word)
        ? existing.vocabulary.map((v) =>
            v.word === entry.word ? { ...v, seenCount: v.seenCount + 1 } : v
          )
        : [...existing.vocabulary, entry];
      return {
        progressMap: {
          ...state.progressMap,
          [studentId]: { ...existing, vocabulary: vocab },
        },
      };
    }),

  markStoryRead: (studentId, storyId) =>
    set((state) => {
      const existing = state.progressMap[studentId];
      if (!existing) return state;
      if (existing.storiesRead.includes(storyId)) return state;
      return {
        progressMap: {
          ...state.progressMap,
          [studentId]: {
            ...existing,
            storiesRead: [...existing.storiesRead, storyId],
            sessionsCompleted: existing.sessionsCompleted + 1,
          },
        },
      };
    }),

  setActiveStory: (storyId, sessionId) =>
    set({
      activeStoryId: storyId,
      activePage: storyId ? 0 : 0,
      sessionId: sessionId ?? null,
      sessionStartTime: storyId ? Date.now() : null,
      wordsLearnedThisSession: [],
    }),

  setPage: (page) => set({ activePage: page }),

  addLearnedWord: (word) =>
    set((state) => ({
      wordsLearnedThisSession: state.wordsLearnedThisSession.includes(word)
        ? state.wordsLearnedThisSession
        : [...state.wordsLearnedThisSession, word],
    })),

  clearSession: () =>
    set({
      activeStoryId: null,
      activePage: 0,
      sessionId: null,
      sessionStartTime: null,
      wordsLearnedThisSession: [],
    }),
}));
