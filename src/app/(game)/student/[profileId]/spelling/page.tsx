"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Lock, CheckCircle } from "lucide-react";
import { useStudentStore } from "@/store/studentStore";
import { useProgressStore } from "@/store/progressStore";
import { useSpelling } from "@/hooks/useSpelling";
import { getStudentProfile, getStudentProgress } from "@/lib/firebase/firestore";
import { ALL_SPELLING_SETS } from "@/data/spelling";
import { StudentProfile } from "@/types/user";
import { StudentProgress } from "@/types/progress";
import { SpellingSet, MASTERY_COLORS } from "@/types/spelling";
import { GameHUD } from "@/components/game/GameHUD";
import { GameNav } from "@/components/game/GameNav";
import { FullPageLoader } from "@/components/ui/LoadingSpinner";

interface Props {
  params: { profileId: string };
}

const LEVEL_GROUPS: Array<{ levelId: number; label: string; emoji: string; color: string }> = [
  { levelId: 1, label: "Crystal Cove — Level 1", emoji: "🏝️", color: "#10B981" },
  { levelId: 3, label: "Thunder Peak — Level 3", emoji: "⚡", color: "#F59E0B" },
  { levelId: 5, label: "Ocean Deep — Level 5", emoji: "🌊", color: "#3B82F6" },
];

export default function SpellingHubPage({ params }: Props) {
  const { profileId } = params;
  const router = useRouter();
  const { activeStudent } = useStudentStore();
  const { setProgress } = useProgressStore();
  const { spellingProgress, loadSpellingProgress } = useSpelling(profileId);
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
        setLocalProgress(p);
        if (p) setProgress(profileId, p);
        await loadSpellingProgress();
      } catch {
        router.push("/parent");
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [profileId, activeStudent, router, setProgress, loadSpellingProgress]);

  if (isLoading) return <FullPageLoader label="Opening Spelling Academy..." />;
  if (!student) return null;

  const unlockedLevels = progress?.levels.filter((l) => l.isUnlocked).map((l) => l.levelId) ?? [1];
  const mastery = spellingProgress?.wordMastery ?? {};
  const setsCompleted = spellingProgress?.setsCompleted ?? [];

  const getMasteryForSet = (set: SpellingSet) => {
    const wordMasteries = set.words.map((w) => mastery[w.word]?.level ?? "new");
    const masteredCount = wordMasteries.filter((l) => l === "mastered").length;
    const practicingCount = wordMasteries.filter((l) => l === "practicing").length;
    const learningCount = wordMasteries.filter((l) => l === "learning").length;
    return { masteredCount, practicingCount, learningCount, total: set.words.length };
  };

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
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              ✏️ Spelling Academy
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              {spellingProgress?.totalWordsMastered ?? 0} words mastered
            </p>
          </div>
        </motion.div>

        <div className="space-y-8">
          {LEVEL_GROUPS.map(({ levelId, label, emoji, color }, gi) => {
            const sets = ALL_SPELLING_SETS.filter((s) => s.levelId === levelId);
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
                    {!isUnlocked && (
                      <p className="text-xs text-gray-500">Unlock earlier worlds to access</p>
                    )}
                  </div>
                  {!isUnlocked && <Lock className="w-4 h-4 text-gray-600" />}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {sets.map((set, si) => {
                    const { masteredCount, total } = getMasteryForSet(set);
                    const isComplete = setsCompleted.includes(set.id);
                    const pct = total > 0 ? (masteredCount / total) * 100 : 0;

                    return (
                      <motion.button
                        key={set.id}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 + si * 0.06 }}
                        onClick={() => isUnlocked && router.push(`/student/${profileId}/spelling/${set.id}`)}
                        disabled={!isUnlocked}
                        className={`text-left w-full rounded-3xl border overflow-hidden transition-all duration-200 ${
                          !isUnlocked
                            ? "opacity-50 cursor-not-allowed border-white/10 bg-white/3"
                            : isComplete
                            ? "border-emerald-500/30 hover:border-emerald-500/50 hover:-translate-y-0.5 active:scale-98"
                            : "border-white/10 hover:border-white/20 hover:-translate-y-0.5 active:scale-98"
                        }`}
                        style={
                          isUnlocked
                            ? { background: `linear-gradient(160deg, ${set.theme.primary}10, #0D1117 60%)` }
                            : { background: "#0D1117" }
                        }
                      >
                        <div className="p-4">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-2xl">{set.emoji}</span>
                              <div>
                                <p className="font-bold text-white text-sm">{set.title}</p>
                                <p className="text-xs text-gray-500">{set.subtitle}</p>
                              </div>
                            </div>
                            {isComplete && (
                              <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                            )}
                          </div>

                          {isUnlocked && (
                            <>
                              <div className="flex items-center justify-between text-xs mb-1.5">
                                <span className="text-gray-500">{masteredCount}/{total} mastered</span>
                                <div className="flex items-center gap-2 text-gray-500">
                                  <span style={{ color: set.theme.primary }}>💎 +{set.crystalReward}</span>
                                  <span>⚡ +{set.xpReward}</span>
                                </div>
                              </div>
                              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                                <div
                                  className="h-full rounded-full transition-all duration-500"
                                  style={{ width: `${pct}%`, backgroundColor: set.theme.primary }}
                                />
                              </div>

                              {/* Word mastery pills */}
                              <div className="flex flex-wrap gap-1 mt-2.5">
                                {set.words.map((w) => {
                                  const level = mastery[w.word]?.level ?? "new";
                                  const c = MASTERY_COLORS[level];
                                  return (
                                    <span
                                      key={w.word}
                                      className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${c.bg} ${c.text} border ${c.border}`}
                                    >
                                      {w.word}
                                    </span>
                                  );
                                })}
                              </div>
                            </>
                          )}
                        </div>
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
