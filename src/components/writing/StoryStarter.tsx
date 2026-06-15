"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Send, ChevronLeft } from "lucide-react";
import { StoryStarterActivity } from "@/types/writing";

interface StoryStarterProps {
  activities: StoryStarterActivity[];
  onSubmit: (activity: StoryStarterActivity, text: string) => void;
  theme: { primary: string; secondary: string };
}

type StarterPhase = "pick" | "write" | "done";

export function StoryStarter({ activities, onSubmit, theme }: StoryStarterProps) {
  const [phase, setPhase] = useState<StarterPhase>(activities.length === 1 ? "write" : "pick");
  const [selectedActivity, setSelectedActivity] = useState<StoryStarterActivity | null>(
    activities.length === 1 ? activities[0] : null
  );
  const [text, setText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
  const minWords = selectedActivity?.minWords ?? 20;
  const canSubmit = wordCount >= minWords;

  const handlePick = useCallback((a: StoryStarterActivity) => {
    setSelectedActivity(a);
    setText("");
    setPhase("write");
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!selectedActivity || !canSubmit || isSubmitting) return;
    setIsSubmitting(true);
    await onSubmit(selectedActivity, text);
    setPhase("done");
  }, [selectedActivity, canSubmit, isSubmitting, onSubmit, text]);

  if (phase === "pick") {
    return (
      <div className="flex flex-col gap-4 w-full max-w-sm mx-auto">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider text-center">
          Choose a story to write
        </p>
        {activities.map((a, i) => (
          <motion.button
            key={a.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            onClick={() => handlePick(a)}
            className="text-left p-5 rounded-3xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all active:scale-98"
          >
            <div className="flex gap-2 text-4xl mb-3">
              {a.scene.map((e, j) => <span key={j}>{e}</span>)}
            </div>
            <p className="text-sm font-medium text-gray-200 leading-relaxed">{a.prompt}</p>
            <p className="text-xs text-gray-500 mt-2">✏️ Write at least {a.minWords} words</p>
          </motion.button>
        ))}
      </div>
    );
  }

  if (phase === "done") {
    return (
      <div className="flex flex-col items-center gap-4 w-full max-w-sm mx-auto py-8 text-center">
        <div className="text-7xl">📖</div>
        <h2 className="text-2xl font-bold text-white">Story Saved!</h2>
        <p className="text-gray-400 text-sm">
          Your story has been saved. A parent can read it later!
        </p>
        <div className="flex gap-2 text-4xl mt-2">
          {selectedActivity?.scene.map((e, i) => <span key={i}>{e}</span>)}
        </div>
        <div className="mt-4 p-4 rounded-2xl bg-white/5 border border-white/10 text-left w-full">
          <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-2">Your Story</p>
          <p className="text-sm text-gray-200 leading-relaxed italic">{text}</p>
          <p className="text-xs text-gray-500 mt-2">{wordCount} words written</p>
        </div>
      </div>
    );
  }

  // write phase
  return (
    <div className="flex flex-col gap-4 w-full max-w-sm mx-auto">
      {activities.length > 1 && (
        <button
          onClick={() => setPhase("pick")}
          className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-300 font-medium transition-all self-start"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          Choose different story
        </button>
      )}

      {/* Scene + prompt */}
      <div
        className="p-5 rounded-2xl border"
        style={{
          background: `linear-gradient(135deg, ${theme.primary}12, transparent)`,
          borderColor: theme.primary + "30",
        }}
      >
        <div className="flex gap-2 text-3xl mb-3">
          {selectedActivity?.scene.map((e, i) => <span key={i}>{e}</span>)}
        </div>
        <p className="text-white font-medium text-sm leading-relaxed">
          {selectedActivity?.prompt}
        </p>
      </div>

      {/* Textarea */}
      <div className="relative">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Start writing your story here... Be creative! 🌟"
          rows={8}
          className="w-full rounded-2xl bg-white/5 border border-white/15 focus:border-blue-500/50 focus:outline-none text-white placeholder:text-gray-600 text-sm leading-relaxed p-4 resize-none transition-colors"
          style={{ fontFamily: "inherit" }}
        />
        <div className="absolute bottom-3 right-3 text-[11px] font-bold">
          <span className={wordCount >= minWords ? "text-emerald-400" : "text-gray-500"}>
            {wordCount}
          </span>
          <span className="text-gray-600">/{minWords} words</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          animate={{ width: `${Math.min(100, (wordCount / minWords) * 100)}%` }}
          transition={{ duration: 0.3 }}
          style={{ backgroundColor: canSubmit ? "#10B981" : theme.primary }}
        />
      </div>

      {!canSubmit && (
        <p className="text-xs text-gray-500 text-center">
          Keep writing! {minWords - wordCount} more word{minWords - wordCount !== 1 ? "s" : ""} to go.
        </p>
      )}

      <motion.button
        onClick={handleSubmit}
        disabled={!canSubmit || isSubmitting}
        whileTap={canSubmit ? { scale: 0.97 } : undefined}
        className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-sm transition-all"
        style={
          canSubmit
            ? { background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`, color: "#000" }
            : { background: "rgba(255,255,255,0.05)", color: "#6B7280", cursor: "not-allowed" }
        }
      >
        <Send className="w-4 h-4" />
        {isSubmitting ? "Saving..." : "Submit My Story! 🌟"}
      </motion.button>
    </div>
  );
}
