import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
  sendPasswordResetEmail,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "./config";
import { ParentUser, ParentSettings } from "@/types/user";

const DEFAULT_PARENT_SETTINGS: ParentSettings = {
  emailNotifications: true,
  weeklyReports: true,
  dailyReminders: false,
  reminderTime: "18:00",
};

export async function registerParent(
  email: string,
  password: string,
  displayName: string
): Promise<ParentUser> {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(credential.user, { displayName });

  const parentUser: ParentUser = {
    uid: credential.user.uid,
    email,
    displayName,
    role: "parent",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    settings: DEFAULT_PARENT_SETTINGS,
  };

  await setDoc(doc(db, "parents", credential.user.uid), {
    ...parentUser,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return parentUser;
}

export async function signInParent(email: string, password: string): Promise<User> {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  await updateDoc(doc(db, "parents", credential.user.uid), {
    updatedAt: serverTimestamp(),
  });
  return credential.user;
}

export async function signOut(): Promise<void> {
  await firebaseSignOut(auth);
}

export async function resetPassword(email: string): Promise<void> {
  await sendPasswordResetEmail(auth, email);
}

export async function getParentProfile(uid: string): Promise<ParentUser | null> {
  const snap = await getDoc(doc(db, "parents", uid));
  if (!snap.exists()) return null;
  const data = snap.data();
  return {
    ...data,
    uid,
    createdAt: data.createdAt?.toDate?.()?.toISOString() ?? data.createdAt,
    updatedAt: data.updatedAt?.toDate?.()?.toISOString() ?? data.updatedAt,
  } as ParentUser;
}

export function onAuthChange(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}
