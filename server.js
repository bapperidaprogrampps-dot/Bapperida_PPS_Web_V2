/**
 * server.js
 * Root production entry point for Hostinger Node.js, cPanel, Passenger, and Cloud deployments.
 * Points to the compiled, self-contained server bundle.
 */
import fs from 'node:fs';
import path from 'node:path';

const distServer = path.resolve(process.cwd(), 'dist', 'server.cjs');
if (fs.existsSync(distServer)) {
  await import('./dist/server.cjs');
} else {
  console.log('[Server Startup] dist/server.cjs belum tersedia, silakan jalankan "npm run build" terlebih dahulu.');
}
