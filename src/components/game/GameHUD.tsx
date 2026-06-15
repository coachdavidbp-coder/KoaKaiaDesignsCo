"use client";

import { motion } from "framer-motion";
import { Home } from "lucide-react";
import Link from "next/link";
import { StudentProfile } from "@/types/user";
import { StudentProgress } from "@/types/progress";
import { Avatar } from "@/components/ui/Avatar";
import { ProgressBar } from "@/components/ui/ProgressBar";

interface GameHUDProps {
  student: StudentProfile;
  progress: StudentProgress | null;
}

export function GameHUD({ student, progress }: GameHUDProps) {
  const crystals = progress?.crystals.earned ?? 0;
  const coins = progress?.coins ?? 0;
  const gems = progress?.gems ?? 0;
  const xp = progress?.xp ?? 0;
  const overall = progress?.overallPercent ?? 0;
  const streak = progress?.streak ?? 0;

  return (
    <div className="sticky top-0 z-30 bg-gray-900/90 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-5xl mx-auto px-4 py-3">
        <div className="flex items-center gap-3">
          <Avatar character={student.avatar.character} color={student.avatar.color} size="sm" avatarUrl={student.avatarUrl} />

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <p className="font-bold text-white text-sm truncate">{student.displayName}</p>
              {streak > 0 && (
                <span className="text-xs px-1.5 py-0.5 rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/30 font-medium flex-shrink-0">
                  🔥{streak}
                </span>
              )}
            </div>
            <ProgressBar value={overall} size="sm" variant="gradient" animated={false} />
          </div>

          <div className="flex items-center gap-2 flex-shrink-0 text-xs">
            <div className="hidden sm:flex flex-col items-center px-2 py-1 rounded-xl bg-amber-500/10 border border-amber-500/20">
              <span className="text-amber-300 font-bold">{crystals}</span>
              <span className="text-amber-500/70 text-[10px]">💎</span>
            </div>
            <div className="hidden sm:flex flex-col items-center px-2 py-1 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
              <span className="text-yellow-300 font-bold">{coins}</span>
              <span className="text-yellow-500/70 text-[10px]">🪙</span>
            </div>
            <div className="hidden sm:flex flex-col items-center px-2 py-1 rounded-xl bg-purple-500/10 border border-purple-500/20">
              <span className="text-purple-300 font-bold">{gems}</span>
              <span className="text-purple-500/70 text-[10px]">💜</span>
            </div>
            <Link href="/parent">
              <button className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-all">
                <Home className="w-4 h-4" />
              </button>
            </Link>
          </div>
        </div>

        <div className="sm:hidden flex items-center gap-3 mt-2 text-xs">
          <span className="text-amber-300 font-medium">💎 {crystals}/100</span>
          <span className="text-yellow-300 font-medium">🪙 {coins}</span>
          <span className="text-purple-300 font-medium">💜 {gems}</span>
          <span className="text-blue-300 font-medium ml-auto">⚡ {xp} XP</span>
        </div>
      </div>
    </div>
  );
}
