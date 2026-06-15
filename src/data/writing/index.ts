import { WritingSet } from "@/types/writing";
import { LEVEL1_WRITING_SETS } from "./level1";
import { LEVEL3_WRITING_SETS } from "./level3";
import { LEVEL5_WRITING_SETS } from "./level5";

export const ALL_WRITING_SETS: WritingSet[] = [
  ...LEVEL1_WRITING_SETS,
  ...LEVEL3_WRITING_SETS,
  ...LEVEL5_WRITING_SETS,
];

export function getWritingSetsByLevel(levelId: number): WritingSet[] {
  return ALL_WRITING_SETS.filter((s) => s.levelId === levelId);
}

export function getWritingSetById(id: string): WritingSet | undefined {
  return ALL_WRITING_SETS.find((s) => s.id === id);
}
