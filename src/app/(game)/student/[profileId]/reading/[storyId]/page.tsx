"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { useStudentStore } from "@/store/studentStore";
import { useReading } from "@/hooks/useReading";
import { useNarration } from "@/hooks/useNarration";
import { getStoryById } from "@/data/stories";
import { Story, VocabWord } from "@/types/reading";
import { PageDisplay } from "@/components/reading/PageDisplay";
import { NarrationBar } from "@/components/reading/NarrationBar";
import { WordTapPopup } from "@/components/reading/WordTapPopup";
import { ComprehensionQuiz } from "@/components/reading/ComprehensionQuiz";
import { StoryComplete } from "@/components/reading/StoryComplete";
import { FullPageLoader } from "@/components/ui/LoadingSpinner";

type ReaderPhase = "cover" | "reading" | "quiz" | "complete";

interface CompletionData {
  score: number;
  questionsCorrect: number;
  questionsTotal: number;
  crystalsEarned: number;
  xpEarned: number;
}

interface Props {
  params: { profileId: string; storyId: string };
}

export default function StoryReaderPage({ params }: Props) {
  const { profileId, storyId } = params;
  const router = useRouter();
  const { activeStudent } = useStudentStore();

  const {
    readingProgress,
    activePage,
    wordsLearnedThisSession,
    loadReadingProgress,
    beginStory,
    learnWord,
    completeStory,
    setPage,
    clearSession,
  } = useReading(profileId);

  const narration = useNarration();

  const [story, setStory] = useState<Story | null>(null);
  const [phase, setPhase] = useState<ReaderPhase>("cover");
  const [tappedWord, setTappedWord] = useState<VocabWord | null>(null);
  const [completionData, setCompletionData] = useState<CompletionData | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  useEffect(() => {
    if (!activeStudent || activeStudent.id !== profileId) {
      router.push("/parent/students");
      return;
    }

    const found = getStoryById(storyId);
    if (!found) {
      router.push(`/student/${profileId}/reading`);
      return;
    }

    setStory(found);
    loadReadingProgress().then(() => setIsReady(true));
  }, [profileId, storyId, activeStudent, router, loadReadingProgress]);

  // Stop narration when page changes
  useEffect(() => {
    narration.stop();
  }, [activePage]); // eslint-disable-line react-hooks/exhaustive-deps

  // Stop narration on unmount
  useEffect(() => {
    return () => narration.stop();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleStartReading = useCallback(async () => {
    if (!story) return;
    setPhase("reading");
    setPage(0);
    await beginStory(story.id);
  }, [story, beginStory, setPage]);

  const handleNextPage = useCallback(() => {
    if (!story) return;
    narration.stop();
    if (activePage + 1 >= story.pages.length) {
      setPhase("quiz");
    } else {
      setPage(activePage + 1);
    }
  }, [story, activePage, narration, setPage]);

  const handlePrevPage = useCallback(() => {
    if (activePage > 0) {
      narration.stop();
      setPage(activePage - 1);
    }
  }, [activePage, narration, setPage]);

  const handleQuizComplete = useCallback(
    async (correct: number, total: number) => {
      if (!story) return;
      const score = await completeStory(
        story.id,
        correct,
        total,
        story.wordCount,
        story.crystalReward,
        story.xpReward,
        story.coinReward
      );
      setCompletionData({
        score,
        questionsCorrect: correct,
        questionsTotal: total,
        crystalsEarned: story.crystalReward,
        xpEarned: story.xpReward,
      });
      setPhase("complete");
    },
    [story, completeStory]
  );

  const handleWordTap = useCallback((word: VocabWord) => {
    narration.stop();
    setTappedWord(word);
  }, [narration]);

  const handleLearnWord = useCallback(
    async (word: VocabWord) => {
      if (!story) return;
      await learnWord(word, story.id);
    },
    [story, learnWord]
  );

  const handleNarrate = useCallback(() => {
    if (!story) return;
    const page = story.pages[activePage];
    if (narration.isPaused) {
      narration.resume();
    } else {
      narration.speak(page.text);
    }
  }, [story, activePage, narration]);

  const handleExit = useCallback(() => {
    if (phase === "reading" || phase === "quiz") {
      setShowExitConfirm(true);
    } else {
      narration.stop();
      clearSession();
      router.push(`/student/${profileId}/reading`);
    }
  }, [phase, narration, clearSession, profileId, router]);

  const confirmExit = useCallback(() => {
    narration.stop();
    clearSession();
    router.push(`/student/${profileId}/reading`);
  }, [narration, clearSession, profileId, router]);

  const handleReadAgain = useCallback(() => {
    narration.stop();
    clearSession();
    setPage(0);
    setPhase("cover");
    setCompletionData(null);
  }, [narration, clearSession, setPage]);

  if (!isReady || !story) return <FullPageLoader label="Opening story..." />;

  const currentPage = story.pages[activePage];
  const isWordLearned = (word: string) =>
    wordsLearnedThisSession.includes(word) ||
    (readingProgress?.vocabulary.some((v) => v.word === word) ?? false);

  return (
    <div
      className="fixed inset-0 flex flex-col overflow-hidden"
      style={{
        background: `linear-gradient(170deg, ${story.theme.primary}18 0%, #080B12 40%, #080B12 100%)`,
      }}
    >
      {/* Top bar */}
      <div className="flex items-center gap-3 px-4 py-3 flex-shrink-0 z-20">
        <button
          onClick={handleExit}
          className="p-2 rounded-xl bg-white/10 hover:bg-white/15 text-gray-400 hover:text-white transition-all active:scale-95"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-white truncate">{story.title}</p>
          {phase === "reading" && (
            <p className="text-[11px] text-gray-500">
              Page {activePage + 1} of {story.pages.length}
            </p>
          )}
        </div>

        <div className="flex items-center gap-1 text-xs font-medium">
          <span style={{ color: story.theme.primary }}>💎 +{story.crystalReward}</span>
          <span className="text-gray-600 mx-1">·</span>
          <span className="text-blue-400">⚡ +{story.xpReward}</span>
        </div>
      </div>

      {/* Progress bar for reading phase */}
      {phase === "reading" && (
        <div className="h-0.5 bg-white/5 flex-shrink-0">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: story.theme.primary }}
            animate={{ width: `${((activePage + 1) / story.pages.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <AnimatePresence mode="wait">
          {phase === "cover" && (
            <motion.div
              key="cover"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="min-h-full flex flex-col items-center justify-center px-6 py-10 text-center"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
                className="relative mb-8"
              >
                <div
                  className="w-52 h-52 rounded-3xl flex items-center justify-center gap-3 shadow-2xl"
                  style={{
                    background: `linear-gradient(135deg, ${story.theme.primary}30, ${story.theme.secondary}15)`,
                    border: `1px solid ${story.theme.primary}30`,
                  }}
                >
                  {story.coverScene.map((emoji, i) => (
                    <motion.span
                      key={i}
                      style={{ fontSize: i === 1 ? "5rem" : "3rem" }}
                      animate={{ y: [0, i % 2 === 0 ? -6 : 6, 0] }}
                      transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: "easeInOut" }}
                    >
                      {emoji}
                    </motion.span>
                  ))}
                </div>

                <div
                  className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full text-xs font-bold"
                  style={{
                    backgroundColor: story.theme.primary,
                    color: "#000",
                  }}
                >
                  {story.readingLevel}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
              >
                <h1 className="text-3xl font-bold text-white mb-2">{story.title}</h1>
                {story.subtitle && (
                  <p className="text-gray-400 mb-6">{story.subtitle}</p>
                )}

                <div className="flex items-center justify-center gap-4 text-sm text-gray-400 mb-8">
                  <span>📄 {story.pages.length} pages</span>
                  <span>·</span>
                  <span>📝 {story.wordCount} words</span>
                  <span>·</span>
                  <span>{story.companionEmoji} {story.companion}</span>
                </div>

                {story.vocabulary.length > 0 && (
                  <div className="mb-8 p-4 rounded-2xl bg-white/5 border border-white/10 max-w-xs mx-auto text-left">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                      Vocabulary Words
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {story.vocabulary.map((v) => (
                        <span
                          key={v.word}
                          className="px-2.5 py-1 rounded-full text-xs font-medium"
                          style={{
                            backgroundColor: story.theme.primary + "20",
                            color: story.theme.primary,
                            border: `1px solid ${story.theme.primary}30`,
                          }}
                        >
                          {v.emoji} {v.word}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <motion.button
                  onClick={handleStartReading}
                  className="px-8 py-4 rounded-2xl font-bold text-lg text-black shadow-lg transition-all active:scale-95"
                  style={{
                    background: `linear-gradient(135deg, ${story.theme.primary}, ${story.theme.secondary})`,
                  }}
                  whileTap={{ scale: 0.96 }}
                >
                  Start Reading! 📖
                </motion.button>
              </motion.div>
            </motion.div>
          )}

          {phase === "reading" && currentPage && (
            <motion.div
              key="reading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col min-h-full px-4 py-4"
            >
              <div className="flex-1 max-w-xl mx-auto w-full">
                <AnimatePresence mode="wait">
                  <PageDisplay
                    key={activePage}
                    page={currentPage}
                    vocabulary={story.vocabulary}
                    currentWordIndex={narration.isPlaying ? narration.currentWordIndex : -1}
                    learnedWords={[
                      ...wordsLearnedThisSession,
                      ...(readingProgress?.vocabulary.map((v) => v.word) ?? []),
                    ]}
                    onWordTap={handleWordTap}
                    theme={story.theme}
                  />
                </AnimatePresence>
              </div>

              {/* Bottom controls */}
              <div className="flex-shrink-0 max-w-xl mx-auto w-full mt-4 space-y-3 pb-2">
                <NarrationBar
                  isPlaying={narration.isPlaying}
                  isPaused={narration.isPaused}
                  isSupported={narration.isSupported}
                  rate={narration.rate}
                  onPlay={handleNarrate}
                  onPause={narration.pause}
                  onStop={narration.stop}
                  onRateChange={narration.setRate}
                />

                <div className="flex items-center gap-3">
                  <button
                    onClick={handlePrevPage}
                    disabled={activePage === 0}
                    className="flex items-center gap-1.5 px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95 text-sm font-medium flex-1"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Back
                  </button>

                  <button
                    onClick={handleNextPage}
                    className="flex items-center justify-center gap-1.5 px-4 py-3 rounded-2xl font-bold text-sm text-black transition-all active:scale-95 flex-[2] shadow-lg"
                    style={{
                      background: `linear-gradient(135deg, ${story.theme.primary}, ${story.theme.secondary})`,
                    }}
                  >
                    {activePage + 1 >= story.pages.length ? "Answer Questions!" : "Next Page"}
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {phase === "quiz" && (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="min-h-full px-4 py-4"
            >
              <div className="max-w-xl mx-auto">
                <div className="mb-4 p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-2">
                  <span className="text-xl">🧠</span>
                  <div>
                    <p className="text-sm font-bold text-white">Comprehension Check</p>
                    <p className="text-xs text-gray-500">Show what you understood!</p>
                  </div>
                </div>
                <ComprehensionQuiz story={story} onComplete={handleQuizComplete} />
              </div>
            </motion.div>
          )}

          {phase === "complete" && completionData && (
            <motion.div
              key="complete"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="min-h-full"
            >
              <StoryComplete
                story={story}
                score={completionData.score}
                questionsTotal={completionData.questionsTotal}
                wordsLearned={wordsLearnedThisSession}
                crystalsEarned={completionData.crystalsEarned}
                xpEarned={completionData.xpEarned}
                onGoHome={() => {
                  router.push(`/student/${profileId}/reading`);
                }}
                onReadAgain={handleReadAgain}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Word tap popup */}
      <WordTapPopup
        word={tappedWord}
        onClose={() => setTappedWord(null)}
        onLearnWord={async (word) => {
          await handleLearnWord(word);
          setTappedWord(null);
        }}
        alreadyLearned={tappedWord ? isWordLearned(tappedWord.word) : false}
      />

      {/* Exit confirmation modal */}
      <AnimatePresence>
        {showExitConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowExitConfirm(false)}
            />
            <motion.div
              className="relative w-full max-w-sm bg-gray-900 border border-white/10 rounded-3xl p-6 text-center shadow-2xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 28 }}
            >
              <div className="text-4xl mb-3">📖</div>
              <h2 className="text-lg font-bold text-white mb-2">Leave this story?</h2>
              <p className="text-sm text-gray-400 mb-5">
                Your progress on this page won&apos;t be saved. You can start over later!
              </p>
              <div className="flex flex-col gap-2">
                <button
                  onClick={confirmExit}
                  className="w-full py-3 rounded-2xl bg-red-500/20 border border-red-500/30 text-red-300 font-bold text-sm hover:bg-red-500/30 transition-all"
                >
                  Leave Story
                </button>
                <button
                  onClick={() => setShowExitConfirm(false)}
                  className="w-full py-3 rounded-2xl bg-white/10 border border-white/10 text-white font-bold text-sm hover:bg-white/15 transition-all"
                >
                  Keep Reading
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
