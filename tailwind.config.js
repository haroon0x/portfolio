/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#fffdfb',
        sky: {
          light: '#fff8f5',
          haze: '#f8fbf6',
        },
        surface: 'rgba(255, 255, 255, 0.82)',
        border: 'rgba(54, 45, 42, 0.10)',
        ink: {
          DEFAULT: '#282321',
          secondary: '#5f5753',
          muted: '#817671',
        },
        accent: {
          DEFAULT: '#b72d3b',
          hover: '#962330',
          muted: 'rgba(183, 45, 59, 0.09)',
        },
        gold: {
          DEFAULT: '#b88a37',
          soft: 'rgba(184, 138, 55, 0.13)',
        },
        blush: '#fff1f1',
      },
      fontFamily: {
        heading: ['"Shippori Mincho"', 'Georgia', 'serif'],
        body: ['Manrope', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      fontSize: {
        'display': ['clamp(2.75rem, 8vw, 4.75rem)', { lineHeight: '1.08', letterSpacing: '0.01em' }],
        'title':   ['clamp(2rem, 5vw, 3rem)',       { lineHeight: '1.15', letterSpacing: '0.01em' }],
        'heading': ['clamp(1.25rem, 3vw, 1.5rem)',  { lineHeight: '1.35' }],
        'body-lg': ['clamp(1.0625rem, 1.5vw, 1.1875rem)', { lineHeight: '1.75' }],
      },
      boxShadow: {
        petal: '0 1px 2px rgba(42,32,28,0.04), 0 16px 42px rgba(78,51,42,0.07)',
        'petal-lg': '0 2px 4px rgba(42,32,28,0.05), 0 22px 60px rgba(78,51,42,0.11)',
      },
      transitionDuration: {
        fast: '150ms',
        base: '250ms',
        slow: '500ms',
      },
      transitionTimingFunction: {
        out: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
};
