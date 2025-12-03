/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        'btn-anim1': {
          '0%': { left: '-100%' },
          '50%, 100%': { left: '100%' },
        },
        'btn-anim2': {
          '0%': { top: '-100%' },
          '50%, 100%': { top: '100%' },
        },
        'btn-anim3': {
          '0%': { right: '-100%' },
          '50%, 100%': { right: '100%' },
        },
        'btn-anim4': {
          '0%': { bottom: '-100%' },
          '50%, 100%': { bottom: '100%' },
        },
      },
      animation: {
        'btn-anim1': 'btn-anim1 1.5s linear infinite',
        'btn-anim2': 'btn-anim2 1.5s linear infinite 0.375s',
        'btn-anim3': 'btn-anim3 1.5s linear infinite 0.75s',
        'btn-anim4': 'btn-anim4 1.5s linear infinite 1.125s',
      },
    },
  },
  plugins: [],
}
