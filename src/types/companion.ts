import { AvatarCharacter } from "./user";

export interface CompanionDefinition {
  id: AvatarCharacter;
  name: string;
  emoji: string;
  specialty: string;
  personality: string;
  color: string;
  glow: string;
  greetings: string[];
  encouragements: string[];
  levelStartMessages: string[];
  wrongAnswerMessages: string[];
  levelCompleteMessages: string[];
  idleMessages: string[];
}

export const COMPANIONS: Record<AvatarCharacter, CompanionDefinition> = {
  koa: {
    id: "koa",
    name: "Koa",
    emoji: "🧒",
    specialty: "All Skills",
    personality: "Brave & Adventurous",
    color: "#3B82F6",
    glow: "rgba(59,130,246,0.4)",
    greetings: [
      "Ready for today's adventure?",
      "Let's go explore Adventure Island!",
      "I've been waiting for you!",
    ],
    encouragements: ["You've got this!", "Keep going, explorer!", "Amazing work!"],
    levelStartMessages: ["Let's do this!", "Adventure awaits!"],
    wrongAnswerMessages: ["Let's try that again!", "We can figure this out!"],
    levelCompleteMessages: ["WE DID IT!", "Adventure complete!"],
    idleMessages: ["What are we waiting for?", "Let's go!"],
  },
  mia: {
    id: "mia",
    name: "Mia",
    emoji: "🐕",
    specialty: "Hints & Encouragement",
    personality: "Loyal & Enthusiastic",
    color: "#F59E0B",
    glow: "rgba(245,158,11,0.4)",
    greetings: [
      "Woof woof! Great to see you! 🐾",
      "I missed you so much! Let's play and learn!",
      "You're my favorite explorer! Ready to go?",
      "I saved your spot on the adventure trail!",
    ],
    encouragements: [
      "You're doing SO great! *happy tail wag* 🐾",
      "I believe in you! *licks your face*",
      "That was AMAZING! You're the best explorer ever!",
      "Keep going! Every crystal counts! 💎",
    ],
    levelStartMessages: [
      "I'll be right beside you the whole way!",
      "Together we can do anything! Let's go!",
      "I can smell adventure from here! Exciting!",
    ],
    wrongAnswerMessages: [
      "Hmm, let me help you figure that out!",
      "No worries! Let's look at it together.",
      "You almost had it! Try one more time!",
    ],
    levelCompleteMessages: [
      "AMAZING!! I knew you could do it! 🎉",
      "You're the best explorer in all of Adventure Island!",
      "WOOF WOOF! That was spectacular!!",
    ],
    idleMessages: [
      "I'm here if you need a hint! Just ask!",
      "*wags tail excitedly*",
      "Look at all those crystals waiting for us!",
    ],
  },
  turbo: {
    id: "turbo",
    name: "Turbo",
    emoji: "🚛",
    specialty: "Math Missions",
    personality: "High-Energy & Competitive",
    color: "#F97316",
    glow: "rgba(249,115,22,0.4)",
    greetings: [
      "VROOM VROOM! Ready to race through some math? ⚡",
      "Turbo's engines are RUNNING! Time to crush those numbers!",
      "Full speed ahead! Math won't know what hit it!",
    ],
    encouragements: [
      "TURBO SPEED! You're crushing it! 🏎️",
      "That's the FASTEST solving I've ever seen!",
      "YOU'RE ON FIRE! Don't stop now!",
      "Maximum power! MAXIMUM AWESOME!",
    ],
    levelStartMessages: [
      "On your marks... get set... LEARN!",
      "Math is just a race — and we're gonna WIN!",
      "Buckle up! We're going full speed!",
    ],
    wrongAnswerMessages: [
      "Even Turbo has to pit stop sometimes! Let's refuel!",
      "Redirect! Recalculate! We've got this!",
      "Wrong turn! No worries — TURBO REVERSES!",
    ],
    levelCompleteMessages: [
      "VROOM VROOM VROOM!!! WE SMASHED IT! 🏆",
      "NEW RECORD! You're the math CHAMPION!",
      "TURBO VICTORY!!! NOTHING CAN STOP US!",
    ],
    idleMessages: [
      "My engines are warming up... *vroom*",
      "Numbers are trembling at your power!",
      "Ready to race whenever you are! ⚡",
    ],
  },
  splash: {
    id: "splash",
    name: "Splash",
    emoji: "🐬",
    specialty: "Reading & Comprehension",
    personality: "Calm & Curious",
    color: "#0EA5E9",
    glow: "rgba(14,165,233,0.4)",
    greetings: [
      "Hello, wonderful reader! 🌊",
      "The ocean of stories is calling us!",
      "I found the most amazing story today! Want to read it together?",
    ],
    encouragements: [
      "You read that beautifully! 🌊",
      "Your understanding of stories is incredible!",
      "Dolphins do a flip when you read that well!",
      "The ocean is celebrating your reading skills!",
    ],
    levelStartMessages: [
      "Every great story starts with page one!",
      "Let the words wash over you like waves...",
      "I'll swim alongside you through every sentence!",
    ],
    wrongAnswerMessages: [
      "Let's dive deeper into that question...",
      "The answer is hiding in the story! Let's look together.",
      "Sometimes we need to re-read to find the treasure!",
    ],
    levelCompleteMessages: [
      "Magnificent! You understood every wave of that story! 🌊",
      "A perfect performance! The ocean applauds you!",
      "Your reading skills are as vast as the ocean!",
    ],
    idleMessages: [
      "The stories are waiting for us...",
      "*makes happy dolphin sounds*",
      "I love how much you love reading!",
    ],
  },
  rex: {
    id: "rex",
    name: "Rex",
    emoji: "🦕",
    specialty: "Spelling & Vocabulary",
    personality: "Silly & Excited",
    color: "#16A34A",
    glow: "rgba(22,163,74,0.4)",
    greetings: [
      "RAWR! I mean... hello! 🦕",
      "Rex is SO EXCITED to spell with you today!",
      "Did you know dinosaurs loved spelling? Well, THIS one does!",
    ],
    encouragements: [
      "RAWR means AMAZING in dinosaur! And you're AMAZING!",
      "Rex does a happy dinosaur stomp when you spell right! STOMP STOMP!",
      "You spelled that better than a DIPLODOCUS! That's very hard!",
      "ROAR-some job! Rex is so proud! 🦕",
    ],
    levelStartMessages: [
      "Dinosaurs never gave up! Neither will we!",
      "Ready to ROAR through some spelling? Let's go!",
      "Rex has been practicing words ALL day for this!",
    ],
    wrongAnswerMessages: [
      "Hmm, even T-Rex makes mistakes! Let's try again!",
      "Let's sound it out together... like a dinosaur!",
      "ROAR! Don't give up! Rex believes in you!",
    ],
    levelCompleteMessages: [
      "ROAR ROAR ROAR!!! You're a SPELLING CHAMPION! 🏆",
      "Rex is doing his VICTORY STOMP for you! STOMP STOMP STOMP!",
      "That was DINO-MITE! Get it? DINO-MITE! Ha!",
    ],
    idleMessages: [
      "*stomps around excitedly*",
      "Word! W-O-R-D! See? Rex can spell too!",
      "RAWR! Let's learn some awesome words today!",
    ],
  },
  thunder: {
    id: "thunder",
    name: "Coach Thunder",
    emoji: "🏈",
    specialty: "Problem Solving",
    personality: "Motivational & Strategic",
    color: "#EF4444",
    glow: "rgba(239,68,68,0.4)",
    greetings: [
      "CHAMPIONS show up EVERY day! And here you are! 🏆",
      "Listen up, team! Today we TRAIN and WIN!",
      "I don't coach quitters — and you're definitely NOT a quitter!",
    ],
    encouragements: [
      "THAT'S what I'm talking about! CHAMPIONSHIP PLAY!",
      "Every great champion started exactly where you are!",
      "PUSH THROUGH! Champions don't stop at hard!",
      "The scoreboard says: YOU ARE WINNING! 🏆",
    ],
    levelStartMessages: [
      "Game plan is simple: try your best, never quit!",
      "Every mission is a play in the championship game!",
      "Break! Ready? HIKE!",
    ],
    wrongAnswerMessages: [
      "Even champions miss plays! The key is we TRY AGAIN!",
      "Timeout! Let's draw up a new play!",
      "No great player made it without mistakes. Reset and GO!",
    ],
    levelCompleteMessages: [
      "TOUCHDOWN!! That's how CHAMPIONS do it!! 🏆",
      "I'm calling this one the greatest play of the summer!",
      "THE CROWD GOES WILD! And so does Coach Thunder!",
    ],
    idleMessages: [
      "Remember: practice makes permanent!",
      "Winners prepare — are you ready to prepare?",
      "Clock is running! Let's GO! ⏱️",
    ],
  },
  builder: {
    id: "builder",
    name: "Builder Bot",
    emoji: "🤖",
    specialty: "Logic & Patterns",
    personality: "Logical & Methodical",
    color: "#8B5CF6",
    glow: "rgba(139,92,246,0.4)",
    greetings: [
      "BEEP BOOP. Builder Bot ready. Let's build knowledge! ⚙️",
      "Processing... excellent learning partner detected!",
      "System initialized. All learning modules ready. BEEP!",
    ],
    encouragements: [
      "PROCESSING... EXCELLENT ANSWER DETECTED! BEEP! ⚙️",
      "Logic circuits: IMPRESSED. That was perfect thinking!",
      "Builder Bot gives you: 5 out of 5 gears! TOP RATING!",
      "BEEP BOOP! Your brain is more powerful than Builder Bot!",
    ],
    levelStartMessages: [
      "Mission parameters set. Beginning learning sequence.",
      "Builder Bot will build this with you, step by step!",
      "Every big build starts with one block. Let's place it!",
    ],
    wrongAnswerMessages: [
      "Incorrect input detected. Recalibrating... try again!",
      "BEEP! Analyzing error... solution found! Let me show you.",
      "Builder Bot makes mistakes too. That is how we improve!",
    ],
    levelCompleteMessages: [
      "MISSION COMPLETE! BEEP BOOP BOOP! EXCELLENT WORK!",
      "Achievement unlocked: LOGIC MASTER! You're incredible!",
      "Processing results... PERFECT SCORE DETECTED! BEEEEEP! 🎉",
    ],
    idleMessages: [
      "BEEP. Builder Bot standing by.",
      "Calculating optimal learning path... please wait...",
      "All systems go! Your brain is ready for input! ⚙️",
    ],
  },
};

export function getCompanionMessage(
  companion: AvatarCharacter,
  type: "greeting" | "encouragement" | "idle"
): string {
  const def = COMPANIONS[companion];
  const messages =
    type === "greeting"
      ? def.greetings
      : type === "encouragement"
      ? def.encouragements
      : def.idleMessages;
  return messages[Math.floor(Math.random() * messages.length)];
}
