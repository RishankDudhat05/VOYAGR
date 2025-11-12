/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: ["class"], // enables dark/light mode via the 'dark' class
  theme: {
    extend: {
      colors: {
        mywhite: "#f7fbfa",
        myblack: "#282d33",
        myred: "#ed4343",
      },
    },
  },
  plugins: [],
};
