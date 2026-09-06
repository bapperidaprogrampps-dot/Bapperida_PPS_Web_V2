import express from 'express';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

// Base uploads directory on server (suitable for Hostinger VPS / Cloud or Node container)
const UPLOADS_BASE_DIR = path.join(process.cwd(), 'uploads');
const DATA_BASE_DIR = path.join(UPLOADS_BASE_DIR, 'data');
const CATEGORIES = ['documents', 'images', 'videos', 'general'] as const;
type UploadCategory = typeof CATEGORIES[number];

// Ensure upload and data directories exist
CATEGORIES.forEach((cat) => {
  const dir = path.join(UPLOADS_BASE_DIR, cat);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

if (!fs.existsSync(DATA_BASE_DIR)) {
  fs.mkdirSync(DATA_BASE_DIR, { recursive: true });
}

// Configure Multer Storage for Hostinger Server Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const rawCategory = (req.body?.category || req.query?.category || 'general') as string;
    const category: UploadCategory = CATEGORIES.includes(rawCategory as UploadCategory)
      ? (rawCategory as UploadCategory)
      : 'general';

    const targetDir = path.join(UPLOADS_BASE_DIR, category);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    cb(null, targetDir);
  },
  filename: (req, file, cb) => {
    // Sanitize filename and append unique timestamp
    const ext = path.extname(file.originalname).toLowerCase();
    const baseName = path
      .basename(file.originalname, ext)
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .slice(0, 50);
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
    cb(null, `${baseName}-${uniqueSuffix}${ext}`);
  }
});

// File upload limit (up to 120MB for high-res videos and official regional planning documents)
const upload = multer({
  storage,
  limits: {
    fileSize: 120 * 1024 * 1024 // 120 MB
  }
});

// JSON body parsing for API
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve Uploaded Files statically from Hostinger server storage
app.use(
  '/uploads',
  express.static(UPLOADS_BASE_DIR, {
    maxAge: '7d',
    setHeaders: (res, filePath) => {
      // Enable CORS for assets so cross-origin previews work if needed
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Cache-Control', 'public, max-age=604800');
    }
  })
);

// Format file size utility
function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

// -------------------------------------------------------------
// API ROUTES
// -------------------------------------------------------------

// 1. Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Bapperida Papua Selatan Portal API',
    time: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// 2. Storage System Info
app.get('/api/storage/info', (req, res) => {
  try {
    const stats: Record<string, { count: number; totalSize: number; totalSizeFormatted: string }> = {};

    let grandTotalCount = 0;
    let grandTotalSize = 0;

    CATEGORIES.forEach((cat) => {
      const dir = path.join(UPLOADS_BASE_DIR, cat);
      let count = 0;
      let size = 0;

      if (fs.existsSync(dir)) {
        const files = fs.readdirSync(dir);
        count = files.length;
        files.forEach((f) => {
          try {
            const stat = fs.statSync(path.join(dir, f));
            size += stat.size;
          } catch {
            // ignore
          }
        });
      }

      stats[cat] = {
        count,
        totalSize: size,
        totalSizeFormatted: formatBytes(size)
      };

      grandTotalCount += count;
      grandTotalSize += size;
    });

    res.json({
      success: true,
      provider: 'Hostinger Server Storage (Local Disk)',
      status: 'active',
      uploadBasePath: '/uploads',
      maxFileSize: '120 MB',
      totalFiles: grandTotalCount,
      totalStorageUsed: formatBytes(grandTotalSize),
      categories: stats,
      hostingerReady: true,
      note: 'Berkas disimpan langsung ke penyimpanan server Hostinger di direktori /uploads'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Gagal membaca status penyimpanan server'
    });
  }
});

