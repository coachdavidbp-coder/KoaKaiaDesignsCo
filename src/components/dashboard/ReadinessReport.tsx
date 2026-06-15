"use client";

import { motion } from "framer-motion";
import { StudentProgress, getReadinessLevel, getReadinessLabel } from "@/types/progress";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";

interface ReadinessReportProps {
  progress: StudentProgress;
  studentName: string;
}

const SUBJECTS = [
  {
    key: "readingPercent" as const,
    label: "Reading & Comprehension",
    emoji: "📚",
    color: "#3B82F6",
    weight: 0.30,
    tips: {
      emerging:  "Start with Level 1 stories — just 5 minutes a day builds fluency!",
      developing: "Tapping vocabulary words in stories is a great habit to build.",
      approaching: "Try comprehension quizzes after every story for extra growth.",
      ready: "Reading skills are strong — challenge with longer stories!",
      highly_prepared: "Exceptional reading ability — well ahead of 2nd grade!",
    },
  },
  {
    key: "mathPercent" as const,
    label: "Math & Number Sense",
    emoji: "🔢",
    color: "#F59E0B",
    weight: 0.25,
    tips: {
      emerging: "Start with Crystal Cove addition — counters make it visual and fun!",
      developing: "Skip-counting practice unlocks big math breakthroughs.",
      approaching: "Word problems are the next big step — try Ocean Deep math!",
      ready: "Strong number sense — place value missions are next!",
      highly_prepared: "Math skills are outstanding for 2nd grade readiness!",
    },
  },
  {
    key: "spellingPercent" as const,
    label: "Spelling & Phonics",
    emoji: "✏️",
    color: "#8B5CF6",
    weight: 0.25,
    tips: {
      emerging: "Study Card mode is perfect for learning sight words first.",
      developing: "Try Scramble mode — it makes spelling patterns stick!",
      approaching: "Mastering blends and silent-e words is a huge milestone.",
      ready: "Spelling skills are solid — compound words are next!",
      highly_prepared: "Excellent spelling mastery — way ahead of peers!",
    },
  },
  {
    key: "writingPercent" as const,
    label: "Writing & Grammar",
    emoji: "📝",
    color: "#10B981",
    weight: 0.20,
    tips: {
      emerging: "Sentence Builder activities are a great first step for writers!",
      developing: "Punctuation practice (., ?, !) is building great writing habits.",
      approaching: "Story Starter activities are unlocking creative confidence!",
      ready: "Strong writing foundation — encourage longer story starters!",
      highly_prepared: "Writing skills are well above 2nd grade expectations!",
    },
  },
];

