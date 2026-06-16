"use client";

import { useCallback } from "react";
import { useSpellingStore } from "@/store/spellingStore";
import { useProgressStore } from "@/store/progressStore";
import { useAchievements } from "@/hooks/useAchievements";
import {
  getSpellingProgress,
  initSpellingProgress,
  updateWordMastery,
} from "@/lib/firebase/spelling";
import { updateStudentProgress } from "@/lib/firebase/firestore";
import { getSpellingSetById } from "@/data/spelling";
import { SessionWordResult } from "@/types/spelling";
import { StudentProgress } from "@/types/progress";

export function useSpelling(studentId?: string) {
  const { progressMap, setProgress, updateMastery } = useSpellingStore();
  const { updateProgress, progressMap: gameProgressMap } = useProgressStore();
  const { tryUnlock } = useAchievements(studentId);

  const spellingProgress = studentId ? progressMap[studentId] : undefined;
  const gameProgress = studentId ? gameProgressMap[studentId] : undefined;

  const loadSpellingProgress = useCallback(async (studentProgress?: StudentProgress) => {
    if (!studentId) return;
    const p = await getSpellingProgress(studentId);
    const spellingProg = p ?? await initSpellingProgress(studentId);
    setProgress(studentId, spellingProg);

    // One-time migration: sync already-completed spelling sets to completedLevelItems
    if (studentProgress && (spellingProg.setsCompleted?.length ?? 0) > 0) {
      const migrateKey = `spelling_lvl_sync_${studentId}`;
      if (!localStorage.getItem(migrateKey)) {
        try {
          const currentItems = studentProgress.completedLevelItems ?? {};
          const newItems: Record<string, string[]> = { ...currentItems };
          let changed = false;

          for (const setId of (spellingProg.setsCompleted ?? [])) {
            const set = getSpellingSetById(setId);
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

  const finishSession = useCallback(
    async (
      setId: string,
      results: SessionWordResult[],
      xpReward: number,
      coinReward: number,
      crystalReward: number = 0
    ) => {
      if (!studentId || !spellingProgress) return;

      const updated = await updateWordMastery(studentId, results, setId, spellingProgress);
      const isFirstCompletion = updated.setsCompleted.includes(setId) && !spellingProgress.setsCompleted?.includes(setId);

      updateMastery(studentId, updated.wordMastery, updated.setsCompleted, updated.totalWordsMastered);

      const correctCount = results.filter((r) => r.correct).length;
      const score = Math.round((correctCount / results.length) * 100);
      const xpBonus = score >= 80 ? Math.round(xpReward * 1.25) : xpReward;

      const prevXP = gameProgress?.xp ?? 0;
      const prevCoins = gameProgress?.coins ?? 0;
      const prevSpelling = gameProgress?.spellingPercent ?? 0;

      const masteredCount = Object.values(updated.wordMastery).filter((m) => m.level === "mastered").length;
      const totalWords = Object.keys(updated.wordMastery).length;
      const spellingBoost = Math.min(3, (masteredCount / Math.max(totalWords, 1)) * 5);
      const newSpelling = Math.min(100, prevSpelling + spellingBoost);

      const prevReading = gameProgress?.readingPercent ?? 0;
      const prevMath = gameProgress?.mathPercent ?? 0;
      const prevWriting = gameProgress?.writingPercent ?? 0;
      const prevVocab = gameProgress?.vocabularyPercent ?? 0;
      const newOverall = Math.round((newSpelling + prevReading + prevMath + prevWriting + prevVocab) / 5);

      const prevCrystals = gameProgress?.crystals?.earned ?? 0;
      const newCrystalsEarned = prevCrystals + crystalReward;

      // Track level item on first completion
      const spellingSet = getSpellingSetById(setId);
      const prevItems = gameProgress?.completedLevelItems ?? {};
      let newLevelItems = prevItems;
      if (isFirstCompletion && spellingSet) {
        const key = String(spellingSet.levelId);
        const existing = prevItems[key] ?? [];
        if (!existing.includes(setId)) {
          newLevelItems = { ...prevItems, [key]: [...existing, setId] };
        }
      }

      try {
        await updateStudentProgress(studentId, {
          xp: prevXP + xpBonus,
          coins: prevCoins + coinReward,
          spellingPercent: newSpelling,
          overallPercent: newOverall,
          crystals: { total: 100, earned: newCrystalsEarned, byLevel: gameProgress?.crystals?.byLevel ?? {} },
          lastPlayedAt: new Date().toISOString(),
          ...(newLevelItems !== prevItems ? { completedLevelItems: newLevelItems } : {}),
        });
        updateProgress(studentId, {
          xp: prevXP + xpBonus,
          coins: prevCoins + coinReward,
          spellingPercent: newSpelling,
          overallPercent: newOverall,
          crystals: { total: 100, earned: newCrystalsEarned, byLevel: gameProgress?.crystals?.byLevel ?? {} },
          ...(newLevelItems !== prevItems ? { completedLevelItems: newLevelItems } : {}),
        });
      } catch {
        console.error("Failed to update game progress");
      }

      await tryUnlock("first_story");
      if (updated.totalWordsMastered >= 10) await tryUnlock("vocab_hero");
      if (score === 100) await tryUnlock("perfect_score");

      return { score, xpEarned: xpBonus, masteredThisSession: updated.totalWordsMastered };
    },
    [studentId, spellingProgress, gameProgress, updateMastery, updateProgress, tryUnlock]
  );

  return {
    spellingProgress,
    loadSpellingProgress,
    finishSession,
  };
}
