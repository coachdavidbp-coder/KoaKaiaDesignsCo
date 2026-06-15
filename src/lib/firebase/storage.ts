"use client";

import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "./config";
import { updateStudentProfile } from "./firestore";

export async function uploadStudentPhoto(studentId: string, file: File): Promise<string> {
  const ext = file.type === "image/png" ? "png" : "jpg";
  const storageRef = ref(storage, `students/${studentId}/avatar.${ext}`);
  await uploadBytes(storageRef, file, { contentType: file.type });
  const url = await getDownloadURL(storageRef);
  await updateStudentProfile(studentId, { avatarUrl: url });
  return url;
}
