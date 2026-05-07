import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#050506",
        panel: "#111114",
        line: "rgba(255,255,255,0.12)",
        volt: "#93ff70",
        signal: "#28f0d4",
        brass: "#f2b84b",
        smoke: "#b8bbc4"
      },
      boxShadow: {
        glow: "0 0 48px rgba(40, 240, 212, 0.18)",
        lift: "0 24px 80px rgba(0,0,0,0.45)"
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "Inter", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
};

export default config;
