import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0e0e0e", // Deep Obsidian
        foreground: "#ffffff",
        primary: {
          DEFAULT: "#00ffff", // Neon Cyan
          dim: "#00e6e6",
          fixed: "#00f5f5",
        },
        secondary: {
          DEFAULT: "#0deafc",
          dim: "#00dbec",
          container: "#006972",
        },
        tertiary: {
          DEFAULT: "#63baff",
          dim: "#2ea5f3",
        },
        surface: {
          DEFAULT: "#0e0e0e",
          bright: "#2c2c2c",
          container: "#1a1919",
          "container-high": "#201f1f",
          "container-highest": "#262626",
          "container-low": "#131313",
          "container-lowest": "#000000",
          dim: "#0e0e0e",
          variant: "#262626",
        },
      },
      fontFamily: {
        sans: ["var(--font-manrope)", "sans-serif"],
        display: ["var(--font-space-grotesk)", "sans-serif"],
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
        "3xl": "2rem",
      },
      animation: {
        "glow-pulse": "glow-pulse 4s infinite",
        "fade-in-up": "fade-in-up 0.8s ease-out forwards",
      },
      keyframes: {
        "glow-pulse": {
          "0%, 100%": { opacity: "0.8", filter: "blur(20px)" },
          "50%": { opacity: "1", filter: "blur(40px)" },
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
