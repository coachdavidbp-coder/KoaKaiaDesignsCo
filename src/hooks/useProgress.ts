"use client";

import { useCallback } from "react";
import { useProgressStore } from "@/store/progressStore";
import { getStudentProgress, updateStudentProgress, getDailyActivities } from "@/lib/firebase/firestore";
import { StudentProgress } from "@/types/progress";
import toast from "react-hot-toast";

export function useProgress(studentId?: string) {
  const { progressMap, activityMap, isLoading, setProgress, updateProgress, setActivities, setLoading } =
    useProgressStore();

  const progress = studentId ? progressMap[studentId] : undefined;
  const activities = studentId ? activityMap[studentId] : undefined;

  const loadProgress = useCallback(async () => {
    if (!studentId) return;
    setLoading(true);
    try {
      const p = await getStudentProgress(studentId);
      if (p) setProgress(studentId, p);
    } catch {
      toast.error("Failed to load progress");
    } finally {
      setLoading(false);
    }
  }, [studentId, setProgress, setLoading]);

  const loadActivities = useCallback(async (days: number = 30) => {
    if (!studentId) return;
    try {
      const acts = await getDailyActivities(studentId, days);
      setActivities(studentId, acts);
    } catch {
      console.error("Failed to load activities");
    }
  }, [studentId, setActivities]);

  const saveProgress = useCallback(
    async (updates: Partial<StudentProgress>) => {
      if (!studentId) return;
      try {
        await updateStudentProgress(studentId, updates);
        updateProgress(studentId, updates);
      } catch {
        toast.error("Failed to save progress");
      }
    },
    [studentId, updateProgress]
  );

  return { progress, activities, isLoading, loadProgress, loadActivities, saveProgress };
}
