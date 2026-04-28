import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./hooks/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ritual: {
          black: "#000000",
          elevated: "#111827",
          surface: "#1F2937",
          green: "#19D184",
          lime: "#BFFF00",
          pink: "#FF1DCE",
          gold: "#FACC15",
          red: "#EF4444",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "Inter", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "Fira Code", "monospace"],
      },
      boxShadow: {
        "glow-green": "0 0 30px -5px rgba(25, 209, 132, 0.25)",
        "glow-pink": "0 0 30px -5px rgba(255, 29, 206, 0.2)",
        "glow-gold": "0 0 20px -5px rgba(250, 204, 21, 0.2)",
        card: "0 4px 40px -12px rgba(0, 0, 0, 0.5)",
      },
      animation: {
        "pulse-green": "pulse-green 2s ease-in-out infinite",
        float: "float 4s ease-in-out infinite",
        "fade-in": "fade-in 0.4s ease-out both",
        shimmer: "shimmer 2s linear infinite",
        "spin-slow": "spin 8s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
