/*eslint-env node*/
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "media",
  content: [
    "./resources/**/*.{edge,js,ts,jsx,tsx,vue}",
    "./node_modules/flowbite/**/*.js",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("flowbite/plugin")],
};
