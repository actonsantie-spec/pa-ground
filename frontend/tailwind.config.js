/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        accent: '#CE1126',
        'accent-dark': '#A00D20',
        primary: '#006B3F',
        'primary-dark': '#004D2B',
        secondary: '#000000',
        'secondary-light': '#1a1a1a',
      },
      fontFamily: {
        heading: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
