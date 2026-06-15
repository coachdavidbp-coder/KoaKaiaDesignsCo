"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { X, Lock } from "lucide-react";
import { Level } from "@/types/game";
import { LevelProgress } from "@/types/progress";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Badge } from "@/components/ui/Badge";

interface LevelModalProps {
  level: Level;
  levelProgress: LevelProgress | null;
  profileId: string;
  onClose: () => void;
}

function getSubjectRoute(level: Level, profileId: string): string {
  const areas = level.focusAreas.map((a) => a.toLowerCase());
  if (areas.some((a) => /spelling|word famil|scramble/.test(a))) return `/student/${profileId}/spelling`;
  if (areas.some((a) => /writing|grammar|sentence|punctuation/.test(a))) return `/student/${profileId}/writing`;
  if (areas.some((a) => /math|number|addition|subtraction|problem|pattern|place value|time/.test(a))) return `/student/${profileId}/math`;
  return `/student/${profileId}/reading`;
}

export function LevelModal({ level, levelProgress, profileId, onClose }: LevelModalProps) {
  const router = useRouter();
  const isLocked = !levelProgress?.isUnlocked && level.id !== 1;
  const isCompleted = levelProgress?.isCompleted ?? false;
  const pct = levelProgress?.completionPercent ?? 0;
  const crystalsEarned = levelProgress?.crystalsEarned ?? 0;
  const missionsCompleted = levelProgress?.missionsCompleted ?? 0;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      <motion.div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      <motion.div
        className="relative w-full max-w-sm rounded-3xl overflow-hidden border border-white/10 shadow-2xl z-10"
        style={{
          background: `linear-gradient(160deg, ${level.theme.bgFrom} 0%, #0D1117 100%)`,
          borderColor: level.theme.primaryColor + "30",
        }}
        initial={{ y: 60, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 60, opacity: 0, scale: 0.95 }}
        transition={{ type: "spring", stiffness: 300, damping: 28 }}
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{
            background: `radial-gradient(circle at 30% 30%, ${level.theme.primaryColor}, transparent 60%)`,
          }}
        />

        <div className="relative p-6">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-all"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-start gap-4 mb-5">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shrink-0 border"
              style={{
                background: `linear-gradient(135deg, ${level.theme.bgFrom}, ${level.theme.bgTo})`,
                borderColor: level.theme.primaryColor + "50",
                boxShadow: `0 4px 20px ${level.theme.primaryColor}30`,
              }}
            >
              {level.theme.icon}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Level {level.id}
                </span>
                {isCompleted && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-medium">
                    ✓ Complete
                  </span>
                )}
                {isLocked && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-gray-500/20 text-gray-400 border border-gray-500/30 font-medium flex items-center gap-1">
                    <Lock className="w-2.5 h-2.5" /> Locked
                  </span>
                )}
              </div>
              <h2 className="text-lg font-bold text-white">{level.name}</h2>
              <p className="text-xs text-gray-400 mt-0.5">{level.description}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5 mb-5">
            {level.focusAreas.map((area) => (
              <Badge key={area} variant="blue" className="text-xs">
                {area}
              </Badge>
            ))}
          </div>

          {!isLocked && (
            <>
              <div className="mb-4">
                <ProgressBar value={pct} showPercent label="Progress" size="md" />
              </div>

              <div className="grid grid-cols-3 gap-3 mb-5">
                <StatBox
                  icon="💎"
                  label="Crystals"
                  value={`${crystalsEarned}/${level.crystalCount}`}
                  color={level.theme.primaryColor}
                />
                <StatBox
                  icon="⚡"
                  label="Missions"
                  value={`${missionsCompleted}/${level.missionCount}`}
                  color={level.theme.primaryColor}
                />
                <StatBox
                  icon="🦸"
                  label="Guide"
                  value={level.companion}
                  color={level.theme.primaryColor}
                  small
                />
              </div>
            </>
          )}

          {isLocked ? (
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/10">
              <Lock className="w-5 h-5 text-gray-500 shrink-0" />
              <p className="text-sm text-gray-400">
                Complete the previous world to unlock this adventure!
              </p>
            </div>
          ) : (
            <button
              className="w-full py-3.5 rounded-2xl font-bold text-base transition-all hover:opacity-90 active:scale-[0.98]"
              style={{
                background: `linear-gradient(135deg, ${level.theme.primaryColor}, ${level.theme.secondaryColor})`,
                boxShadow: `0 4px 20px ${level.theme.primaryColor}40`,
                color: "#fff",
              }}
              onClick={() => { onClose(); router.push(getSubjectRoute(level, profileId)); }}
            >
              {isCompleted ? "⭐ Play Again" : pct > 0 ? "Continue Adventure" : "Begin Adventure"}
              {" "}{level.theme.emoji}
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}

function StatBox({
  icon,
  label,
  value,
  color,
  small,
}: {
  icon: string;
  label: string;
  value: string;
  color: string;
  small?: boolean;
}) {
  return (
    <div className="flex flex-col items-center gap-1 p-3 rounded-xl bg-white/5 border border-white/10">
      <span className="text-lg">{icon}</span>
      <span
        className={`font-bold text-white text-center leading-tight ${small ? "text-[10px]" : "text-sm"}`}
      >
        {value}
      </span>
      <span className="text-[10px] text-gray-500 uppercase tracking-wide">{label}</span>
    </div>
  );
}
