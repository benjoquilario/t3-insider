/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#6a55fa",
        background: {
          DEFAULT: "#000000",
          900: "#111",
          800: "#0d0d0d",
          700: "#100f0f",
          600: "#1b1919",
        },
      },
    },
  },
  plugins: [
    require("@tailwindcss/aspect-ratio"),
    require("tailwind-scrollbar-hide"),
    require("tailwind-scrollbar"),
  ],
};
