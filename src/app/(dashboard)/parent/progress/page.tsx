"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BarChart2, TrendingUp } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useStudents } from "@/hooks/useStudents";
import { getStudentProgress } from "@/lib/firebase/firestore";
import { StudentProgress, getReadinessLabel, getReadinessLevel } from "@/types/progress";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { ProgressSummary } from "@/components/dashboard/ProgressSummary";
import { Avatar } from "@/components/ui/Avatar";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export default function ProgressPage() {
  const { profile } = useAuth();
  const { students, loadStudents } = useStudents(profile?.uid);
  const [progressMap, setProgressMap] = useState<Record<string, StudentProgress>>({});
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (profile?.uid) loadStudents();
  }, [profile?.uid, loadStudents]);

  useEffect(() => {
    if (students.length === 0) return;
    setIsLoading(true);
    Promise.all(
      students.map(async (s) => {
        const p = await getStudentProgress(s.id);
        return [s.id, p] as [string, StudentProgress | null];
      })
    ).then((results) => {
      const map: Record<string, StudentProgress> = {};
      results.forEach(([id, p]) => { if (p) map[id] = p; });
      setProgressMap(map);
      if (students[0]) setSelectedId(students[0].id);
      setIsLoading(false);
    });
  }, [students]);

  const selectedStudent = students.find((s) => s.id === selectedId);
  const selectedProgress = selectedId ? progressMap[selectedId] : null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-1">
          <BarChart2 className="w-6 h-6 text-blue-400" />
          <h1 className="text-2xl font-bold text-white">Learning Progress</h1>
        </div>
        <p className="text-gray-400">Track mastery and growth across all skill areas</p>
      </motion.div>

      {isLoading ? (
        <div className="py-16 flex justify-center">
          <LoadingSpinner size="lg" label="Loading progress..." />
        </div>
      ) : students.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="text-5xl mb-4">📊</div>
          <p className="text-gray-400">Create an explorer profile to see progress reports.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="space-y-2">
            <p className="text-xs font-medium text-gray-500 uppercase mb-3">Explorers</p>
            {students.map((s) => {
              const p = progressMap[s.id];
              return (
                <button
                  key={s.id}
                  onClick={() => setSelectedId(s.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-2xl border transition-all ${
                    selectedId === s.id
                      ? "border-blue-500/50 bg-blue-500/10"
                      : "border-white/10 bg-white/5 hover:border-white/20"
                  }`}
                >
                  <Avatar character={s.avatar.character} color={s.avatar.color} size="sm" />
                  <div className="text-left min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{s.displayName}</p>
                    <p className="text-xs text-gray-500">{Math.round(p?.overallPercent ?? 0)}% complete</p>
                  </div>
                </button>
              );
            })}

            {students.length > 1 && (
              <Card className="p-3 mt-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-medium text-gray-300">All Explorers</span>
                </div>
                {students.map((s) => {
                  const p = progressMap[s.id];
                  const pct = Math.round(p?.overallPercent ?? 0);
                  return (
                    <div key={s.id} className="mb-2">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-400 truncate">{s.displayName}</span>
                        <span className="text-gray-300 font-medium">{pct}%</span>
                      </div>
                      <ProgressBar value={pct} size="sm" animated={false} />
                    </div>
                  );
                })}
              </Card>
            )}
          </div>

          <div className="lg:col-span-3">
            {selectedStudent && selectedProgress ? (
              <ProgressSummary progress={selectedProgress} studentName={selectedStudent.displayName} />
            ) : (
              <Card className="p-12 text-center">
                <p className="text-gray-400">Select an explorer to view their progress</p>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
