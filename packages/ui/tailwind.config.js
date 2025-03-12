/** @type {import('tailwindcss').Config} */
import containerQueries from "@tailwindcss/container-queries";
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {},
  },
  // darkMode: "selector",
  plugins: [containerQueries],
};
