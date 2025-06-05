import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.tsx'],
  format: ['esm', 'cjs'],
  sourcemap: true,
  clean: true,
  dts: false, // Explicitly disable tsup's DTS generation
  external: [
    'react',
    'react-dom',
    '@mui/material',
    '@emotion/react',
    '@emotion/styled',
    '@github-profile-cards/core',
    '@mui/icons-material'
  ],
});
