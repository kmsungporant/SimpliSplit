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
        "background-color": "#18181b",
        "Primary-color": "#EC625F",
        "Secondary-color": "#ebebeb",
      },
    },
  },
  plugins: [],
};
