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
import { SessionWordResult } from "@/types/spelling";

export function useSpelling(studentId?: string) {
  const { progressMap, setProgress, updateMastery } = useSpellingStore();
  const { updateProgress, progressMap: gameProgressMap } = useProgressStore();
  const { tryUnlock } = useAchievements(studentId);

  const spellingProgress = studentId ? progressMap[studentId] : undefined;
  const gameProgress = studentId ? gameProgressMap[studentId] : undefined;

  const loadSpellingProgress = useCallback(async () => {
    if (!studentId) return;
    const p = await getSpellingProgress(studentId);
    if (p) {
      setProgress(studentId, p);
    } else {
      const init = await initSpellingProgress(studentId);
      setProgress(studentId, init);
    }
  }, [studentId, setProgress]);

  const finishSession = useCallback(
    async (
      setId: string,
      results: SessionWordResult[],
      xpReward: number,
      coinReward: number,
      crystalReward: number = 0
    ) => {
      if (!studentId || !spellingProgress) return;

      const updated = await updateWordMastery(
        studentId,
        results,
        setId,
        spellingProgress
      );

      updateMastery(
        studentId,
        updated.wordMastery,
        updated.setsCompleted,
        updated.totalWordsMastered
      );

      const correctCount = results.filter((r) => r.correct).length;
      const score = Math.round((correctCount / results.length) * 100);
      const xpBonus = score >= 80 ? Math.round(xpReward * 1.25) : xpReward;

      const prevXP = gameProgress?.xp ?? 0;
      const prevCoins = gameProgress?.coins ?? 0;
      const prevSpelling = gameProgress?.spellingPercent ?? 0;

      const masteredCount = Object.values(updated.wordMastery).filter(
        (m) => m.level === "mastered"
      ).length;
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

      try {
        await updateStudentProgress(studentId, {
          xp: prevXP + xpBonus,
          coins: prevCoins + coinReward,
          spellingPercent: newSpelling,
          overallPercent: newOverall,
          crystals: { total: 100, earned: newCrystalsEarned, byLevel: gameProgress?.crystals?.byLevel ?? {} },
          lastPlayedAt: new Date().toISOString(),
        });
        updateProgress(studentId, {
          xp: prevXP + xpBonus,
          coins: prevCoins + coinReward,
          spellingPercent: newSpelling,
          overallPercent: newOverall,
          crystals: { total: 100, earned: newCrystalsEarned, byLevel: gameProgress?.crystals?.byLevel ?? {} },
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
