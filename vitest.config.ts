import { defineConfig } from 'vitest/config'
import path from 'node:path'

export default defineConfig({
  resolve: {
    alias: {
      'content-collections': path.resolve(process.cwd(), '.content-collections/generated/index.js'),
      '@': path.resolve(process.cwd()),
    },
  },
  test: {
    include: ['lib/**/*.test.ts', 'scripts/**/*.test.ts'],
  },
})
