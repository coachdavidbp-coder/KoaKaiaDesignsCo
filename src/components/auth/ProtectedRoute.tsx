"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { FullPageLoader } from "@/components/ui/LoadingSpinner";

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export function ProtectedRoute({ children, redirectTo = "/login" }: ProtectedRouteProps) {
  const { firebaseUser, isInitialized } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (isInitialized && !firebaseUser) {
      router.push(redirectTo);
    }
  }, [firebaseUser, isInitialized, router, redirectTo]);

  if (!isInitialized) return <FullPageLoader label="Setting up your adventure..." />;
  if (!firebaseUser) return <FullPageLoader label="Redirecting..." />;

  return <>{children}</>;
}
