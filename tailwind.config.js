/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#0a0a0a',
        surface: '#111113',
        border: 'rgba(255, 255, 255, 0.08)',
        accent: {
          DEFAULT: '#5e6ad2',
          hover: '#6e79e0',
          muted: 'rgba(94, 106, 210, 0.15)',
        },
        text: {
          primary: '#ededed',
          secondary: 'rgba(255, 255, 255, 0.65)',
          muted: 'rgba(255, 255, 255, 0.50)',
        },
      },
      fontFamily: {
        heading: ['Manrope', 'sans-serif'],
        body: ['Manrope', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        'display': ['clamp(2.75rem, 8vw, 4.5rem)', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        'title':   ['clamp(2rem, 5vw, 3rem)',      { lineHeight: '1.1',  letterSpacing: '-0.02em' }],
        'heading': ['clamp(1.25rem, 3vw, 1.5rem)', { lineHeight: '1.3' }],
        'body-lg': ['clamp(1.0625rem, 1.5vw, 1.1875rem)', { lineHeight: '1.7' }],
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
