import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#6366f1', // Electric Indigo
          dark: '#4f46e5',
          light: '#818cf8',
        },
        accent: {
          DEFAULT: '#a855f7', // Neon Purple
          dark: '#9333ea',
          light: '#c084fc',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-primary': 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
      },
    },
  },
  plugins: [],
  darkMode: 'class',
}
export default config
