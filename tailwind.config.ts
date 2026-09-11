import type { Config } from 'tailwindcss';

export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        obsidian: {
          950: '#060708',
          900: '#0A0C0E',
          850: '#101216',
          800: '#16191F',
          750: '#1D2129',
          700: '#252A34',
        },
        gold: {
          300: '#F5DE88',
          400: '#E8C55A',
          500: '#D4AF37',
          600: '#B89326',
          700: '#947318',
        },
        cream: {
          50: '#FAF9F6',
          100: '#F4F2EB',
          200: '#E8E5DA',
          300: '#D6D2C4',
        },
      },
      fontFamily: {
        serif: ['var(--font-cinzel)', 'Georgia', 'serif'],
        sans: ['var(--font-plus-jakarta)', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config;