const READINESS_CONFIG: Record<string, { color: string; bg: string; border: string; label: string }> = {
  emerging:          { color: "text-red-400",    bg: "bg-red-500/10",    border: "border-red-500/30",    label: "Just Getting Started" },
  developing:        { color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/30", label: "Building Skills" },
  approaching:       { color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/30", label: "Approaching Readiness" },
  ready:             { color: "text-green-400",  bg: "bg-green-500/10",  border: "border-green-500/30",  label: "Ready for 2nd Grade" },
  highly_prepared:   { color: "text-blue-400",   bg: "bg-blue-500/10",   border: "border-blue-500/30",   label: "Highly Prepared" },
};

const OVERALL_MESSAGES: Record<string, string> = {
  emerging: `${"{name}"} is at the beginning of the adventure! Every session builds foundational skills. Focus on 1-2 subjects daily for just 10-15 minutes to build strong habits.`,
  developing: `${"{name}"} is making real progress! The skills being built now will pay off in 2nd grade. Encourage regular practice and celebrate every mission completed.`,
  approaching: `${"{name}"} is approaching 2nd grade readiness! Some subjects are strong — focus extra time on weaker areas to balance overall skill development.`,
  ready: `${"{name}"} is ready for 2nd grade! Skills across reading, math, spelling, and writing show strong preparation. Keep the adventure going to stay ahead!`,
  highly_prepared: `${"{name}"} is exceptionally prepared for 2nd grade! Outstanding performance across all subject areas. This explorer is a Summer Quest champion!`,
};

export function ReadinessReport({ progress, studentName }: ReadinessReportProps) {
  const readinessScore = Math.round(
    SUBJECTS.reduce((sum, s) => sum + (progress[s.key] ?? 0) * s.weight, 0)
  );
  const level = getReadinessLevel(readinessScore);
  const config = READINESS_CONFIG[level];
  const overallMsg = OVERALL_MESSAGES[level].replace("{name}", studentName);

  const strengths = SUBJECTS.filter((s) => (progress[s.key] ?? 0) >= 60);
  const toGrow = SUBJECTS.filter((s) => (progress[s.key] ?? 0) < 40);

  return (
    <div className="space-y-4">
      {/* Overall readiness card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card variant="glow" className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">
                2nd Grade Readiness
              </p>
              <h3 className="text-xl font-bold text-white">{studentName}&apos;s Report</h3>
            </div>
            <div className="text-right">
              <p className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                {readinessScore}%
              </p>
              <p className="text-xs text-gray-500">Readiness Score</p>
            </div>
          </div>

          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-bold mb-4 ${config.bg} ${config.border}`}>
            <span className={config.color}>{config.label}</span>
          </div>

          <ProgressBar value={readinessScore} variant="gradient" size="lg" />
        </Card>
      </motion.div>

      {/* Subject breakdown */}
      <div className="space-y-3">
        {SUBJECTS.map((subject, i) => {
          const pct = progress[subject.key] ?? 0;
          const subLevel = getReadinessLevel(pct);
          const subConfig = READINESS_CONFIG[subLevel];
          const tip = subject.tips[subLevel];

          return (
            <motion.div
              key={subject.key}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 + i * 0.06 }}
            >
              <Card className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xl">{subject.emoji}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-sm font-semibold text-white">{subject.label}</span>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${subConfig.bg} ${subConfig.border} ${subConfig.color}`}>
                          {getReadinessLabel(subLevel)}
                        </span>
                        <span className="text-sm font-bold text-white">{Math.round(pct)}%</span>
                      </div>
                    </div>
                    <ProgressBar
                      value={pct}
                      size="sm"
                      animated={false}
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-400 pl-8">{tip}</p>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Strengths & grow */}
      {(strengths.length > 0 || toGrow.length > 0) && (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 gap-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {strengths.length > 0 && (
            <Card className="p-4 border-emerald-500/20 bg-emerald-500/5">
              <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">
                💪 Strengths
              </p>
              <div className="flex flex-wrap gap-2">
                {strengths.map((s) => (
                  <span
                    key={s.key}
                    className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-medium"
                  >
                    {s.emoji} {s.label.split(" ")[0]}
                  </span>
                ))}
              </div>
            </Card>
          )}
          {toGrow.length > 0 && (
            <Card className="p-4 border-orange-500/20 bg-orange-500/5">
              <p className="text-xs font-bold text-orange-400 uppercase tracking-wider mb-2">
                🎯 Keep Growing
              </p>
              <div className="flex flex-wrap gap-2">
                {toGrow.map((s) => (
                  <span
                    key={s.key}
                    className="text-xs px-2.5 py-1 rounded-full bg-orange-500/15 border border-orange-500/30 text-orange-300 font-medium"
                  >
                    {s.emoji} {s.label.split(" ")[0]}
                  </span>
                ))}
              </div>
            </Card>
          )}
        </motion.div>
      )}

      {/* Overall message */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="p-5 border-blue-500/20 bg-blue-500/5">
          <p className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-2">
            📋 Parent Note
          </p>
          <p className="text-sm text-gray-300 leading-relaxed">{overallMsg}</p>
        </Card>
      </motion.div>
    </div>
  );
}
