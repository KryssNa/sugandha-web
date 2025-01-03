import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "#FA6800",
        primaryLight: "#FF9F29",
        secondaryLight: "#DAA520",
        primaryDark: "#222222",
        secondaryBg: "#211f49",
        secondaryText: "#211f49",
        red: "#DC2626",
        green: "#27AE60",
        grey: "F1F1F1",
      },
      animation: {
        "spin-slow": "spin 20s linear infinite",
      },
      fontFamily: {
        dancing: ['"Dancing Script"', "cursive"],
        exo: ["Exo", "sans-serif"],
        inter: ["Inter", "sans-serif"],
        outfit: ["Outfit", "sans-serif"],
        quicksand: ["Quicksand", "sans-serif"],
        primary: ["Quicksand", "sans-serif"],
      },
      width: {
        "custom-width": "425px",
      },
      backgroundImage: {
        "gift": "url('/assets/images/additional/gift.svg')",
        "giftwrapper": "url('/assets/images/additional/gift_wrapper.svg')",
        "luxury": "url('/assets/images/additional/luxury.svg')",
        "scent_bg": "url('/assets/images/additional/scent_bg.svg')",
      },
    },
  },
  plugins: [],
} satisfies Config;
