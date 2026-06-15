"use client";

import { use, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { useStudentStore } from "@/store/studentStore";
import { useProgressStore } from "@/store/progressStore";
import { getStudentProfile, getStudentProgress } from "@/lib/firebase/firestore";
import { saveBossAttempt } from "@/lib/firebase/boss";
import { getBossQuestions, BossQuestion } from "@/data/boss/questions";
import { StudentProfile } from "@/types/user";
import { StudentProgress } from "@/types/progress";
import { BossIntro } from "@/components/boss/BossIntro";
import { BossArena } from "@/components/boss/BossArena";
import { GraduationCelebration } from "@/components/boss/GraduationCelebration";
import { FullPageLoader } from "@/components/ui/LoadingSpinner";

interface Props {
  params: Promise<{ profileId: string }>;
}

type BossPhase = "intro" | "battle" | "victory" | "defeat";

export default function BossPage({ params }: Props) {
  const { profileId } = use(params);
  const router = useRouter();
  const { activeStudent } = useStudentStore();
  const { updateProgress } = useProgressStore();

  const [student, setStudent] = useState<StudentProfile | null>(null);
  const [progress, setProgress] = useState<StudentProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [phase, setPhase] = useState<BossPhase>("intro");
  const [questions, setQuestions] = useState<BossQuestion[]>([]);
  const [finalScore, setFinalScore] = useState(0);
  const [finalTotal, setFinalTotal] = useState(0);

  useEffect(() => {
    if (!activeStudent || activeStudent.id !== profileId) {
      router.push("/parent/students"); return;
    }
    Promise.all([
      getStudentProfile(profileId),
      getStudentProgress(profileId),
    ]).then(([s, p]) => {
      if (!s) { router.push(`/student/${profileId}`); return; }
      setStudent(s);
      setProgress(p);
      setQuestions(getBossQuestions(10));
      setIsLoading(false);
    }).catch(() => router.push(`/student/${profileId}`));
  }, [profileId, activeStudent, router]);

  const handleBattleComplete = useCallback(
    async (correct: number, total: number) => {
      setFinalScore(correct);
      setFinalTotal(total);

      const won = correct / total >= 0.7;

      try {
        await saveBossAttempt(profileId, correct, total);
        if (won) {
          updateProgress(profileId, { xp: (progress?.xp ?? 0) + 500, gems: (progress?.gems ?? 0) + 10 });
        }
      } catch {
        console.error("Failed to save boss attempt");
      }

      setPhase(won ? "victory" : "defeat");
    },
    [profileId, progress, updateProgress]
  );

  const handleRetry = useCallback(() => {
    setQuestions(getBossQuestions(10));
    setFinalScore(0);
    setFinalTotal(0);
    setPhase("intro");
  }, []);

  if (isLoading || !student) return <FullPageLoader label="The Fog is approaching…" />;

  if (phase === "victory") {
    return (
      <GraduationCelebration
        student={student}
        progress={progress}
        score={finalScore}
        total={finalTotal}
        onGoHome={() => router.push(`/student/${profileId}`)}
      />
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background:
          "radial-gradient(ellipse at 50% 0%, rgba(88,28,135,0.3) 0%, transparent 60%), linear-gradient(170deg, #08050f 0%, #06080f 100%)",
      }}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 flex-shrink-0">
        <button
          onClick={() => router.push(`/student/${profileId}`)}
          className="p-2 rounded-xl bg-white/10 hover:bg-white/15 text-gray-400 hover:text-white transition-all active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="text-center">
          <p className="text-xs font-bold text-purple-300 uppercase tracking-widest">
            Final Battle
          </p>
        </div>
        <div className="w-8" />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 pb-8">
        <AnimatePresence mode="wait">
          {phase === "intro" && (
            <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <BossIntro
                studentName={student.displayName}
                onReady={() => setPhase("battle")}
              />
            </motion.div>
          )}

          {phase === "battle" && questions.length > 0 && (
            <motion.div
              key="battle"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="py-4"
            >
              <BossArena
                questions={questions}
                onComplete={handleBattleComplete}
                studentName={student.displayName}
              />
            </motion.div>
          )}

          {phase === "defeat" && (
            <motion.div
              key="defeat"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6 gap-6"
            >
              <motion.div
                className="text-8xl"
                animate={{ rotate: [0, -5, 5, -3, 3, 0] }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                🌫️
              </motion.div>
              <div>
                <p className="text-xs font-bold text-red-400 uppercase tracking-widest mb-2">
                  Not this time…
                </p>
                <h2 className="text-2xl font-bold text-white mb-2">The Fog Fought Back!</h2>
                <p className="text-sm text-gray-400 max-w-xs">
                  You got {finalScore}/{finalTotal} correct. You need 7 or more to defeat the Fog.
                  Study your subjects and try again — you&apos;ve got this!
                </p>
              </div>

              <div className="flex flex-col gap-3 w-full max-w-xs">
                <button
                  onClick={handleRetry}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-black text-sm transition-all active:scale-95"
                  style={{ background: "linear-gradient(135deg, #A78BFA, #7C3AED)" }}
                >
                  <RotateCcw className="w-4 h-4" />
                  Try Again
                </button>
                <button
                  onClick={() => router.push(`/student/${profileId}`)}
                  className="w-full py-3 rounded-2xl font-bold text-gray-300 text-sm bg-white/10 border border-white/10 hover:bg-white/15 transition-all active:scale-95"
                >
                  Back to Map
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
