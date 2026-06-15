"use client";

import { useCallback } from "react";
import { useMathStore } from "@/store/mathStore";
import { useProgressStore } from "@/store/progressStore";
import { useAchievements } from "@/hooks/useAchievements";
import { getMathProgress, initMathProgress, completeMathMission } from "@/lib/firebase/math";
import { updateStudentProgress } from "@/lib/firebase/firestore";
import { MathProblemResult } from "@/types/math";

export function useMath(studentId?: string) {
  const { progressMap, setProgress, markMissionComplete } = useMathStore();
  const { updateProgress, progressMap: gameProgressMap } = useProgressStore();
  const { tryUnlock } = useAchievements(studentId);

  const mathProgress = studentId ? progressMap[studentId] : undefined;
  const gameProgress = studentId ? gameProgressMap[studentId] : undefined;

  const loadMathProgress = useCallback(async () => {
    if (!studentId) return;
    const p = await getMathProgress(studentId);
    if (p) {
      setProgress(studentId, p);
    } else {
      const init = await initMathProgress(studentId);
      setProgress(studentId, init);
    }
  }, [studentId, setProgress]);

  const finishMission = useCallback(
    async (
      missionId: string,
      results: MathProblemResult[],
      xpReward: number,
      coinReward: number
    ) => {
      if (!studentId || !mathProgress) return { score: 0, xpEarned: 0 };

      const updated = await completeMathMission(studentId, missionId, results, mathProgress);
      if (updated.missionsCompleted.includes(missionId) && !mathProgress.missionsCompleted.includes(missionId)) {
        markMissionComplete(studentId, missionId);
      }

      const correct = results.filter((r) => r.correct).length;
      const score = Math.round((correct / results.length) * 100);
      const xpBonus = score >= 80 ? Math.round(xpReward * 1.25) : xpReward;

      const prevXP = gameProgress?.xp ?? 0;
      const prevCoins = gameProgress?.coins ?? 0;
      const prevMath = gameProgress?.mathPercent ?? 0;
      const mathBoost = Math.min(4, score / 25);

      try {
        await updateStudentProgress(studentId, {
          xp: prevXP + xpBonus,
          coins: prevCoins + coinReward,
          mathPercent: Math.min(100, prevMath + mathBoost),
          lastPlayedAt: new Date().toISOString(),
        });
        updateProgress(studentId, {
          xp: prevXP + xpBonus,
          coins: prevCoins + coinReward,
          mathPercent: Math.min(100, prevMath + mathBoost),
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
