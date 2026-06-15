"use client";

import { motion } from "framer-motion";

interface TensOnesVisualProps {
  tens: number;
  ones: number;
  theme: { primary: string; secondary: string };
}

export function TensOnesVisual({ tens, ones, theme }: TensOnesVisualProps) {
  return (
    <div className="flex items-end gap-4 justify-center">
      {tens > 0 && (
        <div className="flex flex-col items-center gap-1">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Tens</p>
          <div className="flex gap-1 flex-wrap justify-center" style={{ maxWidth: "100px" }}>
            {Array.from({ length: tens }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                className="w-6 h-14 rounded-lg flex flex-col items-center justify-center gap-0.5"
                style={{ backgroundColor: theme.primary + "30", border: `2px solid ${theme.primary}` }}
              >
                {Array.from({ length: 10 }).map((_, j) => (
                  <div key={j} className="w-2 h-1 rounded-full" style={{ backgroundColor: theme.primary }} />
                ))}
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {tens > 0 && ones > 0 && (
        <div className="w-px h-12 bg-white/20 self-center" />
      )}

      {ones > 0 && (
        <div className="flex flex-col items-center gap-1">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Ones</p>
          <div className="flex gap-1 flex-wrap justify-center" style={{ maxWidth: "80px" }}>
            {Array.from({ length: ones }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: tens * 0.1 + i * 0.08 }}
                className="w-6 h-6 rounded-full"
                style={{ backgroundColor: theme.secondary + "60", border: `2px solid ${theme.secondary}` }}
              />
            ))}
          </div>
        </div>
      )}

      {ones === 0 && tens > 0 && (
        <div className="flex flex-col items-center gap-1">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Ones</p>
          <div className="w-6 h-6 rounded-full border-2 border-dashed border-white/20" />
        </div>
      )}
    </div>
  );
}
