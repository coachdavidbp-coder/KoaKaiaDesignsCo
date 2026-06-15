"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, BookOpen, Plus } from "lucide-react";
import { VocabWord } from "@/types/reading";

interface WordTapPopupProps {
  word: VocabWord | null;
  onClose: () => void;
  onLearnWord: (word: VocabWord) => void;
  alreadyLearned: boolean;
}

const PART_OF_SPEECH_COLORS = {
  noun: { bg: "bg-blue-500/20", text: "text-blue-300", label: "noun" },
  verb: { bg: "bg-green-500/20", text: "text-green-300", label: "verb" },
  adjective: { bg: "bg-purple-500/20", text: "text-purple-300", label: "adjective" },
  adverb: { bg: "bg-amber-500/20", text: "text-amber-300", label: "adverb" },
};

export function WordTapPopup({ word, onClose, onLearnWord, alreadyLearned }: WordTapPopupProps) {
  const pos = word ? PART_OF_SPEECH_COLORS[word.partOfSpeech] : null;

  return (
    <AnimatePresence>
      {word && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            className="relative w-full max-w-sm bg-gray-900 border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
            initial={{ y: 60, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 60, opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 380, damping: 28 }}
          >
            <div className="relative bg-gradient-to-br from-blue-900/40 to-gray-900 p-6 text-center border-b border-white/10">
              <button
                onClick={onClose}
                className="absolute top-3 right-3 p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-all"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="text-5xl mb-2">{word.emoji}</div>
              <h2 className="text-2xl font-bold text-white capitalize">{word.word}</h2>
              {pos && (
                <span
                  className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${pos.bg} ${pos.text}`}
                >
                  {pos.label}
                </span>
              )}
            </div>

            <div className="p-5 space-y-4">
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                  What it means
                </p>
                <p className="text-white font-medium leading-relaxed">{word.definition}</p>
              </div>

              <div className="bg-white/5 rounded-2xl p-3">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <BookOpen className="w-3 h-3" /> Example
                </p>
                <p className="text-gray-300 text-sm italic leading-relaxed">
                  &ldquo;{word.exampleSentence}&rdquo;
                </p>
              </div>

              {alreadyLearned ? (
                <div className="flex items-center justify-center gap-2 py-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                  <span className="text-emerald-400 text-sm font-bold">✓ Added to My Words!</span>
                </div>
              ) : (
                <button
                  onClick={() => onLearnWord(word)}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold transition-all active:scale-98"
                >
                  <Plus className="w-4 h-4" />
                  Add to My Words
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
