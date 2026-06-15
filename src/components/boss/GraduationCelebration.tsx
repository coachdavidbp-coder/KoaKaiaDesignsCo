"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Home } from "lucide-react";
import { StudentProfile } from "@/types/user";
import { StudentProgress } from "@/types/progress";
import { Avatar } from "@/components/ui/Avatar";

interface GraduationCelebrationProps {
  student: StudentProfile;
  progress: StudentProgress | null;
  score: number;
  total: number;
  onGoHome: () => void;
}

const CONFETTI_COLORS = ["#FBBF24", "#A78BFA", "#34D399", "#60A5FA", "#F472B6", "#FB923C"];

function Confetti() {
  const [particles] = useState(() =>
    Array.from({ length: 40 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      delay: Math.random() * 1.5,
      duration: 2 + Math.random() * 2,
      size: 6 + Math.random() * 8,
      rotate: Math.random() * 360,
    }))
  );

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-10">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-sm"
          style={{
            left: `${p.x}%`,
            top: "-5%",
            width: p.size,
            height: p.size * 0.6,
            backgroundColor: p.color,
            rotate: p.rotate,
          }}
          animate={{ y: "110vh", rotate: p.rotate + 360 * (Math.random() > 0.5 ? 3 : -3), opacity: [1, 1, 0] }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: "easeIn",
            opacity: { times: [0, 0.8, 1] },
          }}
        />
      ))}
    </div>
  );
}

export function GraduationCelebration({
  student,
  progress,
  score,
  total,
  onGoHome,
}: GraduationCelebrationProps) {
  const [showCert, setShowCert] = useState(false);
  const pct = Math.round((score / total) * 100);
  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  });

  useEffect(() => {
    const t = setTimeout(() => setShowCert(true), 1200);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-start overflow-y-auto"
      style={{ background: "linear-gradient(170deg, #0f0a2e 0%, #06080f 50%)" }}
    >
      <Confetti />

      <div className="relative z-20 w-full max-w-sm mx-auto px-4 py-8 flex flex-col items-center gap-6">
        {/* Trophy */}
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 280, damping: 18, delay: 0.1 }}
          className="text-8xl"
        >
          🏆
        </motion.div>

        {/* Title */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <p className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-2">
            🌟 Summer Quest Complete! 🌟
          </p>
          <h1 className="text-3xl font-bold text-white leading-tight">
            The Forgetful Fog<br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
              Has Been Defeated!
            </span>
          </h1>
        </motion.div>

        {/* Avatar + score */}
        <motion.div
          className="flex items-center gap-4"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Avatar character={student.avatar.character} color={student.avatar.color} size="xl" />
          <div>
            <p className="font-bold text-white text-lg">{student.displayName}</p>
            <p className="text-sm text-gray-400">Knowledge Restored!</p>
            <p className="text-amber-300 font-bold mt-1">{score}/{total} correct ({pct}%)</p>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="grid grid-cols-3 gap-3 w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          {[
            { emoji: "⚡", value: progress?.xp ?? 0, label: "XP" },
            { emoji: "💎", value: `${progress?.crystals.earned ?? 0}/100`, label: "Crystals" },
            { emoji: "🔥", value: `${progress?.streak ?? 0}d`, label: "Streak" },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl bg-white/5 border border-white/10 p-3 text-center">
              <div className="text-xl mb-0.5">{s.emoji}</div>
              <div className="font-bold text-white text-sm">{s.value}</div>
              <div className="text-xs text-gray-500">{s.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Certificate */}
        {showCert && (
          <motion.div
            className="w-full rounded-3xl border-2 border-amber-500/40 overflow-hidden"
            style={{ background: "linear-gradient(135deg, #1a0a05, #0a0514)" }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <div className="p-6 text-center">
              <p className="text-amber-400 text-xs font-bold uppercase tracking-widest mb-3">
                ✦ Certificate of Completion ✦
              </p>
              <p className="text-gray-400 text-xs mb-2">This certifies that</p>
              <p className="text-white font-bold text-xl mb-2">{student.displayName}</p>
              <p className="text-gray-400 text-xs leading-relaxed mb-3">
                has completed Summer Quest: The Road to 2nd Grade,
                defeated The Forgetful Fog, and restored all
                knowledge to Adventure Island.
              </p>
              <div className="flex justify-center gap-2 text-xl mb-3">
                {"⭐⭐⭐⭐⭐".split("").map((s, i) => (
                  <motion.span
                    key={i}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1 + i * 0.07, type: "spring" }}
                  >
                    {s}
                  </motion.span>
                ))}
              </div>
              <p className="text-amber-500/60 text-xs">{today}</p>
            </div>
          </motion.div>
        )}

        {/* Go home */}
        <motion.button
          onClick={onGoHome}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-black text-sm transition-all active:scale-95"
          style={{ background: "linear-gradient(135deg, #FBBF24, #F59E0B)" }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Home className="w-4 h-4" />
          Back to Adventure Island
        </motion.button>
      </div>
    </div>
  );
}
