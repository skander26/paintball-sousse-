import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          red: "var(--red-primary)",
          dark: "var(--red-dark)",
          glow: "var(--red-glow)",
        },
        surface: {
          deep: "var(--black-deep)",
          DEFAULT: "var(--black-surface)",
          card: "var(--black-card)",
          border: "var(--black-border)",
        },
        muted: "var(--white-muted)",
      },
      fontFamily: {
        display: ["var(--font-bebas)", "sans-serif"],
        body: ["var(--font-rajdhani)", "sans-serif"],
        mono: ["var(--font-orbitron)", "sans-serif"],
      },
      backgroundImage: {
        "grain":
          "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.06'/%3E%3C/svg%3E\")",
      },
      boxShadow: {
        glow: "0 0 40px var(--red-glow)",
        card: "0 25px 80px rgba(0,0,0,0.55)",
      },
    },
  },
  plugins: [],
};
export default config;
