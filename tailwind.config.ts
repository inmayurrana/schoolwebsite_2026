import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        school: {
          primary: "#0A2540",
          "primary-dark": "#051322",
          "primary-light": "#153d66",
          secondary: "#0066FF",
          "secondary-hover": "#0052cc",
          "secondary-light": "#e0edff",
          accent: "#F4B400",
          "accent-hover": "#d99f00",
          "accent-light": "#fff8e6",
          bg: "#F8FAFC",
          card: "#FFFFFF",
          "card-dark": "#0d1f33",
          border: "#E2E8F0",
          text: "#1E293B",
          "text-muted": "#64748B",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "sans-serif"],
        heading: ["var(--font-poppins)", "Poppins", "sans-serif"],
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(10, 37, 64, 0.08)",
        "glass-lg": "0 20px 40px 0 rgba(10, 37, 64, 0.12)",
        "glow-accent": "0 0 25px rgba(244, 180, 0, 0.35)",
        "glow-blue": "0 0 25px rgba(0, 102, 255, 0.35)",
      },
      animation: {
        "float-slow": "float 6s ease-in-out infinite",
        "pulse-glow": "pulseGlow 3s infinite",
        "marquee": "marquee 35s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.6", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.05)" },
        },
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
