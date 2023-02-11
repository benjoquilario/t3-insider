/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        banner:
          "grey 0px 11px 0px -10px inset, rgb(17 17 17) 0px -110px 50px -10px inset",
      },
      backgroundImage: {
        shadow:
          "linear-gradient(180deg, rgba(0, 0, 0, 0) 40%, rgba(0, 0, 0, .8))",
      },
      colors: {
        primary: "#6a55fa",
        secondary: "#8877fb",
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
