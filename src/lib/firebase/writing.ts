import { doc, getDoc, setDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "./config";
import { WritingProgress, SavedStory, ActivityResult } from "@/types/writing";

function writingRef(studentId: string) {
  return doc(db, "writing", studentId);
}

export async function getWritingProgress(studentId: string): Promise<WritingProgress | null> {
  const snap = await getDoc(writingRef(studentId));
  if (!snap.exists()) return null;
  return snap.data() as WritingProgress;
}

export async function initWritingProgress(studentId: string): Promise<WritingProgress> {
  const progress: WritingProgress = {
    studentId,
    setsCompleted: [],
    stories: [],
    totalActivitiesCompleted: 0,
    updatedAt: new Date().toISOString(),
  };
  await setDoc(writingRef(studentId), progress);
  return progress;
}

export async function completeWritingSet(
  studentId: string,
  setId: string,
  results: ActivityResult[],
  existingProgress: WritingProgress
): Promise<WritingProgress> {
  const allCorrect = results.every((r) => r.correct);
  const setsCompleted =
    allCorrect && !existingProgress.setsCompleted.includes(setId)
      ? [...existingProgress.setsCompleted, setId]
      : existingProgress.setsCompleted;

  const totalActivitiesCompleted =
    existingProgress.totalActivitiesCompleted + results.length;

  const updated: WritingProgress = {
    ...existingProgress,
    setsCompleted,
    totalActivitiesCompleted,
    updatedAt: new Date().toISOString(),
  };

  await updateDoc(writingRef(studentId), {
    setsCompleted,
    totalActivitiesCompleted,
    updatedAt: updated.updatedAt,
  });

  return updated;
}

export async function saveStory(
  studentId: string,
  story: SavedStory
): Promise<void> {
  await updateDoc(writingRef(studentId), {
    stories: arrayUnion(story),
    updatedAt: new Date().toISOString(),
  });
}
