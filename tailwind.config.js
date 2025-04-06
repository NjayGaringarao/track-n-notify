/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#87CEFC",
        background: "#fff",
        secondary: "#16404D",
        panel: "#A6CDC6",
        uBlack: "#1f2937",
        uGray: "#4b5563",
        uGrayLight: "#9ca3af",
        success: "#10B981",
        failed: "#dc2626",
        pending: "#9ca3af",
        processing: "#3b82f6",
        forPickup: "#f97316",
        complete: "#22c55e",
      },
    },
  },
  plugins: [],
};
