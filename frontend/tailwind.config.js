/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Manrope', 'sans-serif'],
      },
      colors: {
        primary: '#0059FF',
        success: '#3B6629',
        danger: '#ff4444',
        light: '#FAFBFA',
        dark: '#000000',
      },
    },
  },
  plugins: [],
}
