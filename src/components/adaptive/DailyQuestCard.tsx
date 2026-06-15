"use client";

import { motion } from "framer-motion";
import { ChevronRight, Flame } from "lucide-react";
import { useRouter } from "next/navigation";
import { SubjectRec } from "@/hooks/useAdaptive";

interface DailyQuestCardProps {
  recommendation: SubjectRec;
  streak: number;
  delay?: number;
}

export function DailyQuestCard({ recommendation, streak, delay = 0 }: DailyQuestCardProps) {
  const router = useRouter();

  return (
    <motion.button
      onClick={() => router.push(recommendation.route)}
      className="w-full text-left p-4 rounded-3xl border overflow-hidden transition-all hover:-translate-y-0.5 active:scale-[0.98]"
      style={{
        background: `linear-gradient(135deg, ${recommendation.color}15 0%, #0D1117 65%)`,
        borderColor: recommendation.color + "35",
      }}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 border"
          style={{
            backgroundColor: recommendation.color + "18",
            borderColor: recommendation.color + "30",
          }}
        >
          {recommendation.emoji}
        </div>

        <div className="flex-1 min-w-0">
          <p
            className="text-[10px] font-bold uppercase tracking-widest mb-0.5"
            style={{ color: recommendation.color }}
          >
            ⚔️ Today&apos;s Quest
          </p>
          <p className="font-bold text-white text-sm leading-tight">
            Practice {recommendation.label}
          </p>
          <p className="text-[11px] text-gray-500 mt-0.5 truncate">
            {recommendation.reason}
          </p>
        </div>

        <ChevronRight className="w-4 h-4 text-gray-600 shrink-0" />
      </div>

      {streak > 1 && (
        <div className="mt-3 pt-3 border-t border-white/5 flex items-center gap-2">
          <Flame className="w-3.5 h-3.5 text-orange-400" />
          <p className="text-xs text-orange-300 font-medium">
            {streak}-day streak — you&apos;re on fire! Keep going!
          </p>
        </div>
      )}
    </motion.button>
  );
}
