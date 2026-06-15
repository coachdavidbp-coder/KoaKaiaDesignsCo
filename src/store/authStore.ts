import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "firebase/auth";
import { ParentUser } from "@/types/user";

interface AuthState {
  firebaseUser: User | null;
  parentProfile: ParentUser | null;
  isLoading: boolean;
  isInitialized: boolean;
  setFirebaseUser: (user: User | null) => void;
  setParentProfile: (profile: ParentUser | null) => void;
  setLoading: (loading: boolean) => void;
  setInitialized: (initialized: boolean) => void;
  reset: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      firebaseUser: null,
      parentProfile: null,
      isLoading: true,
      isInitialized: false,
      setFirebaseUser: (user) => set({ firebaseUser: user }),
      setParentProfile: (profile) => set({ parentProfile: profile }),
      setLoading: (loading) => set({ isLoading: loading }),
      setInitialized: (initialized) => set({ isInitialized: initialized }),
      reset: () =>
        set({
          firebaseUser: null,
          parentProfile: null,
          isLoading: false,
          isInitialized: true,
        }),
    }),
    {
      name: "summer-quest-auth",
      partialize: (state) => ({ parentProfile: state.parentProfile }),
    }
  )
);
