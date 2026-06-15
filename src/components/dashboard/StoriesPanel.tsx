"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, BookOpen } from "lucide-react";
import { SavedStory } from "@/types/writing";
import { Card } from "@/components/ui/Card";
import { formatRelativeTime } from "@/lib/utils/format";

interface StoriesPanelProps {
  stories: SavedStory[];
  studentName: string;
}

export function StoriesPanel({ stories, studentName }: StoriesPanelProps) {
  const [selected, setSelected] = useState<SavedStory | null>(null);

  if (stories.length === 0) {
    return (
      <Card className="p-12 text-center">
        <div className="text-5xl mb-4">📝</div>
        <h3 className="font-bold text-white text-lg mb-2">No Stories Yet</h3>
        <p className="text-sm text-gray-400 max-w-xs mx-auto">
          {studentName} will write stories in Writing Workshop — they&apos;ll appear here for you to read!
        </p>
      </Card>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {stories.map((story, i) => (
          <motion.div
            key={story.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
          >
            <Card className="p-4 border-amber-500/20 bg-amber-500/5 hover:border-amber-500/40 transition-all h-full flex flex-col">
              {/* Scene emojis */}
              {story.scene && story.scene.length > 0 && (
                <div className="flex gap-1 text-2xl mb-3">
                  {story.scene.map((e, j) => <span key={j}>{e}</span>)}
                </div>
              )}

              {/* Prompt */}
              <p className="text-[11px] text-gray-500 mb-2 font-medium leading-relaxed line-clamp-2">
                {story.promptText.length > 70
                  ? story.promptText.slice(0, 70) + "…"
                  : story.promptText}
              </p>

              {/* Story excerpt */}
              <p className="text-sm text-gray-200 leading-relaxed flex-1 line-clamp-3">
                {story.studentText.length > 130
                  ? story.studentText.slice(0, 130) + "…"
                  : story.studentText}
              </p>

              {/* Footer */}
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 font-medium">
                    {story.wordCount} words
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatRelativeTime(story.writtenAt)}
                  </span>
                </div>
                <button
                  onClick={() => setSelected(story)}
                  className="flex items-center gap-1 text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  Read
                </button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Full story modal */}
      <AnimatePresence>
        {selected && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelected(null)}
            />
            <motion.div
              className="relative w-full max-w-lg bg-gray-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 350, damping: 28 }}
            >
              {/* Modal header */}
              <div className="flex items-center justify-between p-5 border-b border-white/10 flex-shrink-0">
                <div className="flex items-center gap-3">
                  {selected.scene && selected.scene.length > 0 && (
                    <span className="text-2xl">{selected.scene.join("")}</span>
                  )}
                  <div>
                    <p className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                      {studentName}&apos;s Story
                    </p>
                    <p className="text-xs text-gray-500">
                      {selected.wordCount} words · {formatRelativeTime(selected.writtenAt)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelected(null)}
                  className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Story content */}
              <div className="flex-1 overflow-y-auto p-5">
                <p className="text-xs text-gray-500 italic mb-4 leading-relaxed">
                  Prompt: {selected.promptText}
                </p>
                <div className="bg-amber-500/5 border border-amber-500/15 rounded-2xl p-4">
                  <p className="text-white text-sm leading-relaxed whitespace-pre-wrap">
                    {selected.studentText}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
