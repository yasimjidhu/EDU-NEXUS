// tailwind.config.js
module.exports = {
  mode:'jit',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      sans: ['Roboto', 'sans-serif'],
    },
    extend: {
      colors: {
        'prime-blue': '#0074fc',
      },
    },
  },
  plugins: [],
};
