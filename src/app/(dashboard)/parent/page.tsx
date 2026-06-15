"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Users } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useStudents } from "@/hooks/useStudents";
import { useProgress } from "@/hooks/useProgress";
import { useProgressStore } from "@/store/progressStore";
import { getStudentProgress } from "@/lib/firebase/firestore";
import { StudentCard } from "@/components/dashboard/StudentCard";
import { AddStudentForm } from "@/components/dashboard/AddStudentForm";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { StudentProfile } from "@/types/user";
import { AvatarCharacter, AvatarColor } from "@/types/user";
import { StudentProgress } from "@/types/progress";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export default function ParentDashboardPage() {
  const { profile } = useAuth();
  const { students, isLoading, loadStudents, createStudent, archiveStudent, setActiveStudent } = useStudents(
    profile?.uid
  );
  const { setProgress } = useProgressStore();
  const router = useRouter();
  const [addOpen, setAddOpen] = useState(false);
  const [progressMap, setProgressMap] = useState<Record<string, StudentProgress>>({});
  const [loadingProgress, setLoadingProgress] = useState(false);

  useEffect(() => {
    if (profile?.uid) loadStudents();
  }, [profile?.uid, loadStudents]);

  useEffect(() => {
    if (students.length === 0) return;
    setLoadingProgress(true);
    Promise.all(
      students.map(async (s) => {
        const p = await getStudentProgress(s.id);
        if (p) setProgress(s.id, p);
        return [s.id, p] as [string, StudentProgress | null];
      })
    ).then((results) => {
      const map: Record<string, StudentProgress> = {};
      results.forEach(([id, p]) => { if (p) map[id] = p; });
      setProgressMap(map);
      setLoadingProgress(false);
    });
  }, [students, setProgress]);

  const handleCreateStudent = async (
    name: string,
    character: AvatarCharacter,
    color: AvatarColor,
    pin: string
  ) => {
    const student = await createStudent(name, character, color, pin);
    if (student) setAddOpen(false);
  };

  const handlePlay = (student: StudentProfile) => {
    setActiveStudent(student);
    router.push(`/student/${student.id}`);
  };

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-2xl md:text-3xl font-bold text-white">
          {greeting()}, {profile?.displayName?.split(" ")[0] ?? "Explorer"}! 👋
        </h1>
        <p className="text-gray-400 mt-1">
          Track your child&apos;s summer learning adventure
        </p>
      </motion.div>

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-400" />
          <h2 className="text-lg font-semibold text-white">Explorer Profiles</h2>
          <span className="text-sm text-gray-500">({students.length})</span>
        </div>
        <Button
          onClick={() => setAddOpen(true)}
          size="sm"
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Add Explorer
        </Button>
      </div>

      {isLoading ? (
        <div className="py-16 flex justify-center">
          <LoadingSpinner size="lg" label="Loading profiles..." />
        </div>
      ) : students.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Card
            variant="glass"
            className="p-12 text-center cursor-pointer hover:border-blue-500/30 transition-all"
            onClick={() => setAddOpen(true)}
          >
            <div className="text-6xl mb-4 animate-float inline-block">🗺️</div>
            <h3 className="text-xl font-bold text-white mb-2">No Explorers Yet!</h3>
            <p className="text-gray-400 mb-6">
              Create your child&apos;s explorer profile to begin the adventure.
            </p>
            <Button leftIcon={<Plus className="w-4 h-4" />}>
              Create First Explorer
            </Button>
          </Card>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {students.map((student, i) => (
              <StudentCard
                key={student.id}
                student={student}
                progress={progressMap[student.id]}
                onPlay={handlePlay}
                onDelete={archiveStudent ? () => archiveStudent(student.id) : undefined}
                index={i}
              />
            ))}
          </AnimatePresence>

          {students.length < 5 && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={() => setAddOpen(true)}
              className="border-2 border-dashed border-white/10 rounded-2xl p-8 flex flex-col items-center justify-center gap-3 text-gray-500 hover:text-gray-300 hover:border-blue-500/30 transition-all group"
            >
              <Plus className="w-8 h-8 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium">Add Explorer</span>
            </motion.button>
          )}
        </div>
      )}

      <Modal
        isOpen={addOpen}
        onClose={() => setAddOpen(false)}
        title="Create New Explorer"
        size="md"
      >
        <AddStudentForm
          onSubmit={handleCreateStudent}
          onCancel={() => setAddOpen(false)}
        />
      </Modal>
    </div>
  );
}
