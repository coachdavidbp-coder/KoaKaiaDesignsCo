export type AchievementCategory =
  | "reading"
  | "math"
  | "spelling"
  | "writing"
  | "exploration"
  | "streak"
  | "mastery"
  | "companion"
  | "crystal";

export interface Achievement {
  id: string;
  name: string;
  description: string;
  emoji: string;
  category: AchievementCategory;
  rarity: "common" | "rare" | "epic" | "legendary";
  xpReward: number;
  coinReward: number;
  gemReward: number;
  secret?: boolean;
}

export interface EarnedAchievement {
  achievementId: string;
  earnedAt: string;
}

export interface StudentAchievements {
  studentId: string;
  earned: EarnedAchievement[];
  updatedAt: string;
}

export const ALL_ACHIEVEMENTS: Achievement[] = [
  // ── Crystal ──────────────────────────────────────────────────────────────
  {
    id: "first_crystal",
    name: "First Crystal!",
    description: "Earn your very first Knowledge Crystal",
    emoji: "💎",
    category: "crystal",
    rarity: "common",
    xpReward: 50,
    coinReward: 20,
    gemReward: 0,
  },
  {
    id: "crystal_collector",
    name: "Crystal Collector",
    description: "Earn 25 Knowledge Crystals",
    emoji: "💎",
    category: "crystal",
    rarity: "rare",
    xpReward: 150,
    coinReward: 75,
    gemReward: 1,
  },
  {
    id: "crystal_master",
    name: "Crystal Master",
    description: "Earn 50 Knowledge Crystals",
    emoji: "💎",
    category: "crystal",
    rarity: "epic",
    xpReward: 300,
    coinReward: 150,
    gemReward: 2,
  },
  {
    id: "crystal_champion",
    name: "Crystal Champion",
    description: "Earn 75 Knowledge Crystals",
    emoji: "💎",
    category: "crystal",
    rarity: "epic",
    xpReward: 500,
    coinReward: 250,
    gemReward: 3,
  },
  {
    id: "crystal_legend",
    name: "Crystal Legend",
    description: "Collect ALL 100 Knowledge Crystals!",
    emoji: "🌟",
    category: "crystal",
    rarity: "legendary",
    xpReward: 1000,
    coinReward: 500,
    gemReward: 10,
  },

  // ── Reading ───────────────────────────────────────────────────────────────
  {
    id: "first_story",
    name: "Story Starter",
    description: "Complete your first reading adventure",
    emoji: "📖",
    category: "reading",
    rarity: "common",
    xpReward: 50,
    coinReward: 15,
    gemReward: 0,
  },
  {
    id: "bookworm",
    name: "Bookworm",
    description: "Complete 10 reading missions",
    emoji: "🐛",
    category: "reading",
    rarity: "rare",
    xpReward: 200,
    coinReward: 80,
    gemReward: 1,
  },
  {
    id: "speed_reader",
    name: "Speed Reader",
    description: "Complete a reading mission with 90%+ fluency",
    emoji: "⚡",
    category: "reading",
    rarity: "rare",
    xpReward: 150,
    coinReward: 60,
    gemReward: 1,
  },
  {
    id: "story_master",
    name: "Story Master",
    description: "Complete all reading missions in a level",
    emoji: "🏆",
    category: "reading",
    rarity: "epic",
    xpReward: 300,
    coinReward: 120,
    gemReward: 2,
  },
  {
    id: "vocab_hero",
    name: "Vocabulary Hero",
    description: "Learn 50 new vocabulary words",
    emoji: "🦸",
    category: "reading",
    rarity: "epic",
    xpReward: 350,
    coinReward: 140,
    gemReward: 2,
  },

  // ── Math ──────────────────────────────────────────────────────────────────
  {
    id: "first_math",
    name: "Number Cruncher",
    description: "Complete your first math mission",
    emoji: "🔢",
    category: "math",
    rarity: "common",
    xpReward: 50,
    coinReward: 15,
    gemReward: 0,
  },
  {
    id: "addition_ace",
    name: "Addition Ace",
    description: "Master all addition challenges",
    emoji: "➕",
    category: "math",
    rarity: "rare",
    xpReward: 200,
    coinReward: 80,
    gemReward: 1,
  },
  {
    id: "subtraction_star",
    name: "Subtraction Star",
    description: "Master all subtraction challenges",
    emoji: "➖",
    category: "math",
    rarity: "rare",
    xpReward: 200,
    coinReward: 80,
    gemReward: 1,
  },
  {
    id: "math_wizard",
    name: "Math Wizard",
    description: "Complete 20 math missions",
    emoji: "🧙",
    category: "math",
    rarity: "epic",
    xpReward: 300,
    coinReward: 120,
    gemReward: 2,
  },
  {
    id: "problem_solver",
    name: "Problem Solver",
    description: "Complete all word problem challenges",
    emoji: "🧩",
    category: "math",
    rarity: "epic",
    xpReward: 350,
    coinReward: 140,
    gemReward: 2,
  },

  // ── Spelling ──────────────────────────────────────────────────────────────
  {
    id: "first_spell",
    name: "Spell Check",
    description: "Spell your first word correctly",
    emoji: "✏️",
    category: "spelling",
    rarity: "common",
    xpReward: 30,
    coinReward: 10,
    gemReward: 0,
  },
  {
    id: "perfect_speller",
    name: "Perfect Speller",
    description: "Spell 10 words in a row correctly",
    emoji: "⭐",
    category: "spelling",
    rarity: "rare",
    xpReward: 200,
    coinReward: 80,
    gemReward: 1,
  },
  {
    id: "word_warrior",
    name: "Word Warrior",
    description: "Master 50 sight words",
    emoji: "⚔️",
    category: "spelling",
    rarity: "epic",
    xpReward: 300,
    coinReward: 120,
    gemReward: 2,
  },
  {
    id: "spelling_bee",
    name: "Spelling Bee",
    description: "Complete the entire Spelling Academy",
    emoji: "🐝",
    category: "spelling",
    rarity: "legendary",
    xpReward: 600,
    coinReward: 250,
    gemReward: 5,
  },

  // ── Writing ───────────────────────────────────────────────────────────────
  {
    id: "sentence_builder",
    name: "Sentence Builder",
    description: "Write your first complete sentence",
    emoji: "📝",
    category: "writing",
    rarity: "common",
    xpReward: 50,
    coinReward: 15,
    gemReward: 0,
  },
  {
    id: "paragraph_pro",
    name: "Paragraph Pro",
    description: "Write your first full paragraph",
    emoji: "📄",
    category: "writing",
    rarity: "rare",
    xpReward: 200,
    coinReward: 80,
    gemReward: 1,
  },
  {
    id: "story_author",
    name: "Story Author",
    description: "Complete your first story writing mission",
    emoji: "📚",
    category: "writing",
    rarity: "rare",
    xpReward: 250,
    coinReward: 100,
    gemReward: 1,
  },
  {
    id: "grammar_guru",
    name: "Grammar Guru",
    description: "Master all grammar challenges",
    emoji: "🎓",
    category: "writing",
    rarity: "epic",
    xpReward: 350,
    coinReward: 140,
    gemReward: 2,
  },

  // ── Streak ────────────────────────────────────────────────────────────────
  {
    id: "day_one",
    name: "Day One",
    description: "Play Summer Quest for the first time!",
    emoji: "🌅",
    category: "streak",
    rarity: "common",
    xpReward: 25,
    coinReward: 10,
    gemReward: 0,
  },
  {
    id: "hot_streak",
    name: "Hot Streak",
    description: "Play 3 days in a row",
    emoji: "🔥",
    category: "streak",
    rarity: "common",
    xpReward: 75,
    coinReward: 30,
    gemReward: 0,
  },
  {
    id: "on_fire",
    name: "On Fire!",
    description: "Play 7 days in a row",
    emoji: "🌋",
    category: "streak",
    rarity: "rare",
    xpReward: 200,
    coinReward: 80,
    gemReward: 1,
  },
  {
    id: "unstoppable",
    name: "Unstoppable",
    description: "Play 14 days in a row",
    emoji: "⚡",
    category: "streak",
    rarity: "epic",
    xpReward: 400,
    coinReward: 160,
    gemReward: 3,
  },
  {
    id: "summer_legend",
    name: "Summer Legend",
    description: "Play 30 days in a row",
    emoji: "👑",
    category: "streak",
    rarity: "legendary",
    xpReward: 1000,
    coinReward: 400,
    gemReward: 8,
  },

  // ── Exploration ───────────────────────────────────────────────────────────
  {
    id: "first_level",
    name: "Level Complete!",
    description: "Complete your first adventure world",
    emoji: "🏅",
    category: "exploration",
    rarity: "common",
    xpReward: 100,
    coinReward: 40,
    gemReward: 0,
  },
  {
    id: "halfway",
    name: "Halfway Hero",
    description: "Complete 7 adventure worlds",
    emoji: "🗺️",
    category: "exploration",
    rarity: "rare",
    xpReward: 400,
    coinReward: 160,
    gemReward: 2,
  },
  {
    id: "final_battle_won",
    name: "Adventure Complete!",
    description: "Defeat The Forgetful Fog and complete all 15 worlds!",
    emoji: "🌟",
    category: "exploration",
    rarity: "legendary",
    xpReward: 2000,
    coinReward: 1000,
    gemReward: 20,
    secret: true,
  },
  {
    id: "perfect_score",
    name: "Perfect Score",
    description: "Get 100% on any assessment",
    emoji: "💯",
    category: "mastery",
    rarity: "rare",
    xpReward: 250,
    coinReward: 100,
    gemReward: 2,
  },
  {
    id: "second_grade_ready",
    name: "2nd Grade Ready!",
    description: "Reach 100% completion — you're ready for 2nd grade!",
    emoji: "🎓",
    category: "mastery",
    rarity: "legendary",
    xpReward: 5000,
    coinReward: 2000,
    gemReward: 50,
    secret: true,
  },

  // ── Companion ─────────────────────────────────────────────────────────────
  {
    id: "best_friends",
    name: "Best Friends",
    description: "Play alongside Mia for 10 sessions",
    emoji: "🐕",
    category: "companion",
    rarity: "rare",
    xpReward: 150,
    coinReward: 60,
    gemReward: 1,
  },
  {
    id: "turbo_charged",
    name: "Turbo Charged",
    description: "Complete 5 math missions with Turbo",
    emoji: "🚛",
    category: "companion",
    rarity: "rare",
    xpReward: 150,
    coinReward: 60,
    gemReward: 1,
  },
  {
    id: "splash_zone",
    name: "Splash Zone",
    description: "Complete 5 reading missions with Splash",
    emoji: "🐬",
    category: "companion",
    rarity: "rare",
    xpReward: 150,
    coinReward: 60,
    gemReward: 1,
  },
];

export const RARITY_COLORS = {
  common: { bg: "bg-gray-500/20", text: "text-gray-300", border: "border-gray-500/30", label: "Common" },
  rare: { bg: "bg-blue-500/20", text: "text-blue-300", border: "border-blue-500/30", label: "Rare" },
  epic: { bg: "bg-purple-500/20", text: "text-purple-300", border: "border-purple-500/30", label: "Epic" },
  legendary: { bg: "bg-amber-500/20", text: "text-amber-300", border: "border-amber-500/30", label: "Legendary" },
};
