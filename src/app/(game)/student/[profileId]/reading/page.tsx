"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, BookOpen, Sparkles } from "lucide-react";
import { useStudentStore } from "@/store/studentStore";
import { useProgressStore } from "@/store/progressStore";
import { useReading } from "@/hooks/useReading";
import { getStudentProfile, getStudentProgress } from "@/lib/firebase/firestore";
import { ALL_STORIES } from "@/data/stories";
import { StudentProfile } from "@/types/user";
import { StudentProgress } from "@/types/progress";
import { Story } from "@/types/reading";
import { StoryCard } from "@/components/reading/StoryCard";
import { GameHUD } from "@/components/game/GameHUD";
import { GameNav } from "@/components/game/GameNav";
import { FullPageLoader } from "@/components/ui/LoadingSpinner";

interface Props {
  params: { profileId: string };
}

const LEVEL_LABELS: Record<number, { label: string; emoji: string; color: string }> = {
  1: { label: "Level 1 · Crystal Cove", emoji: "🏝️", color: "#10B981" },
  3: { label: "Level 2 · Thunder Peak", emoji: "⚡", color: "#F59E0B" },
  5: { label: "Level 3 · Ocean Deep", emoji: "🌊", color: "#3B82F6" },
};

export default function ReadingLibraryPage({ params }: Props) {
  const { profileId } = params;
  const router = useRouter();
  const { activeStudent } = useStudentStore();
  const { setProgress } = useProgressStore();
  const { readingProgress, loadReadingProgress } = useReading(profileId);
  const [student, setStudent] = useState<StudentProfile | null>(null);
  const [progress, setLocalProgress] = useState<StudentProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const s = await getStudentProfile(profileId);
        if (!s || !s.isActive) { router.push("/parent"); return; }

        if (!activeStudent || activeStudent.id !== profileId) {
          router.push("/parent/students");
          return;
        }

        const p = await getStudentProgress(profileId);
        setStudent(s);
        setLocalProgress(p);
        if (p) setProgress(profileId, p);

        await loadReadingProgress(p ?? undefined);
      } catch {
        router.push("/parent");
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [profileId, activeStudent, router, setProgress, loadReadingProgress]);

  if (isLoading) return <FullPageLoader label="Opening Story Library..." />;
  if (!student) return null;

  const unlockedLevels = progress?.levels
    .filter((l) => l.isUnlocked)
    .map((l) => l.levelId) ?? [1];

  const storiesRead = readingProgress?.storiesRead ?? [];

  const storyLevels = [1, 3, 5].map((levelId) => ({
    levelId,
    meta: LEVEL_LABELS[levelId],
    stories: ALL_STORIES.filter((s) => s.levelId === levelId),
    isUnlocked: unlockedLevels.includes(levelId),
  }));

  const handleSelectStory = (story: Story) => {
    router.push(`/student/${profileId}/reading/${story.id}`);
  };

  const totalRead = storiesRead.length;
  const totalAvailable = ALL_STORIES.filter((s) => unlockedLevels.includes(s.levelId)).length;

  return (
    <div className="min-h-screen pb-24">
      <GameHUD student={student} progress={progress} />

      <div className="max-w-2xl mx-auto px-4 py-5">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 mb-6"
        >
          <button
            onClick={() => router.push(`/student/${profileId}`)}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/15 text-gray-400 hover:text-white transition-all active:scale-95"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-400" />
              Reading Adventure
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              {totalRead} of {totalAvailable} stories read
            </p>
          </div>
        </motion.div>

        {totalAvailable > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="mb-6 p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center gap-3"
          >
            <Sparkles className="w-5 h-5 text-blue-400 shrink-0" />
            <div>
              <p className="text-sm font-bold text-white">
                {totalRead === 0
                  ? "Start your reading adventure!"
                  : totalRead === totalAvailable
                  ? "You've read every story! Amazing! 🌟"
                  : `Keep going — ${totalAvailable - totalRead} ${totalAvailable - totalRead === 1 ? "story" : "stories"} left!`}
              </p>
              <div className="mt-1.5 h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all duration-500"
                  style={{ width: `${totalAvailable > 0 ? (totalRead / totalAvailable) * 100 : 0}%` }}
                />
              </div>
            </div>
          </motion.div>
        )}

        <div className="space-y-8">
          {storyLevels.map(({ levelId, meta, stories, isUnlocked }, groupIdx) => (
            <motion.div
              key={levelId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + groupIdx * 0.08 }}
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">{meta.emoji}</span>
                <div>
                  <h2 className="font-bold text-white text-sm">{meta.label}</h2>
                  {!isUnlocked && (
                    <p className="text-xs text-gray-500">Complete earlier worlds to unlock</p>
                  )}
                </div>
                {isUnlocked && (
                  <span
                    className="ml-auto text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{
                      backgroundColor: meta.color + "20",
                      color: meta.color,
                      border: `1px solid ${meta.color}30`,
                    }}
                  >
                    {stories.filter((s) => storiesRead.includes(s.id)).length}/{stories.length} read
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {stories.map((story, i) => (
                  <StoryCard
                    key={story.id}
                    story={story}
                    readingProgress={readingProgress}
                    isLocked={!isUnlocked}
                    onSelect={handleSelectStory}
                    index={i}
                  />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <GameNav profileId={profileId} />
    </div>
  );
}
