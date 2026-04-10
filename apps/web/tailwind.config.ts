import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0ea5e9',
          light: '#e0f2fe',
          dark: '#0369a1',
        },
      },
    },
  },
  plugins: [],
}

export default config
