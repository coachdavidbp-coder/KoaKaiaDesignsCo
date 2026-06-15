import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  arrayUnion,
} from "firebase/firestore";
import { db } from "./config";
import { StudentAchievements, EarnedAchievement } from "@/types/achievements";
import { Inventory } from "@/types/rewards";

// ── Achievements ──────────────────────────────────────────────────────────────

export async function getStudentAchievements(
  studentId: string
): Promise<StudentAchievements | null> {
  const snap = await getDoc(doc(db, "achievements", studentId));
  if (!snap.exists()) return null;
  const data = snap.data();
  return {
    studentId,
    earned: (data.earned ?? []).map((e: Record<string, unknown>) => ({
      achievementId: e.achievementId as string,
      earnedAt:
        typeof e.earnedAt === "object" && e.earnedAt !== null && "toDate" in e.earnedAt
          ? (e.earnedAt as { toDate(): Date }).toDate().toISOString()
          : String(e.earnedAt ?? new Date().toISOString()),
    })),
    updatedAt: data.updatedAt?.toDate?.()?.toISOString?.() ?? new Date().toISOString(),
  };
}

export async function initStudentAchievements(studentId: string): Promise<void> {
  await setDoc(doc(db, "achievements", studentId), {
    earned: [],
    updatedAt: serverTimestamp(),
  });
}

export async function unlockAchievement(
  studentId: string,
  achievementId: string
): Promise<void> {
  const earned: EarnedAchievement = {
    achievementId,
    earnedAt: new Date().toISOString(),
  };

  const ref = doc(db, "achievements", studentId);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    await setDoc(ref, { earned: [earned], updatedAt: serverTimestamp() });
  } else {
    await updateDoc(ref, {
      earned: arrayUnion(earned),
      updatedAt: serverTimestamp(),
    });
  }
}

export async function hasAchievement(
  studentId: string,
  achievementId: string
): Promise<boolean> {
  const achievments = await getStudentAchievements(studentId);
  if (!achievments) return false;
  return achievments.earned.some((e) => e.achievementId === achievementId);
}

// ── Inventory ──────────────────────────────────────────────────────────────────

export async function getInventory(studentId: string): Promise<Inventory | null> {
  const snap = await getDoc(doc(db, "inventory", studentId));
  if (!snap.exists()) return null;
  const data = snap.data();
  return {
    studentId,
    ownedItemIds: data.ownedItemIds ?? [],
    equippedSkinId: data.equippedSkinId ?? null,
    equippedCelebrationId: data.equippedCelebrationId ?? null,
    updatedAt: data.updatedAt?.toDate?.()?.toISOString?.() ?? new Date().toISOString(),
  };
}

export async function initInventory(studentId: string): Promise<void> {
  await setDoc(doc(db, "inventory", studentId), {
    ownedItemIds: [],
    equippedSkinId: null,
    equippedCelebrationId: null,
    updatedAt: serverTimestamp(),
  });
}

export async function purchaseItem(
  studentId: string,
  itemId: string
): Promise<void> {
  const ref = doc(db, "inventory", studentId);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    await setDoc(ref, {
      ownedItemIds: [itemId],
      equippedSkinId: null,
      equippedCelebrationId: null,
      updatedAt: serverTimestamp(),
    });
  } else {
    await updateDoc(ref, {
      ownedItemIds: arrayUnion(itemId),
      updatedAt: serverTimestamp(),
    });
  }
}

export async function equipItem(
  studentId: string,
  itemId: string,
  slot: "skin" | "celebration"
): Promise<void> {
  const field = slot === "skin" ? "equippedSkinId" : "equippedCelebrationId";
  const ref = doc(db, "inventory", studentId);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    await initInventory(studentId);
  }
  await updateDoc(ref, { [field]: itemId, updatedAt: serverTimestamp() });
}
