"use client";

import { motion } from "framer-motion";
import { StoryPage, VocabWord } from "@/types/reading";
import { cn } from "@/lib/utils/cn";

interface PageDisplayProps {
  page: StoryPage;
  vocabulary: VocabWord[];
  currentWordIndex: number;
  learnedWords: string[];
  onWordTap: (word: VocabWord) => void;
  theme: { primary: string; secondary: string };
}

function parseWords(text: string): Array<{ raw: string; clean: string; lineBreak?: boolean }> {
  const lines = text.split("\n");
  const result: Array<{ raw: string; clean: string; lineBreak?: boolean }> = [];
  lines.forEach((line, li) => {
    const words = line.split(/(\s+)/);
    words.forEach((chunk) => {
      if (/^\s+$/.test(chunk)) return;
      const clean = chunk.replace(/[.,!?;:"'"'…—\-]/g, "").toLowerCase();
      result.push({ raw: chunk, clean });
    });
    if (li < lines.length - 1) result.push({ raw: "\n", clean: "", lineBreak: true });
  });
  return result;
}

export function PageDisplay({
  page,
  vocabulary,
  currentWordIndex,
  learnedWords,
  onWordTap,
  theme,
}: PageDisplayProps) {
  const vocabMap = new Map(vocabulary.map((v) => [v.word.toLowerCase(), v]));
  const words = parseWords(page.text);
  let wordCounter = 0;

  return (
    <motion.div
      key={page.pageNumber}
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="flex flex-col h-full"
    >
      <div
        className="flex items-center justify-center gap-2 py-8 mb-2 rounded-2xl relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${theme.primary}15, ${theme.secondary}08)`,
          minHeight: "160px",
        }}
      >
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `radial-gradient(circle at 50% 50%, ${theme.primary}, transparent 70%)`,
          }}
        />
        {page.scene.map((emoji, i) => (
          <motion.span
            key={i}
            className="relative"
            style={{
              fontSize: i === 1 ? "4.5rem" : i === 0 ? "3.5rem" : "3rem",
              filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.5))",
            }}
            animate={{ y: [0, i % 2 === 0 ? -4 : 4, 0] }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.3,
            }}
          >
            {emoji}
          </motion.span>
        ))}
      </div>

      <div className="flex-1 flex items-center justify-center px-2">
        <p className="text-xl sm:text-2xl leading-relaxed tracking-wide text-center text-white font-medium max-w-prose">
          {words.map((w, i) => {
            if (w.lineBreak) return <br key={i} />;
            const thisIndex = wordCounter++;
            const isCurrentWord = currentWordIndex === thisIndex;
            const vocabDef = vocabMap.get(w.clean);
            const isVocab = !!vocabDef;
            const isLearned = learnedWords.includes(w.clean);

            return (
              <span key={i}>
                <span
                  onClick={() => isVocab && vocabDef && onWordTap(vocabDef)}
                  className={cn(
                    "transition-all duration-100 rounded-sm px-0.5",
                    isCurrentWord && "bg-yellow-400 text-gray-900 rounded-md px-1 -mx-0.5",
                    !isCurrentWord && isVocab && isLearned && "underline decoration-emerald-400 decoration-2 cursor-pointer",
                    !isCurrentWord && isVocab && !isLearned && "underline decoration-blue-400 decoration-dotted underline-offset-2 cursor-pointer",
                    !isCurrentWord && !isVocab && "cursor-default"
                  )}
                  style={
                    isCurrentWord
                      ? undefined
                      : isVocab
                      ? { color: theme.primary }
                      : undefined
                  }
                >
                  {w.raw}
                </span>
                {" "}
              </span>
            );
          })}
        </p>
      </div>
    </motion.div>
  );
}
