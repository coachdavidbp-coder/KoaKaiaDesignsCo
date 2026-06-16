import { updateStudentProgress } from "./firestore";
import { StudentProgress } from "@/types/progress";

export async function updateStreakOnVisit(
  studentId: string,
  progress: StudentProgress
): Promise<number> {
  const todayStr = new Date().toISOString().split("T")[0];
  const lastStr = progress.lastPlayedAt
    ? progress.lastPlayedAt.split("T")[0]
    : null;

  if (lastStr === todayStr) return progress.streak;

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split("T")[0];

  const newStreak = lastStr === yesterdayStr ? progress.streak + 1 : 1;

  const { readingPercent, spellingPercent, mathPercent, writingPercent, vocabularyPercent } = progress;
  const overallPercent = Math.round(
    (readingPercent + spellingPercent + mathPercent + writingPercent + (vocabularyPercent ?? 0)) / 5
  );

  await updateStudentProgress(studentId, {
    streak: newStreak,
    lastPlayedAt: new Date().toISOString(),
    overallPercent,
  });

  return newStreak;
}

export async function checkAndUnlockLevels(
  studentId: string,
  progress: StudentProgress
): Promise<number[]> {
  const { levels } = progress;

  const unlocked: number[] = [];
  const updatedLevels = levels.map((l) => {
    if (!l.isUnlocked) {
      unlocked.push(l.levelId);
      return { ...l, isUnlocked: true };
    }
    return { ...l };
  });

  if (unlocked.length > 0) {
    await updateStudentProgress(studentId, { levels: updatedLevels });
  }

  return unlocked;
}
