import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export default function GameLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-game-bg">
        {children}
      </div>
    </ProtectedRoute>
  );
}
