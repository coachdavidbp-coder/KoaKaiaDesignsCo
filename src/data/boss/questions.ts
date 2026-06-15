export interface BossQuestion {
  id: string;
  subject: "reading" | "math" | "spelling" | "writing";
  emoji: string;
  question: string;
  choices: string[];
  answer: string;
  explanation: string;
}

export const BOSS_QUESTIONS: BossQuestion[] = [
  // ── Reading ────────────────────────────────────────────────────────
  {
    id: "boss-r1",
    subject: "reading",
    emoji: "📚",
    question: 'Which word means "very happy"?',
    choices: ["Angry", "Joyful", "Tired", "Scared"],
    answer: "Joyful",
    explanation: "'Joyful' means full of joy and happiness — just like you when you defeat the Fog!",
  },
  {
    id: "boss-r2",
    subject: "reading",
    emoji: "📖",
    question: "Which sentence is written CORRECTLY?",
    choices: [
      "the dog ran fast.",
      "The dog ran fast.",
      "The Dog ran fast",
      "the Dog ran fast!",
    ],
    answer: "The dog ran fast.",
    explanation: "Sentences start with a capital letter and end with a period. 'The dog ran fast.' is perfect!",
  },
  {
    id: "boss-r3",
    subject: "reading",
    emoji: "📚",
    question: "Koa read 6 pages before lunch and 5 pages after lunch. How many pages did she read in all?",
    choices: ["9", "10", "11", "12"],
    answer: "11",
    explanation: "6 + 5 = 11 pages. Koa is a reading champion!",
  },
  {
    id: "boss-r4",
    subject: "reading",
    emoji: "💬",
    question: "What does the word 'ancient' mean?",
    choices: ["Very new", "Very old", "Very fast", "Very big"],
    answer: "Very old",
    explanation: "'Ancient' means extremely old — like the Ancient Temple on Adventure Island!",
  },

  // ── Math ───────────────────────────────────────────────────────────
  {
    id: "boss-m1",
    subject: "math",
    emoji: "🔢",
    question: "What is 9 + 8?",
    choices: ["15", "16", "17", "18"],
    answer: "17",
    explanation: "9 + 8 = 17. Count on from 9: 10, 11, 12, 13, 14, 15, 16, 17!",
  },
  {
    id: "boss-m2",
    subject: "math",
    emoji: "⚡",
    question: "Turbo has 20 racing trophies. He gives 7 to Rex. How many does Turbo have left?",
    choices: ["11", "12", "13", "14"],
    answer: "13",
    explanation: "20 − 7 = 13 trophies. Subtract to find what's left!",
  },
  {
    id: "boss-m3",
    subject: "math",
    emoji: "🔢",
    question: "Which number is GREATER: 63 or 36?",
    choices: ["36", "63", "They are equal", "Cannot tell"],
    answer: "63",
    explanation: "63 > 36 because 63 has 6 tens while 36 only has 3 tens. Check the tens place first!",
  },
  {
    id: "boss-m4",
    subject: "math",
    emoji: "🔢",
    question: "Count by 5s: 5, 10, 15, ___, 25",
    choices: ["18", "19", "20", "22"],
    answer: "20",
    explanation: "Skip counting by 5s: 5, 10, 15, 20, 25. The pattern always goes up by 5!",
  },
  {
    id: "boss-m5",
    subject: "math",
    emoji: "🏗️",
    question: "What number has 4 TENS and 7 ONES?",
    choices: ["74", "47", "407", "4 + 7"],
    answer: "47",
    explanation: "4 tens = 40, plus 7 ones = 47. You've mastered place value!",
  },

  // ── Spelling ───────────────────────────────────────────────────────
  {
    id: "boss-s1",
    subject: "spelling",
    emoji: "✏️",
    question: "Which word is spelled CORRECTLY?",
    choices: ["becaus", "becuase", "because", "bekause"],
    answer: "because",
    explanation: "B-E-C-A-U-S-E. 'Because' is a super important sight word!",
  },
  {
    id: "boss-s2",
    subject: "spelling",
    emoji: "✏️",
    question: "Which word has a SILENT E that makes the vowel say its name?",
    choices: ["cat", "dog", "cake", "fish"],
    answer: "cake",
    explanation: "In 'cake', the silent e at the end makes the 'a' say its name: /k-AY-k/!",
  },
  {
    id: "boss-s3",
    subject: "spelling",
    emoji: "🌟",
    question: "Which word means 'shining with light'?",
    choices: ["Dark", "Bright", "Slow", "Quiet"],
    answer: "Bright",
    explanation: "B-R-I-G-H-T. Bright means full of light — like your 100 Knowledge Crystals!",
  },

  // ── Writing / Grammar ──────────────────────────────────────────────
  {
    id: "boss-w1",
    subject: "writing",
    emoji: "📝",
    question: "Which sentence uses the CORRECT punctuation at the end?",
    choices: [
      "Are you ready to fight the Fog.",
      "Are you ready to fight the Fog?",
      "Are you ready to fight the Fog!",
      "are you ready to fight the Fog?",
    ],
    answer: "Are you ready to fight the Fog?",
    explanation: "Questions end with a question mark (?). It also starts with a capital A!",
  },
  {
    id: "boss-w2",
    subject: "writing",
    emoji: "📝",
    question: "Which word is a DESCRIBING word (adjective)?",
    choices: ["Run", "Purple", "Jump", "Sing"],
    answer: "Purple",
    explanation: "Adjectives describe nouns. 'Purple' describes what something looks like — great for describing the Fog!",
  },
  {
    id: "boss-w3",
    subject: "writing",
    emoji: "📝",
    question: "Which group of words makes a COMPLETE sentence?",
    choices: [
      "The brave explorer.",
      "Ran through the forest.",
      "The brave explorer ran.",
      "Quickly and fast.",
    ],
    answer: "The brave explorer ran.",
    explanation: "A complete sentence needs a subject (who) and a verb (what they do). 'The brave explorer ran' has both!",
  },
];

export function getBossQuestions(count: number = 10): BossQuestion[] {
  const shuffled = [...BOSS_QUESTIONS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}
