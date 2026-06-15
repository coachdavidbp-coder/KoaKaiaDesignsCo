export interface Level {
  id: number;
  name: string;
  description: string;
  world: string;
  focusAreas: string[];
  completionRange: { min: number; max: number };
  crystalCount: number;
  missionCount: number;
  companion: string;
  theme: LevelTheme;
  isAvailable: boolean;
}

export interface LevelTheme {
  primaryColor: string;
  secondaryColor: string;
  bgFrom: string;
  bgTo: string;
  icon: string;
  emoji: string;
}

export interface Mission {
  id: string;
  levelId: number;
  title: string;
  description: string;
  type: MissionType;
  difficulty: "easy" | "medium" | "hard";
  crystalReward: number;
  xpReward: number;
  coinReward: number;
  estimatedMinutes: number;
  prerequisites: string[];
  skillTags: string[];
}

export type MissionType =
  | "reading"
  | "spelling"
  | "writing"
  | "math"
  | "vocabulary"
  | "comprehension"
  | "assessment";

export interface Reward {
  id: string;
  type: "vehicle" | "pet" | "skin" | "badge" | "trophy" | "treasure";
  name: string;
  description: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  unlockCondition: string;
  image: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: "reading" | "math" | "spelling" | "writing" | "exploration" | "streak" | "mastery";
  requirement: number;
  xpReward: number;
}

