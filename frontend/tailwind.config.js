/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      animation: {
        zoomWipe: "zoomWipe 1.5s ease-in-out forwards",
      },
      keyframes: {
        zoomWipe: {
          "0%": {
            transform: "scale(0)",
            opacity: 1,
          },
          "100%": {
            transform: "scale(120)",
            opacity: 1,
          },
        },
      },
    },
  },
  plugins: [],
};
