export type SkillStatus = "locked" | "not_started" | "in_progress" | "developing" | "mastered";
export type SkillCategory = "reading" | "spelling" | "writing" | "math" | "vocabulary";

export interface SkillScore {
  category: SkillCategory;
  skillName: string;
  score: number;
  attempts: number;
  lastAttemptAt: string;
  status: SkillStatus;
}

export interface CrystalProgress {
  total: number;
  earned: number;
  byLevel: Record<number, number>;
}

export interface LevelProgress {
  levelId: number;
  levelName: string;
  isUnlocked: boolean;
  isCompleted: boolean;
  completionPercent: number;
  missionsCompleted: number;
  missionsTotal: number;
  crystalsEarned: number;
  crystalsTotal: number;
  completedAt: string | null;
}

export interface StudentProgress {
  studentId: string;
  overallPercent: number;
  readingPercent: number;
  spellingPercent: number;
  writingPercent: number;
  mathPercent: number;
  vocabularyPercent: number;
  crystals: CrystalProgress;
  levels: LevelProgress[];
  skills: SkillScore[];
  coins: number;
  gems: number;
  xp: number;
  streak: number;
  lastPlayedAt: string | null;
  totalPlaytimeMinutes: number;
  updatedAt: string;
  // Tracks completed item IDs per educational level (key = String(levelId))
  // Used for sequential level unlock: need 10 items per level to unlock the next
  completedLevelItems?: Record<string, string[]>;
}

export interface MissedItem {
  id: string;
  studentId: string;
  category: SkillCategory;
  itemType: "word" | "question" | "concept";
  content: string;
  context: string;
  missedAt: string;
  reviewedAt: string | null;
  masteredAt: string | null;
}

export interface DailyActivity {
  date: string;
  studentId: string;
  minutesPlayed: number;
  missionsCompleted: number;
  crystalsEarned: number;
  xpEarned: number;
  skillsWorkedOn: SkillCategory[];
}

export type ReadinessLevel = "emerging" | "developing" | "approaching" | "ready" | "highly_prepared";

export function getReadinessLevel(score: number): ReadinessLevel {
  if (score < 40) return "emerging";
  if (score < 60) return "developing";
  if (score < 75) return "approaching";
  if (score < 90) return "ready";
  return "highly_prepared";
}

export function getReadinessLabel(level: ReadinessLevel): string {
  const labels: Record<ReadinessLevel, string> = {
    emerging: "Emerging",
    developing: "Developing",
    approaching: "Approaching Readiness",
    ready: "Ready",
    highly_prepared: "Highly Prepared",
  };
  return labels[level];
}
