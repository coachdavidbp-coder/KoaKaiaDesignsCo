"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useStudentStore } from "@/store/studentStore";
import { useMath } from "@/hooks/useMath";
import { getMathMissionById } from "@/data/math";
import { MathMission, MathProblemResult } from "@/types/math";
import { MathProblemCard } from "@/components/math/MathProblemCard";
import { MathComplete } from "@/components/math/MathComplete";
import { FullPageLoader } from "@/components/ui/LoadingSpinner";

type SessionPhase = "playing" | "complete";

interface Props {
  params: { profileId: string; missionId: string };
}

export default function MathSessionPage({ params }: Props) {
  const { profileId, missionId } = params;
  const router = useRouter();
  const { activeStudent } = useStudentStore();
  const { finishMission } = useMath(profileId);

  const [mission, setMission] = useState<MathMission | null>(null);
  const [phase, setPhase] = useState<SessionPhase>("playing");
  const [problemIdx, setProblemIdx] = useState(0);
  const [results, setResults] = useState<MathProblemResult[]>([]);
  const [sessionScore, setSessionScore] = useState(0);
  const [sessionXP, setSessionXP] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [showExit, setShowExit] = useState(false);

  useEffect(() => {
    if (!activeStudent || activeStudent.id !== profileId) {
      router.push("/parent/students"); return;
    }
    const found = getMathMissionById(missionId);
    if (!found) { router.push(`/student/${profileId}/math`); return; }
    setMission(found);
    setIsReady(true);
  }, [profileId, missionId, activeStudent, router]);

  const handleProblemResult = useCallback(
    async (correct: boolean, attempts: number) => {
      if (!mission) return;
      const problem = mission.problems[problemIdx];
      const newResult: MathProblemResult = { problemId: problem.id, correct, attempts };
      const newResults = [...results, newResult];
      setResults(newResults);

      if (problemIdx + 1 >= mission.problems.length) {
        const { score, xpEarned } = await finishMission(missionId, newResults, mission.xpReward, mission.coinReward, mission.crystalReward);
        setSessionScore(score);
        setSessionXP(xpEarned);
        setPhase("complete");
      } else {
        setProblemIdx((i) => i + 1);
      }
    },
    [mission, problemIdx, results, finishMission, missionId]
  );

  const handlePlayAgain = useCallback(() => {
    setProblemIdx(0);
    setResults([]);
    setPhase("playing");
  }, []);

  if (!isReady || !mission) return <FullPageLoader label="Loading Math Mission..." />;

  const currentProblem = mission.problems[problemIdx];
  const progressPct = phase === "playing" ? (problemIdx / mission.problems.length) * 100 : 100;

  return (
    <div
      className="fixed inset-0 flex flex-col overflow-hidden"
      style={{
        background: `linear-gradient(170deg, ${mission.theme.primary}18 0%, #080B12 40%, #080B12 100%)`,
      }}
    >
      {/* Top bar */}
      <div className="flex items-center gap-3 px-4 py-3 flex-shrink-0">
        <button
          onClick={() => phase === "playing" ? setShowExit(true) : router.push(`/student/${profileId}/math`)}
          className="p-2 rounded-xl bg-white/10 hover:bg-white/15 text-gray-400 hover:text-white transition-all active:scale-95"
        >
          <X className="w-4 h-4" />
        </button>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-white truncate">{mission.emoji} {mission.title}</p>
          {phase === "playing" && (
            <p className="text-[11px] text-gray-500">{mission.problems.length} problems</p>
          )}
        </div>
        <span className="text-xs font-medium" style={{ color: mission.theme.primary }}>
          💎 +{mission.crystalReward}
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-0.5 bg-white/5 flex-shrink-0">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: mission.theme.primary }}
          animate={{ width: `${progressPct}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <AnimatePresence mode="wait">
          {phase === "playing" && currentProblem && (
            <motion.div
              key="playing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="px-4 py-6"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentProblem.id}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.2 }}
                >
                  <MathProblemCard
                    problem={currentProblem}
                    problemNumber={problemIdx + 1}
                    total={mission.problems.length}
                    onResult={handleProblemResult}
                    theme={mission.theme}
                  />
                </motion.div>
              </AnimatePresence>
            </motion.div>
          )}

          {phase === "complete" && (
            <motion.div
              key="complete"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="min-h-full"
            >
              <MathComplete
                mission={mission}
                results={results}
                score={sessionScore}
                xpEarned={sessionXP}
                onGoHome={() => router.push(`/student/${profileId}/math`)}
                onPlayAgain={handlePlayAgain}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Exit confirmation */}
      <AnimatePresence>
        {showExit && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowExit(false)}
            />
            <motion.div
              className="relative w-full max-w-sm bg-gray-900 border border-white/10 rounded-3xl p-6 text-center shadow-2xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 28 }}
            >
              <div className="text-4xl mb-3">🧮</div>
              <h2 className="text-lg font-bold text-white mb-2">Leave this mission?</h2>
              <p className="text-sm text-gray-400 mb-5">Your progress won&apos;t be saved for this mission.</p>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => router.push(`/student/${profileId}/math`)}
                  className="w-full py-3 rounded-2xl bg-red-500/20 border border-red-500/30 text-red-300 font-bold text-sm hover:bg-red-500/30 transition-all"
                >
                  Leave
                </button>
                <button
                  onClick={() => setShowExit(false)}
                  className="w-full py-3 rounded-2xl bg-white/10 border border-white/10 text-white font-bold text-sm hover:bg-white/15 transition-all"
                >
                  Keep Going
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
