import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Earthy palette: village/agriculture themed, not generic SaaS blue
        clay: {
          50: "#FBF6EF",
          100: "#F3E6D0",
          200: "#E5C99A",
          300: "#D4A85F",
          400: "#BE8839",
          500: "#A06B28",
          600: "#7E521F",
        },
        leaf: {
          50: "#F1F6EC",
          100: "#DCEBCC",
          200: "#B7D69B",
          300: "#8FBE6A",
          400: "#5F9A3D",
          500: "#447A2A",
          600: "#335E20",
        },
        ink: "#2B2420",
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
