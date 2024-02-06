import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        primary_blue: "#024768",
        primary_orange: "#FEC33B",
        primary_red: "#ED1C24",
        primary_green: "#00C300",
        secondary_blue: "#1A5CAC",
        secondary_text: "#5B595A",
        light_blue: "#56CCF2",
      },
      keyframes: {
        wiggle: {
          "0%, 50%, 100%": { transform: "rotate(deg)" },
          "25%": { transform: "rotate(1.5deg)" },
          "75%": { transform: "rotate(-1.5deg)" },
        },
      },
      animation: {
        wiggle: "wiggle 0.25s 2",
      },
      screens: {
        xs: "486px",
      },
    },
  },
  plugins: [require("daisyui"), require("tailwindcss-animated")],
  daisyui: {
    themes: false, // false: only light + dark | true: all themes | array: specific themes like this ["light", "dark", "cupcake"]
    darkTheme: "light", // name of one of the included themes for dark mode
    base: true, // applies background color and foreground color for root element by default
    styled: true, // include daisyUI colors and design decisions for all components
    utils: true, // adds responsive and modifier utility classes
    prefix: "", // prefix for daisyUI classnames (components, modifiers and responsive class names. Not colors)
    logs: true, // Shows info about daisyUI version and used config in the console when building your CSS
    themeRoot: ":root", // The element that receives theme color CSS variables
  },
};
export default config;
