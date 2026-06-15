import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        game: {
          bg: "#06080F",
          surface: "#0D1117",
          card: "#111827",
          border: "#1F2937",
          primary: "#3B82F6",
          secondary: "#8B5CF6",
          accent: "#F59E0B",
          success: "#10B981",
          danger: "#EF4444",
          text: "#F9FAFB",
          muted: "#6B7280",
          glow: "#3B82F6",
        },
      },
      backgroundImage: {
        "game-gradient": "linear-gradient(135deg, #06080F 0%, #0D1117 50%, #111827 100%)",
        "card-gradient": "linear-gradient(135deg, rgba(59,130,246,0.1) 0%, rgba(139,92,246,0.1) 100%)",
        "hero-gradient": "linear-gradient(135deg, #1e1b4b 0%, #0f172a 50%, #0c1a3d 100%)",
        "crystal-gradient": "linear-gradient(135deg, #3B82F6 0%, #8B5CF6 50%, #EC4899 100%)",
        "gold-gradient": "linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)",
        "success-gradient": "linear-gradient(135deg, #10B981 0%, #34D399 100%)",
      },
      boxShadow: {
        "game-glow": "0 0 20px rgba(59,130,246,0.4), 0 0 40px rgba(59,130,246,0.2)",
        "purple-glow": "0 0 20px rgba(139,92,246,0.4), 0 0 40px rgba(139,92,246,0.2)",
        "gold-glow": "0 0 20px rgba(245,158,11,0.4)",
        "card": "0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)",
        "button": "0 4px 14px 0 rgba(59,130,246,0.4)",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
      fontFamily: {
        game: ["Inter", "system-ui", "sans-serif"],
        display: ["Inter", "system-ui", "sans-serif"],
      },
      animation: {
        "float": "float 3s ease-in-out infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "shimmer": "shimmer 2s linear infinite",
        "star-twinkle": "star-twinkle 1.5s ease-in-out infinite",
        "slide-up": "slide-up 0.3s ease-out",
        "slide-down": "slide-down 0.3s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
        "bounce-in": "bounce-in 0.5s cubic-bezier(0.68,-0.55,0.265,1.55)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "1", boxShadow: "0 0 20px rgba(59,130,246,0.4)" },
          "50%": { opacity: "0.8", boxShadow: "0 0 40px rgba(59,130,246,0.8)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "star-twinkle": {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.5", transform: "scale(0.8)" },
        },
        "slide-up": {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "slide-down": {
          "0%": { transform: "translateY(-10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "bounce-in": {
          "0%": { transform: "scale(0.3)", opacity: "0" },
          "50%": { transform: "scale(1.05)" },
          "70%": { transform: "scale(0.9)" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
      screens: {
        "ipad": "768px",
        "ipad-pro": "1024px",
      },
    },
  },
  plugins: [],
};

export default config;
