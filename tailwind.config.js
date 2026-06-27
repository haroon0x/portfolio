/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#faf8f4',
        sky: {
          light: '#eef5fc',
          haze: '#fdfbf7',
        },
        surface: '#ffffff',
        border: 'rgba(31, 35, 40, 0.08)',
        ink: {
          DEFAULT: '#1f2328',
          secondary: '#46525c',
          muted: '#66707a',
        },
        accent: {
          DEFAULT: '#3e7a52',
          hover: '#346847',
          muted: 'rgba(62, 122, 82, 0.10)',
        },
        gold: {
          DEFAULT: '#a8821f',
          soft: 'rgba(168, 130, 31, 0.14)',
        },
        blush: '#f7eef0',
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
        petal: '0 1px 2px rgba(31,35,40,0.04), 0 8px 24px rgba(31,35,40,0.06)',
        'petal-lg': '0 2px 4px rgba(31,35,40,0.05), 0 16px 48px rgba(31,35,40,0.09)',
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
