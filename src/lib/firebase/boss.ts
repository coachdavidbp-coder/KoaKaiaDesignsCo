import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./config";
import { updateStudentProgress } from "./firestore";

export interface BossProgress {
  studentId: string;
  defeated: boolean;
  bestScore: number;
  totalQuestions: number;
  attempts: number;
  defeatedAt: string | null;
  updatedAt: string;
}

export async function getBossProgress(studentId: string): Promise<BossProgress | null> {
  const snap = await getDoc(doc(db, "boss", studentId));
  if (!snap.exists()) return null;
  return snap.data() as BossProgress;
}

export async function saveBossAttempt(
  studentId: string,
  score: number,
  total: number
): Promise<BossProgress> {
  const existing = await getBossProgress(studentId);
  const won = score / total >= 0.7;
  const now = new Date().toISOString();

  const progress: BossProgress = {
    studentId,
    defeated: existing?.defeated || won,
    bestScore: Math.max(existing?.bestScore ?? 0, score),
    totalQuestions: total,
    attempts: (existing?.attempts ?? 0) + 1,
    defeatedAt: won && !existing?.defeated ? now : (existing?.defeatedAt ?? null),
    updatedAt: now,
  };

  await setDoc(doc(db, "boss", studentId), progress);

  // Award crystals and XP on first victory
  if (won && !existing?.defeated) {
    try {
      await updateStudentProgress(studentId, {
        xp: 500,
        gems: 10,
        lastPlayedAt: now,
      });
    } catch {
      console.error("Failed to award boss victory rewards");
    }
  }

  return progress;
}
