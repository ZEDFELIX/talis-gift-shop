import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0B0B0B",
        ivory: "#F7F1E7",
        gold: "#C9A45C",
        champagne: "#E4D1A5",
        espresso: "#241B16",
        beige: "#D8CBB8"
      },
      fontFamily: {
        serif: ['"Playfair Display"', "Georgia", "serif"],
        sans: ["Montserrat", "Segoe UI", "sans-serif"],
        script: ['"Great Vibes"', "cursive"]
      },
      boxShadow: {
        soft: "0 2px 16px rgba(36,27,22,0.07)",
        lift: "0 10px 32px rgba(36,27,22,0.13)",
        card: "0 1px 3px rgba(36,27,22,0.06)"
      },
      maxWidth: { shell: "80rem" },
      keyframes: {
        fadeUp: { from: { opacity: "0", transform: "translateY(14px)" }, to: { opacity: "1", transform: "none" } },
        fadeIn: { from: { opacity: "0" }, to: { opacity: "1" } },
        slideIn: { from: { transform: "translateX(100%)" }, to: { transform: "none" } }
      },
      animation: {
        fadeUp: "fadeUp .55s ease both",
        fadeIn: "fadeIn .4s ease both",
        slideIn: "slideIn .35s cubic-bezier(.22,.8,.36,1) both"
      }
    }
  },
  plugins: []
};
export default config;
