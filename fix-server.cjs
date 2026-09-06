const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');
const target = `async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(\`Server Bapperida berjalan pada port \${PORT} (Hostinger Ready)\`);
  });
}`;

const replacement = `async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production' && fs.existsSync(path.join(process.cwd(), 'vite.config.ts'));

  if (isDev) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    let distPath = path.join(process.cwd(), 'dist');
    if (fs.existsSync(path.join(process.cwd(), 'dist', 'index.html'))) {
      distPath = path.join(process.cwd(), 'dist');
    } else if (fs.existsSync(path.join(process.cwd(), 'index.html'))) {
      distPath = process.cwd();
    }

    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(\`Server Bapperida berjalan pada port \${PORT} (Hostinger Ready)\`);
  });
}`;

code = code.replace(target, replacement);
fs.writeFileSync('server.ts', code);
