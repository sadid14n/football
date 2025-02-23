/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#0D1321",
        secondary: "#FFB703",
        accent: "#D90429",
        success: "#2EC4B6",
        warning: "#FB8500",
        background: "#090C14",
        card: "#1B1F2B",
        textLight: "#CBD5E1",
        border: "#374151",
      },
    },
  },
  plugins: [],
};
