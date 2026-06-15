import { MathMission } from "@/types/math";
import { LEVEL1_MATH_MISSIONS } from "./level1";
import { LEVEL3_MATH_MISSIONS } from "./level3";
import { LEVEL5_MATH_MISSIONS } from "./level5";

export const ALL_MATH_MISSIONS: MathMission[] = [
  ...LEVEL1_MATH_MISSIONS,
  ...LEVEL3_MATH_MISSIONS,
  ...LEVEL5_MATH_MISSIONS,
];

export function getMathMissionsByLevel(levelId: number): MathMission[] {
  return ALL_MATH_MISSIONS.filter((m) => m.levelId === levelId);
}

export function getMathMissionById(id: string): MathMission | undefined {
  return ALL_MATH_MISSIONS.find((m) => m.id === id);
}
