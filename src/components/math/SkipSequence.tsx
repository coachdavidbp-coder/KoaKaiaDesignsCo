"use client";

import { motion } from "framer-motion";

interface SkipSequenceProps {
  sequence: (number | null)[];
  theme: { primary: string; secondary: string };
}

export function SkipSequence({ sequence, theme }: SkipSequenceProps) {
  return (
    <div className="flex items-center gap-1.5 flex-wrap justify-center">
      {sequence.map((n, i) => (
        <div key={i} className="flex items-center gap-1.5">
          {i > 0 && <span className="text-gray-600 font-bold text-sm">,</span>}
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: i * 0.08 }}
            className="w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg border-2"
            style={
              n === null
                ? {
                    background: `linear-gradient(135deg, ${theme.primary}20, ${theme.secondary}10)`,
                    borderColor: theme.primary,
                    color: theme.primary,
                  }
                : {
                    background: "rgba(255,255,255,0.05)",
                    borderColor: "rgba(255,255,255,0.1)",
                    color: "#fff",
                  }
            }
          >
            {n === null ? "?" : n}
          </motion.div>
        </div>
      ))}
    </div>
  );
}
