/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        "dash-back": "url('./src/Assets/Svgs/Background.svg')",
      },
      fontFamily: {
        cursive: ['"Edu NSW ACT Cursive"', "cursive"],
        nunito: ['"Nunito"', "sens-serif"],
      },
      screens: {
        xs: "500px",
      },
    },
  },
plugins: [require("daisyui")],

};