export const GAME_LEVELS: Level[] = [
  {
    id: 1,
    name: "Explorer Camp",
    description: "Begin your adventure with letters, sounds, and numbers!",
    world: "Starting World",
    focusAreas: ["Letters", "Sounds", "Numbers"],
    completionRange: { min: 0, max: 5 },
    crystalCount: 5,
    missionCount: 20,
    companion: "Mia",
    theme: {
      primaryColor: "#10B981",
      secondaryColor: "#34D399",
      bgFrom: "#064E3B",
      bgTo: "#065F46",
      icon: "🏕️",
      emoji: "🌟",
    },
    isAvailable: true,
  },
  {
    id: 2,
    name: "Monster Truck Mountain",
    description: "Race with Turbo and conquer addition and sight words!",
    world: "Mountain Zone",
    focusAreas: ["Addition", "Sight Words"],
    completionRange: { min: 5, max: 12 },
    crystalCount: 7,
    missionCount: 28,
    companion: "Turbo",
    theme: {
      primaryColor: "#F59E0B",
      secondaryColor: "#FBBF24",
      bgFrom: "#78350F",
      bgTo: "#92400E",
      icon: "🚛",
      emoji: "⚡",
    },
    isAvailable: false,
  },
  {
    id: 3,
    name: "Football Stadium",
    description: "Coach Thunder leads reading and vocabulary training!",
    world: "Stadium Zone",
    focusAreas: ["Reading", "Vocabulary"],
    completionRange: { min: 12, max: 18 },
    crystalCount: 6,
    missionCount: 24,
    companion: "Coach Thunder",
    theme: {
      primaryColor: "#EF4444",
      secondaryColor: "#F87171",
      bgFrom: "#7F1D1D",
      bgTo: "#991B1B",
      icon: "🏈",
      emoji: "🏆",
    },
    isAvailable: false,
  },
  {
    id: 4,
    name: "Animal Safari",
    description: "Rex helps you master spelling and word families!",
    world: "Safari Zone",
    focusAreas: ["Spelling", "Word Families"],
    completionRange: { min: 18, max: 25 },
    crystalCount: 7,
    missionCount: 28,
    companion: "Rex",
    theme: {
      primaryColor: "#F97316",
      secondaryColor: "#FB923C",
      bgFrom: "#7C2D12",
      bgTo: "#9A3412",
      icon: "🦁",
      emoji: "🦕",
    },
    isAvailable: false,
  },
  {
    id: 5,
    name: "Ocean Adventure",
    description: "Dive deep with Splash for story reading and comprehension!",
    world: "Ocean Zone",
    focusAreas: ["Story Reading", "Comprehension"],
    completionRange: { min: 25, max: 32 },
    crystalCount: 7,
    missionCount: 28,
    companion: "Splash",
    theme: {
      primaryColor: "#0EA5E9",
      secondaryColor: "#38BDF8",
      bgFrom: "#0C4A6E",
      bgTo: "#075985",
      icon: "🐬",
      emoji: "🌊",
    },
    isAvailable: false,
  },
  {
    id: 6,
    name: "Treasure Island",
    description: "Solve subtraction and problem puzzles to find treasure!",
    world: "Island Zone",
    focusAreas: ["Subtraction", "Problem Solving"],
    completionRange: { min: 32, max: 38 },
    crystalCount: 6,
    missionCount: 24,
    companion: "Mia",
    theme: {
      primaryColor: "#D97706",
      secondaryColor: "#F59E0B",
      bgFrom: "#451A03",
      bgTo: "#78350F",
      icon: "💎",
      emoji: "🗺️",
    },
    isAvailable: false,
  },
  {
    id: 7,
    name: "Block Builder Kingdom",
    description: "Builder Bot teaches patterns and logic through building!",
    world: "Builder Zone",
    focusAreas: ["Patterns", "Logic"],
    completionRange: { min: 38, max: 45 },
    crystalCount: 7,
    missionCount: 28,
    companion: "Builder Bot",
    theme: {
      primaryColor: "#8B5CF6",
      secondaryColor: "#A78BFA",
      bgFrom: "#2E1065",
      bgTo: "#3B0764",
      icon: "🧱",
      emoji: "⚙️",
    },
    isAvailable: false,
  },
  {
    id: 8,
    name: "Dinosaur Valley",
    description: "Rex roars into writing sentences and grammar adventures!",
    world: "Dino Zone",
    focusAreas: ["Writing Sentences"],
    completionRange: { min: 45, max: 52 },
    crystalCount: 7,
    missionCount: 28,
    companion: "Rex",
    theme: {
      primaryColor: "#16A34A",
      secondaryColor: "#22C55E",
      bgFrom: "#14532D",
      bgTo: "#166534",
      icon: "🦖",
      emoji: "🌿",
    },
    isAvailable: false,
  },
  {
    id: 9,
    name: "Lost Crystal Caves",
    description: "Navigate the caves while building reading fluency!",
    world: "Cave Zone",
    focusAreas: ["Reading Fluency"],
    completionRange: { min: 52, max: 58 },
    crystalCount: 6,
    missionCount: 24,
    companion: "Splash",
    theme: {
      primaryColor: "#6366F1",
      secondaryColor: "#818CF8",
      bgFrom: "#1E1B4B",
      bgTo: "#312E81",
      icon: "💎",
      emoji: "🔮",
    },
    isAvailable: false,
  },
  {
    id: 10,
    name: "Thunder Stadium",
    description: "Coach Thunder trains you for word problem mastery!",
    world: "Thunder Zone",
    focusAreas: ["Word Problems"],
    completionRange: { min: 58, max: 65 },
    crystalCount: 7,
    missionCount: 28,
    companion: "Coach Thunder",
    theme: {
      primaryColor: "#EAB308",
      secondaryColor: "#FDE047",
      bgFrom: "#422006",
      bgTo: "#713F12",
      icon: "⚡",
      emoji: "🏟️",
    },
    isAvailable: false,
  },
  {
    id: 11,
    name: "Sky Island",
    description: "Float above the clouds mastering grammar with Mia!",
    world: "Sky Zone",
    focusAreas: ["Grammar"],
    completionRange: { min: 65, max: 72 },
    crystalCount: 7,
    missionCount: 28,
    companion: "Mia",
    theme: {
      primaryColor: "#0EA5E9",
      secondaryColor: "#BAE6FD",
      bgFrom: "#0C4A6E",
      bgTo: "#0369A1",
      icon: "☁️",
      emoji: "🌈",
    },
    isAvailable: false,
  },
  {
    id: 12,
    name: "Volcano Ridge",
    description: "Turbo races through place value and time challenges!",
    world: "Volcano Zone",
    focusAreas: ["Place Value", "Time"],
    completionRange: { min: 72, max: 80 },
    crystalCount: 8,
    missionCount: 32,
    companion: "Turbo",
    theme: {
      primaryColor: "#DC2626",
      secondaryColor: "#F87171",
      bgFrom: "#450A0A",
      bgTo: "#7F1D1D",
      icon: "🌋",
      emoji: "🔥",
    },
    isAvailable: false,
  },
  {
    id: 13,
    name: "Ancient Temple",
    description: "Decode ancient scrolls with deep paragraph reading!",
    world: "Temple Zone",
    focusAreas: ["Paragraph Reading"],
    completionRange: { min: 80, max: 88 },
    crystalCount: 8,
    missionCount: 32,
    companion: "Rex",
    theme: {
      primaryColor: "#A16207",
      secondaryColor: "#CA8A04",
      bgFrom: "#1C1917",
      bgTo: "#292524",
      icon: "🏛️",
      emoji: "📜",
    },
    isAvailable: false,
  },
  {
    id: 14,
    name: "Crystal Fortress",
    description: "The ultimate mixed review to prepare for the final battle!",
    world: "Fortress Zone",
    focusAreas: ["Mixed Review"],
    completionRange: { min: 88, max: 95 },
    crystalCount: 7,
    missionCount: 28,
    companion: "All",
    theme: {
      primaryColor: "#8B5CF6",
      secondaryColor: "#C4B5FD",
      bgFrom: "#1E1B4B",
      bgTo: "#2E1065",
      icon: "🏰",
      emoji: "⚔️",
    },
    isAvailable: false,
  },
  {
    id: 15,
    name: "Final Battle",
    description: "Defeat The Forgetful Fog and restore all knowledge!",
    world: "Final World",
    focusAreas: ["All Skills"],
    completionRange: { min: 95, max: 100 },
    crystalCount: 5,
    missionCount: 20,
    companion: "All",
    theme: {
      primaryColor: "#EC4899",
      secondaryColor: "#F472B6",
      bgFrom: "#0F172A",
      bgTo: "#1E1B4B",
      icon: "⚡",
      emoji: "🌟",
    },
    isAvailable: false,
  },
];
