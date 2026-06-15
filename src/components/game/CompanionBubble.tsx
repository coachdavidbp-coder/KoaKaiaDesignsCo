"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AvatarCharacter } from "@/types/user";
import { COMPANIONS, getCompanionMessage } from "@/types/companion";
import { Avatar } from "@/components/ui/Avatar";

interface CompanionBubbleProps {
  character: AvatarCharacter;
  color: import("@/types/user").AvatarColor;
  context?: "greeting" | "encouragement" | "idle";
  className?: string;
}

export function CompanionBubble({
  character,
  color,
  context = "greeting",
  className,
}: CompanionBubbleProps) {
  const [message, setMessage] = useState(() => getCompanionMessage(character, context));
  const [visible, setVisible] = useState(true);
  const companion = COMPANIONS[character];

  useEffect(() => {
    const t = setTimeout(() => setVisible(false), 6000);
    return () => clearTimeout(t);
  }, []);

  const handleClick = () => {
    setMessage(getCompanionMessage(character, "idle"));
    setVisible(true);
    const t = setTimeout(() => setVisible(false), 5000);
    return () => clearTimeout(t);
  };

  return (
    <div className={`flex items-end gap-2 ${className ?? ""}`}>
      <button
        onClick={handleClick}
        className="shrink-0 hover:scale-110 transition-transform active:scale-95"
        aria-label={`${companion.name} companion`}
      >
        <div
          className="rounded-2xl border-2 p-0.5"
          style={{
            borderColor: companion.color + "60",
            boxShadow: `0 0 16px ${companion.glow}`,
          }}
        >
          <Avatar character={character} color={color} size="md" />
        </div>
      </button>

      <AnimatePresence>
        {visible && (
          <motion.div
            className="relative max-w-[220px] sm:max-w-xs"
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            <div
              className="absolute left-0 bottom-4 w-0 h-0"
              style={{
                borderRight: "8px solid transparent",
                borderTop: "8px solid transparent",
                borderBottom: `8px solid ${companion.color}20`,
                transform: "translateX(-8px)",
              }}
            />
            <div
              className="relative px-4 py-3 rounded-2xl rounded-bl-sm border text-sm text-white font-medium leading-snug"
              style={{
                background: `linear-gradient(135deg, ${companion.color}15, rgba(17,24,39,0.9))`,
                borderColor: companion.color + "30",
                backdropFilter: "blur(8px)",
              }}
            >
              {message}
              <div className="mt-1 text-xs opacity-60">— {companion.name}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
