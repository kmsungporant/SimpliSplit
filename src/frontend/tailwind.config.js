/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./screens/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "background-color": "#e1dad0",
        "Primary-color": "#2d7092",
        "Secondary-color": "#ebebeb",
        "Black-color": "#454545",
      },
    },
  },
  plugins: [],
};
