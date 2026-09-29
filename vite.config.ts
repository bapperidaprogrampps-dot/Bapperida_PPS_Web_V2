import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import {defineConfig, Plugin} from 'vite';

function outputDirectoryBridge(): Plugin {
  return {
    name: 'output-directory-bridge',
    closeBundle() {
      try {
        const nextDir = path.resolve(process.cwd(), '.next');
        const distDir = path.resolve(process.cwd(), 'dist');
        if (fs.existsSync(distDir) && !fs.existsSync(nextDir)) {
          try {
            fs.symlinkSync(distDir, nextDir, 'junction');
          } catch {
            fs.cpSync(distDir, nextDir, { recursive: true });
          }
        }
      } catch {
        // ignore non-critical
      }
    },
  };
}

export default defineConfig(() => {
  return {
    base: './',
    plugins: [react(), tailwindcss(), outputDirectoryBridge()],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname ?? process.cwd(), '.'),
      },
    },
    build: {
      outDir: 'dist',
      emptyOutDir: true,
    },
    server: {
      host: '0.0.0.0',
      port: 3000,
      allowedHosts: true as const,
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
