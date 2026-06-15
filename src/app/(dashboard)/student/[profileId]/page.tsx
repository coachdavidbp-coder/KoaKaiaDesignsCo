"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useStudentStore } from "@/store/studentStore";
import { getStudentProfile, getStudentProgress } from "@/lib/firebase/firestore";
import { StudentProfile } from "@/types/user";
import { StudentProgress } from "@/types/progress";
import { GAME_LEVELS } from "@/types/game";
import { Card } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Badge } from "@/components/ui/Badge";
import { FullPageLoader } from "@/components/ui/LoadingSpinner";
import { Home, Lock } from "lucide-react";
import Link from "next/link";

interface Props {
  params: Promise<{ profileId: string }>;
}

export default function StudentWorldPage({ params }: Props) {
  const { profileId } = use(params);
  const router = useRouter();
  const { activeStudent } = useStudentStore();
  const [student, setStudent] = useState<StudentProfile | null>(null);
  const [progress, setProgress] = useState<StudentProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const s = await getStudentProfile(profileId);
        if (!s) { router.push("/parent"); return; }

        if (activeStudent?.id !== profileId && s.pin) {
          router.push("/parent");
          return;
        }

        const p = await getStudentProgress(profileId);
        setStudent(s);
        setProgress(p);
      } catch {
        router.push("/parent");
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [profileId, activeStudent, router]);

  if (isLoading) return <FullPageLoader label="Loading Adventure Island..." />;
  if (!student) return null;

  const crystals = progress?.crystals.earned ?? 0;
  const overallPct = progress?.overallPercent ?? 0;

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Avatar character={student.avatar.character} color={student.avatar.color} size="md" />
          <div>
            <p className="font-bold text-white text-lg">{student.displayName}</p>
            <p className="text-xs text-gray-400">Explorer</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="gold">💎 {crystals}/100</Badge>
          <Link href="/parent">
            <button className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-all">
              <Home className="w-5 h-5" />
            </button>
          </Link>
        </div>
      </div>

      <Card variant="glow" className="p-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm text-gray-400">Adventure Progress</p>
            <p className="text-2xl font-bold text-white">{Math.round(overallPct)}%</p>
          </div>
          <p className="text-4xl animate-float">🏝️</p>
        </div>
        <ProgressBar value={overallPct} variant="gradient" size="lg" />
        <p className="text-xs text-gray-500 mt-2">
          {crystals === 0
            ? "Begin your adventure! Complete missions to earn Knowledge Crystals!"
            : `Keep going! Collect all 100 crystals to defeat The Forgetful Fog!`}
        </p>
      </Card>

      <h2 className="text-lg font-bold text-white mb-4">🗺️ Adventure Island Worlds</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {GAME_LEVELS.map((level, i) => {
          const lvlProgress = progress?.levels.find((l) => l.levelId === level.id);
          const isUnlocked = lvlProgress?.isUnlocked ?? level.id === 1;
          const pct = lvlProgress?.completionPercent ?? 0;
          const crystalsEarned = lvlProgress?.crystalsEarned ?? 0;

          return (
            <motion.div
              key={level.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <Card
                variant={isUnlocked ? "default" : "glass"}
                interactive={isUnlocked}
                className={`p-4 ${!isUnlocked ? "opacity-60" : ""}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-2xl">{level.theme.icon}</span>
                      {!isUnlocked && <Lock className="w-3 h-3 text-gray-500" />}
                    </div>
                    <p className="text-xs text-gray-500">Level {level.id}</p>
                    <p className="font-semibold text-white text-sm leading-tight">{level.name}</p>
                  </div>
                  <Badge variant={crystalsEarned > 0 ? "gold" : "gray"}>
                    💎 {crystalsEarned}/{level.crystalCount}
                  </Badge>
                </div>

                <div className="flex flex-wrap gap-1 mb-3">
                  {level.focusAreas.map((area) => (
                    <span
                      key={area}
                      className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-gray-400 border border-white/10"
                    >
                      {area}
                    </span>
                  ))}
                </div>

                <ProgressBar value={pct} size="sm" animated={false} />

                {isUnlocked && (
                  <button
                    className="mt-3 w-full py-2 rounded-xl text-sm font-semibold transition-all"
                    style={{
                      background: `linear-gradient(135deg, ${level.theme.primaryColor}30, ${level.theme.secondaryColor}30)`,
                      border: `1px solid ${level.theme.primaryColor}40`,
                      color: level.theme.primaryColor,
                    }}
                    disabled
                    title="Coming in Phase 2"
                  >
                    {pct > 0 ? "Continue" : "Start"} {level.theme.emoji}
                  </button>
                )}
              </Card>
            </motion.div>
          );
        })}
      </div>

      <Card className="p-5 mt-6 text-center">
        <p className="text-4xl mb-2">🌫️</p>
        <p className="text-sm font-semibold text-white">The Forgetful Fog awaits...</p>
        <p className="text-xs text-gray-500 mt-1">
          Complete all 15 worlds to unlock the Final Battle and restore Adventure Island!
        </p>
      </Card>
    </div>
  );
}
