import { create } from "zustand";
import { Inventory } from "@/types/rewards";

interface RewardState {
  inventoryMap: Record<string, Inventory>;
  setInventory: (studentId: string, inv: Inventory) => void;
  addOwnedItem: (studentId: string, itemId: string) => void;
  equipItem: (studentId: string, slot: "skin" | "celebration", itemId: string) => void;
}

export const useRewardStore = create<RewardState>()((set) => ({
  inventoryMap: {},
  setInventory: (studentId, inv) =>
    set((state) => ({
      inventoryMap: { ...state.inventoryMap, [studentId]: inv },
    })),
  addOwnedItem: (studentId, itemId) =>
    set((state) => {
      const inv = state.inventoryMap[studentId];
      if (!inv) return state;
      return {
        inventoryMap: {
          ...state.inventoryMap,
          [studentId]: { ...inv, ownedItemIds: [...inv.ownedItemIds, itemId] },
        },
      };
    }),
  equipItem: (studentId, slot, itemId) =>
    set((state) => {
      const inv = state.inventoryMap[studentId];
      if (!inv) return state;
      return {
        inventoryMap: {
          ...state.inventoryMap,
          [studentId]: {
            ...inv,
            equippedSkinId: slot === "skin" ? itemId : inv.equippedSkinId,
            equippedCelebrationId:
              slot === "celebration" ? itemId : inv.equippedCelebrationId,
          },
        },
      };
    }),
}));
