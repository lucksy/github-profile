import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@github-profile-cards/core': path.resolve(__dirname, '../../packages/core/src/index.ts'),
      '@github-profile-cards/react-material': path.resolve(__dirname, '../../packages/react-material/src/index.tsx'),
    },
  },
  // Optional: If encountering issues with symlinked workspace dependencies during build,
  // you might need to optimize them. However, pnpm usually handles this well.
  // build: {
  //   rollupOptions: {
  //     external: (id) => {
  //       // If you want to ensure they are treated as external and not bundled
  //       if (id.startsWith('@github-profile-cards/')) {
  //         return true;
  //       }
  //       return false;
  //     }
  //   }
  // }
  // optimizeDeps: {
  //   include: ['@github-profile-cards/core', '@github-profile-cards/react-material'],
  // },
});
