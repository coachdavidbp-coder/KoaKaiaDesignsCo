"use client";

import { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Star, ChevronRight } from "lucide-react";
import { GAME_LEVELS } from "@/types/game";
import { StudentProgress } from "@/types/progress";
import { LevelModal } from "./LevelModal";
import { cn } from "@/lib/utils/cn";

const LEVEL_POSITIONS: Record<number, { x: number; y: number }> = {
  1:  { x: 8,  y: 80 },
  2:  { x: 26, y: 80 },
  3:  { x: 44, y: 80 },
  4:  { x: 62, y: 80 },
  5:  { x: 80, y: 80 },
  6:  { x: 80, y: 50 },
  7:  { x: 62, y: 50 },
  8:  { x: 44, y: 50 },
  9:  { x: 26, y: 50 },
  10: { x: 8,  y: 50 },
  11: { x: 8,  y: 20 },
  12: { x: 26, y: 20 },
  13: { x: 44, y: 20 },
  14: { x: 62, y: 20 },
  15: { x: 80, y: 8  },
};

const PATH_CONNECTIONS = [
  [1,2],[2,3],[3,4],[4,5],
  [5,6],
  [6,7],[7,8],[8,9],[9,10],
  [10,11],
  [11,12],[12,13],[13,14],[14,15],
];

interface WorldMapProps {
  progress: StudentProgress | null;
}

function getNodeStatus(
  levelId: number,
  progress: StudentProgress | null
): "locked" | "available" | "in_progress" | "completed" {
  const lvl = progress?.levels.find((l) => l.levelId === levelId);
  if (!lvl) return levelId === 1 ? "available" : "locked";
  if (lvl.isCompleted) return "completed";
  if (lvl.isUnlocked) return lvl.completionPercent > 0 ? "in_progress" : "available";
  return "locked";
}

