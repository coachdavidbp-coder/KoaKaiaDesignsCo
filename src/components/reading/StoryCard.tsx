"use client";

import { motion } from "framer-motion";
import { BookOpen, Star, Lock, CheckCircle } from "lucide-react";
import { Story } from "@/types/reading";
import { ReadingProgress } from "@/types/reading";
import { READING_LEVEL_LABELS } from "@/types/reading";

interface StoryCardProps {
  story: Story;
  readingProgress?: ReadingProgress;
  isLocked?: boolean;
  onSelect: (story: Story) => void;
  index?: number;
}

export function StoryCard({ story, readingProgress, isLocked, onSelect, index = 0 }: StoryCardProps) {
  const isRead = readingProgress?.storiesRead.includes(story.id) ?? false;

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      onClick={() => !isLocked && onSelect(story)}
      disabled={isLocked}
      className={`text-left w-full rounded-3xl border overflow-hidden transition-all duration-300 ${
        isLocked
          ? "opacity-50 cursor-not-allowed border-white/10"
          : isRead
          ? "border-emerald-500/30 hover:border-emerald-500/60 hover:-translate-y-0.5 active:scale-98"
          : "border-white/10 hover:border-blue-500/40 hover:-translate-y-0.5 active:scale-98"
      }`}
      style={
        !isLocked
          ? {
              background: `linear-gradient(160deg, ${story.theme.bg.replace("from-", "").replace("to-", "")} 0%, #0D1117 100%)`,
            }
          : { background: "#0D1117" }
      }
    >
      <div
        className="h-28 flex items-center justify-center text-6xl gap-3 relative overflow-hidden"
        style={
          !isLocked
            ? {
                background: `linear-gradient(135deg, ${story.theme.primary}20, ${story.theme.secondary}10)`,
              }
            : { background: "rgba(255,255,255,0.03)" }
        }
      >
        {isLocked ? (
          <Lock className="w-8 h-8 text-gray-600" />
        ) : (
          story.coverScene.map((emoji, i) => (
            <span
              key={i}
              className="drop-shadow-lg"
              style={{
                fontSize: i === 1 ? "3rem" : "2rem",
                opacity: i === 0 ? 0.7 : i === 1 ? 1 : 0.6,
              }}
            >
              {emoji}
            </span>
          ))
        )}

        {isRead && !isLocked && (
          <div className="absolute top-2 right-2">
            <CheckCircle className="w-5 h-5 text-emerald-400 fill-emerald-900/50" />
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-bold text-white text-sm leading-tight">{story.title}</h3>
          <span
            className="text-xs px-2 py-0.5 rounded-full shrink-0 font-medium"
            style={{
              backgroundColor: story.theme.primary + "20",
              color: story.theme.primary,
              border: `1px solid ${story.theme.primary}30`,
            }}
          >
            {story.readingLevel}
          </span>
        </div>
        <p className="text-xs text-gray-500 mb-3">{story.subtitle}</p>

        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1 text-gray-400">
            <BookOpen className="w-3 h-3" />
            <span>{story.wordCount} words</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-amber-300 font-medium">💎 +{story.crystalReward}</span>
            <span className="text-gray-600">·</span>
            <span className="text-blue-300 font-medium">⚡ +{story.xpReward}</span>
          </div>
        </div>

        {isRead && (
          <div className="mt-2 pt-2 border-t border-white/5">
            <p className="text-xs text-emerald-400 font-medium">✓ Story Complete!</p>
          </div>
        )}
      </div>
    </motion.button>
  );
}
