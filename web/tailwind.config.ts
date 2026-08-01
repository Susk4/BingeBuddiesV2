import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      display: ["var(--font-display)", "system-ui", "sans-serif"],
    },
    extend: {
      colors: {
        void: "#0a0a0c",
        surface: {
          DEFAULT: "#141418",
          raised: "#1c1c22",
          overlay: "#26262e",
        },
        ink: {
          DEFAULT: "#f4f4f5",
          muted: "#a1a1aa",
          faint: "#71717a",
        },
        brand: {
          DEFAULT: "#7c5cff",
          dim: "#5b3fd4",
        },
        gold: {
          DEFAULT: "#f5c518",
          dim: "#c9a012",
        },
        line: "rgba(255, 255, 255, 0.1)",
      },
      boxShadow: {
        card: "0 12px 40px rgba(0, 0, 0, 0.55)",
        poster: "0 4px 24px rgba(0, 0, 0, 0.65)",
      },
    },
  },
  plugins: [],
};

export default config;
