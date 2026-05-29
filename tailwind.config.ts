import type { Config } from 'tailwindcss'
import { fontFamily } from 'tailwindcss/defaultTheme'

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', ...fontFamily.sans],
        moonlight: ['var(--font-moonlight)', ...fontFamily.serif],
        mono: ['var(--font-mono)', ...fontFamily.mono],
      },
      colors: {
        // new design tokens
        'ls-bg': 'var(--ls-bg)',
        'ls-bg-elev': 'var(--ls-bg-elev)',
        'ls-fg': 'var(--ls-fg)',
        'ls-fg-dim': 'var(--ls-fg-dim)',
        'ls-muted': 'var(--ls-muted)',
        'ls-line': 'var(--ls-line)',
        'ls-line-soft': 'var(--ls-line-soft)',
        'ls-accent': 'var(--ls-accent)',
        // backward compat
        bg: 'var(--bg)',
        fg: 'var(--fg)',
        'fg-muted': 'var(--fg-muted)',
        'fg-subtle': 'var(--fg-subtle)',
        border: 'var(--border)',
      },
      transitionTimingFunction: {
        spring: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}

export default config
