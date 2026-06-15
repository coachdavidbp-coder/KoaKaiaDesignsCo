import { SpellingSet } from "@/types/spelling";
import { LEVEL1_SPELLING_SETS } from "./level1";
import { LEVEL3_SPELLING_SETS } from "./level3";
import { LEVEL5_SPELLING_SETS } from "./level5";

export const ALL_SPELLING_SETS: SpellingSet[] = [
  ...LEVEL1_SPELLING_SETS,
  ...LEVEL3_SPELLING_SETS,
  ...LEVEL5_SPELLING_SETS,
];

export function getSpellingSetsByLevel(levelId: number): SpellingSet[] {
  return ALL_SPELLING_SETS.filter((s) => s.levelId === levelId);
}

export function getSpellingSetById(id: string): SpellingSet | undefined {
  return ALL_SPELLING_SETS.find((s) => s.id === id);
}

export function getAvailableSpellingSets(unlockedLevels: number[]): SpellingSet[] {
  return ALL_SPELLING_SETS.filter((s) => unlockedLevels.includes(s.levelId));
}
