"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X, BookOpen, PenLine, Shuffle } from "lucide-react";
import { useStudentStore } from "@/store/studentStore";
import { useSpelling } from "@/hooks/useSpelling";
import { useSounds } from "@/hooks/useSounds";
import { getSpellingSetById } from "@/data/spelling";
import { SpellingSet, SpellingMode, SessionWordResult } from "@/types/spelling";
import { StudyCard } from "@/components/spelling/StudyCard";
import { SpellItGame } from "@/components/spelling/SpellItGame";
import { WordScramble } from "@/components/spelling/WordScramble";
import { SessionComplete } from "@/components/spelling/SessionComplete";
import { FullPageLoader } from "@/components/ui/LoadingSpinner";

type SessionPhase = "mode_select" | "playing" | "complete";

interface Props {
  params: { profileId: string; setId: string };
}

const MODE_OPTIONS: Array<{ mode: SpellingMode; icon: typeof BookOpen; label: string; desc: string; color: string }> = [
  { mode: "study",    icon: BookOpen, label: "Study Cards",  desc: "Flip cards to learn each word at your own pace", color: "#3B82F6" },
  { mode: "spell",    icon: PenLine,  label: "Spell It!",    desc: "Type each word letter by letter from memory",     color: "#10B981" },
  { mode: "scramble", icon: Shuffle,  label: "Scramble",     desc: "Unscramble the mixed-up letters to spell the word", color: "#F59E0B" },
];

