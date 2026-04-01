/** @type {import('tailwindcss').Config} */
module.exports = {
  // Look for classes in your HTML and JS files to generate only the CSS you need
  content: ["./index.html", "./js/**/*.js"],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pageFadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        }
      },
      animation: {
        fadeInUp: 'fadeInUp 0.6s ease-out forwards',
      }
    },
  },
  plugins: [],
}