// 3. Upload File API
app.post('/api/upload', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'Tidak ada file yang diunggah. Kirimkan file melalui field "file".'
      });
    }

    const rawCategory = (req.body?.category || req.query?.category || 'general') as string;
    const category: UploadCategory = CATEGORIES.includes(rawCategory as UploadCategory)
      ? (rawCategory as UploadCategory)
      : 'general';

    const relativeUrl = `/uploads/${category}/${req.file.filename}`;

    return res.json({
      success: true,
      message: `File ${req.file.originalname} berhasil diunggah ke server Hostinger`,
      url: relativeUrl,
      filename: req.file.filename,
      originalName: req.file.originalname,
      category,
      size: req.file.size,
      sizeFormatted: formatBytes(req.file.size),
      mimetype: req.file.mimetype,
      storage: 'hostinger-server',
      uploadedAt: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Gagal mengunggah file ke server'
    });
  }
});

// 4. Centralized Data APIs for Multi-Browser / Shared Persistence
// GET all data keys at once (used on initial app load in any browser)
app.get('/api/sync/all', (req, res) => {
  try {
    const result: Record<string, any> = {};
    if (fs.existsSync(DATA_BASE_DIR)) {
      const files = fs.readdirSync(DATA_BASE_DIR);
      files.forEach((file) => {
        if (file.endsWith('.json')) {
          const key = path.basename(file, '.json');
          try {
            const content = fs.readFileSync(path.join(DATA_BASE_DIR, file), 'utf-8');
            result[key] = JSON.parse(content);
          } catch {
            // ignore malformed JSON file
          }
        }
      });
    }

    res.json({
      success: true,
      data: result,
      count: Object.keys(result).length,
      syncedAt: new Date().toISOString()
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Gagal membaca data dari server'
    });
  }
});

// POST all data keys (used when Admin syncs/restores everything)
app.post('/api/sync/all', (req, res) => {
  try {
    const payload = req.body?.data || req.body;
    if (!payload || typeof payload !== 'object') {
      return res.status(400).json({ success: false, error: 'Data payload tidak valid' });
    }

    let savedCount = 0;
    Object.keys(payload).forEach((key) => {
      const cleanKey = key.replace(/[^a-zA-Z0-9_-]/g, '');
      if (cleanKey) {
        const filePath = path.join(DATA_BASE_DIR, `${cleanKey}.json`);
        fs.writeFileSync(filePath, JSON.stringify(payload[key], null, 2), 'utf-8');
        savedCount++;
      }
    });

    res.json({
      success: true,
      message: `${savedCount} modul data berhasil disimpan ke server Hostinger`,
      savedCount,
      savedAt: new Date().toISOString()
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Gagal menyimpan data ke server'
    });
  }
});

// GET single data key (e.g. /api/data/settings, /api/data/articles)
app.get('/api/data/:key', (req, res) => {
  try {
    const cleanKey = req.params.key.replace(/[^a-zA-Z0-9_-]/g, '');
    const filePath = path.join(DATA_BASE_DIR, `${cleanKey}.json`);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      return res.json({
        success: true,
        key: cleanKey,
        data: JSON.parse(content)
      });
    }
    return res.status(404).json({
      success: false,
      key: cleanKey,
      error: 'Data belum tersimpan di server'
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message || 'Gagal membaca data modul'
    });
  }
});

// POST single data key
app.post('/api/data/:key', (req, res) => {
  try {
    const cleanKey = req.params.key.replace(/[^a-zA-Z0-9_-]/g, '');
    const filePath = path.join(DATA_BASE_DIR, `${cleanKey}.json`);
    const payload = req.body;
    const dataToSave = payload && payload.data !== undefined ? payload.data : payload;

    fs.writeFileSync(filePath, JSON.stringify(dataToSave, null, 2), 'utf-8');
    return res.json({
      success: true,
      key: cleanKey,
      message: `Data ${cleanKey} berhasil disimpan terpusat di server Hostinger`,
      savedAt: new Date().toISOString()
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message || 'Gagal menyimpan data modul ke server'
    });
  }
});

// -------------------------------------------------------------
// VITE MIDDLEWARE (Dev) & STATIC FILES (Production)
// -------------------------------------------------------------
async function startServer() {
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
    console.log(`Server Bapperida berjalan pada port ${PORT} (Hostinger Ready)`);
  });
}

startServer();
