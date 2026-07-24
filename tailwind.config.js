/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: 'rgb(var(--color-bg) / <alpha-value>)',
        surface: 'rgb(var(--color-surface) / <alpha-value>)',
        'surface-strong': 'rgb(var(--color-surface-strong) / <alpha-value>)',
        border: 'rgb(var(--color-border) / <alpha-value>)',
        'border-strong': 'rgb(var(--color-border-strong) / <alpha-value>)',
        accent: {
          DEFAULT: 'rgb(var(--color-accent) / <alpha-value>)',
          hover: 'rgb(var(--color-accent-hover) / <alpha-value>)',
          muted: 'rgb(var(--color-accent-muted) / <alpha-value>)',
          foreground: 'rgb(var(--color-on-accent) / <alpha-value>)',
        },
        text: {
          primary: 'rgb(var(--color-text) / <alpha-value>)',
          secondary: 'rgb(var(--color-text-secondary) / <alpha-value>)',
          muted: 'rgb(var(--color-text-muted) / <alpha-value>)',
        },
        status: {
          open: 'rgb(var(--color-status-open) / <alpha-value>)',
          merged: 'rgb(var(--color-status-merged) / <alpha-value>)',
          closed: 'rgb(var(--color-status-closed) / <alpha-value>)',
        },
      },
      fontFamily: {
        heading: 'var(--font-heading)',
        body: 'var(--font-body)',
        mono: 'var(--font-mono)',
      },
      fontSize: {
        'display': ['clamp(2.75rem, 8vw, 4.75rem)', { lineHeight: '1.08', letterSpacing: '0.01em' }],
        'title':   ['clamp(2rem, 5vw, 3rem)',       { lineHeight: '1.15', letterSpacing: '0.01em' }],
        'heading': ['clamp(1.25rem, 3vw, 1.5rem)',  { lineHeight: '1.35' }],
        'body-lg': ['clamp(1.0625rem, 1.5vw, 1.1875rem)', { lineHeight: '1.75' }],
      },
      boxShadow: {
        panel: 'var(--shadow-panel)',
        header: 'var(--shadow-header)',
      },
      borderRadius: {
        panel: 'var(--radius-panel)',
        control: 'var(--radius-control)',
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
