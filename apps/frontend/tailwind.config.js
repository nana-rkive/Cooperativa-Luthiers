/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-brown': '#3D2B1F', // Predominant brown
        'brand-brown-light': '#9C6644', // Light brown for buttons
        'brand-offwhite': '#FAF9F6', // Predominant off-white
        'brand-text-dark': '#1E1E1C', // Dark text on off-white
      }
    },
  },
  plugins: [],
}
