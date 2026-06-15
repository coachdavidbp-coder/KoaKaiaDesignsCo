"use client";

import { motion } from "framer-motion";
import { Play, MoreVertical, Clock, Zap, FileText } from "lucide-react";
import { StudentProfile } from "@/types/user";
import { StudentProgress } from "@/types/progress";
import { Card } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Badge } from "@/components/ui/Badge";
import { formatRelativeTime } from "@/lib/utils/format";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";

interface StudentCardProps {
  student: StudentProfile;
  progress?: StudentProgress;
  onPlay: (student: StudentProfile) => void;
  onEdit?: (student: StudentProfile) => void;
  onDelete?: (student: StudentProfile) => void;
  index?: number;
}

export function StudentCard({ student, progress, onPlay, onEdit, onDelete, index = 0 }: StudentCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [menuOpen]);

  const crystalsEarned = progress?.crystals.earned ?? 0;
  const overallPercent = progress?.overallPercent ?? 0;
  const streak = progress?.streak ?? 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Card
        variant="default"
        className="p-5 hover:border-blue-500/30 transition-all duration-300 group"
      >
        <div className="flex items-start gap-4">
          <Avatar
            character={student.avatar.character}
            color={student.avatar.color}
            size="lg"
          />

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-bold text-white text-lg leading-tight truncate">
                  {student.displayName}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  {student.lastLoginAt
                    ? `Last played ${formatRelativeTime(student.lastLoginAt)}`
                    : "Ready to begin!"}
                </p>
              </div>

              <div className="relative shrink-0" ref={menuRef}>
                <button
                  onClick={() => setMenuOpen((v) => !v)}
                  className="p-1.5 rounded-lg text-gray-500 hover:text-gray-300 hover:bg-white/10 transition-all opacity-0 group-hover:opacity-100"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>
                {menuOpen && (
                  <div className="absolute right-0 top-8 w-40 bg-gray-800 border border-white/10 rounded-xl shadow-xl z-10 overflow-hidden">
                    {onEdit && (
                      <button
                        onClick={() => { onEdit(student); setMenuOpen(false); }}
                        className="w-full px-4 py-2.5 text-sm text-left text-gray-300 hover:bg-white/10 transition-colors"
                      >
                        Edit Profile
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => { onDelete(student); setMenuOpen(false); }}
                        className="w-full px-4 py-2.5 text-sm text-left text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        Remove Profile
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-3 space-y-2">
              <ProgressBar
                value={overallPercent}
                label="Overall Progress"
                showPercent
                variant="gradient"
                size="sm"
                animated={false}
              />

              <div className="flex items-center gap-3 flex-wrap">
                <Badge variant="gold">
                  💎 {crystalsEarned}/100 Crystals
                </Badge>
                {streak > 0 && (
                  <Badge variant="green">
                    🔥 {streak} day streak
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-400" />
              {progress?.xp ?? 0} XP
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-blue-400" />
              {progress?.totalPlaytimeMinutes ?? 0}m played
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Link href={`/parent/students/${student.id}`}>
              <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-gray-300 text-sm font-medium transition-all active:scale-95">
                <FileText className="w-3.5 h-3.5" />
                Report
              </button>
            </Link>
            <button
              onClick={() => onPlay(student)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white text-sm font-semibold transition-all shadow-game-glow active:scale-95"
            >
              <Play className="w-4 h-4 fill-current" />
              Play
            </button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
