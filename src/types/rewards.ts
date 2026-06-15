export type ItemType = "skin" | "vehicle" | "pet" | "badge" | "celebration" | "treasure";
export type ItemRarity = "common" | "rare" | "epic" | "legendary";

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  emoji: string;
  type: ItemType;
  rarity: ItemRarity;
  costCoins: number;
  costGems: number;
  unlockRequirement?: string;
  preview?: string;
}

export interface Inventory {
  studentId: string;
  ownedItemIds: string[];
  equippedSkinId: string | null;
  equippedCelebrationId: string | null;
  updatedAt: string;
}

export const SHOP_ITEMS: ShopItem[] = [
  // ── Celebrations ─────────────────────────────────────────────────────────
  {
    id: "fireworks",
    name: "Fireworks!",
    description: "Celebrate with a fireworks explosion",
    emoji: "🎆",
    type: "celebration",
    rarity: "common",
    costCoins: 50,
    costGems: 0,
  },
  {
    id: "confetti",
    name: "Confetti Blast",
    description: "Rain of colorful confetti",
    emoji: "🎊",
    type: "celebration",
    rarity: "common",
    costCoins: 50,
    costGems: 0,
  },
  {
    id: "rainbow_burst",
    name: "Rainbow Burst",
    description: "A rainbow explosion of colors",
    emoji: "🌈",
    type: "celebration",
    rarity: "rare",
    costCoins: 150,
    costGems: 0,
  },
  {
    id: "lightning_strike",
    name: "Lightning Strike",
    description: "Electric celebration flash",
    emoji: "⚡",
    type: "celebration",
    rarity: "rare",
    costCoins: 0,
    costGems: 2,
  },
  {
    id: "star_shower",
    name: "Star Shower",
    description: "A shower of golden stars",
    emoji: "✨",
    type: "celebration",
    rarity: "epic",
    costCoins: 0,
    costGems: 5,
    unlockRequirement: "Earn 50 crystals",
  },

  // ── Vehicles (Turbo themed) ───────────────────────────────────────────────
  {
    id: "truck_blue",
    name: "Blue Thunder",
    description: "A cool blue monster truck for Turbo",
    emoji: "🚙",
    type: "vehicle",
    rarity: "common",
    costCoins: 80,
    costGems: 0,
  },
  {
    id: "truck_gold",
    name: "Gold Crusher",
    description: "Golden monster truck — the ultimate ride",
    emoji: "🏆",
    type: "vehicle",
    rarity: "legendary",
    costCoins: 0,
    costGems: 10,
    unlockRequirement: "Complete Level 2",
  },

  // ── Pets ──────────────────────────────────────────────────────────────────
  {
    id: "pet_baby_dino",
    name: "Baby Dino",
    description: "Rex's little friend who follows you around",
    emoji: "🦕",
    type: "pet",
    rarity: "rare",
    costCoins: 200,
    costGems: 0,
    unlockRequirement: "Complete Level 4",
  },
  {
    id: "pet_mini_truck",
    name: "Mini Turbo",
    description: "A tiny monster truck companion",
    emoji: "🚛",
    type: "pet",
    rarity: "rare",
    costCoins: 0,
    costGems: 3,
    unlockRequirement: "Complete Level 2",
  },
  {
    id: "pet_dolphin_friend",
    name: "Splash Jr.",
    description: "A baby dolphin who loves stories",
    emoji: "🐬",
    type: "pet",
    rarity: "epic",
    costCoins: 0,
    costGems: 5,
    unlockRequirement: "Complete Level 5",
  },
  {
    id: "pet_star",
    name: "Star Buddy",
    description: "A magical floating star that guides your path",
    emoji: "⭐",
    type: "pet",
    rarity: "legendary",
    costCoins: 0,
    costGems: 8,
    unlockRequirement: "Earn 75 crystals",
  },

  // ── Badges (cosmetic) ─────────────────────────────────────────────────────
  {
    id: "badge_explorer",
    name: "Explorer Badge",
    description: "Shows you're a true Adventure Island explorer",
    emoji: "🧭",
    type: "badge",
    rarity: "common",
    costCoins: 30,
    costGems: 0,
  },
  {
    id: "badge_champion",
    name: "Champion Badge",
    description: "For champions who never give up",
    emoji: "🏅",
    type: "badge",
    rarity: "rare",
    costCoins: 100,
    costGems: 0,
  },
  {
    id: "badge_crystal_king",
    name: "Crystal King",
    description: "The rarest badge, for crystal masters",
    emoji: "👑",
    type: "badge",
    rarity: "legendary",
    costCoins: 0,
    costGems: 15,
    unlockRequirement: "Earn all 100 crystals",
  },

  // ── Treasure Chests ───────────────────────────────────────────────────────
  {
    id: "chest_bronze",
    name: "Bronze Chest",
    description: "Contains random coins and a surprise!",
    emoji: "📦",
    type: "treasure",
    rarity: "common",
    costCoins: 100,
    costGems: 0,
  },
  {
    id: "chest_silver",
    name: "Silver Chest",
    description: "Better rewards inside!",
    emoji: "🗃️",
    type: "treasure",
    rarity: "rare",
    costCoins: 250,
    costGems: 0,
  },
  {
    id: "chest_gold",
    name: "Gold Chest",
    description: "Epic rewards and gems await!",
    emoji: "💰",
    type: "treasure",
    rarity: "epic",
    costCoins: 0,
    costGems: 5,
  },
];

export const ITEM_RARITY_STYLES = {
  common: { border: "border-gray-500/40", bg: "from-gray-800 to-gray-900", badge: "text-gray-400" },
  rare: { border: "border-blue-500/40", bg: "from-blue-900/40 to-gray-900", badge: "text-blue-400" },
  epic: { border: "border-purple-500/40", bg: "from-purple-900/40 to-gray-900", badge: "text-purple-400" },
  legendary: { border: "border-amber-500/40", bg: "from-amber-900/40 to-gray-900", badge: "text-amber-400" },
};
