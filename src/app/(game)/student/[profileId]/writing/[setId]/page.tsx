"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useStudentStore } from "@/store/studentStore";
import { useWriting } from "@/hooks/useWriting";
import { getWritingSetById } from "@/data/writing";
import {
  WritingSet,
  ActivityResult,
  SentenceBuilderActivity,
  PunctuationActivity,
  WordSortActivity,
  StoryStarterActivity,
} from "@/types/writing";
import { SentenceBuilder } from "@/components/writing/SentenceBuilder";
import { PunctuationPractice } from "@/components/writing/PunctuationPractice";
import { WordSort } from "@/components/writing/WordSort";
import { StoryStarter } from "@/components/writing/StoryStarter";
import { WritingComplete } from "@/components/writing/WritingComplete";
import { FullPageLoader } from "@/components/ui/LoadingSpinner";

type SessionPhase = "playing" | "complete";

interface Props {
  params: { profileId: string; setId: string };
}

export default function WritingSessionPage({ params }: Props) {
  const { profileId, setId } = params;
  const router = useRouter();
  const { activeStudent } = useStudentStore();
  const { writingProgress, loadWritingProgress, finishSet, submitStory } = useWriting(profileId);

  const [writingSet, setWritingSet] = useState<WritingSet | null>(null);
  const [phase, setPhase] = useState<SessionPhase>("playing");
  const [activityIdx, setActivityIdx] = useState(0);
  const [results, setResults] = useState<ActivityResult[]>([]);
  const [sessionScore, setSessionScore] = useState(0);
  const [sessionXP, setSessionXP] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [showExit, setShowExit] = useState(false);
  const checkpointKey = `ck_write_${profileId}_${setId}`;
  const restored = useRef(false);

  useEffect(() => {
    if (!activeStudent || activeStudent.id !== profileId) {
      router.push("/parent/students"); return;
    }
    const found = getWritingSetById(setId);
    if (!found) { router.push(`/student/${profileId}/writing`); return; }
    setWritingSet(found);
    loadWritingProgress().then((p) => {
      setIsReady(true);
      // Restore checkpoint after load
      if (restored.current) return;
      restored.current = true;
      try {
        const saved = localStorage.getItem(checkpointKey);
        if (saved) {
          const { idx, res } = JSON.parse(saved);
          if (typeof idx === "number" && idx > 0 && Array.isArray(res)) {
            setActivityIdx(idx);
            setResults(res);
          }
        }
      } catch {}
    });
  }, [profileId, setId, activeStudent, router, loadWritingProgress, checkpointKey]);

  // Save checkpoint on activity advance
  useEffect(() => {
    if (!isReady || phase !== "playing") return;
    try {
      localStorage.setItem(checkpointKey, JSON.stringify({ idx: activityIdx, res: results }));
    } catch {}
  }, [activityIdx, results, phase, isReady, checkpointKey]);

  // Clear checkpoint on completion
  useEffect(() => {
    if (phase === "complete") localStorage.removeItem(checkpointKey);
  }, [phase, checkpointKey]);

  const handleActivityResult = useCallback(
    async (correct: boolean, attempts: number) => {
      if (!writingSet) return;
      const activity = writingSet.activities[activityIdx];
      const newResult: ActivityResult = { activityId: activity.id, correct, attempts };
      const newResults = [...results, newResult];
      setResults(newResults);

      // Story starters only have one activity and are handled differently
      if (activityIdx + 1 >= writingSet.activities.length || writingSet.activityType === "word_sort") {
        const score = await finishSet(setId, newResults, writingSet.xpReward, writingSet.coinReward);
        setSessionScore(score ?? 0);
        setSessionXP(writingSet.xpReward);
        setPhase("complete");
      } else {
        setActivityIdx((i) => i + 1);
      }
    },
    [writingSet, activityIdx, results, finishSet, setId]
  );

  const handleStorySubmit = useCallback(
    async (activity: StoryStarterActivity, text: string) => {
      if (!writingSet) return;
      await submitStory(
        activity.id,
        activity.prompt,
        text,
        activity.scene,
        writingSet.xpReward,
        writingSet.coinReward
      );
      // Mark the set as done
      const storyResult: ActivityResult = { activityId: activity.id, correct: true, attempts: 1 };
      const newResults = [...results, storyResult];
      setResults(newResults);
      setSessionScore(100);
      setSessionXP(writingSet.xpReward);
      setPhase("complete");
    },
    [writingSet, results, submitStory]
  );

  const handlePlayAgain = useCallback(() => {
    localStorage.removeItem(checkpointKey);
    restored.current = false;
    setPhase("playing");
    setActivityIdx(0);
    setResults([]);
  }, [checkpointKey]);

  if (!isReady || !writingSet) return <FullPageLoader label="Opening activity..." />;

  const currentActivity = writingSet.activities[activityIdx];
  const progressPct = phase === "playing" && writingSet.activityType !== "word_sort"
    ? (activityIdx / writingSet.activities.length) * 100
    : 0;

  return (
    <div
      className="fixed inset-0 flex flex-col overflow-hidden"
      style={{
        background: `linear-gradient(170deg, ${writingSet.theme.primary}18 0%, #080B12 40%, #080B12 100%)`,
      }}
    >
      {/* Top bar */}
      <div className="flex items-center gap-3 px-4 py-3 flex-shrink-0">
        <button
          onClick={() => phase === "playing" ? setShowExit(true) : router.push(`/student/${profileId}/writing`)}
          className="p-2 rounded-xl bg-white/10 hover:bg-white/15 text-gray-400 hover:text-white transition-all active:scale-95"
        >
          <X className="w-4 h-4" />
        </button>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-white truncate">{writingSet.title}</p>
          {phase === "playing" && writingSet.activityType !== "word_sort" && writingSet.activityType !== "story_starter" && (
            <p className="text-[11px] text-gray-500">
              {activityIdx + 1} of {writingSet.activities.length}
            </p>
          )}
        </div>
        <span className="text-xs font-medium" style={{ color: writingSet.theme.primary }}>
          💎 +{writingSet.crystalReward}
        </span>
      </div>

      {/* Progress bar */}
      {progressPct > 0 && (
        <div className="h-0.5 bg-white/5 flex-shrink-0">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: writingSet.theme.primary }}
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <AnimatePresence mode="wait">
          {phase === "playing" && (
            <motion.div
              key="playing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="px-4 py-6"
            >
              {writingSet.activityType === "story_starter" ? (
                <StoryStarter
                  activities={writingSet.activities as StoryStarterActivity[]}
                  onSubmit={handleStorySubmit}
                  theme={writingSet.theme}
                />
              ) : (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${activityIdx}`}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.2 }}
                  >
                    {currentActivity?.type === "sentence_builder" && (
                      <SentenceBuilder
                        activity={currentActivity as SentenceBuilderActivity}
                        activityNumber={activityIdx + 1}
                        total={writingSet.activities.length}
                        onResult={handleActivityResult}
                        theme={writingSet.theme}
                      />
                    )}
                    {currentActivity?.type === "punctuation" && (
                      <PunctuationPractice
                        activity={currentActivity as PunctuationActivity}
                        activityNumber={activityIdx + 1}
                        total={writingSet.activities.length}
                        onResult={handleActivityResult}
                        theme={writingSet.theme}
                      />
                    )}
                    {currentActivity?.type === "word_sort" && (
                      <WordSort
                        activity={currentActivity as WordSortActivity}
                        onResult={handleActivityResult}
                        theme={writingSet.theme}
                      />
                    )}
                  </motion.div>
                </AnimatePresence>
              )}
            </motion.div>
          )}

          {phase === "complete" && (
            <motion.div
              key="complete"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="min-h-full"
            >
              <WritingComplete
                set={writingSet}
                results={results}
                score={sessionScore}
                xpEarned={sessionXP}
                onGoHome={() => router.push(`/student/${profileId}/writing`)}
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
              <div className="text-4xl mb-3">📝</div>
              <h2 className="text-lg font-bold text-white mb-2">Leave this activity?</h2>
              <p className="text-sm text-gray-400 mb-5">Your progress won&apos;t be saved for this session.</p>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => router.push(`/student/${profileId}/writing`)}
                  className="w-full py-3 rounded-2xl bg-red-500/20 border border-red-500/30 text-red-300 font-bold text-sm hover:bg-red-500/30 transition-all"
                >
                  Leave
                </button>
                <button
                  onClick={() => setShowExit(false)}
                  className="w-full py-3 rounded-2xl bg-white/10 border border-white/10 text-white font-bold text-sm hover:bg-white/15 transition-all"
                >
                  Keep Writing
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
