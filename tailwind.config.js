/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme:  {
    extend: {
      colors: {
        "so-orange": "#f48225",
        "so-black": "#242729",
        "so-gray": {
          100: "#f8f9f9",
          200: "#e4e6e8",
          300: "#d6d9dc",
          400: "#babfc4",
          500: "#848d95",
          600: "#6a737c",
          700: "#535a60",
          800: "#3c4146",
          900: "#242729",
        },
        "so-blue": {
          100: "#e1ecf4",
          500: "#0095ff",
          600: "#0077cc",
          700: "#0064bd",
        },
      },
    },
  },
  plugins: [],
};

