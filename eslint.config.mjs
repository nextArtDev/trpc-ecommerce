import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { FlatCompat } from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

const eslintConfig = [
  // Add ignore patterns FIRST in the config array
  {
    ignores: [
      'lib/generated/prisma/**', // Prisma generated files
      'node_modules/**', // Standard ignores
      '.next/**', // Next.js build files
      'dist/**', // Build output
    ],
  },

  // Then include your existing configs
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
]

export default eslintConfig
