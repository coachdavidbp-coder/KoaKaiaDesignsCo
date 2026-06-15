"use client";

import { useCallback } from "react";
import { useStudentStore } from "@/store/studentStore";
import {
  createStudentProfile,
  getStudentProfiles,
  updateStudentProfile,
  deleteStudentProfile,
  recordStudentLogin,
} from "@/lib/firebase/firestore";
import { AvatarCharacter, AvatarColor } from "@/types/user";
import toast from "react-hot-toast";

export function useStudents(parentUid?: string) {
  const { students, activeStudent, isLoading, setStudents, addStudent, updateStudent, removeStudent, setActiveStudent, setLoading } =
    useStudentStore();

  const loadStudents = useCallback(async () => {
    if (!parentUid) return;
    setLoading(true);
    try {
      const list = await getStudentProfiles(parentUid);
      setStudents(list);
    } catch {
      toast.error("Failed to load student profiles");
    } finally {
      setLoading(false);
    }
  }, [parentUid, setStudents, setLoading]);

  const createStudent = useCallback(
    async (
      displayName: string,
      avatarCharacter: AvatarCharacter,
      avatarColor: AvatarColor,
      pin: string
    ) => {
      if (!parentUid) return null;
      setLoading(true);
      try {
        const profile = await createStudentProfile(parentUid, displayName, avatarCharacter, avatarColor, pin);
        addStudent(profile);
        toast.success(`${displayName}'s profile created!`);
        return profile;
      } catch {
        toast.error("Failed to create student profile");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [parentUid, addStudent, setLoading]
  );

  const selectStudent = useCallback(
    async (studentId: string, pin: string) => {
      const student = students.find((s) => s.id === studentId);
      if (!student) return false;
      if (student.pin !== pin) {
        toast.error("Incorrect PIN");
        return false;
      }
      setActiveStudent(student);
      await recordStudentLogin(studentId);
      return true;
    },
    [students, setActiveStudent]
  );

  const archiveStudent = useCallback(
    async (studentId: string) => {
      try {
        await deleteStudentProfile(studentId);
        removeStudent(studentId);
        toast.success("Profile removed");
      } catch {
        toast.error("Failed to remove profile");
      }
    },
    [removeStudent]
  );

  const renameStudent = useCallback(
    async (studentId: string, displayName: string) => {
      try {
        await updateStudentProfile(studentId, { displayName });
        updateStudent(studentId, { displayName });
        toast.success("Name updated");
      } catch {
        toast.error("Failed to update name");
      }
    },
    [updateStudent]
  );

  return {
    students,
    activeStudent,
    isLoading,
    loadStudents,
    createStudent,
    selectStudent,
    archiveStudent,
    renameStudent,
    setActiveStudent,
  };
}
