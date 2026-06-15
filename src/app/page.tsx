"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/Button";
import { Sparkles, Shield, Star, Zap } from "lucide-react";

const FEATURES = [
  { icon: "📚", title: "Reading Adventures", desc: "Stories that grow with your child" },
  { icon: "🔢", title: "Math Missions", desc: "Visual puzzles, no worksheets" },
  { icon: "✏️", title: "Spelling Academy", desc: "Adaptive word learning" },
  { icon: "🎮", title: "100 Crystals", desc: "Earn rewards as you learn" },
];

export default function HomePage() {
  const { firebaseUser, isInitialized } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (isInitialized && firebaseUser) {
      router.push("/parent");
    }
  }, [isInitialized, firebaseUser, router]);

  return (
    <main className="relative min-h-screen bg-hero-gradient overflow-hidden">
      <div className="star-field" />

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <nav className="flex items-center justify-between p-6 max-w-6xl mx-auto w-full">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌟</span>
            <span className="font-bold text-white">Summer Quest</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">Sign In</Button>
            </Link>
            <Link href="/register">
              <Button size="sm" leftIcon={<Sparkles className="w-4 h-4" />}>
                Get Started
              </Button>
            </Link>
          </div>
        </nav>

        <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl"
          >
            <div className="text-7xl md:text-9xl mb-6 animate-float inline-block">🏝️</div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
              Summer Quest
              <span className="block text-2xl md:text-3xl mt-2 bg-clip-text text-transparent bg-crystal-gradient">
                The Road to 2nd Grade
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              An epic adventure where every battle teaches reading, spelling, math, and writing.
              Collect <span className="text-amber-400 font-bold">100 Knowledge Crystals</span> and
              defeat <span className="text-purple-400 font-bold">The Forgetful Fog</span>!
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href="/register">
                <Button size="xl" leftIcon={<Zap className="w-5 h-5" />} className="w-full sm:w-auto">
                  Start the Adventure
                </Button>
              </Link>
              <Link href="/login">
                <Button size="xl" variant="ghost" className="w-full sm:w-auto">
                  Parent Sign In
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
              {FEATURES.map((f, i) => (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-sm"
                >
                  <div className="text-3xl mb-2">{f.icon}</div>
                  <p className="text-sm font-semibold text-white">{f.title}</p>
                  <p className="text-xs text-gray-500 mt-1">{f.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="relative z-10 border-t border-white/5 py-8 px-6">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-blue-400" />
              <span>COPPA Compliant &bull; No Ads &bull; Parent-Controlled</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-400" />
              <span>Aligned with 1st Grade Standards &bull; 40-60 Hours of Learning</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
