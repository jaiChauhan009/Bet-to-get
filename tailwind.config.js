/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    screens: {
      xs: "410px",
      sm: "640px",
      // => @media (min-width: 640px) { ... }

      md: "768px",
      // => @media (min-width: 768px) { ... }

      lg: "1024px",
      // => @media (min-width: 1024px) { ... }

      xl: "1280px",
      // => @media (min-width: 1280px) { ... }

      "2xl": "1536px",
      // => @media (min-width: 1536px) { ... }
    },
    extend: {
      fontFamily: {
        pacifico: ["Pacifico", "cursive"],
      },
      backgroundImage: {
        bgHi: "url('/src/assets/bgHi.svg')",
        bgLo: "url('/src/assets/bgLo.svg')",
        bgHiStacked: "url('/src/assets/bgHiStacked.svg')",
        bgLoStacked: "url('/src/assets/bgLoStacked.svg')",
        higherButton: "url('/src/assets/higherButton.svg')",
        lowerButton: "url('/src/assets/lowerButton.svg')",
      },
    },
  },
  plugins: [],
};
