/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./screens/**/*.{js,jsx,ts,tsx}",
    "./navigation/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./lib/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        ink: {
          50: "#f4f5f7",
          100: "#e8eaef",
          200: "#cfd3dc",
          300: "#a8aebc",
          400: "#7c8498",
          500: "#606882",
          600: "#4c546c",
          700: "#3e4558",
          800: "#353b4a",
          900: "#1e222c",
          950: "#12151c",
        },
        clay: {
          DEFAULT: "#c45c3e",
          muted: "#d67a5f",
          deep: "#9a4328",
        },
        mist: "#6b8f9a",
        paper: "#faf7f2",
      },
    },
  },
  darkMode: "class", // 
  plugins: [],
};
