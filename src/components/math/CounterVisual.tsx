"use client";

import { motion } from "framer-motion";

interface CounterVisualProps {
  groups: number[];
  emoji: string;
  operation?: "+" | "−";
  showTotal?: boolean;
  totalEmoji?: string;
}

export function CounterVisual({ groups, emoji, operation = "+", showTotal, totalEmoji }: CounterVisualProps) {
  const MAX_PER_ROW = 5;

  return (
    <div className="flex items-center gap-3 flex-wrap justify-center">
      {groups.map((count, gi) => (
        <div key={gi} className="flex items-center gap-3">
          {gi > 0 && (
            <span className="text-2xl font-bold text-gray-400">{operation}</span>
          )}
          <div className="flex flex-wrap gap-1 justify-center" style={{ maxWidth: `${MAX_PER_ROW * 2.25}rem` }}>
            {Array.from({ length: count }).map((_, i) => (
              <motion.span
                key={i}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: gi * 0.15 + i * 0.04, type: "spring", stiffness: 400, damping: 15 }}
                className="text-2xl leading-none"
              >
                {emoji}
              </motion.span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
