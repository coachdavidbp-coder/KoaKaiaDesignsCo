"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Zap, Flame, Clock } from "lucide-react";
import { getStudentProfile, getStudentProgress } from "@/lib/firebase/firestore";
import { getWritingProgress } from "@/lib/firebase/writing";
import { StudentProfile } from "@/types/user";
import { StudentProgress } from "@/types/progress";
import { WritingProgress } from "@/types/writing";
import { Avatar } from "@/components/ui/Avatar";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { ProgressSummary } from "@/components/dashboard/ProgressSummary";
import { ReadinessReport } from "@/components/dashboard/ReadinessReport";
import { StoriesPanel } from "@/components/dashboard/StoriesPanel";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { formatRelativeTime } from "@/lib/utils/format";
import Link from "next/link";

interface Props {
  params: Promise<{ studentId: string }>;
}

type Tab = "overview" | "skills" | "stories" | "report";

const XP_PER_LEVEL = 500;

const EXPLORER_RANKS = [
  { min: 1,  max: 3,        title: "Rookie Explorer",            emoji: "🌱" },
  { min: 4,  max: 6,        title: "Junior Explorer",            emoji: "⭐" },
  { min: 7,  max: 10,       title: "Adventurer",                 emoji: "🧭" },
  { min: 11, max: 15,       title: "Expert Explorer",            emoji: "🗺️" },
  { min: 16, max: 20,       title: "Master Explorer",            emoji: "👑" },
  { min: 21, max: Infinity, title: "Legend of Adventure Island", emoji: "🌟" },
];

function getRank(level: number) {
  return EXPLORER_RANKS.find((r) => level >= r.min && level <= r.max) ?? EXPLORER_RANKS[0];
}

const TABS: { id: Tab; label: string; emoji: string }[] = [
  { id: "overview", label: "Overview", emoji: "🏠" },
  { id: "skills",   label: "Skills",   emoji: "📊" },
  { id: "stories",  label: "Stories",  emoji: "📝" },
  { id: "report",   label: "Report",   emoji: "📋" },
];

const SUBJECTS = [
  { label: "Reading",  key: "readingPercent"  as const, emoji: "📚", color: "#3B82F6" },
  { label: "Math",     key: "mathPercent"     as const, emoji: "🔢", color: "#F59E0B" },
  { label: "Spelling", key: "spellingPercent" as const, emoji: "✏️", color: "#8B5CF6" },
  { label: "Writing",  key: "writingPercent"  as const, emoji: "📝", color: "#10B981" },
];

