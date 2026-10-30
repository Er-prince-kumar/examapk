/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#090d16',
        },
        brand: {
          cyan: '#06b6d4',
          'cyan-light': '#e0f2fe',
          'cyan-dark': '#0891b2',
          navy: '#0f172a',
          'navy-card': '#1e293b',
          'navy-light': '#334155',
          accent: '#0284c7'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 2px 10px rgba(15, 23, 42, 0.04)',
        'card': '0 4px 20px -2px rgba(15, 23, 42, 0.06)',
        'card-hover': '0 10px 30px -4px rgba(15, 23, 42, 0.1)',
        'glow-cyan': '0 0 25px -5px rgba(6, 182, 212, 0.3)'
      }
    },
  },
  plugins: [],
}
