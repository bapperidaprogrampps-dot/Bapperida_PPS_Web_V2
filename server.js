/**
 * server.js
 * Root production entry point for Hostinger Node.js, cPanel, Passenger, and Cloud deployments.
 * Points to the compiled, self-contained server bundle.
 */
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';

const distServer = path.resolve(process.cwd(), 'dist', 'server.cjs');

if (fs.existsSync(distServer)) {
  await import('./dist/server.cjs');
} else {
  console.warn('[Server Startup] dist/server.cjs belum tersedia. Mengaktifkan fallback server agar tidak terjadi 503...');
  
  const rawPort = process.env.PORT || 3000;
  const isNumeric = !isNaN(Number(rawPort)) && String(rawPort).trim() !== '';
  const port = isNumeric ? Number(rawPort) : rawPort;

  const fallbackServer = http.createServer((req, res) => {
    const indexPath = fs.existsSync(path.resolve(process.cwd(), 'dist', 'index.html'))
      ? path.resolve(process.cwd(), 'dist', 'index.html')
      : path.resolve(process.cwd(), 'index.html');

    if (fs.existsSync(indexPath)) {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      fs.createReadStream(indexPath).pipe(res);
    } else {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(`<!DOCTYPE html><html><head><title>Portal Bapperida Papua Selatan</title><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="font-family:sans-serif;padding:40px;text-align:center;background:#f8fafc;color:#0f172a;"><div style="max-width:500px;margin:40px auto;background:#fff;padding:32px;border-radius:12px;box-shadow:0 4px 6px -1px rgba(0,0,0,0.1);"><h2 style="color:#0f3d5c;">Portal Bapperida Papua Selatan</h2><p style="color:#64748b;line-height:1.6;">Aplikasi sedang dalam proses kompilasi awal. Silakan jalankan perintah <code>npm run build</code> di terminal hosting Anda.</p></div></body></html>`);
    }
  });

  if (typeof port === 'number') {
    fallbackServer.listen(port, '0.0.0.0', () => {
      console.log(`[Fallback Server] Aktif pada port ${port}`);
    });
  } else {
    fallbackServer.listen(port, () => {
      console.log(`[Fallback Server] Aktif pada socket Passenger: ${port}`);
    });
  }
}
