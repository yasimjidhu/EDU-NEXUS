export default {
  mode: 'jit',
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
        'strong-rose': '#5d001e',
        'medium-rose': '#9A1750',
        'lite-rose': '#E3AFBC',
        'pure-white': '#E3E2DF',
        'purple': '#D4D1FA',
        'lite-black': '#0d0d0d',
        'hash-black': '#1a1a1a',
      },
    },
  },
  plugins: [],
};
