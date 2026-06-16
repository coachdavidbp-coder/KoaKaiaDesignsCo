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

// Items needed per educational level to unlock the next level
// Level 1: 2 math + 3 reading + 2 spelling + 3 writing = 10
// Level 3: 3 math + 2 reading + 2 spelling + 3 writing = 10
// Level 5: 3 math + 2 reading + 2 spelling + 3 writing = 10
const LEVEL_UNLOCK_THRESHOLD: Record<number, number> = { 1: 10, 3: 10, 5: 10 };

// Maps educational content level → next level on the WorldMap to unlock
const NEXT_WORLD_LEVEL: Record<number, number> = { 1: 3, 3: 5 };

export async function checkAndUnlockLevels(
  studentId: string,
  progress: StudentProgress
): Promise<number[]> {
  const { levels, completedLevelItems = {} } = progress;

  const unlocked: number[] = [];
  const updatedLevels = levels.map((l) => ({ ...l }));

  for (const [srcLevelStr, nextWorldLevel] of Object.entries(NEXT_WORLD_LEVEL)) {
    const srcLevelId = Number(srcLevelStr);
    const completedCount = (completedLevelItems[srcLevelStr] ?? []).length;
    const threshold = LEVEL_UNLOCK_THRESHOLD[srcLevelId] ?? 10;

    const nextLevel = updatedLevels.find((l) => l.levelId === nextWorldLevel);
    if (nextLevel && !nextLevel.isUnlocked && completedCount >= threshold) {
      nextLevel.isUnlocked = true;
      unlocked.push(nextWorldLevel);
    }
  }

  if (unlocked.length > 0) {
    await updateStudentProgress(studentId, { levels: updatedLevels });
  }

  return unlocked;
}
