import { resolve } from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    alias: {
      mdast: resolve(__dirname, './node_modules/@types/mdast/index.d.ts'),
    },
    coverage: {
      reportOnFailure: true,
      reporter: ['json', 'json-summary', 'text'],
    },
  },
});
