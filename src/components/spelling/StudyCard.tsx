"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, RotateCcw } from "lucide-react";
import { SpellingWord } from "@/types/spelling";

interface StudyCardProps {
  word: SpellingWord;
  wordNumber: number;
  totalWords: number;
  onKnowIt: () => void;
  onStudyMore: () => void;
  theme: { primary: string; secondary: string };
}

export function StudyCard({ word, wordNumber, totalWords, onKnowIt, onStudyMore, theme }: StudyCardProps) {
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    setFlipped(false);
  }, [word.word]);

  const speak = () => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(word.word);
    u.rate = 0.75;
    u.pitch = 1.1;
    window.speechSynthesis.speak(u);
  };

  const handleFlip = () => {
    if (!flipped) {
      setFlipped(true);
      setTimeout(speak, 300);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">
        Word {wordNumber} of {totalWords}
      </p>

      <div
        className="w-full max-w-xs cursor-pointer"
        style={{ perspective: "1000px" }}
        onClick={handleFlip}
      >
        <motion.div
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          style={{ transformStyle: "preserve-3d", position: "relative", height: "240px" }}
        >
          {/* Front */}
          <div
            className="absolute inset-0 rounded-3xl border border-white/10 flex flex-col items-center justify-center gap-4 p-6"
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              background: `linear-gradient(135deg, ${theme.primary}15, ${theme.secondary}08)`,
            }}
          >
            <span className="text-7xl">{word.emoji}</span>
            <p className="text-gray-400 text-sm font-medium text-center leading-relaxed">
              {word.hint.replace(word.word, "_ ".repeat(word.word.length).trim())}
            </p>
            <p className="text-xs text-gray-600 mt-1">Tap to reveal the word!</p>
          </div>

          {/* Back */}
          <div
            className="absolute inset-0 rounded-3xl border flex flex-col items-center justify-center gap-4 p-6"
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
              background: `linear-gradient(135deg, ${theme.primary}25, ${theme.secondary}15)`,
              borderColor: theme.primary + "40",
            }}
          >
            <span className="text-7xl">{word.emoji}</span>
            <div className="flex items-center gap-3">
              <p
                className="text-4xl font-bold tracking-widest"
                style={{ color: theme.primary }}
              >
                {word.word}
              </p>
              <button
                onClick={(e) => { e.stopPropagation(); speak(); }}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-gray-400 hover:text-white transition-all"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
            <p className="text-gray-400 text-sm text-center leading-relaxed">{word.hint}</p>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {flipped && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-3 w-full max-w-xs mt-6"
          >
            <button
              onClick={onKnowIt}
              className="w-full py-3.5 rounded-2xl font-bold text-black text-sm transition-all active:scale-95 shadow-lg"
              style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})` }}
            >
              ✓ I know it!
            </button>
            <button
              onClick={onStudyMore}
              className="w-full py-3 rounded-2xl font-bold text-gray-300 text-sm bg-white/10 border border-white/10 hover:bg-white/15 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Study more
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
