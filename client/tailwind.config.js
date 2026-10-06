/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        agro: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        earth: {
          50: '#fdf8f4',
          100: '#f9eee3',
          200: '#f2dcbf',
          300: '#e7c293',
          400: '#dca467',
          500: '#d48842',
          600: '#c57134',
          700: '#a4572b',
          800: '#844629',
          900: '#6c3a24',
          950: '#3a1c11',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
        'glow-green': '0 0 20px -3px rgba(34, 197, 94, 0.25)',
      }
    },
  },
  plugins: [],
}
