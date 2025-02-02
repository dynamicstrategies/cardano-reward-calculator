/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],

  theme: {
    extend: {
      colors: {
        "blue-primary": "#264BAF",
        "cardano-blue": "#264BAF",
      }
    },
  },
  plugins: [],

}

