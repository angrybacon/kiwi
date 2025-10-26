import { type Options } from 'tsup';

export default {
  clean: true,
  dts: true,
  entry: ['lib/index.ts'],
  format: ['esm'],
  outDir: 'dist',
  splitting: true,
  treeshake: true,
} satisfies Options;
