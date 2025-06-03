import { defineConfig } from 'tsup';

export default defineConfig((options) => ({
  outDir: 'dist',
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  minify: !options.watch,
}));
