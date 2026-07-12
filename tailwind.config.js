/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: 'var(--bg)',
        surface: 'var(--surface)',
        border: 'var(--border)',
        accent: {
          DEFAULT: 'rgb(var(--accent-rgb) / <alpha-value>)',
          hover: 'rgb(var(--accent-hover-rgb) / <alpha-value>)',
        },
        'accent-muted': 'var(--accent-muted)',
        text: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          muted: 'var(--text-muted)',
        },
        'header-bg': 'var(--header-bg)',
        'header-bg-scrolled': 'var(--header-bg-scrolled)',
        'header-bg-solid': 'var(--header-bg-solid)',
        'header-border': 'var(--header-border)',
        'hover-bg': 'var(--hover-bg)',
        'hover-bg-strong': 'var(--hover-bg-strong)',
        'footer-bg': 'var(--footer-bg)',
        'card-bg': 'var(--card-bg)',
        'card-border': 'var(--card-border)',
        'card-border-subtle': 'var(--card-border-subtle)',
        'card-border-hover': 'var(--card-border-hover)',
        overlay: 'var(--overlay)',
        divider: 'var(--divider)',
        'selection-bg': 'var(--selection-bg)',
        'selection-text': 'var(--selection-text)',
        'scrollbar-track': 'var(--scrollbar-track)',
        'scrollbar-thumb': 'var(--scrollbar-thumb)',
        'scrollbar-thumb-hover': 'var(--scrollbar-thumb-hover)',
        'focus-ring': 'var(--focus-ring)',
      },
      fontFamily: {
        heading: ['var(--font-heading)', 'Georgia', 'serif'],
        body: ['Manrope', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
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
        header: 'var(--header-shadow)',
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
      // 1-4-9 rhythm scale
      spacing: {
        '1u': '4px',
        '4u': '16px',
        '9u': '36px',
      },
    },
  },
  plugins: [],
};
