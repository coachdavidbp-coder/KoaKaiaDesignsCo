import { Story } from "@/types/reading";
import { LEVEL1_STORIES } from "./level1";
import { LEVEL3_STORIES } from "./level3";
import { LEVEL5_STORIES } from "./level5";

export const ALL_STORIES: Story[] = [
  ...LEVEL1_STORIES,
  ...LEVEL3_STORIES,
  ...LEVEL5_STORIES,
];

export function getStoriesByLevel(levelId: number): Story[] {
  return ALL_STORIES.filter((s) => s.levelId === levelId);
}

export function getStoryById(id: string): Story | undefined {
  return ALL_STORIES.find((s) => s.id === id);
}

export function getAvailableStories(unlockedLevels: number[]): Story[] {
  return ALL_STORIES.filter((s) => unlockedLevels.includes(s.levelId));
}
