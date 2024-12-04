/** @type {import('tailwindcss').Config} */
//import formsPlugin from "@tailwindcss/forms";
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    fontFamily: {
      sans: ["Roboto,sans-serif"],
      serif: [
        "Merriweather",
        "Georgia",
        "Cambria",
        "Times New Roman",
        "Times",
        "serif",
      ],
    },
    screens: {
      xs: "0px", // default extra small breakpoint
      sx: "520px", // new custom value
      sm: "640px", // Default small breakpoint
      md: "768px", // Default medium breakpoint
      lg: "1024px", // Default large breakpoint
      xl: "1280px", // Default extra large breakpoint
      "2xl": "1536px", // Default 2 extra large breakpoint
    },
    extend: {
      colors: {
        customBlue: "#028bff",
        customGreen: "#2a8639",
        softBlue: "#FFB6B9",
        tblColora: "#F9FBFD",
        tblColorb: "#FFFFFF",
        tblColorc: "#e9F6F8",
        tblColord: "#0f0f0f",
        tblColore: "#969696",
        tblColore: "#848da0",
        btn: "rgb(0,146,246)",
        hoverBlue: "#1B98DC",
      },
      animation: {
        progress: "progress 1s infinite linear",
      },
      keyframes: {
        progress: {
          "0%": { transform: " translateX(0) scaleX(0)" },
          "40%": { transform: "translateX(0) scaleX(0.4)" },
          "100%": { transform: "translateX(100%) scaleX(0.5)" },
        },
      },
      transformOrigin: {
        "left-right": "0% 50%",
      },
    },
  },

  plugins: [],
};
