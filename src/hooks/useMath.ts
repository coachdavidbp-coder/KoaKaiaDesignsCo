"use client";

import { useCallback } from "react";
import { useMathStore } from "@/store/mathStore";
import { useProgressStore } from "@/store/progressStore";
import { useAchievements } from "@/hooks/useAchievements";
import { getMathProgress, initMathProgress, completeMathMission } from "@/lib/firebase/math";
import { updateStudentProgress } from "@/lib/firebase/firestore";
import { getMathMissionById } from "@/data/math";
import { MathProblemResult } from "@/types/math";
import { StudentProgress } from "@/types/progress";

export function useMath(studentId?: string) {
  const { progressMap, setProgress, markMissionComplete } = useMathStore();
  const { updateProgress, progressMap: gameProgressMap } = useProgressStore();
  const { tryUnlock } = useAchievements(studentId);

  const mathProgress = studentId ? progressMap[studentId] : undefined;
  const gameProgress = studentId ? gameProgressMap[studentId] : undefined;

  const loadMathProgress = useCallback(async (studentProgress?: StudentProgress) => {
    if (!studentId) return;
    const p = await getMathProgress(studentId);
    const mathProg = p ?? await initMathProgress(studentId);
    setProgress(studentId, mathProg);

    // One-time migration: sync already-completed math missions to completedLevelItems
    if (studentProgress && mathProg.missionsCompleted.length > 0) {
      const migrateKey = `math_lvl_sync_${studentId}`;
      if (!localStorage.getItem(migrateKey)) {
        try {
          const currentItems = studentProgress.completedLevelItems ?? {};
          const newItems: Record<string, string[]> = { ...currentItems };
          let changed = false;

          for (const missionId of mathProg.missionsCompleted) {
            const mission = getMathMissionById(missionId);
            if (!mission) continue;
            const key = String(mission.levelId);
            if (!(newItems[key] ?? []).includes(missionId)) {
              newItems[key] = [...(newItems[key] ?? []), missionId];
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

  const finishMission = useCallback(
    async (
      missionId: string,
      results: MathProblemResult[],
      xpReward: number,
      coinReward: number,
      crystalReward: number = 0
    ) => {
      if (!studentId || !mathProgress) return { score: 0, xpEarned: 0 };

      const updated = await completeMathMission(studentId, missionId, results, mathProgress);
      const isFirstCompletion = updated.missionsCompleted.includes(missionId) && !mathProgress.missionsCompleted.includes(missionId);
      if (isFirstCompletion) markMissionComplete(studentId, missionId);

      const correct = results.filter((r) => r.correct).length;
      const score = Math.round((correct / results.length) * 100);
      const xpBonus = score >= 80 ? Math.round(xpReward * 1.25) : xpReward;

      const prevXP = gameProgress?.xp ?? 0;
      const prevCoins = gameProgress?.coins ?? 0;
      const prevMath = gameProgress?.mathPercent ?? 0;
      const mathBoost = Math.min(4, score / 25);
      const newMath = Math.min(100, prevMath + mathBoost);

      const prevReading = gameProgress?.readingPercent ?? 0;
      const prevSpelling = gameProgress?.spellingPercent ?? 0;
      const prevWriting = gameProgress?.writingPercent ?? 0;
      const prevVocab = gameProgress?.vocabularyPercent ?? 0;
      const newOverall = Math.round((newMath + prevReading + prevSpelling + prevWriting + prevVocab) / 5);

      const prevCrystals = gameProgress?.crystals?.earned ?? 0;
      const newCrystalsEarned = prevCrystals + crystalReward;

      // Track this completion in completedLevelItems for level unlock
      const mission = getMathMissionById(missionId);
      const prevItems = gameProgress?.completedLevelItems ?? {};
      let newLevelItems = prevItems;
      if (isFirstCompletion && mission) {
        const key = String(mission.levelId);
        const existing = prevItems[key] ?? [];
        if (!existing.includes(missionId)) {
          newLevelItems = { ...prevItems, [key]: [...existing, missionId] };
        }
      }

      try {
        await updateStudentProgress(studentId, {
          xp: prevXP + xpBonus,
          coins: prevCoins + coinReward,
          mathPercent: newMath,
          overallPercent: newOverall,
          crystals: { total: 100, earned: newCrystalsEarned, byLevel: gameProgress?.crystals?.byLevel ?? {} },
          lastPlayedAt: new Date().toISOString(),
          ...(newLevelItems !== prevItems ? { completedLevelItems: newLevelItems } : {}),
        });
        updateProgress(studentId, {
          xp: prevXP + xpBonus,
          coins: prevCoins + coinReward,
          mathPercent: newMath,
          overallPercent: newOverall,
          crystals: { total: 100, earned: newCrystalsEarned, byLevel: gameProgress?.crystals?.byLevel ?? {} },
          ...(newLevelItems !== prevItems ? { completedLevelItems: newLevelItems } : {}),
        });
      } catch {
        console.error("Failed to update game progress");
      }

      if (score === 100) await tryUnlock("perfect_score");

      return { score, xpEarned: xpBonus };
    },
    [studentId, mathProgress, gameProgress, markMissionComplete, updateProgress, tryUnlock]
  );

  return { mathProgress, loadMathProgress, finishMission };
}
