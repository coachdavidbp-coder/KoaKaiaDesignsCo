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
  const { readingPercent, spellingPercent, mathPercent, writingPercent, levels } = progress;
  const sum = readingPercent + spellingPercent + mathPercent + writingPercent;

  const unlocked: number[] = [];
  const updatedLevels = levels.map((l) => ({ ...l }));

  const level3 = updatedLevels.find((l) => l.levelId === 3);
  if (level3 && !level3.isUnlocked && sum >= 20) {
    level3.isUnlocked = true;
    unlocked.push(3);
  }

  const level5 = updatedLevels.find((l) => l.levelId === 5);
  if (level5 && !level5.isUnlocked && sum >= 60) {
    level5.isUnlocked = true;
    unlocked.push(5);
  }

  if (unlocked.length > 0) {
    await updateStudentProgress(studentId, { levels: updatedLevels });
  }

  return unlocked;
}
