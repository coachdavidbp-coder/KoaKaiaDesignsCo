import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "./config";
import { StudentProfile, AvatarCharacter, AvatarColor } from "@/types/user";
import { StudentProgress, MissedItem, DailyActivity, LevelProgress } from "@/types/progress";
import { GAME_LEVELS } from "@/types/game";
import { v4 as uuidv4 } from "uuid";

// ── Student Profiles ──────────────────────────────────────────────────────────

export async function createStudentProfile(
  parentUid: string,
  displayName: string,
  avatarCharacter: AvatarCharacter,
  avatarColor: AvatarColor,
  pin: string,
  avatarUrl?: string
): Promise<StudentProfile> {
  const id = uuidv4();
  const now = new Date().toISOString();

  const profile: StudentProfile = {
    id,
    parentUid,
    displayName,
    gradeLevel: 1,
    avatar: { character: avatarCharacter, color: avatarColor },
    ...(avatarUrl ? { avatarUrl } : {}),
    pin,
    createdAt: now,
    updatedAt: now,
    lastLoginAt: null,
    isActive: true,
  };

  await setDoc(doc(db, "students", id), {
    ...profile,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  await initializeStudentProgress(id);
  return profile;
}

export async function getStudentProfiles(parentUid: string): Promise<StudentProfile[]> {
  const q = query(
    collection(db, "students"),
    where("parentUid", "==", parentUid),
    where("isActive", "==", true)
  );
  const snap = await getDocs(q);
  const profiles = snap.docs.map((d) => {
    const data = d.data();
    return {
      ...data,
      id: d.id,
      createdAt: toIso(data.createdAt),
      updatedAt: toIso(data.updatedAt),
      lastLoginAt: data.lastLoginAt ? toIso(data.lastLoginAt) : null,
    } as StudentProfile;
  });
  return profiles.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

export async function getStudentProfile(id: string): Promise<StudentProfile | null> {
  const snap = await getDoc(doc(db, "students", id));
  if (!snap.exists()) return null;
  const data = snap.data();
  return {
    ...data,
    id,
    createdAt: toIso(data.createdAt),
    updatedAt: toIso(data.updatedAt),
    lastLoginAt: data.lastLoginAt ? toIso(data.lastLoginAt) : null,
  } as StudentProfile;
}

export async function updateStudentProfile(
  id: string,
  updates: Partial<Omit<StudentProfile, "id" | "parentUid" | "createdAt">>
): Promise<void> {
  await updateDoc(doc(db, "students", id), {
    ...updates,
    updatedAt: serverTimestamp(),
  });
}

export async function recordStudentLogin(id: string): Promise<void> {
  await updateDoc(doc(db, "students", id), {
    lastLoginAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function deleteStudentProfile(id: string): Promise<void> {
  await updateDoc(doc(db, "students", id), { isActive: false, updatedAt: serverTimestamp() });
}

// ── Progress ──────────────────────────────────────────────────────────────────

export async function initializeStudentProgress(studentId: string): Promise<void> {
  const levels: LevelProgress[] = GAME_LEVELS.map((l) => ({
    levelId: l.id,
    levelName: l.name,
    isUnlocked: l.id === 1,
    isCompleted: false,
    completionPercent: 0,
    missionsCompleted: 0,
    missionsTotal: l.missionCount,
    crystalsEarned: 0,
    crystalsTotal: l.crystalCount,
    completedAt: null,
  }));

  const progress: StudentProgress = {
    studentId,
    overallPercent: 0,
    readingPercent: 0,
    spellingPercent: 0,
    writingPercent: 0,
    mathPercent: 0,
    vocabularyPercent: 0,
    crystals: { total: 100, earned: 0, byLevel: {} },
    levels,
    skills: [],
    coins: 0,
    gems: 0,
    xp: 0,
    streak: 0,
    lastPlayedAt: null,
    totalPlaytimeMinutes: 0,
    updatedAt: new Date().toISOString(),
  };

  await setDoc(doc(db, "progress", studentId), {
    ...progress,
    updatedAt: serverTimestamp(),
  });
}

export async function getStudentProgress(studentId: string): Promise<StudentProgress | null> {
  const snap = await getDoc(doc(db, "progress", studentId));
  if (!snap.exists()) return null;
  const data = snap.data();
  const levels = (data.levels ?? []).map((l: LevelProgress) => ({
    ...l,
    completedAt: l.completedAt ? toIso(l.completedAt as unknown) : null,
  }));
  return {
    ...data,
    levels,
    updatedAt: toIso(data.updatedAt),
    lastPlayedAt: data.lastPlayedAt ? toIso(data.lastPlayedAt) : null,
  } as StudentProgress;
}

export async function updateStudentProgress(
  studentId: string,
  updates: Partial<StudentProgress>
): Promise<void> {
  await updateDoc(doc(db, "progress", studentId), {
    ...updates,
    updatedAt: serverTimestamp(),
  });
}

// ── Missed Items ──────────────────────────────────────────────────────────────

export async function addMissedItem(
  studentId: string,
  item: Omit<MissedItem, "id" | "studentId" | "reviewedAt" | "masteredAt">
): Promise<void> {
  const id = uuidv4();
  await setDoc(doc(db, "missedItems", id), {
    ...item,
    id,
    studentId,
    reviewedAt: null,
    masteredAt: null,
    missedAt: serverTimestamp(),
  });
}

export async function getMissedItems(studentId: string): Promise<MissedItem[]> {
  const q = query(
    collection(db, "missedItems"),
    where("studentId", "==", studentId),
    where("masteredAt", "==", null),
    orderBy("missedAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => {
    const data = d.data();
    return {
      ...data,
      id: d.id,
      missedAt: toIso(data.missedAt),
      reviewedAt: data.reviewedAt ? toIso(data.reviewedAt) : null,
      masteredAt: data.masteredAt ? toIso(data.masteredAt) : null,
    } as MissedItem;
  });
}

// ── Daily Activity ────────────────────────────────────────────────────────────

export async function recordDailyActivity(
  studentId: string,
  activity: Omit<DailyActivity, "studentId">
): Promise<void> {
  const id = `${studentId}_${activity.date}`;
  const existing = await getDoc(doc(db, "dailyActivity", id));

  if (existing.exists()) {
    const data = existing.data() as DailyActivity;
    await updateDoc(doc(db, "dailyActivity", id), {
      minutesPlayed: data.minutesPlayed + activity.minutesPlayed,
      missionsCompleted: data.missionsCompleted + activity.missionsCompleted,
      crystalsEarned: data.crystalsEarned + activity.crystalsEarned,
      xpEarned: data.xpEarned + activity.xpEarned,
      skillsWorkedOn: Array.from(new Set([...data.skillsWorkedOn, ...activity.skillsWorkedOn])),
    });
  } else {
    await setDoc(doc(db, "dailyActivity", id), { ...activity, studentId });
  }
}

export async function getDailyActivities(
  studentId: string,
  days: number = 30
): Promise<DailyActivity[]> {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  const cutoffStr = cutoff.toISOString().split("T")[0];

  const q = query(
    collection(db, "dailyActivity"),
    where("studentId", "==", studentId),
    where("date", ">=", cutoffStr),
    orderBy("date", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as DailyActivity);
}

// ── Utilities ─────────────────────────────────────────────────────────────────

function toIso(value: unknown): string {
  if (value instanceof Timestamp) return value.toDate().toISOString();
  if (typeof value === "string") return value;
  return new Date().toISOString();
}
