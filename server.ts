import express from 'express';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import { 
  initialArticles, 
  initialDocuments, 
  initialEmployees, 
  defaultAgencySettings, 
  regionalIndicatorStats, 
  initialAgendas, 
  initialGallery, 
  initialComplaints 
} from './server/initialData.ts';
import { 
  getMysqlPool, 
  testMysqlConnection, 
  saveModuleToMysql, 
  getModuleFromMysql, 
  migrateAllJsonToMysql, 
  getMysqlConfig,
  resetMysqlConfig,
  updateMysqlConfig
} from './server/mysql.ts';

const app = express();

// Support numeric ports AND Passenger Unix domain socket paths / pipes (Hostinger / cPanel)
const rawPort = process.env.PORT || 3000;
const isNumericPort = !isNaN(Number(rawPort)) && String(rawPort).trim() !== '';
const PORT: number | string = isNumericPort ? Number(rawPort) : rawPort;

// Base uploads directory on server (suitable for Hostinger VPS / Cloud or Node container)
const UPLOADS_BASE_DIR = path.join(process.cwd(), 'uploads');
const DATA_BASE_DIR = path.join(UPLOADS_BASE_DIR, 'data');
const CATEGORIES = ['documents', 'images', 'videos', 'general'] as const;
type UploadCategory = typeof CATEGORIES[number];

// Ensure upload and data directories exist safely
try {
  CATEGORIES.forEach((cat) => {
    const dir = path.join(UPLOADS_BASE_DIR, cat);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });

  if (!fs.existsSync(DATA_BASE_DIR)) {
    fs.mkdirSync(DATA_BASE_DIR, { recursive: true });
  }
} catch (err) {
  console.warn('[Storage Init] Directory creation notice:', err);
}

// Inisialisasi otomatis seluruh berkas JSON dasar ke /uploads/data/ agar VPS & sinkronisasi langsung siap pakai
function seedInitialDataFiles(force = false) {
  const defaultModules: Record<string, any> = {
    articles: initialArticles,
    documents: initialDocuments,
    employees: initialEmployees,
    settings: defaultAgencySettings,
    indicators: regionalIndicatorStats,
    agendas: initialAgendas,
    gallery: initialGallery,
    complaints: initialComplaints,
    info_requests: []
  };

  let seededCount = 0;
  Object.entries(defaultModules).forEach(([key, defaultValue]) => {
    const filePath = path.join(DATA_BASE_DIR, `${key}.json`);
    let needsWrite = force || !fs.existsSync(filePath);

    if (!needsWrite && fs.existsSync(filePath)) {
      try {
        const raw = fs.readFileSync(filePath, 'utf-8');
        const parsed = JSON.parse(raw);
        // Khusus settings: periksa apakah rusak atau terpotong (misal hanya { agencyName: "Bapperida" })
        if (key === 'settings' && (!parsed.leaderName || !parsed.officeAddress)) {
          needsWrite = true;
          defaultValue = { ...defaultAgencySettings, ...parsed };
        }
      } catch {
        needsWrite = true;
      }
    }

    if (needsWrite) {
      try {
        fs.writeFileSync(filePath, JSON.stringify(defaultValue, null, 2), 'utf-8');
        seededCount++;
        console.log(`[Seed VPS] Berkas data JSON berhasil diinisialisasi: uploads/data/${key}.json`);
      } catch (e) {
        console.error(`[Seed VPS] Gagal menulis uploads/data/${key}.json:`, e);
      }
    }
  });

  return seededCount;
}

// Jalankan seed saat server pertama kali hidup
seedInitialDataFiles();

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

