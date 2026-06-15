"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Camera } from "lucide-react";
import { useStudentStore } from "@/store/studentStore";
import { useProgressStore } from "@/store/progressStore";
import { useAchievements } from "@/hooks/useAchievements";
import { getStudentProgress } from "@/lib/firebase/firestore";
import { uploadStudentPhoto } from "@/lib/firebase/storage";
import { COMPANIONS } from "@/types/companion";
import { ALL_ACHIEVEMENTS, RARITY_COLORS } from "@/types/achievements";
import { GameNav } from "@/components/game/GameNav";
import { Avatar } from "@/components/ui/Avatar";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Badge } from "@/components/ui/Badge";
import { formatRelativeTime } from "@/lib/utils/format";
import { StudentProgress } from "@/types/progress";

interface Props {
  params: { profileId: string };
}

const XP_PER_LEVEL = 500;

function getExplorerLevel(xp: number) {
  return Math.floor(xp / XP_PER_LEVEL) + 1;
}

function getXPProgress(xp: number) {
  return xp % XP_PER_LEVEL;
}

const EXPLORER_RANKS = [
  { min: 1, max: 3, title: "Rookie Explorer", emoji: "🌱" },
  { min: 4, max: 6, title: "Junior Explorer", emoji: "⭐" },
  { min: 7, max: 10, title: "Adventurer", emoji: "🧭" },
  { min: 11, max: 15, title: "Expert Explorer", emoji: "🗺️" },
  { min: 16, max: 20, title: "Master Explorer", emoji: "👑" },
  { min: 21, max: Infinity, title: "Legend of Adventure Island", emoji: "🌟" },
];

function getRank(level: number) {
  return (
    EXPLORER_RANKS.find((r) => level >= r.min && level <= r.max) ?? EXPLORER_RANKS[0]
  );
}

