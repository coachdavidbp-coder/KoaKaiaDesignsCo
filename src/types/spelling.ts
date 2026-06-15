export type MasteryLevel = "new" | "learning" | "practicing" | "mastered";
export type SpellingMode = "study" | "spell" | "scramble";

export interface SpellingWord {
  word: string;
  emoji: string;
  hint: string;
  setId: string;
  levelId: number;
}

export interface SpellingSet {
  id: string;
  title: string;
  subtitle: string;
  levelId: number;
  emoji: string;
  words: SpellingWord[];
  crystalReward: number;
  xpReward: number;
  coinReward: number;
  theme: { primary: string; secondary: string };
}

export interface WordMastery {
  word: string;
  setId: string;
  level: MasteryLevel;
  correctStreak: number;
  totalAttempts: number;
  correctAttempts: number;
  lastSeenAt: string;
  masteredAt: string | null;
}

export interface SpellingProgress {
  studentId: string;
  wordMastery: Record<string, WordMastery>;
  setsCompleted: string[];
  totalWordsMastered: number;
  updatedAt: string;
}

export interface SessionWordResult {
  word: string;
  correct: boolean;
  attempts: number;
}

export const MASTERY_THRESHOLDS: Record<MasteryLevel, number> = {
  new: 1,
  learning: 2,
  practicing: 3,
  mastered: Infinity,
};

export const MASTERY_LABELS: Record<MasteryLevel, string> = {
  new: "New",
  learning: "Learning",
  practicing: "Practicing",
  mastered: "Mastered!",
};

export const MASTERY_COLORS: Record<
  MasteryLevel,
  { bg: string; text: string; border: string; fill: string }
> = {
  new: { bg: "bg-gray-500/20", text: "text-gray-400", border: "border-gray-500/30", fill: "#6B7280" },
  learning: { bg: "bg-blue-500/20", text: "text-blue-300", border: "border-blue-500/30", fill: "#3B82F6" },
  practicing: { bg: "bg-amber-500/20", text: "text-amber-300", border: "border-amber-500/30", fill: "#F59E0B" },
  mastered: { bg: "bg-emerald-500/20", text: "text-emerald-300", border: "border-emerald-500/30", fill: "#10B981" },
};
