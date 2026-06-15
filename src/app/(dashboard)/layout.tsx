import { Navbar } from "@/components/layout/Navbar";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-game-bg">
        <Navbar />
        <main className="pt-16 pb-20 md:pb-8 min-h-screen">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}
