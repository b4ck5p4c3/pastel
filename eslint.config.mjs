import base from '@bksp/style-guide/eslint/next'
import { defineConfig } from 'eslint/config'

export default defineConfig([
  base,
  {
    extends: [{
      files: ['./src/app/**/*.{ts,tsx,js,jsx}'],
      rules: {
        'no-restricted-imports': [
          'error',
          {
            patterns: [
              {
                message: 'Direct actions from BE are not allowed. Use only @/backend/actions',
                regex: '@/backend/(?!actions/).*'
              }
            ]
          }
        ]
      }
    }]
  },
])
