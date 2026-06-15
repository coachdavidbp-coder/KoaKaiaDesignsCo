"use client";

import { useEffect } from "react";
import { onAuthChange, getParentProfile } from "@/lib/firebase/auth";
import { useAuthStore } from "@/store/authStore";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setFirebaseUser, setParentProfile, setLoading, setInitialized } = useAuthStore();

  useEffect(() => {
    const unsubscribe = onAuthChange(async (user) => {
      setFirebaseUser(user);
      if (user) {
        try {
          const profile = await getParentProfile(user.uid);
          setParentProfile(profile);
        } catch {
          setParentProfile(null);
        }
      } else {
        setParentProfile(null);
      }
      setLoading(false);
      setInitialized(true);
    });
    return unsubscribe;
  }, [setFirebaseUser, setParentProfile, setLoading, setInitialized]);

  return <>{children}</>;
}
