import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "./config";
import {
  SpellingProgress,
  WordMastery,
  MasteryLevel,
  SessionWordResult,
} from "@/types/spelling";

function advanceMastery(current: MasteryLevel, correctStreak: number): MasteryLevel {
  if (current === "mastered") return "mastered";
  if (current === "new" && correctStreak >= 1) return "learning";
  if (current === "learning" && correctStreak >= 2) return "practicing";
  if (current === "practicing" && correctStreak >= 3) return "mastered";
  return current;
}

function spellingRef(studentId: string) {
  return doc(db, "spelling", studentId);
}

export async function getSpellingProgress(studentId: string): Promise<SpellingProgress | null> {
  const snap = await getDoc(spellingRef(studentId));
  if (!snap.exists()) return null;
  return snap.data() as SpellingProgress;
}

export async function initSpellingProgress(studentId: string): Promise<SpellingProgress> {
  const progress: SpellingProgress = {
    studentId,
    wordMastery: {},
    setsCompleted: [],
    totalWordsMastered: 0,
    updatedAt: new Date().toISOString(),
  };
  await setDoc(spellingRef(studentId), progress);
  return progress;
}

export async function updateWordMastery(
  studentId: string,
  results: SessionWordResult[],
  setId: string,
  existingProgress: SpellingProgress
): Promise<SpellingProgress> {
  const mastery = { ...existingProgress.wordMastery };

  for (const result of results) {
    const key = result.word;
    const current: WordMastery = mastery[key] ?? {
      word: result.word,
      setId,
      level: "new",
      correctStreak: 0,
      totalAttempts: 0,
      correctAttempts: 0,
      lastSeenAt: new Date().toISOString(),
      masteredAt: null,
    };

    const newStreak = result.correct ? current.correctStreak + 1 : 0;
    const newLevel = result.correct
      ? advanceMastery(current.level, newStreak)
      : current.level;
    const isMastered = newLevel === "mastered" && current.level !== "mastered";

    mastery[key] = {
      ...current,
      level: newLevel,
      correctStreak: newStreak,
      totalAttempts: current.totalAttempts + result.attempts,
      correctAttempts: current.correctAttempts + (result.correct ? 1 : 0),
      lastSeenAt: new Date().toISOString(),
      masteredAt: isMastered ? new Date().toISOString() : current.masteredAt,
    };
  }

  const totalWordsMastered = Object.values(mastery).filter(
    (m) => m.level === "mastered"
  ).length;

  const allInSetMastered = results
    .map((r) => mastery[r.word]?.level)
    .every((l) => l === "mastered");

  const setsCompleted = allInSetMastered && !existingProgress.setsCompleted.includes(setId)
    ? [...existingProgress.setsCompleted, setId]
    : existingProgress.setsCompleted;

  const updated: SpellingProgress = {
    ...existingProgress,
    wordMastery: mastery,
    setsCompleted,
    totalWordsMastered,
    updatedAt: new Date().toISOString(),
  };

  await updateDoc(spellingRef(studentId), {
    wordMastery: mastery,
    setsCompleted,
    totalWordsMastered,
    updatedAt: updated.updatedAt,
  });

  return updated;
}