export default function SpellingSessionPage({ params }: Props) {
  const { profileId, setId } = params;
  const router = useRouter();
  const { activeStudent } = useStudentStore();
  const { spellingProgress, loadSpellingProgress, finishSession } = useSpelling(profileId);
  const { playCorrect, playWrong, playComplete } = useSounds();

  const [spellingSet, setSpellingSet] = useState<SpellingSet | null>(null);
  const [phase, setPhase] = useState<SessionPhase>("mode_select");
  const [mode, setMode] = useState<SpellingMode>("spell");
  const [wordQueue, setWordQueue] = useState<SpellingSet["words"]>([]);
  const [currentWordIdx, setCurrentWordIdx] = useState(0);
  const [results, setResults] = useState<SessionWordResult[]>([]);
  const [sessionScore, setSessionScore] = useState(0);
  const [sessionXP, setSessionXP] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [showExit, setShowExit] = useState(false);

  useEffect(() => {
    if (!activeStudent || activeStudent.id !== profileId) {
      router.push("/parent/students"); return;
    }
    const found = getSpellingSetById(setId);
    if (!found) { router.push(`/student/${profileId}/spelling`); return; }
    setSpellingSet(found);
    loadSpellingProgress().then(() => setIsReady(true));
  }, [profileId, setId, activeStudent, router, loadSpellingProgress]);

  const startSession = useCallback((selectedMode: SpellingMode) => {
    if (!spellingSet) return;
    setMode(selectedMode);
    setWordQueue([...spellingSet.words]);
    setCurrentWordIdx(0);
    setResults([]);
    setPhase("playing");
  }, [spellingSet]);

  const handleWordResult = useCallback(
    async (correct: boolean, attempts: number) => {
      if (!spellingSet) return;
      const word = wordQueue[currentWordIdx];
      const newResult: SessionWordResult = { word: word.word, correct, attempts };
      const newResults = [...results, newResult];
      setResults(newResults);

      if (correct) playCorrect(); else playWrong();

      if (currentWordIdx + 1 >= wordQueue.length) {
        const data = await finishSession(setId, newResults, spellingSet.xpReward, spellingSet.coinReward, spellingSet.crystalReward);
        setSessionScore(data?.score ?? 0);
        setSessionXP(data?.xpEarned ?? spellingSet.xpReward);
        playComplete();
        setPhase("complete");
      } else {
        setCurrentWordIdx((i) => i + 1);
      }
    },
    [spellingSet, wordQueue, currentWordIdx, results, finishSession, setId, playCorrect, playWrong, playComplete]
  );

  // Study mode: "know it" = correct, "study more" = re-queue at end
  const handleStudyKnow = useCallback(() => {
    handleWordResult(true, 1);
  }, [handleWordResult]);

  const handleStudyMore = useCallback(() => {
    if (!spellingSet) return;
    const word = wordQueue[currentWordIdx];
    // Move word to end of queue without counting it as a result yet
    setWordQueue((q) => {
      const next = [...q];
      next.push(next.splice(currentWordIdx, 1)[0]);
      return next;
    });
    // Don't advance results — just move to next in queue
    // If we're about to loop endlessly, treat as incorrect
    const alreadyLooped = results.filter((r) => r.word === word.word).length >= 1;
    if (alreadyLooped) {
      handleWordResult(false, 2);
    }
  }, [spellingSet, wordQueue, currentWordIdx, results, handleWordResult]);

  const handlePlayAgain = useCallback(() => {
    setPhase("mode_select");
    setResults([]);
    setCurrentWordIdx(0);
  }, []);

  if (!isReady || !spellingSet) return <FullPageLoader label="Loading word set..." />;

  const currentWord = wordQueue[currentWordIdx];
  const progressPct = phase === "playing" ? (currentWordIdx / wordQueue.length) * 100 : 0;

  return (
    <div
      className="fixed inset-0 flex flex-col overflow-hidden"
      style={{
        background: `linear-gradient(170deg, ${spellingSet.theme.primary}18 0%, #080B12 40%, #080B12 100%)`,
      }}
    >
      {/* Top bar */}
      <div className="flex items-center gap-3 px-4 py-3 flex-shrink-0">
        <button
          onClick={() => phase === "playing" ? setShowExit(true) : router.push(`/student/${profileId}/spelling`)}
          className="p-2 rounded-xl bg-white/10 hover:bg-white/15 text-gray-400 hover:text-white transition-all active:scale-95"
        >
          <X className="w-4 h-4" />
        </button>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-white truncate">{spellingSet.title}</p>
          {phase === "playing" && (
            <p className="text-[11px] text-gray-500">{spellingSet.words.length} words</p>
          )}
        </div>
        <span className="text-xs font-medium" style={{ color: spellingSet.theme.primary }}>
          💎 +{spellingSet.crystalReward}
        </span>
      </div>

      {/* Progress bar */}
      {phase === "playing" && (
        <div className="h-0.5 bg-white/5 flex-shrink-0">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: spellingSet.theme.primary }}
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <AnimatePresence mode="wait">
          {phase === "mode_select" && (
            <motion.div
              key="mode"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="px-4 py-6"
            >
              <div className="max-w-sm mx-auto">
                <div className="text-center mb-6">
                  <div className="text-5xl mb-3">{spellingSet.emoji}</div>
                  <h2 className="text-xl font-bold text-white">{spellingSet.title}</h2>
                  <p className="text-gray-400 text-sm mt-1">{spellingSet.subtitle}</p>
                </div>

                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Choose your mode</p>

                <div className="space-y-2.5">
                  {MODE_OPTIONS.map(({ mode: m, icon: Icon, label, desc, color }) => (
                    <button
                      key={m}
                      onClick={() => startSession(m)}
                      className="w-full flex items-center gap-4 p-4 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 text-left transition-all active:scale-98"
                    >
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                        style={{ backgroundColor: color + "20", border: `1px solid ${color}30` }}
                      >
                        <Icon className="w-5 h-5" style={{ color }} />
                      </div>
                      <div>
                        <p className="font-bold text-white text-sm">{label}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Word list preview */}
                <div className="mt-6 p-4 rounded-2xl bg-white/5 border border-white/10">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                    Words in this set
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {spellingSet.words.map((w) => (
                      <span
                        key={w.word}
                        className="text-sm px-2.5 py-1 rounded-full font-medium"
                        style={{
                          backgroundColor: spellingSet.theme.primary + "20",
                          color: spellingSet.theme.primary,
                          border: `1px solid ${spellingSet.theme.primary}30`,
                        }}
                      >
                        {w.emoji} {w.word}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {phase === "playing" && currentWord && (
            <motion.div
              key="playing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="px-4 py-6"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${currentWordIdx}-${mode}`}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.2 }}
                >
                  {mode === "study" && (
                    <StudyCard
                      word={currentWord}
                      wordNumber={currentWordIdx + 1}
                      totalWords={wordQueue.length}
                      onKnowIt={handleStudyKnow}
                      onStudyMore={handleStudyMore}
                      theme={spellingSet.theme}
                    />
                  )}
                  {mode === "spell" && (
                    <SpellItGame
                      word={currentWord}
                      wordNumber={currentWordIdx + 1}
                      totalWords={wordQueue.length}
                      onResult={handleWordResult}
                      theme={spellingSet.theme}
                    />
                  )}
                  {mode === "scramble" && (
                    <WordScramble
                      word={currentWord}
                      wordNumber={currentWordIdx + 1}
                      totalWords={wordQueue.length}
                      onResult={handleWordResult}
                      theme={spellingSet.theme}
                    />
                  )}
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
              <SessionComplete
                set={spellingSet}
                results={results}
                score={sessionScore}
                xpEarned={sessionXP}
                wordMastery={spellingProgress?.wordMastery ?? {}}
                onGoHome={() => router.push(`/student/${profileId}/spelling`)}
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
              <div className="text-4xl mb-3">✏️</div>
              <h2 className="text-lg font-bold text-white mb-2">Leave this session?</h2>
              <p className="text-sm text-gray-400 mb-5">Your word progress won&apos;t be saved for this session.</p>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => router.push(`/student/${profileId}/spelling`)}
                  className="w-full py-3 rounded-2xl bg-red-500/20 border border-red-500/30 text-red-300 font-bold text-sm hover:bg-red-500/30 transition-all"
                >
                  Leave
                </button>
                <button
                  onClick={() => setShowExit(false)}
                  className="w-full py-3 rounded-2xl bg-white/10 border border-white/10 text-white font-bold text-sm hover:bg-white/15 transition-all"
                >
                  Keep Spelling
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
