import type { Config } from 'tailwindcss'

import { heroui } from '@heroui/react'

export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  plugins: [
    heroui()
  ],
  theme: {
    fontFamily: {
      sans: ['var(--font-onest)', 'sans-serif'],
      serif: ['var(--font-yeseva-one)', 'serif'],
    },
  },
} satisfies Config
