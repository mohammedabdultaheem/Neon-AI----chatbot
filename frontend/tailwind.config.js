/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        neonBlue: "#00FFFF",
        neonRed: "#FF073A",
        neonPurple: "#9D00FF",
        darkBg: "#000000",
      },
      boxShadow: {
        'neon-blue': '0 0 10px #00FFFF, 0 0 20px #00FFFF',
        'neon-red': '0 0 10px #FF073A, 0 0 20px #FF073A',
        'neon-purple': '0 0 10px #9D00FF, 0 0 20px #9D00FF',
      },
      backgroundImage: {
        'neon-gradient': 'linear-gradient(to right, #00FFFF, #9D00FF, #FF073A)',
      },
    },
  },
  plugins: [],
}
