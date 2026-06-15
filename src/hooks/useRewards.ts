"use client";

import { useCallback } from "react";
import { useRewardStore } from "@/store/rewardStore";
import { useProgressStore } from "@/store/progressStore";
import {
  getInventory,
  initInventory,
  purchaseItem,
  equipItem as firebaseEquipItem,
} from "@/lib/firebase/achievements";
import { updateStudentProgress } from "@/lib/firebase/firestore";
import { SHOP_ITEMS } from "@/types/rewards";
import toast from "react-hot-toast";

export function useRewards(studentId?: string) {
  const { inventoryMap, setInventory, addOwnedItem, equipItem } = useRewardStore();
  const { progressMap, updateProgress } = useProgressStore();

  const inventory = studentId ? inventoryMap[studentId] : undefined;
  const progress = studentId ? progressMap[studentId] : undefined;

  const loadInventory = useCallback(async () => {
    if (!studentId) return;
    const inv = await getInventory(studentId);
    if (inv) {
      setInventory(studentId, inv);
    } else {
      await initInventory(studentId);
      setInventory(studentId, {
        studentId,
        ownedItemIds: [],
        equippedSkinId: null,
        equippedCelebrationId: null,
        updatedAt: new Date().toISOString(),
      });
    }
  }, [studentId, setInventory]);

  const buyItem = useCallback(
    async (itemId: string) => {
      if (!studentId || !progress) return false;
      const item = SHOP_ITEMS.find((i) => i.id === itemId);
      if (!item) return false;

      if (inventory?.ownedItemIds.includes(itemId)) {
        toast("You already own this item!");
        return false;
      }

      if (item.costCoins > 0 && progress.coins < item.costCoins) {
        toast.error("Not enough coins!");
        return false;
      }
      if (item.costGems > 0 && progress.gems < item.costGems) {
        toast.error("Not enough gems!");
        return false;
      }

      const newCoins = progress.coins - item.costCoins;
      const newGems = progress.gems - item.costGems;

      await purchaseItem(studentId, itemId);
      await updateStudentProgress(studentId, { coins: newCoins, gems: newGems });
      updateProgress(studentId, { coins: newCoins, gems: newGems });
      addOwnedItem(studentId, itemId);

      toast.success(`🎉 You got ${item.name}!`);
      return true;
    },
    [studentId, progress, inventory, addOwnedItem, updateProgress]
  );

  const equip = useCallback(
    async (itemId: string, slot: "skin" | "celebration") => {
      if (!studentId) return;
      await firebaseEquipItem(studentId, itemId, slot);
      equipItem(studentId, slot, itemId);
      toast.success("Equipped!");
    },
    [studentId, equipItem]
  );

  return { inventory, loadInventory, buyItem, equip };
}
