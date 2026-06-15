export type MathActivityType =
  | "addition"
  | "subtraction"
  | "comparison"
  | "skip_count"
  | "tens_ones"
  | "word_problem";

export interface MathProblem {
  id: string;
  type: MathActivityType;
  question: string;
  story?: string;
  scene?: string[];
  emoji?: string;
  counterGroups?: number[];
  counterEmoji?: string;
  sequence?: (number | null)[];
  tensOnes?: { tens: number; ones: number };
  answer: number | string;
  choices: Array<number | string>;
  explanation: string;
  levelId: number;
}

export interface MathMission {
  id: string;
  title: string;
  subtitle: string;
  emoji: string;
  levelId: number;
  problems: MathProblem[];
  xpReward: number;
  crystalReward: number;
  coinReward: number;
  theme: { primary: string; secondary: string };
}

export interface MathProblemResult {
  problemId: string;
  correct: boolean;
  attempts: number;
}

export interface MathProgress {
  studentId: string;
  missionsCompleted: string[];
  totalProblemsCorrect: number;
  totalProblemsAttempted: number;
  updatedAt: string;
}
