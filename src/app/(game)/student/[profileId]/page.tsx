"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useStudentStore } from "@/store/studentStore";
import { useProgressStore } from "@/store/progressStore";
import { useAchievements } from "@/hooks/useAchievements";
import { useAdaptive } from "@/hooks/useAdaptive";
import { getStudentProfile, getStudentProgress } from "@/lib/firebase/firestore";
import { StudentProfile } from "@/types/user";
import { StudentProgress } from "@/types/progress";
import { WorldMap } from "@/components/game/WorldMap";
import { GameHUD } from "@/components/game/GameHUD";
import { GameNav } from "@/components/game/GameNav";
import { CompanionBubble } from "@/components/game/CompanionBubble";
import { CrystalTracker } from "@/components/game/CrystalTracker";
import { AchievementUnlock } from "@/components/game/AchievementUnlock";
import { DailyQuestCard } from "@/components/adaptive/DailyQuestCard";
import { LevelUpModal } from "@/components/adaptive/LevelUpModal";
import { WorldUnlockBanner } from "@/components/adaptive/WorldUnlockBanner";
import { Card } from "@/components/ui/Card";
import { FullPageLoader } from "@/components/ui/LoadingSpinner";

interface Props {
  params: Promise<{ profileId: string }>;
}

export default function StudentGamePage({ params }: Props) {
  const { profileId } = use(params);
  const router = useRouter();
  const { activeStudent, setActiveStudent } = useStudentStore();
  const { setProgress } = useProgressStore();
  const { earnedCount, loadAchievements, tryUnlock } = useAchievements(profileId);
  const [student, setStudent] = useState<StudentProfile | null>(null);
  const [progress, setLocalProgress] = useState<StudentProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showUnlockBanner, setShowUnlockBanner] = useState(true);

  const { recommendation, unlockedLevels, showLevelUp, newExplorerLevel, dismissLevelUp } =
    useAdaptive(profileId, progress);

  useEffect(() => {
    async function load() {
      try {
        const s = await getStudentProfile(profileId);
        if (!s || !s.isActive) { router.push("/parent"); return; }

        if (!activeStudent || activeStudent.id !== profileId) {
          router.push("/parent/students");
          return;
        }

        const p = await getStudentProgress(profileId);
        setStudent(s);
        setLocalProgress(p);
        if (p) setProgress(profileId, p);

        await loadAchievements();

        if (p && p.overallPercent > 0) {
          await tryUnlock("day_one");
        }
      } catch {
        router.push("/parent");
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [profileId, activeStudent, router, setProgress, loadAchievements, tryUnlock]);

  if (isLoading) return <FullPageLoader label="Loading Adventure Island..." />;
  if (!student) return null;

  return (
    <div className="min-h-screen pb-20">
      <GameHUD student={student} progress={progress} />
      <AchievementUnlock studentId={profileId} />
      <LevelUpModal
        show={showLevelUp}
        level={newExplorerLevel ?? 1}
        onDismiss={dismissLevelUp}
      />

      <div className="max-w-5xl mx-auto px-4 py-5 space-y-5">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <CompanionBubble
            character={student.avatar.character}
            color={student.avatar.color}
            context={progress?.totalPlaytimeMinutes ? "encouragement" : "greeting"}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-white text-lg">🗺️ Adventure Island</h2>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-amber-300 font-semibold">
                💎 {progress?.crystals.earned ?? 0}/100
              </span>
              <span className="text-gray-500">•</span>
              <span className="text-blue-300 font-semibold">
                {Math.round(progress?.overallPercent ?? 0)}% Complete
              </span>
            </div>
          </div>
          <WorldMap progress={progress} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="p-5">
            <CrystalTracker progress={progress} />
          </Card>
        </motion.div>

        {unlockedLevels.length > 0 && showUnlockBanner && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <WorldUnlockBanner
              levelIds={unlockedLevels}
              onDismiss={() => setShowUnlockBanner(false)}
            />
          </motion.div>
        )}

        {recommendation && (
          <DailyQuestCard
            recommendation={recommendation}
            streak={progress?.streak ?? 0}
            delay={0.25}
          />
        )}

        <motion.div
          className="grid grid-cols-2 sm:grid-cols-4 gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {[
            { label: "Reading", pct: progress?.readingPercent ?? 0, emoji: "📚", color: "#3B82F6" },
            { label: "Math", pct: progress?.mathPercent ?? 0, emoji: "🔢", color: "#F59E0B" },
            { label: "Spelling", pct: progress?.spellingPercent ?? 0, emoji: "✏️", color: "#8B5CF6" },
            { label: "Writing", pct: progress?.writingPercent ?? 0, emoji: "📝", color: "#10B981" },
          ].map((skill) => (
            <Card key={skill.label} className="p-4 text-center">
              <div className="text-2xl mb-1">{skill.emoji}</div>
              <p className="text-xs text-gray-400 mb-2">{skill.label}</p>
              <div className="text-lg font-bold" style={{ color: skill.color }}>
                {Math.round(skill.pct)}%
              </div>
              <div className="mt-2 h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${skill.pct}%`, backgroundColor: skill.color }}
                />
              </div>
            </Card>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-5 text-center border-purple-500/20 bg-purple-500/5">
            <div className="text-4xl mb-2 animate-float inline-block">🌫️</div>
            <p className="font-bold text-white text-sm">The Forgetful Fog Awaits...</p>
            <p className="text-xs text-gray-500 mt-1">
              Complete all 15 worlds to challenge The Forgetful Fog and restore knowledge to Adventure Island!
            </p>
          </Card>
        </motion.div>
      </div>

      <GameNav profileId={profileId} achievementCount={earnedCount} />
    </div>
  );
}
