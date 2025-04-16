import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))"
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)"
      },
      colors: {
        background: "#FAFFFB",
        foreground: "#282828",
        card: {
          DEFAULT: "#F5F5F5",
          foreground: "#282828"
        },
        popover: {
          DEFAULT: "#F5F5F5",
          foreground: "#282828"
        },
        primary: {
          DEFAULT: "#6A31F6",
          foreground: "#FAFFFB"
        },
        secondary: {
          DEFAULT: "#282828",
          foreground: "#FAFFFB"
        },
        muted: {
          DEFAULT: "#F5F5F5",
          foreground: "#282828"
        },
        accent: {
          DEFAULT: "#6A31F6",
          foreground: "#FAFFFB"
        },
        destructive: {
          DEFAULT: "#FF0000",
          foreground: "#FFFFFF"
        },
        border: "#E5E5E5",
        input: "#F5F5F5",
        ring: "#6A31F6",
        chart: {
          "1": "#6A31F6",
          "2": "#9C6BFF",
          "3": "#BBA2FF",
          "4": "#D9C7FF",
          "5": "#F0E7FF"
        }
      }
    }
  },
  plugins: [require("tailwindcss-animate")]
};

export default config;
