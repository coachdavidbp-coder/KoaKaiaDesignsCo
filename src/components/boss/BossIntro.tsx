"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";

interface BossIntroProps {
  studentName: string;
  onReady: () => void;
}

export function BossIntro({ studentName, onReady }: BossIntroProps) {
  useEffect(() => {
    const t = setTimeout(onReady, 4000);
    return () => clearTimeout(t);
  }, [onReady]);

  return (
    <div
      className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6"
      style={{ background: "transparent" }}
    >
      {/* Fog reveal */}
      <motion.div
        className="text-9xl mb-6"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0, 1.2, 1], opacity: 1 }}
        transition={{ duration: 0.8, times: [0, 0.7, 1], type: "spring" }}
      >
        🌫️
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <p className="text-xs font-bold text-purple-400 uppercase tracking-widest mb-3">
          ⚠️ Final Challenge
        </p>
        <h1 className="text-3xl font-bold text-white mb-3">
          The Forgetful Fog
          <br />
          <span className="text-purple-300">Appears!</span>
        </h1>
        <p className="text-gray-400 text-sm max-w-xs leading-relaxed">
          The Fog is trying to steal all knowledge from Adventure Island.
          Use everything you've learned to defeat it, {studentName}!
        </p>
      </motion.div>

      <motion.div
        className="mt-8 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <div className="flex gap-3 text-sm text-gray-400">
          <span className="flex items-center gap-1">🛡️ 3 shields</span>
          <span className="flex items-center gap-1">⚔️ 10 questions</span>
          <span className="flex items-center gap-1">🎯 7 to win</span>
        </div>
        <motion.p
          className="text-purple-300 text-xs mt-4"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.2, repeat: Infinity }}
        >
          Get ready…
        </motion.p>
      </motion.div>
    </div>
  );
}
