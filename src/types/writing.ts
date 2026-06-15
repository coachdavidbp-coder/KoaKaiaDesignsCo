export type WritingActivityType = "sentence_builder" | "punctuation" | "word_sort" | "story_starter";

export interface SentenceBuilderActivity {
  id: string;
  type: "sentence_builder";
  words: string[];     // correct order; shuffled at runtime
  sentence: string;   // full sentence with punctuation (for display after answer)
  hint: string[];     // emoji scene
  levelId: number;
}

export interface PunctuationActivity {
  id: string;
  type: "punctuation";
  sentence: string;   // no ending punctuation
  correct: "." | "?" | "!";
  explanation: string;
  hint: string[];
  levelId: number;
}

export interface WordSortWord {
  word: string;
  category: 0 | 1;
  emoji?: string;
}

export interface WordSortActivity {
  id: string;
  type: "word_sort";
  categories: [string, string];
  categoryEmojis: [string, string];
  words: WordSortWord[];
  levelId: number;
}

export interface StoryStarterActivity {
  id: string;
  type: "story_starter";
  prompt: string;
  scene: string[];
  minWords: number;
  levelId: number;
}

export type WritingActivity =
  | SentenceBuilderActivity
  | PunctuationActivity
  | WordSortActivity
  | StoryStarterActivity;

export interface WritingSet {
  id: string;
  title: string;
  subtitle: string;
  emoji: string;
  activityType: WritingActivityType;
  levelId: number;
  activities: WritingActivity[];
  xpReward: number;
  crystalReward: number;
  coinReward: number;
  theme: { primary: string; secondary: string };
}

export interface SavedStory {
  id: string;
  promptId: string;
  promptText: string;
  studentText: string;
  wordCount: number;
  scene: string[];
  writtenAt: string;
}

export interface WritingProgress {
  studentId: string;
  setsCompleted: string[];
  stories: SavedStory[];
  totalActivitiesCompleted: number;
  updatedAt: string;
}

export interface ActivityResult {
  activityId: string;
  correct: boolean;
  attempts: number;
}
