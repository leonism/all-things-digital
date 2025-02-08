const colors = require('tailwindcss/colors')

/** @type {import('tailwindcss').Config} */
module.exports = {
  // content: [],
  content: ["./dist/**/*.{html,js}"],
  darkMode: 'class',
  theme: {
    screens: {
      sm: '480px',
      md: '768px',
      lg: '976px',
      xl: '1440px',
    },
    extend: {
      animation: {
        blob: "blob 7s infinite",
      },
      colors: {
        savoryWhite: 'hsl(0, 36%, 95%)',
        mutedWhite: 'hsl(224, 16%, 54%)',
        whiteHover: 'hsl(0, 36%, 95%)',
        pinkHeading: 'hsl(279, 48%, 54%)',
        pinkSubHeading: 'hsl(293, 43%, 55%)',
        blackSubHeading: 'hsl(221, 39%, 11%)',
        deepBlueSubHeading: 'hsl(229, 38%, 40%)',
        fuchsia: colors.fuchsia,
      },
      keyframes: {
        blob: {
          "0%": {
            transform: "translate(0px, 0px) scale(1)",
          },
          "33%": {
            transform: "translate(30px, -50px) scale(1.1)",
          },
          "66%": {
            transform: "translate(-20px, 20px) scale(0.9)",
          },
          "100%": {
            transform: "tranlate(0px, 0px) scale(1)",
          },
        },
      },
      backgroundColor: {
        main: 'hsl(215, 45%, 14%)',        
      },  
    },    
    fontFamily: {
      navigation: ['Poppins', 'sans-serif']
    }
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),    
    require('@tailwindcss/line-clamp'),
  ],
}
