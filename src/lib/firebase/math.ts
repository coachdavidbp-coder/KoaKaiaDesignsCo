import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "./config";
import { MathProgress, MathProblemResult } from "@/types/math";

function mathRef(studentId: string) {
  return doc(db, "math", studentId);
}

export async function getMathProgress(studentId: string): Promise<MathProgress | null> {
  const snap = await getDoc(mathRef(studentId));
  if (!snap.exists()) return null;
  return snap.data() as MathProgress;
}

export async function initMathProgress(studentId: string): Promise<MathProgress> {
  const progress: MathProgress = {
    studentId,
    missionsCompleted: [],
    totalProblemsCorrect: 0,
    totalProblemsAttempted: 0,
    updatedAt: new Date().toISOString(),
  };
  await setDoc(mathRef(studentId), progress);
  return progress;
}

export async function completeMathMission(
  studentId: string,
  missionId: string,
  results: MathProblemResult[],
  existing: MathProgress
): Promise<MathProgress> {
  const correct = results.filter((r) => r.correct).length;
  const score = Math.round((correct / results.length) * 100);
  const missionsCompleted =
    score >= 60 && !existing.missionsCompleted.includes(missionId)
      ? [...existing.missionsCompleted, missionId]
      : existing.missionsCompleted;

  const updated: MathProgress = {
    ...existing,
    missionsCompleted,
    totalProblemsCorrect: existing.totalProblemsCorrect + correct,
    totalProblemsAttempted: existing.totalProblemsAttempted + results.length,
    updatedAt: new Date().toISOString(),
  };

  await updateDoc(mathRef(studentId), {
    missionsCompleted,
    totalProblemsCorrect: updated.totalProblemsCorrect,
    totalProblemsAttempted: updated.totalProblemsAttempted,
    updatedAt: updated.updatedAt,
  });

  return updated;
}
