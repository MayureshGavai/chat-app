/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily:{
        PlusJakarta:['plus jakarta sans','sans-serif'],
        Inter:['inter','sans-serif']
      }
    },
  },
  plugins: [],
}