// Enable CORS for all API routes (essential when frontend connects to a VPS IP or custom domain)
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// JSON body parsing for API with 50MB limit to support large data backups
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

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
// GET all data keys at once (reads from MySQL first, then falls back to JSON)
app.get('/api/sync/all', async (req, res) => {
  try {
    const result: Record<string, any> = {};
    const keys = ['settings', 'articles', 'documents', 'employees', 'indicators', 'agendas', 'gallery', 'complaints', 'info_requests'];
    let usedMysql = false;

    // Coba baca dari MySQL terlebih dahulu
    try {
      const pool = await getMysqlPool();
      if (pool) {
        for (const k of keys) {
          const rowData = await getModuleFromMysql(k);
          if (rowData !== null && rowData !== undefined) {
            result[k] = rowData;
            usedMysql = true;
          }
        }
      }
    } catch (e: any) {
      console.warn('MySQL read warning:', e.message);
    }

    // Lengkapi data dari berkas JSON lokal jika belum ada di MySQL atau MySQL offline
    if (fs.existsSync(DATA_BASE_DIR)) {
      const files = fs.readdirSync(DATA_BASE_DIR);
      files.forEach((file) => {
        if (file.endsWith('.json')) {
          const key = path.basename(file, '.json');
          if (!result[key]) {
            try {
              const content = fs.readFileSync(path.join(DATA_BASE_DIR, file), 'utf-8');
              result[key] = JSON.parse(content);
            } catch {
              // ignore malformed JSON file
            }
          }
        }
      });
    }

    res.json({
      success: true,
      database: usedMysql ? 'MySQL / MariaDB' : 'JSON Storage (Fallback)',
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

// POST all data keys (simpan ke MySQL dan mirror ke JSON)
app.post('/api/sync/all', async (req, res) => {
  try {
    const payload = req.body?.data || req.body;
    if (!payload || typeof payload !== 'object') {
      return res.status(400).json({ success: false, error: 'Data payload tidak valid' });
    }

    let savedCount = 0;
    let mysqlSavedCount = 0;
    const keys = Object.keys(payload);

    for (const key of keys) {
      const cleanKey = key.replace(/[^a-zA-Z0-9_-]/g, '');
      if (cleanKey) {
        // 1. Simpan ke berkas JSON lokal
        const filePath = path.join(DATA_BASE_DIR, `${cleanKey}.json`);
        fs.writeFileSync(filePath, JSON.stringify(payload[key], null, 2), 'utf-8');
        savedCount++;

        // 2. Simpan ke tabel MySQL
        try {
          const ok = await saveModuleToMysql(cleanKey, payload[key]);
          if (ok) mysqlSavedCount++;
        } catch {}
      }
    }

    res.json({
      success: true,
      message: `${savedCount} modul data berhasil disimpan (${mysqlSavedCount} tersinkronisasi ke MySQL)`,
      savedCount,
      mysqlSavedCount,
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
app.get('/api/data/:key', async (req, res) => {
  try {
    const cleanKey = req.params.key.replace(/[^a-zA-Z0-9_-]/g, '');

    // Coba ambil dari MySQL terlebih dahulu
    try {
      const mysqlData = await getModuleFromMysql(cleanKey);
      if (mysqlData !== null && mysqlData !== undefined) {
        return res.json({
          success: true,
          source: 'mysql',
          key: cleanKey,
          data: mysqlData
        });
      }
    } catch {}

    // Fallback ke berkas JSON
    const filePath = path.join(DATA_BASE_DIR, `${cleanKey}.json`);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      return res.json({
        success: true,
        source: 'json_file',
        key: cleanKey,
        data: JSON.parse(content)
      });
    }

    return res.status(404).json({
      success: false,
      key: cleanKey,
      error: 'Data belum tersimpan di database maupun berkas server'
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message || 'Gagal membaca data modul'
    });
  }
});

// POST single data key
app.post('/api/data/:key', async (req, res) => {
  try {
    const cleanKey = req.params.key.replace(/[^a-zA-Z0-9_-]/g, '');
    const filePath = path.join(DATA_BASE_DIR, `${cleanKey}.json`);
    const payload = req.body;
    const dataToSave = payload && payload.data !== undefined ? payload.data : payload;

    // 1. Simpan ke berkas mirror JSON lokal
    fs.writeFileSync(filePath, JSON.stringify(dataToSave, null, 2), 'utf-8');

    // 2. Simpan ke database MySQL
    let mysqlSaved = false;
    try {
      mysqlSaved = await saveModuleToMysql(cleanKey, dataToSave);
    } catch (dbErr: any) {
      console.warn(`MySQL save error untuk ${cleanKey}:`, dbErr.message);
    }

    return res.json({
      success: true,
      key: cleanKey,
      mysqlSaved,
      storage: mysqlSaved ? 'MySQL + Mirror JSON' : 'Server Mirror Storage',
      message: `Data ${cleanKey} berhasil disimpan terpusat`,
      savedAt: new Date().toISOString()
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message || 'Gagal menyimpan data modul ke server'
    });
  }
});

// 5. VPS & MySQL Diagnostic & Maintenance Endpoints
app.get('/api/mysql/status', async (req, res) => {
  try {
    const result = await testMysqlConnection();
    res.json({
      success: true,
      ...result
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Gagal memeriksa status MySQL'
    });
  }
});

app.post('/api/mysql/migrate', async (req, res) => {
  try {
    const result = await migrateAllJsonToMysql(DATA_BASE_DIR);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Gagal melakukan migrasi ke MySQL'
    });
  }
});

app.post('/api/mysql/reset', (req, res) => {
  try {
    resetMysqlConfig();
    res.json({
      success: true,
      message: 'Seluruh pengaturan basis data MySQL Hostinger berhasil direset dan dikosongkan. Siap menerima konfigurasi baru.'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Gagal mereset konfigurasi MySQL'
    });
  }
});

app.post('/api/mysql/config', async (req, res) => {
  try {
    const { host, port, user, password, database } = req.body || {};
    const result = await updateMysqlConfig({ host, port, user, password, database });
    const status = await testMysqlConnection();
    res.json({
      ...result,
      status
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Gagal memperbarui konfigurasi MySQL'
    });
  }
});

app.get('/api/mysql/schema', (req, res) => {
  const schemaPath = path.join(process.cwd(), 'public', 'schema.sql');
  if (fs.existsSync(schemaPath)) {
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    return res.sendFile(schemaPath);
  }
  return res.status(404).json({ success: false, error: 'Skema schema.sql tidak ditemukan' });
});

// 5. VPS & JSON Diagnostic & Maintenance Endpoints
app.get('/api/vps/status', (req, res) => {
  try {
    const requiredKeys = ['settings', 'articles', 'documents', 'employees', 'indicators', 'agendas', 'gallery', 'complaints', 'info_requests'];
    const jsonFilesInfo = requiredKeys.map((key) => {
      const filePath = path.join(DATA_BASE_DIR, `${key}.json`);
      const exists = fs.existsSync(filePath);
      let size = 0;
      let recordCount: number | null = null;
      let updatedAt = null;

      if (exists) {
        try {
          const stat = fs.statSync(filePath);
          size = stat.size;
          updatedAt = stat.mtime.toISOString();
          const parsed = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
          if (Array.isArray(parsed)) {
            recordCount = parsed.length;
          } else if (typeof parsed === 'object' && parsed !== null) {
            recordCount = Object.keys(parsed).length;
          }
        } catch {
          // parse error
        }
      }

      return {
        key,
        filename: `${key}.json`,
        exists,
        size,
        sizeFormatted: size > 1024 ? `${(size / 1024).toFixed(1)} KB` : `${size} B`,
        recordCount,
        updatedAt
      };
    });

    const readyFilesCount = jsonFilesInfo.filter((f) => f.exists && f.size > 0).length;

    res.json({
      success: true,
      server: 'Hostinger VPS / Node.js Express',
      port: PORT,
      status: 'online',
      nodeVersion: process.version,
      platform: process.platform,
      uploadsDir: UPLOADS_BASE_DIR,
      dataDir: DATA_BASE_DIR,
      allReady: readyFilesCount === requiredKeys.length,
      readyCount: readyFilesCount,
      totalCount: requiredKeys.length,
      files: jsonFilesInfo,
      checkedAt: new Date().toISOString()
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Gagal memeriksa status VPS & JSON'
    });
  }
});

// Seed / repair all JSON files on VPS
app.post('/api/vps/seed', (req, res) => {
  try {
    const force = req.body?.force === true;
    const seeded = seedInitialDataFiles(force);
    res.json({
      success: true,
      message: `Berhasil menginisialisasi / menyinkronkan ulang berkas JSON di VPS (${seeded} berkas diproses)`,
      seededCount: seeded,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Gagal melakukan inisialisasi JSON di VPS'
    });
  }
});

// -------------------------------------------------------------
// VITE MIDDLEWARE (Dev) & STATIC FILES (Production)
// -------------------------------------------------------------
async function startServer() {
  const hasDist = fs.existsSync(path.join(process.cwd(), 'dist', 'index.html'));
  const isDev = process.env.NODE_ENV === 'development' || (!hasDist && fs.existsSync(path.join(process.cwd(), 'vite.config.ts')));

  if (isDev) {
    const { createServer: createViteServer } = await import('vite');
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

  // Gracefully handle Passenger unix sockets vs standard numeric ports
  if (typeof PORT === 'number') {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server Bapperida berjalan pada port ${PORT} (Hostinger Ready)`);
    });
  } else {
    // Unix domain socket or named pipe provided by Passenger / cPanel
    app.listen(PORT, () => {
      console.log(`Server Bapperida terhubung ke socket Passenger: ${PORT}`);
    });
  }
}

// Global safety guards preventing server crashes from yielding 503 errors
process.on('uncaughtException', (err) => {
  console.error('[CRITICAL] Uncaught Exception:', err);
});
process.on('unhandledRejection', (reason, promise) => {
  console.error('[CRITICAL] Unhandled Rejection at:', promise, 'reason:', reason);
});

startServer().catch((err) => {
  console.error('[CRITICAL] Error starting Bapperida Server:', err);
});
