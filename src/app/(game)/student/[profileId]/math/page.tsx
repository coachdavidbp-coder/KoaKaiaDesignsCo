"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Lock, CheckCircle } from "lucide-react";
import { useStudentStore } from "@/store/studentStore";
import { useProgressStore } from "@/store/progressStore";
import { useMath } from "@/hooks/useMath";
import { getStudentProfile, getStudentProgress } from "@/lib/firebase/firestore";
import { checkAndUnlockLevels } from "@/lib/firebase/adaptive";
import { ALL_MATH_MISSIONS } from "@/data/math";
import { StudentProfile } from "@/types/user";
import { StudentProgress } from "@/types/progress";
import { GameHUD } from "@/components/game/GameHUD";
import { GameNav } from "@/components/game/GameNav";
import { FullPageLoader } from "@/components/ui/LoadingSpinner";

interface Props {
  params: { profileId: string };
}

const LEVEL_GROUPS = [
  { levelId: 1, label: "Level 1 · Crystal Cove", emoji: "🏝️", color: "#10B981" },
  { levelId: 3, label: "Level 2 · Thunder Peak", emoji: "⚡", color: "#F59E0B" },
  { levelId: 5, label: "Level 3 · Ocean Deep", emoji: "🌊", color: "#3B82F6" },
];

export default function MathHubPage({ params }: Props) {
  const { profileId } = params;
  const router = useRouter();
  const { activeStudent } = useStudentStore();
  const { setProgress } = useProgressStore();
  const { mathProgress, loadMathProgress } = useMath(profileId);
  const [student, setStudent] = useState<StudentProfile | null>(null);
  const [progress, setLocalProgress] = useState<StudentProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const s = await getStudentProfile(profileId);
        if (!s || !s.isActive) { router.push("/parent"); return; }
        if (!activeStudent || activeStudent.id !== profileId) {
          router.push("/parent/students"); return;
        }
        const p = await getStudentProgress(profileId);
        setStudent(s);
        if (p) {
          setLocalProgress(p);
          setProgress(profileId, p);
          await loadMathProgress(p);
          // Re-read after migration may have updated completedLevelItems
          const freshP = await getStudentProgress(profileId);
          const target = freshP ?? p;
          const newly = await checkAndUnlockLevels(profileId, target);
          if (newly.length > 0) {
            const updated = { ...target, levels: target.levels.map((l) => newly.includes(l.levelId) ? { ...l, isUnlocked: true } : l) };
            setLocalProgress(updated);
            setProgress(profileId, updated);
          } else {
            setLocalProgress(target);
            setProgress(profileId, target);
          }
        } else {
          await loadMathProgress();
        }
      } catch {
        router.push("/parent");
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [profileId, activeStudent, router, setProgress, loadMathProgress]);

  if (isLoading) return <FullPageLoader label="Opening Math Missions..." />;
  if (!student) return null;

  const unlockedLevels = progress?.levels.filter((l) => l.isUnlocked).map((l) => l.levelId) ?? [1];
  const missionsCompleted = mathProgress?.missionsCompleted ?? [];
  const totalCorrect = mathProgress?.totalProblemsCorrect ?? 0;

  return (
    <div className="min-h-screen pb-24">
      <GameHUD student={student} progress={progress} />

      <div className="max-w-2xl mx-auto px-4 py-5">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 mb-6"
        >
          <button
            onClick={() => router.push(`/student/${profileId}`)}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/15 text-gray-400 hover:text-white transition-all active:scale-95"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-white">🔢 Math Missions</h1>
            <p className="text-xs text-gray-500 mt-0.5">
              {missionsCompleted.length} missions complete · {totalCorrect} problems correct
            </p>
          </div>
        </motion.div>

        <div className="space-y-8">
          {LEVEL_GROUPS.map(({ levelId, label, emoji, color }, gi) => {
            const missions = ALL_MATH_MISSIONS.filter((m) => m.levelId === levelId);
            const isUnlocked = unlockedLevels.includes(levelId);

            return (
              <motion.div
                key={levelId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 + gi * 0.08 }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">{emoji}</span>
                  <div className="flex-1">
                    <h2 className="font-bold text-white text-sm">{label}</h2>
                    {!isUnlocked && <p className="text-xs text-gray-500">Unlock earlier worlds to access</p>}
                  </div>
                  {!isUnlocked && <Lock className="w-4 h-4 text-gray-600" />}
                  {isUnlocked && (
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{ backgroundColor: color + "20", color, border: `1px solid ${color}30` }}
                    >
                      {missions.filter((m) => missionsCompleted.includes(m.id)).length}/{missions.length}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {missions.map((mission, mi) => {
                    const isComplete = missionsCompleted.includes(mission.id);

                    return (
                      <motion.button
                        key={mission.id}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 + mi * 0.06 }}
                        onClick={() => isUnlocked && router.push(`/student/${profileId}/math/${mission.id}`)}
                        disabled={!isUnlocked}
                        className={`text-left w-full p-4 rounded-3xl border overflow-hidden transition-all duration-200 ${
                          !isUnlocked
                            ? "opacity-50 cursor-not-allowed border-white/10"
                            : isComplete
                            ? "border-emerald-500/30 hover:border-emerald-500/50 hover:-translate-y-0.5 active:scale-98"
                            : "border-white/10 hover:border-white/20 hover:-translate-y-0.5 active:scale-98"
                        }`}
                        style={isUnlocked
                          ? { background: `linear-gradient(160deg, ${mission.theme.primary}10, #0D1117 60%)` }
                          : { background: "#0D1117" }
                        }
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{mission.emoji}</span>
                            <div>
                              <p className="font-bold text-white text-sm">{mission.title}</p>
                              <p className="text-xs text-gray-500 mt-0.5">{mission.subtitle}</p>
                            </div>
                          </div>
                          {isComplete && <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />}
                        </div>

                        {isUnlocked && (
                          <div className="flex items-center justify-between text-xs mt-2">
                            <span className="text-gray-500">{mission.problems.length} problems</span>
                            <div className="flex items-center gap-2">
                              <span style={{ color: mission.theme.primary }}>💎 +{mission.crystalReward}</span>
                              <span className="text-gray-500">⚡ +{mission.xpReward}</span>
                            </div>
                          </div>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <GameNav profileId={profileId} />
    </div>
  );
}
