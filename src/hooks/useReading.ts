"use client";

import { useCallback } from "react";
import { useReadingStore } from "@/store/readingStore";
import { useProgressStore } from "@/store/progressStore";
import { useAchievements } from "@/hooks/useAchievements";
import {
  getReadingProgress,
  initReadingProgress,
  startReadingSession,
  completeReadingSession,
  addVocabularyWord,
  updateReadingStats,
} from "@/lib/firebase/reading";
import { updateStudentProgress } from "@/lib/firebase/firestore";
import { getStoryById } from "@/data/stories";
import { VocabWord } from "@/types/reading";
import { StudentProgress } from "@/types/progress";


export function useReading(studentId?: string) {
  const {
    progressMap,
    activeStoryId,
    activePage,
    sessionId,
    sessionStartTime,
    wordsLearnedThisSession,
    setProgress,
    addVocabEntry,
    markStoryRead,
    setActiveStory,
    setPage,
    addLearnedWord,
    clearSession,
  } = useReadingStore();

  const { updateProgress, progressMap: gameProgressMap } = useProgressStore();
  const { tryUnlock } = useAchievements(studentId);

  const readingProgress = studentId ? progressMap[studentId] : undefined;
  const gameProgress = studentId ? gameProgressMap[studentId] : undefined;

  const loadReadingProgress = useCallback(async (studentProgress?: StudentProgress) => {
    if (!studentId) return;
    const p = await getReadingProgress(studentId);
    const readingProg = p ?? await initReadingProgress(studentId);
    setProgress(studentId, readingProg);

    // One-time migration: sync already-read stories to completedLevelItems
    if (studentProgress && (readingProg.storiesRead?.length ?? 0) > 0) {
      const migrateKey = `reading_lvl_sync_${studentId}`;
      if (!localStorage.getItem(migrateKey)) {
        try {
          const currentItems = studentProgress.completedLevelItems ?? {};
          const newItems: Record<string, string[]> = { ...currentItems };
          let changed = false;

          for (const storyId of (readingProg.storiesRead ?? [])) {
            const story = getStoryById(storyId);
            if (!story) continue;
            const key = String(story.levelId);
            if (!(newItems[key] ?? []).includes(storyId)) {
              newItems[key] = [...(newItems[key] ?? []), storyId];
              changed = true;
            }
          }

          if (changed) {
            await updateStudentProgress(studentId, { completedLevelItems: newItems });
            updateProgress(studentId, { completedLevelItems: newItems });
          }
        } catch { /* migration errors are non-fatal */ }
        localStorage.setItem(migrateKey, "1");
      }
    }
  }, [studentId, setProgress, updateProgress]);

  const beginStory = useCallback(
    async (storyId: string) => {
      if (!studentId) return;
      try {
        const session = await startReadingSession(studentId, storyId);
        setActiveStory(storyId, session.id);
      } catch {
        setActiveStory(storyId, "local-" + Date.now());
      }
    },
    [studentId, setActiveStory]
  );

  const learnWord = useCallback(
    async (word: VocabWord, storyId: string) => {
      if (!studentId) return;
      addLearnedWord(word.word);
      try {
        await addVocabularyWord(studentId, {
          word: word.word,
          definition: word.definition,
          emoji: word.emoji,
          storyId,
        });
      } catch {
        console.error("Failed to save vocabulary word");
      }
    },
    [studentId, addLearnedWord]
  );

  const completeStory = useCallback(
    async (
      storyId: string,
      questionsCorrect: number,
      questionsTotal: number,
      wordCount: number,
      crystalReward: number,
      xpReward: number,
      coinReward: number
    ) => {
      if (!studentId) return 0;

      const score = Math.round((questionsCorrect / questionsTotal) * 100);
      const timeSpent = sessionStartTime
        ? Math.round((Date.now() - sessionStartTime) / 1000)
        : 60;

      if (sessionId && !sessionId.startsWith("local-")) {
        try {
          await completeReadingSession(sessionId, {
            pagesRead: activePage + 1,
            comprehensionScore: score,
            questionsCorrect,
            questionsTotal,
            wordsLearned: wordsLearnedThisSession,
            crystalsEarned: crystalReward,
            xpEarned: xpReward,
            timeSpentSeconds: timeSpent,
          });
        } catch {
          console.error("Failed to complete session");
        }
      }

      try {
        await updateReadingStats(studentId, {
          storyId,
          wordsRead: wordCount,
          comprehensionScore: score,
        });
      } catch {
        console.error("Failed to update reading stats");
      }

      const prevXP = gameProgress?.xp ?? 0;
      const prevCoins = gameProgress?.coins ?? 0;
      const prevReading = gameProgress?.readingPercent ?? 0;
      const prevVocab = gameProgress?.vocabularyPercent ?? 0;

      const newXP = prevXP + xpReward;
      const newCoins = prevCoins + coinReward;
      const readingBoost = Math.min(5, score / 20);
      const vocabBoost = wordsLearnedThisSession.length * 0.5;
      const newReading = Math.min(100, prevReading + readingBoost);
      const newVocab = Math.min(100, prevVocab + vocabBoost);

      const prevMath = gameProgress?.mathPercent ?? 0;
      const prevSpelling = gameProgress?.spellingPercent ?? 0;
      const prevWriting = gameProgress?.writingPercent ?? 0;
      const newOverall = Math.round((newReading + prevMath + prevSpelling + prevWriting + newVocab) / 5);

      const prevCrystals = gameProgress?.crystals?.earned ?? 0;
      const newCrystalsEarned = prevCrystals + crystalReward;

      // Track level item on first completion
      const isFirstCompletion = !readingProgress?.storiesRead?.includes(storyId);
      const story = getStoryById(storyId);
      const prevItems = gameProgress?.completedLevelItems ?? {};
      let newLevelItems = prevItems;
      if (isFirstCompletion && story) {
        const key = String(story.levelId);
        const existing = prevItems[key] ?? [];
        if (!existing.includes(storyId)) {
          newLevelItems = { ...prevItems, [key]: [...existing, storyId] };
        }
      }

      try {
        await updateStudentProgress(studentId, {
          xp: newXP,
          coins: newCoins,
          readingPercent: newReading,
          vocabularyPercent: newVocab,
          overallPercent: newOverall,
          crystals: { total: 100, earned: newCrystalsEarned, byLevel: gameProgress?.crystals?.byLevel ?? {} },
          totalPlaytimeMinutes: (gameProgress?.totalPlaytimeMinutes ?? 0) + Math.ceil(timeSpent / 60),
          lastPlayedAt: new Date().toISOString(),
          ...(newLevelItems !== prevItems ? { completedLevelItems: newLevelItems } : {}),
        });
        updateProgress(studentId, {
          xp: newXP,
          coins: newCoins,
          readingPercent: newReading,
          vocabularyPercent: newVocab,
          overallPercent: newOverall,
          crystals: { total: 100, earned: newCrystalsEarned, byLevel: gameProgress?.crystals?.byLevel ?? {} },
          ...(newLevelItems !== prevItems ? { completedLevelItems: newLevelItems } : {}),
        });
      } catch {
        console.error("Failed to update game progress");
      }

      markStoryRead(studentId, storyId);

      await tryUnlock("first_story");
      if ((readingProgress?.sessionsCompleted ?? 0) + 1 >= 10) {
        await tryUnlock("bookworm");
      }
      if (score >= 90) {
        await tryUnlock("speed_reader");
        await tryUnlock("perfect_score");
      }
      if (wordsLearnedThisSession.length >= 5) {
        await tryUnlock("vocab_hero");
      }

      clearSession();
      return score;
    },
    [
      studentId,
      sessionId,
      sessionStartTime,
      activePage,
      wordsLearnedThisSession,
      gameProgress,
      readingProgress,
      updateProgress,
      markStoryRead,
      tryUnlock,
      clearSession,
    ]
  );

  return {
    readingProgress,
    activeStoryId,
    activePage,
    wordsLearnedThisSession,
    loadReadingProgress,
    beginStory,
    learnWord,
    completeStory,
    setPage,
    clearSession,
  };
}
