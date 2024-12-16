/*
  default tailwind css configuration
  https://github.com/tailwindlabs/tailwindcss/blob/master/stubs/defaultConfig.stub.js

  Customizing PostCSS Config
  https://nextjs.org/docs/advanced-features/customizing-postcss-config

  theme configuration
  https://tailwindcss.com/docs/theme

  customizing colors
  https://tailwindcss.com/docs/customizing-colors

  naming colors
  https://tailwindcss.com/docs/customizing-colors#naming-your-colors
*/

const { nextui } = require('@nextui-org/react');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}',"./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"],

  theme: {
    extend: {},
  },
  darkMode: "class",
  plugins: [nextui()],
};
