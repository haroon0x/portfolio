/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#050505', // Deeper black
        surface: '#0f0f0f', // Very dark grey
        border: 'rgba(255, 255, 255, 0.08)', // Fainter border
        accent: {
          DEFAULT: '#5e6ad2', // Linear-like blurple
          glow: '#00d9ff', // Cyan glow for highlights
        },
        text: {
          primary: '#ededed',
          secondary: '#a1a1a1',
        }
      },
      fontFamily: {
        heading: ['Manrope', 'sans-serif'],
        body: ['Manrope', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      }
    },
  },
  plugins: [],
};
