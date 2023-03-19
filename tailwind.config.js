/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");
const { fontFamily } = defaultTheme;

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./common/components/**/*.{js,ts,jsx,tsx}",
    "./common/components-ui/**/*.{js,ts,jsx,tsx}",
    "./common/components-helpers/**/*.{js,ts,jsx,tsx}",
    "./modules/**/*.{js,ts,jsx,tsx}",
    "./layouts/**/*.{js,ts,jsx,tsx}",
    "./common/constants/**/*.{js,ts}",
  ],
  theme: {
    screens: {
      sm: "480px",
      md: "768px",
      lg: "976px",
      xl: "1200px",
      xxl: "1440px",
    },
    extend: {
      colors: {
        grey: {
          200: "#e7e7e7",
        },
      },
    },
    fontFamily: {
      sans: ["Inter", ...fontFamily.sans],
    },
  },
  corePlugins: {
    preflight: false,
  },
};