export default function StudentReportPage({ params }: Props) {
  const { studentId } = use(params);
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("overview");
  const [student, setStudent] = useState<StudentProfile | null>(null);
  const [progress, setProgress] = useState<StudentProgress | null>(null);
  const [writingProgress, setWritingProgress] = useState<WritingProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getStudentProfile(studentId),
      getStudentProgress(studentId),
      getWritingProgress(studentId),
    ]).then(([s, p, w]) => {
      if (!s) { router.push("/parent"); return; }
      setStudent(s);
      setProgress(p);
      setWritingProgress(w);
      setIsLoading(false);
    }).catch(() => {
      router.push("/parent");
    });
  }, [studentId, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <LoadingSpinner size="lg" label="Loading report..." />
      </div>
    );
  }

  if (!student || !progress) return null;

  const explorerLevel = Math.floor((progress.xp ?? 0) / XP_PER_LEVEL) + 1;
  const rank = getRank(explorerLevel);
  const stories = writingProgress?.stories ?? [];

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Back + header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <Link href="/parent">
          <button className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-all mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
        </Link>

        <Card variant="glow" className="p-5">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar character={student.avatar.character} color={student.avatar.color} size="xl" />
              <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-blue-600 border-2 border-gray-900 flex items-center justify-center">
                <span className="text-xs font-bold text-white">{explorerLevel}</span>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-bold text-white">{student.displayName}</h1>
              <p className="text-sm text-gray-400">{rank.emoji} {rank.title} · Level {explorerLevel}</p>
              {student.lastLoginAt && (
                <p className="text-xs text-gray-500 mt-1">
                  Last played {formatRelativeTime(student.lastLoginAt)}
                </p>
              )}
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Tabs */}
      <motion.div
        className="flex gap-1 p-1 rounded-2xl bg-white/5 border border-white/10 mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        {TABS.map(({ id, label, emoji }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all ${
              tab === id
                ? "bg-white/10 text-white border border-white/15"
                : "text-gray-500 hover:text-gray-300"
            }`}
          >
            <span>{emoji}</span>
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </motion.div>

      {/* Tab content */}
      {tab === "overview" && (
        <motion.div
          key="overview"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* Stats grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { emoji: "⚡", value: progress.xp, label: "XP", icon: Zap, color: "text-amber-300" },
              { emoji: "🔥", value: `${progress.streak} days`, label: "Streak", icon: Flame, color: "text-orange-300" },
              { emoji: "💎", value: `${progress.crystals.earned}/100`, label: "Crystals", icon: null, color: "text-amber-300" },
              { emoji: "⏱", value: `${progress.totalPlaytimeMinutes}m`, label: "Play Time", icon: Clock, color: "text-blue-300" },
            ].map((stat) => (
              <Card key={stat.label} className="p-4 text-center">
                <div className="text-2xl mb-1">{stat.emoji}</div>
                <div className={`font-bold text-sm ${stat.color}`}>{stat.value}</div>
                <div className="text-[11px] text-gray-500 mt-0.5">{stat.label}</div>
              </Card>
            ))}
          </div>

          {/* Subject progress */}
          <Card className="p-5 space-y-4">
            <p className="text-sm font-bold text-white">📊 Subject Progress</p>
            {SUBJECTS.map((s) => (
              <div key={s.key} className="flex items-center gap-3">
                <span className="text-lg w-7 text-center shrink-0">{s.emoji}</span>
                <div className="flex-1">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-400">{s.label}</span>
                    <span className="font-bold text-white">{Math.round(progress[s.key] ?? 0)}%</span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${progress[s.key] ?? 0}%`,
                        backgroundColor: s.color,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </Card>

          {/* Crystals progress */}
          <Card className="p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-bold text-white">💎 Crystal Collection</p>
              <span className="text-sm font-bold text-amber-300">
                {progress.crystals.earned}/100
              </span>
            </div>
            <ProgressBar
              value={progress.crystals.earned}
              max={100}
              variant="gold"
              size="md"
              animated={false}
            />
            <p className="text-xs text-gray-500 mt-2">
              Collect all 100 Crystals to defeat The Forgetful Fog!
            </p>
          </Card>

          {/* Economy stats */}
          <div className="grid grid-cols-2 gap-3">
            <Card className="p-4 flex items-center gap-3">
              <span className="text-2xl">🪙</span>
              <div>
                <p className="font-bold text-yellow-300">{progress.coins}</p>
                <p className="text-xs text-gray-500">Coins Earned</p>
              </div>
            </Card>
            <Card className="p-4 flex items-center gap-3">
              <span className="text-2xl">💜</span>
              <div>
                <p className="font-bold text-purple-300">{progress.gems}</p>
                <p className="text-xs text-gray-500">Gems Collected</p>
              </div>
            </Card>
          </div>
        </motion.div>
      )}

      {tab === "skills" && (
        <motion.div
          key="skills"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <ProgressSummary progress={progress} studentName={student.displayName} />
        </motion.div>
      )}

      {tab === "stories" && (
        <motion.div
          key="stories"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="mb-4">
            <h2 className="font-bold text-white text-sm mb-1">📖 {student.displayName}&apos;s Stories</h2>
            <p className="text-xs text-gray-500">
              {stories.length > 0
                ? `${stories.length} story ${stories.length === 1 ? "written" : "written"} so far — tap to read!`
                : "Stories written in Writing Workshop appear here."}
            </p>
          </div>
          <StoriesPanel stories={stories} studentName={student.displayName} />
        </motion.div>
      )}

      {tab === "report" && (
        <motion.div
          key="report"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <ReadinessReport progress={progress} studentName={student.displayName} />
        </motion.div>
      )}
    </div>
  );
}