export function WorldMap({ progress }: WorldMapProps) {
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);

  const handleNodeClick = useCallback((levelId: number) => {
    setSelectedLevel(levelId);
  }, []);

  const selectedLevelData = selectedLevel
    ? GAME_LEVELS.find((l) => l.id === selectedLevel)
    : null;
  const selectedLevelProgress = selectedLevel
    ? progress?.levels.find((l) => l.levelId === selectedLevel)
    : null;

  return (
    <div className="relative w-full">
      <div
        className="relative w-full rounded-3xl overflow-hidden border border-white/10"
        style={{
          background:
            "radial-gradient(ellipse at 20% 80%, #0d2818 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, #0d1a38 0%, transparent 50%), linear-gradient(160deg, #06080F 0%, #0a0f1e 50%, #060d0a 100%)",
          minHeight: "520px",
          height: "clamp(420px, 55vw, 640px)",
        }}
      >
        <MapBackground />

        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {PATH_CONNECTIONS.map(([from, to]) => {
            const a = LEVEL_POSITIONS[from];
            const b = LEVEL_POSITIONS[to];
            const fromStatus = getNodeStatus(from, progress);
            const toStatus = getNodeStatus(to, progress);
            const active = fromStatus !== "locked" && toStatus !== "locked";

            return (
              <line
                key={`${from}-${to}`}
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                stroke={active ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.06)"}
                strokeWidth="0.8"
                strokeDasharray={active ? "2,1.5" : "1.5,2"}
                strokeLinecap="round"
              />
            );
          })}
        </svg>

        {GAME_LEVELS.map((level) => {
          const pos = LEVEL_POSITIONS[level.id];
          const status = getNodeStatus(level.id, progress);
          const lvlProgress = progress?.levels.find((l) => l.levelId === level.id);
          const crystals = lvlProgress?.crystalsEarned ?? 0;

          return (
            <MapNode
              key={level.id}
              level={level}
              status={status}
              pos={pos}
              crystals={crystals}
              onSelect={handleNodeClick}
            />
          );
        })}

        <FogOverlay progress={progress} />
      </div>

      <AnimatePresence>
        {selectedLevel && selectedLevelData && (
          <LevelModal
            level={selectedLevelData}
            levelProgress={selectedLevelProgress ?? null}
            onClose={() => setSelectedLevel(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

const STARS = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  size: ((i * 7 + 3) % 3 === 0) ? "2px" : "1px",
  left: `${(i * 53 + 11) % 100}%`,
  top: `${(i * 37 + 7) % 60}%`,
  opacity: 0.2 + ((i * 13) % 40) / 100,
  animationDelay: `${(i * 17) % 30 / 10}s`,
  animationDuration: `${1.5 + (i * 11) % 20 / 10}s`,
}));

function MapBackground() {
  return (
    <>
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            radial-gradient(circle at 15% 75%, rgba(16,185,129,0.3) 0%, transparent 25%),
            radial-gradient(circle at 50% 80%, rgba(14,165,233,0.2) 0%, transparent 20%),
            radial-gradient(circle at 85% 75%, rgba(14,165,233,0.25) 0%, transparent 20%),
            radial-gradient(circle at 15% 20%, rgba(99,102,241,0.2) 0%, transparent 20%),
            radial-gradient(circle at 75% 15%, rgba(236,72,153,0.2) 0%, transparent 20%)
          `,
        }}
      />
      <div className="absolute bottom-0 left-0 right-0 h-1/4 opacity-15"
        style={{ background: "linear-gradient(to top, rgba(14,165,233,0.4), transparent)" }}
      />
      {STARS.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full bg-white animate-star-twinkle"
          style={{
            width: star.size,
            height: star.size,
            left: star.left,
            top: star.top,
            opacity: star.opacity,
            animationDelay: star.animationDelay,
            animationDuration: star.animationDuration,
          }}
        />
      ))}
    </>
  );
}

interface MapNodeProps {
  level: (typeof GAME_LEVELS)[0];
  status: "locked" | "available" | "in_progress" | "completed";
  pos: { x: number; y: number };
  crystals: number;
  onSelect: (id: number) => void;
}

function MapNode({ level, status, pos, crystals, onSelect }: MapNodeProps) {
  const isLocked = status === "locked";
  const isCurrent = status === "available" || status === "in_progress";
  const isCompleted = status === "completed";

  return (
    <motion.div
      className="absolute"
      style={{
        left: `${pos.x}%`,
        top: `${pos.y}%`,
        transform: "translate(-50%, -50%)",
        zIndex: isCurrent ? 10 : 5,
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.4, delay: level.id * 0.04, type: "spring" }}
    >
      <div className="relative flex flex-col items-center gap-1">
        {isCurrent && (
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{ backgroundColor: level.theme.primaryColor, filter: "blur(12px)" }}
            animate={{ opacity: [0.3, 0.7, 0.3], scale: [1, 1.3, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        )}

        <button
          onClick={() => onSelect(level.id)}
          className={cn(
            "relative w-14 h-14 rounded-2xl border-2 flex items-center justify-center text-2xl transition-all duration-200",
            "active:scale-95 focus:outline-none focus:ring-2 focus:ring-white/30",
            isLocked
              ? "bg-gray-900/80 border-white/10 grayscale opacity-50 cursor-pointer"
              : isCompleted
              ? "border-white/40 cursor-pointer hover:scale-105"
              : "border-white/50 cursor-pointer hover:scale-110 shadow-lg"
          )}
          style={
            !isLocked
              ? {
                  background: `linear-gradient(135deg, ${level.theme.bgFrom}, ${level.theme.bgTo})`,
                  borderColor: level.theme.primaryColor + "80",
                  boxShadow: isCurrent
                    ? `0 0 20px ${level.theme.primaryColor}60, 0 4px 12px rgba(0,0,0,0.5)`
                    : `0 4px 12px rgba(0,0,0,0.4)`,
                }
              : undefined
          }
          aria-label={level.name}
        >
          {isLocked ? (
            <Lock className="w-5 h-5 text-gray-500" />
          ) : (
            <span className="drop-shadow-sm">{level.theme.icon}</span>
          )}

          {isCompleted && (
            <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-emerald-500 border-2 border-gray-900 flex items-center justify-center">
              <Star className="w-2.5 h-2.5 text-white fill-current" />
            </div>
          )}

          {isCurrent && (
            <motion.div
              className="absolute -top-2 left-1/2 -translate-x-1/2"
              animate={{ y: [-2, 2, -2] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <span className="text-xs">⬇️</span>
            </motion.div>
          )}
        </button>

        <div className="flex flex-col items-center gap-0.5">
          <span
            className={cn(
              "text-[10px] font-bold px-1.5 py-0.5 rounded-full whitespace-nowrap",
              isLocked
                ? "text-gray-600 bg-transparent"
                : "text-white/90 bg-black/40"
            )}
          >
            {level.id <= 9 ? `0${level.id}` : level.id}
          </span>
          {!isLocked && crystals > 0 && (
            <span className="text-[9px] text-amber-300 font-medium">
              💎{crystals}/{level.crystalCount}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function FogOverlay({ progress }: { progress: StudentProgress | null }) {
  const unlockedCount = progress?.levels.filter((l) => l.isUnlocked).length ?? 1;
  if (unlockedCount >= 15) return null;

  const fogX = (() => {
    const maxUnlocked = Math.max(1, unlockedCount);
    const pos = LEVEL_POSITIONS[Math.min(maxUnlocked + 2, 15)];
    return pos ? pos.x : 100;
  })();

  return (
    <div
      className="absolute inset-0 pointer-events-none rounded-3xl"
      style={{
        background: `radial-gradient(ellipse at 90% 50%, transparent ${fogX - 10}%, rgba(6,8,15,0.85) ${fogX + 20}%)`,
      }}
    />
  );
}