export default function CharacterPage({ params }: Props) {
  const { profileId } = params;
  const router = useRouter();
  const { activeStudent } = useStudentStore();
  const { progressMap, setProgress } = useProgressStore();
  const { earned, earnedIds, earnedCount, loadAchievements } = useAchievements(profileId);
  const [progress, setLocalProgress] = useState<StudentProgress | null>(
    progressMap[profileId] ?? null
  );
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { updateStudent } = useStudentStore();

  useEffect(() => {
    if (!activeStudent || activeStudent.id !== profileId) {
      router.push("/parent");
      return;
    }
    Promise.all([
      getStudentProgress(profileId).then((p) => {
        if (p) { setLocalProgress(p); setProgress(profileId, p); }
      }),
      loadAchievements(),
    ]);
  }, [profileId, activeStudent, router, setProgress, loadAchievements]);

  async function handlePhotoSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !activeStudent) return;
    setUploading(true);
    try {
      const url = await uploadStudentPhoto(activeStudent.id, file);
      updateStudent(activeStudent.id, { avatarUrl: url });
    } catch {
      // upload failed silently
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  if (!activeStudent) return null;
  const companion = COMPANIONS[activeStudent.avatar.character];
  const xp = progress?.xp ?? 0;
  const explorerLevel = getExplorerLevel(xp);
  const xpProgress = getXPProgress(xp);
  const rank = getRank(explorerLevel);

  const recentAchievements = ALL_ACHIEVEMENTS.filter((a) => earnedIds.has(a.id)).slice(-6);

  return (
    <div className="min-h-screen pb-24">
      <div className="bg-gray-900/90 backdrop-blur-xl border-b border-white/10 px-4 py-4 sticky top-0 z-20">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <span className="text-lg">{rank.emoji}</span>
          <div>
            <h1 className="font-bold text-white text-lg leading-none">
              {activeStudent.displayName}
            </h1>
            <p className="text-xs text-gray-400">{rank.title}</p>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-5 space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card variant="glow" className="p-6">
            <div className="flex items-center gap-6">
              <div className="relative">
                <Avatar
                  character={activeStudent.avatar.character}
                  color={activeStudent.avatar.color}
                  avatarUrl={activeStudent.avatarUrl}
                  size="xl"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="absolute -bottom-1 -left-1 w-7 h-7 rounded-full bg-gray-700 border-2 border-gray-900 flex items-center justify-center hover:bg-gray-600 transition-all active:scale-95 disabled:opacity-50"
                  title="Change photo"
                >
                  {uploading ? (
                    <span className="w-3 h-3 border border-white/40 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Camera className="w-3 h-3 text-white" />
                  )}
                </button>
                <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-blue-600 border-2 border-gray-900 flex items-center justify-center">
                  <span className="text-xs font-bold text-white">{explorerLevel}</span>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoSelect}
                />
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-xl font-bold text-white">{activeStudent.displayName}</p>
                  <span className="text-lg">{rank.emoji}</span>
                </div>
                <p className="text-sm text-gray-400 mb-3">{rank.title} • Level {explorerLevel}</p>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-500">XP to next level</span>
                    <span className="text-blue-300 font-medium">
                      {xpProgress}/{XP_PER_LEVEL}
                    </span>
                  </div>
                  <ProgressBar value={xpProgress} max={XP_PER_LEVEL} variant="blue" size="sm" />
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          className="grid grid-cols-2 sm:grid-cols-4 gap-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {[
            { label: "Crystals", value: `${progress?.crystals.earned ?? 0}/100`, emoji: "💎" },
            { label: "Coins", value: progress?.coins ?? 0, emoji: "🪙" },
            { label: "Gems", value: progress?.gems ?? 0, emoji: "💜" },
            { label: "Streak", value: `${progress?.streak ?? 0} days`, emoji: "🔥" },
          ].map((stat) => (
            <Card key={stat.label} className="p-3 text-center">
              <p className="text-xl mb-1">{stat.emoji}</p>
              <p className="font-bold text-white text-sm">{stat.value}</p>
              <p className="text-xs text-gray-500">{stat.label}</p>
            </Card>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Card className="p-5">
            <div className="flex items-center gap-4">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl border shrink-0"
                style={{
                  background: `linear-gradient(135deg, ${companion.color}20, transparent)`,
                  borderColor: companion.color + "40",
                }}
              >
                {companion.emoji}
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-0.5">Active Companion</p>
                <p className="font-bold text-white">{companion.name}</p>
                <p className="text-xs text-gray-400">{companion.specialty} Specialist</p>
                <p className="text-xs mt-1 italic text-gray-500">"{companion.personality}"</p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="font-bold text-white text-sm mb-3 flex items-center gap-2">
            📊 Skill Progress
          </h2>
          <Card className="p-4 space-y-3">
            {[
              { label: "Reading", pct: progress?.readingPercent ?? 0, emoji: "📚" },
              { label: "Math", pct: progress?.mathPercent ?? 0, emoji: "🔢" },
              { label: "Spelling", pct: progress?.spellingPercent ?? 0, emoji: "✏️" },
              { label: "Writing", pct: progress?.writingPercent ?? 0, emoji: "📝" },
              { label: "Vocabulary", pct: progress?.vocabularyPercent ?? 0, emoji: "💬" },
            ].map((skill) => (
              <div key={skill.label} className="flex items-center gap-3">
                <span className="text-lg w-7 shrink-0 text-center">{skill.emoji}</span>
                <div className="flex-1">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-400">{skill.label}</span>
                    <span className="text-gray-300 font-medium">{Math.round(skill.pct)}%</span>
                  </div>
                  <ProgressBar value={skill.pct} size="sm" variant="gradient" animated={false} />
                </div>
              </div>
            ))}
          </Card>
        </motion.div>

        {recentAchievements.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-white text-sm">🏆 Recent Achievements ({earnedCount})</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {recentAchievements.map((a) => {
                const rarity = RARITY_COLORS[a.rarity];
                return (
                  <div
                    key={a.id}
                    className={`flex items-center gap-2 p-3 rounded-2xl border ${rarity.bg} ${rarity.border}`}
                  >
                    <span className="text-xl">{a.emoji}</span>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white truncate">{a.name}</p>
                      <p className={`text-[10px] capitalize ${rarity.text}`}>{a.rarity}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-4">
            <p className="text-xs text-gray-500 mb-1">Time on Adventure Island</p>
            <p className="font-bold text-white">
              {progress?.totalPlaytimeMinutes ?? 0} minutes played
            </p>
            {activeStudent.lastLoginAt && (
              <p className="text-xs text-gray-500 mt-1">
                Last played {formatRelativeTime(activeStudent.lastLoginAt)}
              </p>
            )}
          </Card>
        </motion.div>
      </div>

      <GameNav profileId={profileId} achievementCount={earnedCount} />
    </div>
  );
}
