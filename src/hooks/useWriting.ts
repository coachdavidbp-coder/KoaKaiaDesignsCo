"use client";

import { useCallback } from "react";
import { useWritingStore } from "@/store/writingStore";
import { useProgressStore } from "@/store/progressStore";
import { useAchievements } from "@/hooks/useAchievements";
import {
  getWritingProgress,
  initWritingProgress,
  completeWritingSet,
  saveStory,
} from "@/lib/firebase/writing";
import { updateStudentProgress } from "@/lib/firebase/firestore";
import { getWritingSetById } from "@/data/writing";
import { ActivityResult, SavedStory } from "@/types/writing";
import { StudentProgress } from "@/types/progress";
import { v4 as uuid } from "uuid";

export function useWriting(studentId?: string) {
  const { progressMap, setProgress, markSetComplete, addStory } = useWritingStore();
  const { updateProgress, progressMap: gameProgressMap } = useProgressStore();
  const { tryUnlock } = useAchievements(studentId);

  const writingProgress = studentId ? progressMap[studentId] : undefined;
  const gameProgress = studentId ? gameProgressMap[studentId] : undefined;

  const loadWritingProgress = useCallback(async (studentProgress?: StudentProgress) => {
    if (!studentId) return;
    const p = await getWritingProgress(studentId);
    const writingProg = p ?? await initWritingProgress(studentId);
    setProgress(studentId, writingProg);

    // One-time migration: sync already-completed writing sets to completedLevelItems
    if (studentProgress && (writingProg.setsCompleted?.length ?? 0) > 0) {
      const migrateKey = `writing_lvl_sync_${studentId}`;
      if (!localStorage.getItem(migrateKey)) {
        try {
          const currentItems = studentProgress.completedLevelItems ?? {};
          const newItems: Record<string, string[]> = { ...currentItems };
          let changed = false;

          for (const setId of (writingProg.setsCompleted ?? [])) {
            const set = getWritingSetById(setId);
            if (!set) continue;
            const key = String(set.levelId);
            if (!(newItems[key] ?? []).includes(setId)) {
              newItems[key] = [...(newItems[key] ?? []), setId];
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

  const finishSet = useCallback(
    async (
      setId: string,
      results: ActivityResult[],
      xpReward: number,
      coinReward: number,
      crystalReward: number = 0
    ) => {
      if (!studentId || !writingProgress) return 0;

      const updated = await completeWritingSet(studentId, setId, results, writingProgress);
      const isFirstCompletion = updated.setsCompleted.includes(setId) && !writingProgress.setsCompleted.includes(setId);
      if (isFirstCompletion) markSetComplete(studentId, setId);

      const correct = results.filter((r) => r.correct).length;
      const score = Math.round((correct / Math.max(results.length, 1)) * 100);
      const xpBonus = score >= 80 ? Math.round(xpReward * 1.2) : xpReward;

      const prevXP = gameProgress?.xp ?? 0;
      const prevCoins = gameProgress?.coins ?? 0;
      const prevWriting = gameProgress?.writingPercent ?? 0;
      const writingBoost = Math.min(4, score / 25);
      const newWriting = Math.min(100, prevWriting + writingBoost);

      const prevReading = gameProgress?.readingPercent ?? 0;
      const prevMath = gameProgress?.mathPercent ?? 0;
      const prevSpelling = gameProgress?.spellingPercent ?? 0;
      const prevVocab = gameProgress?.vocabularyPercent ?? 0;
      const newOverall = Math.round((newWriting + prevReading + prevMath + prevSpelling + prevVocab) / 5);

      const prevCrystals = gameProgress?.crystals?.earned ?? 0;
      const newCrystalsEarned = prevCrystals + crystalReward;

      // Track level item on first completion
      const writingSet = getWritingSetById(setId);
      const prevItems = gameProgress?.completedLevelItems ?? {};
      let newLevelItems = prevItems;
      if (isFirstCompletion && writingSet) {
        const key = String(writingSet.levelId);
        const existing = prevItems[key] ?? [];
        if (!existing.includes(setId)) {
          newLevelItems = { ...prevItems, [key]: [...existing, setId] };
        }
      }

      try {
        await updateStudentProgress(studentId, {
          xp: prevXP + xpBonus,
          coins: prevCoins + coinReward,
          writingPercent: newWriting,
          overallPercent: newOverall,
          crystals: { total: 100, earned: newCrystalsEarned, byLevel: gameProgress?.crystals?.byLevel ?? {} },
          lastPlayedAt: new Date().toISOString(),
          ...(newLevelItems !== prevItems ? { completedLevelItems: newLevelItems } : {}),
        });
        updateProgress(studentId, {
          xp: prevXP + xpBonus,
          coins: prevCoins + coinReward,
          writingPercent: newWriting,
          overallPercent: newOverall,
          crystals: { total: 100, earned: newCrystalsEarned, byLevel: gameProgress?.crystals?.byLevel ?? {} },
          ...(newLevelItems !== prevItems ? { completedLevelItems: newLevelItems } : {}),
        });
      } catch {
        console.error("Failed to update game progress");
      }

      if (score === 100) await tryUnlock("perfect_score");

      return score;
    },
    [studentId, writingProgress, gameProgress, markSetComplete, updateProgress, tryUnlock]
  );

  const submitStory = useCallback(
    async (
      promptId: string,
      promptText: string,
      studentText: string,
      scene: string[],
      xpReward: number,
      coinReward: number
    ) => {
      if (!studentId || !writingProgress) return;

      const wordCount = studentText.trim().split(/\s+/).filter(Boolean).length;
      const story: SavedStory = {
        id: uuid(),
        promptId,
        promptText,
        studentText,
        wordCount,
        scene,
        writtenAt: new Date().toISOString(),
      };

      try {
        await saveStory(studentId, story);
        addStory(studentId, story);
      } catch {
        console.error("Failed to save story");
      }

      const prevXP = gameProgress?.xp ?? 0;
      const prevCoins = gameProgress?.coins ?? 0;
      const prevWriting = gameProgress?.writingPercent ?? 0;
      const boost = Math.min(5, wordCount / 10);

      try {
        await updateStudentProgress(studentId, {
          xp: prevXP + xpReward,
          coins: prevCoins + coinReward,
          writingPercent: Math.min(100, prevWriting + boost),
          lastPlayedAt: new Date().toISOString(),
        });
        updateProgress(studentId, {
          xp: prevXP + xpReward,
          coins: prevCoins + coinReward,
          writingPercent: Math.min(100, prevWriting + boost),
        });
      } catch {
        console.error("Failed to update game progress");
      }

      if ((writingProgress.stories.length + 1) >= 3) await tryUnlock("bookworm");
    },
    [studentId, writingProgress, gameProgress, addStory, updateProgress, tryUnlock]
  );

  return {
    writingProgress,
    loadWritingProgress,
    finishSet,
    submitStory,
  };
}
