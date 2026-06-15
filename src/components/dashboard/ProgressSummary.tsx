"use client";

import { motion } from "framer-motion";
import { BookOpen, Calculator, PenTool, Sparkles, Brain } from "lucide-react";
import { StudentProgress } from "@/types/progress";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { getReadinessLevel, getReadinessLabel } from "@/types/progress";

interface ProgressSummaryProps {
  progress: StudentProgress;
  studentName: string;
}

const SKILL_AREAS = [
  { key: "readingPercent" as const, label: "Reading", icon: BookOpen, color: "blue" as const, emoji: "📚" },
  { key: "mathPercent" as const, label: "Math", icon: Calculator, color: "gold" as const, emoji: "🔢" },
  { key: "spellingPercent" as const, label: "Spelling", icon: PenTool, color: "purple" as const, emoji: "✏️" },
  { key: "writingPercent" as const, label: "Writing", icon: PenTool, color: "green" as const, emoji: "📝" },
  { key: "vocabularyPercent" as const, label: "Vocabulary", icon: Brain, color: "gradient" as const, emoji: "💬" },
];

const READINESS_COLORS: Record<string, string> = {
  emerging: "text-red-400",
  developing: "text-orange-400",
  approaching: "text-yellow-400",
  ready: "text-green-400",
  highly_prepared: "text-blue-400",
};

export function ProgressSummary({ progress, studentName }: ProgressSummaryProps) {
  const level = getReadinessLevel(progress.overallPercent);
  const label = getReadinessLabel(level);

  return (
    <div className="space-y-4">
      <Card variant="glow" className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-white text-lg">{studentName}&apos;s Journey</h3>
            <p className={`text-sm font-medium mt-0.5 ${READINESS_COLORS[level]}`}>
              {label}
            </p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              {Math.round(progress.overallPercent)}%
            </p>
            <p className="text-xs text-gray-500">Overall</p>
          </div>
        </div>
        <ProgressBar value={progress.overallPercent} variant="gradient" size="lg" />
        <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
          <span>💎 {progress.crystals.earned}/{progress.crystals.total} Crystals</span>
          <span>🔥 {progress.streak} day streak</span>
          <span>⚡ {progress.xp} XP</span>
        </div>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {SKILL_AREAS.map((area, i) => (
          <motion.div
            key={area.key}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className="p-4">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xl">{area.emoji}</span>
                <span className="text-sm font-medium text-gray-300">{area.label}</span>
                <span className="ml-auto text-sm font-bold text-white">
                  {Math.round(progress[area.key])}%
                </span>
              </div>
              <ProgressBar value={progress[area.key]} variant={area.color} size="sm" animated={false} />
            </Card>
          </motion.div>
        ))}

        <Card className="p-4 flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-400">Coins Earned</p>
            <p className="font-bold text-amber-300">{progress.coins} 🪙</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400">Gems</p>
            <p className="font-bold text-purple-300">{progress.gems} 💜</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
