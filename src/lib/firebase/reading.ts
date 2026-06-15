import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
  serverTimestamp,
  collection,
  query,
  where,
  getDocs,
  orderBy,
} from "firebase/firestore";
import { db } from "./config";
import {
  ReadingSession,
  ReadingProgress,
  StudentVocabularyEntry,
} from "@/types/reading";
import { v4 as uuidv4 } from "uuid";

// ── Reading Progress ──────────────────────────────────────────────────────────

export async function getReadingProgress(studentId: string): Promise<ReadingProgress | null> {
  const snap = await getDoc(doc(db, "readingProgress", studentId));
  if (!snap.exists()) return null;
  const d = snap.data();
  return {
    studentId,
    sessionsCompleted: d.sessionsCompleted ?? 0,
    storiesRead: d.storiesRead ?? [],
    totalWordsRead: d.totalWordsRead ?? 0,
    averageComprehension: d.averageComprehension ?? 0,
    vocabulary: d.vocabulary ?? [],
    currentReadingLevel: d.currentReadingLevel ?? "1A",
    fluencyScore: d.fluencyScore ?? 0,
    updatedAt: d.updatedAt?.toDate?.()?.toISOString?.() ?? new Date().toISOString(),
  };
}

export async function initReadingProgress(studentId: string): Promise<ReadingProgress> {
  const initial: ReadingProgress = {
    studentId,
    sessionsCompleted: 0,
    storiesRead: [],
    totalWordsRead: 0,
    averageComprehension: 0,
    vocabulary: [],
    currentReadingLevel: "1A",
    fluencyScore: 0,
    updatedAt: new Date().toISOString(),
  };
  await setDoc(doc(db, "readingProgress", studentId), {
    ...initial,
    updatedAt: serverTimestamp(),
  });
  return initial;
}

// ── Sessions ──────────────────────────────────────────────────────────────────

export async function startReadingSession(
  studentId: string,
  storyId: string
): Promise<ReadingSession> {
  const session: ReadingSession = {
    id: uuidv4(),
    studentId,
    storyId,
    startedAt: new Date().toISOString(),
    completedAt: null,
    pagesRead: 0,
    comprehensionScore: null,
    questionsCorrect: 0,
    questionsTotal: 0,
    wordsLearned: [],
    crystalsEarned: 0,
    xpEarned: 0,
    timeSpentSeconds: 0,
  };
  await setDoc(doc(db, "readingSessions", session.id), {
    ...session,
    startedAt: serverTimestamp(),
  });
  return session;
}

export async function completeReadingSession(
  sessionId: string,
  updates: {
    pagesRead: number;
    comprehensionScore: number;
    questionsCorrect: number;
    questionsTotal: number;
    wordsLearned: string[];
    crystalsEarned: number;
    xpEarned: number;
    timeSpentSeconds: number;
  }
): Promise<void> {
  await updateDoc(doc(db, "readingSessions", sessionId), {
    ...updates,
    completedAt: serverTimestamp(),
  });
}

export async function getReadingSessions(studentId: string): Promise<ReadingSession[]> {
  const q = query(
    collection(db, "readingSessions"),
    where("studentId", "==", studentId),
    where("completedAt", "!=", null),
    orderBy("completedAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as ReadingSession);
}

// ── Vocabulary ────────────────────────────────────────────────────────────────

export async function addVocabularyWord(
  studentId: string,
  entry: Omit<StudentVocabularyEntry, "firstSeenAt" | "seenCount" | "masteredAt">
): Promise<void> {
  const ref = doc(db, "readingProgress", studentId);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    await initReadingProgress(studentId);
  }

  const data = snap.exists() ? snap.data() : {};
  const existing: StudentVocabularyEntry[] = data.vocabulary ?? [];
  const alreadySeen = existing.find((e) => e.word === entry.word);

  if (alreadySeen) {
    const updated = existing.map((e) =>
      e.word === entry.word
        ? {
            ...e,
            seenCount: e.seenCount + 1,
            masteredAt: e.seenCount + 1 >= 3 && !e.masteredAt ? new Date().toISOString() : e.masteredAt,
          }
        : e
    );
    await updateDoc(ref, { vocabulary: updated, updatedAt: serverTimestamp() });
  } else {
    const newEntry: StudentVocabularyEntry = {
      ...entry,
      firstSeenAt: new Date().toISOString(),
      seenCount: 1,
      masteredAt: null,
    };
    await updateDoc(ref, {
      vocabulary: arrayUnion(newEntry),
      updatedAt: serverTimestamp(),
    });
  }
}

export async function updateReadingStats(
  studentId: string,
  updates: {
    storyId: string;
    wordsRead: number;
    comprehensionScore: number;
  }
): Promise<void> {
  const ref = doc(db, "readingProgress", studentId);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    await initReadingProgress(studentId);
    return;
  }

  const data = snap.data();
  const storiesRead: string[] = data.storiesRead ?? [];
  const alreadyRead = storiesRead.includes(updates.storyId);
  const sessionsCompleted: number = data.sessionsCompleted ?? 0;
  const totalWordsRead: number = data.totalWordsRead ?? 0;
  const prevAvg: number = data.averageComprehension ?? 0;

  const newSessions = sessionsCompleted + 1;
  const newWords = totalWordsRead + updates.wordsRead;
  const newAvg = alreadyRead
    ? prevAvg
    : ((prevAvg * sessionsCompleted + updates.comprehensionScore) / newSessions);

  await updateDoc(ref, {
    sessionsCompleted: newSessions,
    storiesRead: alreadyRead ? storiesRead : arrayUnion(updates.storyId),
    totalWordsRead: newWords,
    averageComprehension: Math.round(newAvg),
    updatedAt: serverTimestamp(),
  });
}
