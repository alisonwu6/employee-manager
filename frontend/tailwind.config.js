/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#6096B4",
          light:"#B1CCDA",
          dark: "#144F6F",
        },
        secondary: {},
      },
    },
  },
  plugins: [],
};
