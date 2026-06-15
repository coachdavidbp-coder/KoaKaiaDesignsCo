export type ReadingLevel = "K" | "1A" | "1B" | "1C" | "2A" | "2B";
export type QuestionType =
  | "multiple_choice"
  | "true_false"
  | "sequence"
  | "prediction"
  | "main_idea"
  | "vocabulary";
export type QuestionSkill =
  | "recall"
  | "inference"
  | "vocabulary"
  | "main_idea"
  | "sequencing"
  | "prediction"
  | "detail";

export interface VocabWord {
  word: string;
  partOfSpeech: "noun" | "verb" | "adjective" | "adverb";
  definition: string;
  emoji: string;
  exampleSentence: string;
}

export interface ComprehensionQuestion {
  id: string;
  type: QuestionType;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  skill: QuestionSkill;
}

export interface StoryPage {
  pageNumber: number;
  text: string;
  scene: string[];
  bg?: string;
}

export interface Story {
  id: string;
  title: string;
  subtitle?: string;
  levelId: number;
  readingLevel: ReadingLevel;
  wordCount: number;
  companion: string;
  companionEmoji: string;
  coverScene: string[];
  coverBg: string;
  pages: StoryPage[];
  vocabulary: VocabWord[];
  questions: ComprehensionQuestion[];
  crystalReward: number;
  xpReward: number;
  coinReward: number;
  theme: {
    primary: string;
    secondary: string;
    bg: string;
    text: string;
  };
  tags: string[];
}

export interface ReadingSession {
  id: string;
  studentId: string;
  storyId: string;
  startedAt: string;
  completedAt: string | null;
  pagesRead: number;
  comprehensionScore: number | null;
  questionsCorrect: number;
  questionsTotal: number;
  wordsLearned: string[];
  crystalsEarned: number;
  xpEarned: number;
  timeSpentSeconds: number;
}

export interface StudentVocabularyEntry {
  word: string;
  definition: string;
  emoji: string;
  storyId: string;
  firstSeenAt: string;
  seenCount: number;
  masteredAt: string | null;
}

export interface ReadingProgress {
  studentId: string;
  sessionsCompleted: number;
  storiesRead: string[];
  totalWordsRead: number;
  averageComprehension: number;
  vocabulary: StudentVocabularyEntry[];
  currentReadingLevel: ReadingLevel;
  fluencyScore: number;
  updatedAt: string;
}

export const READING_LEVEL_LABELS: Record<ReadingLevel, string> = {
  K: "Kindergarten",
  "1A": "Grade 1 — Beginning",
  "1B": "Grade 1 — Developing",
  "1C": "Grade 1 — Proficient",
  "2A": "Grade 2 — Beginning",
  "2B": "Grade 2 — Developing",
};
