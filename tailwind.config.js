/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // <--- This line is the key change!
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
        colors: {
            github: {
                dark: '#0d1117',        // GitHub Dark Background
                card: '#161b22',        // GitHub Dark Card
                border: '#30363d',      // GitHub Dark Border
                green: '#238636',       // GitHub Green Button
                greenHover: '#2ea043',  // GitHub Green Hover
            }
        }
    },
  },
  plugins: [],
}