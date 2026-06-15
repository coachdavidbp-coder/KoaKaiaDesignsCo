"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ShoppingBag, Coins } from "lucide-react";
import { useStudentStore } from "@/store/studentStore";
import { useProgressStore } from "@/store/progressStore";
import { useRewards } from "@/hooks/useRewards";
import { useAchievements } from "@/hooks/useAchievements";
import { getStudentProgress } from "@/lib/firebase/firestore";
import {
  SHOP_ITEMS,
  ShopItem,
  ITEM_RARITY_STYLES,
  ItemType,
} from "@/types/rewards";
import { GameNav } from "@/components/game/GameNav";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils/cn";
import { StudentProgress } from "@/types/progress";

interface Props {
  params: Promise<{ profileId: string }>;
}

const FILTERS: { id: ItemType | "all"; label: string; emoji: string }[] = [
  { id: "all", label: "All Items", emoji: "🛍️" },
  { id: "celebration", label: "Celebrations", emoji: "🎉" },
  { id: "pet", label: "Pets", emoji: "🐾" },
  { id: "vehicle", label: "Vehicles", emoji: "🚛" },
  { id: "badge", label: "Badges", emoji: "🏅" },
  { id: "treasure", label: "Chests", emoji: "📦" },
];

export default function ShopPage({ params }: Props) {
  const { profileId } = use(params);
  const router = useRouter();
  const { activeStudent } = useStudentStore();
  const { progressMap, setProgress } = useProgressStore();
  const { inventory, loadInventory, buyItem } = useRewards(profileId);
  const { earnedCount } = useAchievements(profileId);
  const [progress, setLocalProgress] = useState<StudentProgress | null>(
    progressMap[profileId] ?? null
  );
  const [filter, setFilter] = useState<ItemType | "all">("all");
  const [purchasing, setPurchasing] = useState<string | null>(null);

  useEffect(() => {
    if (!activeStudent || activeStudent.id !== profileId) {
      router.push("/parent");
      return;
    }
    Promise.all([
      getStudentProgress(profileId).then((p) => {
        if (p) { setLocalProgress(p); setProgress(profileId, p); }
      }),
      loadInventory(),
    ]);
  }, [profileId, activeStudent, router, setProgress, loadInventory]);

  const handleBuy = async (item: ShopItem) => {
    setPurchasing(item.id);
    await buyItem(item.id);
    const p = await getStudentProgress(profileId);
    if (p) { setLocalProgress(p); setProgress(profileId, p); }
    setPurchasing(null);
  };

  const filteredItems = SHOP_ITEMS.filter(
    (item) => filter === "all" || item.type === filter
  );

  return (
    <div className="min-h-screen pb-24">
      <div className="bg-gray-900/90 backdrop-blur-xl border-b border-white/10 px-4 py-4 sticky top-0 z-20">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-5 h-5 text-purple-400" />
            <div>
              <h1 className="font-bold text-white text-lg leading-none">Reward Shop</h1>
              <p className="text-xs text-gray-400">Spend your hard-earned coins & gems</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-yellow-300 font-bold">{progress?.coins ?? 0} 🪙</span>
            <span className="text-purple-300 font-bold">{progress?.gems ?? 0} 💜</span>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-5">
        <div className="flex gap-2 overflow-x-auto pb-2 mb-5 scrollbar-hide">
          {FILTERS.map(({ id, label, emoji }) => (
            <button
              key={id}
              onClick={() => setFilter(id)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap border transition-all shrink-0",
                filter === id
                  ? "bg-blue-500/20 border-blue-500/40 text-blue-300"
                  : "bg-white/5 border-white/10 text-gray-400 hover:text-gray-200"
              )}
            >
              <span>{emoji}</span> {label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filteredItems.map((item, i) => {
            const owned = inventory?.ownedItemIds.includes(item.id) ?? false;
            const styles = ITEM_RARITY_STYLES[item.rarity];
            const canAfford =
              (item.costCoins === 0 || (progress?.coins ?? 0) >= item.costCoins) &&
              (item.costGems === 0 || (progress?.gems ?? 0) >= item.costGems);

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <div
                  className={cn(
                    "rounded-2xl border p-4 bg-gradient-to-br",
                    styles.bg,
                    styles.border,
                    owned ? "opacity-80" : ""
                  )}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div
                      className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center text-2xl border shrink-0",
                        styles.border,
                        "bg-black/20"
                      )}
                    >
                      {item.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-bold text-white text-sm">{item.name}</p>
                        <span className={cn("text-[10px] font-bold capitalize", styles.badge)}>
                          {item.rarity}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5 leading-tight">
                        {item.description}
                      </p>
                      {item.unlockRequirement && (
                        <p className="text-[10px] text-amber-400/70 mt-1">
                          ⚠️ Requires: {item.unlockRequirement}
                        </p>
                      )}
                    </div>
                  </div>

                  {owned ? (
                    <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                      <span className="text-emerald-400 text-sm font-bold">✓ Owned</span>
                    </div>
                  ) : (
                    <Button
                      size="sm"
                      variant={canAfford ? "primary" : "ghost"}
                      className="w-full"
                      isLoading={purchasing === item.id}
                      onClick={() => handleBuy(item)}
                      disabled={!canAfford || !!purchasing}
                    >
                      {item.costCoins > 0 && `${item.costCoins} 🪙`}
                      {item.costCoins > 0 && item.costGems > 0 && " + "}
                      {item.costGems > 0 && `${item.costGems} 💜`}
                      {item.costCoins === 0 && item.costGems === 0 && "Free!"}
                    </Button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        <Card className="mt-6 p-5 text-center">
          <p className="text-3xl mb-2">🪙</p>
          <p className="text-sm font-semibold text-white">Earn more coins by completing missions!</p>
          <p className="text-xs text-gray-500 mt-1">
            Each mission rewards coins, XP, and a chance to earn Knowledge Crystals.
          </p>
        </Card>
      </div>

      <GameNav profileId={profileId} achievementCount={earnedCount} />
    </div>
  );
}
