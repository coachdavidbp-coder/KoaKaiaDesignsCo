"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { useStudents } from "@/hooks/useStudents";
import { StudentProfile } from "@/types/user";
import { Avatar } from "@/components/ui/Avatar";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { AddStudentForm } from "@/components/dashboard/AddStudentForm";
import { AvatarCharacter, AvatarColor } from "@/types/user";
import { Plus, ArrowLeft, Hash } from "lucide-react";
import Link from "next/link";

export default function StudentSelectPage() {
  const router = useRouter();
  const { profile } = useAuth();
  const { students, isLoading, loadStudents, createStudent, selectStudent, setActiveStudent } =
    useStudents(profile?.uid);
  const [addOpen, setAddOpen] = useState(false);
  const [pinTarget, setPinTarget] = useState<StudentProfile | null>(null);
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState("");

  useEffect(() => {
    if (profile?.uid) loadStudents();
  }, [profile?.uid, loadStudents]);

  const handleStudentClick = (s: StudentProfile) => {
    setPinTarget(s);
    setPin("");
    setPinError("");
  };

  const handlePinDigit = (d: string) => {
    if (pin.length >= 4) return;
    const next = pin + d;
    setPin(next);
    if (next.length === 4) {
      setTimeout(() => verifyPin(next), 100);
    }
  };

  const verifyPin = async (entered: string) => {
    if (!pinTarget) return;
    const ok = await selectStudent(pinTarget.id, entered);
    if (ok) {
      router.push(`/student/${pinTarget.id}`);
    } else {
      setPinError("Incorrect PIN. Try again!");
      setPin("");
    }
  };

  const handleCreate = async (name: string, char: AvatarCharacter, color: AvatarColor, pin: string) => {
    const s = await createStudent(name, char, color, pin);
    if (s) setAddOpen(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/parent">
          <button className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-all">
            <ArrowLeft className="w-5 h-5" />
          </button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">Who&apos;s Playing?</h1>
          <p className="text-gray-400 text-sm">Select an explorer profile</p>
        </div>
      </div>

      {isLoading ? (
        <div className="py-16 flex justify-center">
          <LoadingSpinner size="lg" label="Loading profiles..." />
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          <AnimatePresence>
            {students.map((s, i) => (
              <motion.button
                key={s.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.08 }}
                onClick={() => handleStudentClick(s)}
                className="flex flex-col items-center gap-3 p-6 rounded-3xl border border-white/10 bg-white/5 hover:border-blue-500/50 hover:bg-blue-500/10 transition-all group active:scale-95"
              >
                <div className="group-hover:scale-110 transition-transform">
                  <Avatar character={s.avatar.character} color={s.avatar.color} size="xl" />
                </div>
                <p className="font-bold text-white text-center">{s.displayName}</p>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Hash className="w-3 h-3" />
                  <span>PIN required</span>
                </div>
              </motion.button>
            ))}
          </AnimatePresence>

          {students.length < 5 && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={() => setAddOpen(true)}
              className="flex flex-col items-center justify-center gap-3 p-6 rounded-3xl border-2 border-dashed border-white/10 text-gray-500 hover:text-gray-300 hover:border-blue-500/30 transition-all group"
            >
              <Plus className="w-10 h-10 group-hover:scale-110 transition-transform" />
              <p className="text-sm font-medium">Add Explorer</p>
            </motion.button>
          )}
        </div>
      )}

      <Modal
        isOpen={!!pinTarget}
        onClose={() => { setPinTarget(null); setPin(""); setPinError(""); }}
        size="sm"
      >
        {pinTarget && (
          <div className="p-6 text-center">
            <div className="mb-4">
              <Avatar character={pinTarget.avatar.character} color={pinTarget.avatar.color} size="xl" className="mx-auto mb-3" />
              <p className="text-lg font-bold text-white">{pinTarget.displayName}</p>
              <p className="text-sm text-gray-400">Enter your 4-digit PIN</p>
            </div>

            <div className="flex justify-center gap-3 mb-4">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center text-xl font-bold transition-all ${
                    pin.length > i
                      ? "border-blue-500 bg-blue-500/20 text-white"
                      : "border-white/20 bg-white/5 text-transparent"
                  }`}
                >
                  {pin.length > i ? "●" : "○"}
                </div>
              ))}
            </div>

            {pinError && (
              <motion.p
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-sm text-red-400 mb-3"
              >
                {pinError}
              </motion.p>
            )}

            <div className="grid grid-cols-3 gap-2 max-w-[200px] mx-auto">
              {["1","2","3","4","5","6","7","8","9","←","0","✓"].map((d) => (
                <button
                  key={d}
                  onClick={() => {
                    if (d === "←") setPin((p) => p.slice(0, -1));
                    else if (d === "✓") verifyPin(pin);
                    else handlePinDigit(d);
                  }}
                  className={`h-12 rounded-xl font-bold text-lg transition-all active:scale-95 ${
                    d === "✓"
                      ? "bg-blue-600 text-white hover:bg-blue-500"
                      : d === "←"
                      ? "bg-white/10 text-gray-300 hover:bg-white/20"
                      : "bg-white/5 border border-white/10 text-white hover:bg-white/10"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={addOpen}
        onClose={() => setAddOpen(false)}
        title="Create New Explorer"
        size="md"
      >
        <AddStudentForm onSubmit={handleCreate} onCancel={() => setAddOpen(false)} />
      </Modal>
    </div>
  );
}
