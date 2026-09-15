import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#071F17",
        forest: "#0B2B20",
        leaf: "#1E5C44",
        moss: "#3D8B66",
        ivory: "#FBF6EA",
        gold: "#E9B63C",
        champagne: "#F3E0A8",
        espresso: "#1C3026",
        beige: "#E4D6B8"
      },
      fontFamily: {
        serif: ['"Playfair Display"', "Georgia", "serif"],
        sans: ["Montserrat", "Segoe UI", "sans-serif"],
        script: ['"Great Vibes"', "cursive"]
      },
      boxShadow: {
        soft: "0 2px 16px rgba(7,31,23,0.07)",
        lift: "0 10px 32px rgba(7,31,23,0.14)",
        card: "0 1px 3px rgba(7,31,23,0.06)",
        glow: "0 8px 40px rgba(233,182,60,0.28)",
        emerald: "0 10px 44px rgba(30,92,68,0.35)"
      },
      maxWidth: { shell: "80rem" },
      keyframes: {
        fadeUp: { from: { opacity: "0", transform: "translateY(14px)" }, to: { opacity: "1", transform: "none" } },
        fadeIn: { from: { opacity: "0" }, to: { opacity: "1" } },
        slideIn: { from: { transform: "translateX(100%)" }, to: { transform: "none" } },
        glimmer: {
          "0%,100%": { opacity: "0.55" },
          "50%": { opacity: "1" }
        },
        pop: {
          "0%": { transform: "scale(0.92)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" }
        }
      },
      animation: {
        fadeUp: "fadeUp .55s ease both",
        fadeIn: "fadeIn .4s ease both",
        slideIn: "slideIn .35s cubic-bezier(.22,.8,.36,1) both",
        glimmer: "glimmer 3.2s ease-in-out infinite",
        pop: "pop .3s cubic-bezier(.22,.8,.36,1) both"
      }
    }
  },
  plugins: []
};
export default config;