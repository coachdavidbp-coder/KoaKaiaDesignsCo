"use client";

import { useEffect, useState, useRef } from "react";
import { useProgressStore } from "@/store/progressStore";
import { updateStreakOnVisit, checkAndUnlockLevels } from "@/lib/firebase/adaptive";
import { StudentProgress } from "@/types/progress";

export interface SubjectRec {
  key: string;
  label: string;
  emoji: string;
  color: string;
  pct: number;
  route: string;
  reason: string;
}

const XP_PER_LEVEL = 500;
const LEVEL_KEY = (id: string) => `explorer_level_${id}`;

const SUBJECTS = (profileId: string): SubjectRec[] => [
  {
    key: "reading",
    label: "Reading",
    emoji: "📚",
    color: "#3B82F6",
    pct: 0,
    route: `/student/${profileId}/reading`,
    reason: "Reading builds vocabulary and comprehension — the foundation of all learning!",
  },
  {
    key: "math",
    label: "Math Missions",
    emoji: "🔢",
    color: "#F59E0B",
    pct: 0,
    route: `/student/${profileId}/math`,
    reason: "Math skills are your secret weapon — let's power up!",
  },
  {
    key: "spelling",
    label: "Spelling",
    emoji: "✏️",
    color: "#8B5CF6",
    pct: 0,
    route: `/student/${profileId}/spelling`,
    reason: "Spelling mastery unlocks your writing superpowers!",
  },
  {
    key: "writing",
    label: "Writing",
    emoji: "📝",
    color: "#10B981",
    pct: 0,
    route: `/student/${profileId}/writing`,
    reason: "Great writers are great thinkers — let's practice today!",
  },
];

function computeRecommendation(progress: StudentProgress, profileId: string): SubjectRec {
  const subjects = SUBJECTS(profileId).map((s) => ({
    ...s,
    pct:
      s.key === "reading" ? progress.readingPercent
      : s.key === "math"  ? progress.mathPercent
      : s.key === "spelling" ? progress.spellingPercent
      : progress.writingPercent,
  }));
  return [...subjects].sort((a, b) => a.pct - b.pct)[0];
}

export function useAdaptive(profileId: string, progress: StudentProgress | null) {
  const { updateProgress } = useProgressStore();
  const [unlockedLevels, setUnlockedLevels] = useState<number[]>([]);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [newExplorerLevel, setNewExplorerLevel] = useState<number | null>(null);
  const didRun = useRef(false);

  useEffect(() => {
    if (!progress || didRun.current) return;
    didRun.current = true;

    // XP level-up detection (localStorage prevents re-showing same session)
    const currentLevel = Math.floor((progress.xp ?? 0) / XP_PER_LEVEL) + 1;
    const lastLevel = parseInt(localStorage.getItem(LEVEL_KEY(profileId)) ?? "0", 10);
    if (lastLevel > 0 && currentLevel > lastLevel) {
      setNewExplorerLevel(currentLevel);
      setShowLevelUp(true);
    }
    localStorage.setItem(LEVEL_KEY(profileId), String(currentLevel));

    // Streak + overallPercent update
    updateStreakOnVisit(profileId, progress).then((streak) => {
      const overallPercent = Math.round(
        (progress.readingPercent + progress.spellingPercent + progress.mathPercent + progress.writingPercent) / 4
      );
      updateProgress(profileId, { streak, lastPlayedAt: new Date().toISOString(), overallPercent });
    }).catch(() => {});

    // Level unlock check
    checkAndUnlockLevels(profileId, progress).then((newly) => {
      if (newly.length > 0) {
        setUnlockedLevels(newly);
        const updatedLevels = progress.levels.map((l) =>
          newly.includes(l.levelId) ? { ...l, isUnlocked: true } : l
        );
        updateProgress(profileId, { levels: updatedLevels });
      }
    }).catch(() => {});
  }, [profileId, progress, updateProgress]);

  const recommendation = progress ? computeRecommendation(progress, profileId) : null;

  return {
    recommendation,
    unlockedLevels,
    showLevelUp,
    newExplorerLevel,
    dismissLevelUp: () => setShowLevelUp(false),
  };
}
