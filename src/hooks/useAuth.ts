"use client";

import { useAuthStore } from "@/store/authStore";
import { signOut, resetPassword } from "@/lib/firebase/auth";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import toast from "react-hot-toast";

export function useAuth() {
  const { firebaseUser, parentProfile, isLoading, isInitialized } = useAuthStore();
  const router = useRouter();

  const logout = useCallback(async () => {
    try {
      await signOut();
      router.push("/login");
      toast.success("Signed out successfully");
    } catch {
      toast.error("Failed to sign out");
    }
  }, [router]);

  const sendPasswordReset = useCallback(async (email: string) => {
    try {
      await resetPassword(email);
      toast.success("Password reset email sent!");
      return true;
    } catch {
      toast.error("Failed to send reset email");
      return false;
    }
  }, []);

  return {
    user: firebaseUser,
    profile: parentProfile,
    isAuthenticated: !!firebaseUser,
    isLoading,
    isInitialized,
    logout,
    sendPasswordReset,
  };
}
